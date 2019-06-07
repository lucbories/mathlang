import * as mocha from 'mocha';
import * as chai from 'chai';

// import IValue from '../../../core/ivalue';
// import IInstruction from '../../../core/iinstruction';

import VMValue from '../../../engine/vm/vmvalue';
import VMError from '../../../engine/vm/vmerror';
import VMEngine from '../../../engine/vm/vmengine';
import VMProgramOptions from '../../../engine/vm/vmprogramoptions';
import VMProgram from '../../../engine/vm/vmprogram';

import VMNumberType from '../../../features/common/number/vmnumber_type';
import VMNumberMathFt from '../../../features/common/number/vmnumber_math_ft';

import VMMethodCall from '../../../engine/instructions/vmcallmethod';

import VMPopV from '../../../engine/instructions/vmpopv';
import VMPushV from '../../../engine/instructions/vmpushv';

import VMIfPositive from '../../../engine/instructions/vmifpositive';
import VMIfPositiveZero from '../../../engine/instructions/vmifpositivezero';
import VMIfNegative from '../../../engine/instructions/vmifnegative';
import VMIfNegativeZero from '../../../engine/instructions/vmifnegativezero';
import VMIfZero from '../../../engine/instructions/vmifzero';

import VMExit from '../../../engine/instructions/vmexit';
import VMGoto from '../../../engine/instructions/vmgoto';

import VMRegV from '../../../engine/instructions/vmregv';
import VMUnRegV from '../../../engine/instructions/vmunrv';
import VMGetRegV from '../../../engine/instructions/vmgetrv';
import IInstruction from '../../../core/iinstruction';

import { test_simple_program, IInstructionRecord } from '../common.test';


const expect = chai.expect;
const nomain:IInstruction = undefined;


// CONFIGURE FEATURES
VMNumberType.add_feature(VMNumberMathFt);



describe('Engine-Registers', () => {

  it('Engine-Registers: register, unregister, pop registered values', () => {

    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);

    const program1_options = new VMProgramOptions();
    program1_options.entry_label = 'main';
    program1_options.registers = 10;
    program1_options.stack = 10;
    program1_options.instructions = 20;
  
    const program1 = new VMProgram("program1", program1_options);

    program1.register_value(1, value1);
    program1.register_value(2, value2);
    program1.register_value(3, value3);

    program1.push_register_value(2);

    expect( program1.pop_value_available() ).to.equal(true);
    expect( program1.pop_value().to_number() ).to.equal(456);

    program1.push_register_value(3);
    program1.push_register_value(1);

    expect( program1.pop_value_available() ).to.equal(true);
    expect( program1.pop_value().to_number() ).to.equal(123);

    expect( program1.pop_value_available() ).to.equal(true);
    expect( program1.pop_value().to_number() ).to.equal(789);

    program1.unregister_value(2);
    program1.push_register_value(2);
    expect( program1.pop_value_available() ).to.equal(false);
    expect( program1.pop_value() ).is.undefined;
    expect( program1.has_error() ).to.equal(true);
    expect( program1.get_error_message() ).to.equal('stack underflow: actual size=[' + program1_options.stack + ']');

    program1.push_register_value(55);
    expect( program1.has_error() ).to.equal(true);
    expect( program1.get_error_message() ).to.equal('program want to push on the stack a bad value');
  });
});