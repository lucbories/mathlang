import * as mocha from 'mocha';
import * as chai from 'chai';

// import IValue from '../../../core/ivalue';
// import IInstruction from '../../../core/iinstruction';

import VMValue from '../../../engine/vm/vmvalue';
// import VMError from '../../../engine/vm/vmerror';
// import VMEngine from '../../../engine/vm/vmengine';
// import VMProgramOptions from '../../../engine/vm/vmprogramoptions';
// import VMProgram from '../../../engine/vm/vmprogram';

import VMNumberType from '../../../features/numbers/vmnumber_type';
import VMNumberMathFt from '../../../features/numbers/vmnumber_math_ft';

// import VMMethodCall from '../../../engine/instructions/vmcallmethod';

// import VMPopV from '../../../engine/instructions/vmpopv';
// import VMPushV from '../../../engine/instructions/vmpushv';

// import VMIfPositive from '../../../engine/instructions/vmifpositive';
// import VMIfPositiveZero from '../../../engine/instructions/vmifpositivezero';
// import VMIfNegative from '../../../engine/instructions/vmifnegative';
// import VMIfNegativeZero from '../../../engine/instructions/vmifnegativezero';
// import VMIfZero from '../../../engine/instructions/vmifzero';

import VMExit from '../../../engine/instructions/vmexit';
import VMGoto from '../../../engine/instructions/vmgoto';

import VMRegV from '../../../engine/instructions/vmregv';
// import VMUnRegV from '../../../engine/instructions/vmunrv';
import VMGetRegV from '../../../engine/instructions/vmgetrv';
import IInstruction from '../../../core/iinstruction';

import { test_simple_program, IInstructionRecord } from '../common.test';


const expect = chai.expect;
const nomain:IInstruction = undefined;


// CONFIGURE FEATURES
VMNumberType.add_feature(VMNumberMathFt);



describe('Engine-Instructions-1:Goto,Exit,RegV,GetRV', () => {

  it('Engine-Instructions: instr0:reg1=123, instr1:reg2=456 instr2:Goto(5) instr3:getrv(1), intsr4:exit, instr5:getrv(2), instr6:exit', () => {

    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_goto5 = new VMGoto(5);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},
      {instruction:instr_regv2, label:undefined},
      {instruction:instr_goto5, label:undefined},
      {instruction:instr_getregv1, label:undefined},
      {instruction:instr_exit, label:undefined},
      {instruction:instr_getregv2, label:undefined},
      {instruction:instr_exit, label:undefined}
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(456);
  });

  it('Engine-Instructions: 0:reg1=123 1:reg2=456 2:goto(4) 3:exit 4:goto(8), 5:exit 6:getrv(1) 7:exit 8:goto(6) 9:exit 10:getrv(2) 11:exit', () => {

    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_goto4 = new VMGoto(4);
    const instr_goto6 = new VMGoto(6);
    const instr_goto8 = new VMGoto(8);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},    // 0
      {instruction:instr_regv2, label:undefined}, // 1
      {instruction:instr_goto4, label:undefined}, // 2
      {instruction:instr_exit, label:undefined},  // 3
      {instruction:instr_goto8, label:undefined}, // 4
      {instruction:instr_exit, label:undefined},  // 5
      {instruction:instr_getregv1, label:undefined}, // 6
      {instruction:instr_exit, label:undefined},  // 7
      {instruction:instr_goto6, label:undefined}, // 8
      {instruction:instr_exit, label:undefined},  // 9
      {instruction:instr_getregv2, label:undefined}, // 10
      {instruction:instr_exit, label:undefined}   // 11
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(123);
  });
});