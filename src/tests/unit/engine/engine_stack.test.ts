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



describe('Engine-Stack', () => {

  it('Engine-Stack: push undefined, expect an error' , () => {

    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const int_op = new VMMethodCall('NumberAdd', 3);
    
    const program1_options = new VMProgramOptions();
    program1_options.entry_label = 'main';
    program1_options.registers = 10;
    program1_options.stack = 10;
    program1_options.instructions = 20;
    
    
    const program1 = new VMProgram("program1", program1_options);
    program1.push_value(value3);
    program1.push_value(value2);
    program1.push_value(value1);
    program1.push_value(undefined);
    program1.set_instruction(0, int_op, 'main');
    
    const engine = new VMEngine('engine');
    const result1 = engine.run(program1);
    
    expect( program1.has_error() ).to.equal(true);
    expect( engine.has_error() ).to.equal(true);

    expect( program1.get_error_cursor() ).to.equal(0);
    expect( engine.get_error_cursor() ).to.equal(0);

    expect( program1.get_error_message() ).to.equal('program want to push on the stack a bad value');
    expect( engine.get_error_message() ).to.equal('program want to push on the stack a bad value');
    
    expect( result1 instanceof VMError ).to.equal(true);
    expect( result1.to_number() ).to.equal(0);
    expect( result1.to_string() ).to.equal('program want to push on the stack a bad value');
  });

  it('Engine-Stack: push and pop', () => {

    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const program1_options = new VMProgramOptions();
    program1_options.entry_label = 'main';
    program1_options.registers = 10;
    program1_options.stack = 10;
    program1_options.instructions = 20;
    
    
    const program1 = new VMProgram("program1", program1_options);
    program1.push_value(value3);
    program1.push_value(value2);
    program1.push_value(value1);
    
    expect( program1.pop_value_available() ).to.equal(true);
    expect( program1.pop_value().to_number() ).to.equal(123);
    expect( program1.pop_value_available() ).to.equal(true);
    expect( program1.pop_value().to_number() ).to.equal(456);
    expect( program1.pop_value_available() ).to.equal(true);
    expect( program1.pop_value().to_number() ).to.equal(789);
    expect( program1.pop_value_available() ).to.equal(false);

    program1.push_value(value2);
    program1.push_value(value3);
    program1.push_value(value1);

    const result = program1.pop_values(3).map(v=>v.to_number());
    expect( Array.isArray(result) ).to.equal(true);
    expect(result.length).to.equal(3);
    expect(result[0]).to.equal(123);
    expect(result[1]).to.equal(789);
    expect(result[2]).to.equal(456);

    expect( program1.has_error() ).to.equal(false);
    expect( program1.pop_value() ).is.undefined;
    expect( program1.has_error() ).to.equal(true);
    expect( program1.get_error_message() ).to.equal('stack underflow: actual size=[' + program1_options.stack + ']');
  });
});