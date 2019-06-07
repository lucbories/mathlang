import * as mocha from 'mocha';
import * as chai from 'chai';

// import IValue from '../../../core/ivalue';
// import IInstruction from '../../../core/iinstruction';

import VMValue from '../../../engine/vm/vmvalue';
// import VMError from '../../../engine/vm/vmerror';
// import VMEngine from '../../../engine/vm/vmengine';
// import VMProgramOptions from '../../../engine/vm/vmprogramoptions';
// import VMProgram from '../../../engine/vm/vmprogram';

import VMNumberType from '../../../features/common/number/vmnumber_type';
import VMNumberMathFt from '../../../features/common/number/vmnumber_math_ft';

// import VMMethodCall from '../../../engine/instructions/vmcallmethod';

// import VMPopV from '../../../engine/instructions/vmpopv';
// import VMPushV from '../../../engine/instructions/vmpushv';

import VMIfPositive from '../../../engine/instructions/vmifpositive';
import VMIfPositiveZero from '../../../engine/instructions/vmifpositivezero';
import VMIfNegative from '../../../engine/instructions/vmifnegative';
import VMIfNegativeZero from '../../../engine/instructions/vmifnegativezero';
import VMIfZero from '../../../engine/instructions/vmifzero';

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


function test_if(cond_value:number, instr_if:IInstruction) {

  const value1 = new VMValue(VMNumberType, cond_value);
  const value2 = new VMValue(VMNumberType, 456);
  const value3 = new VMValue(VMNumberType, 789);
  
  const instr_exit = new VMExit();
  const instr_regv1 = new VMRegV(1);
  const instr_regv2 = new VMRegV(2);
  const instr_regv3 = new VMRegV(3);
  const instr_getregv1 = new VMGetRegV(1);
  const instr_getregv2 = new VMGetRegV(2);
  const instr_getregv3 = new VMGetRegV(3);
  
  const instructions:IInstructionRecord[] = [
    {instruction:instr_regv1, label:'main'},      // 0
    {instruction:instr_regv2, label:undefined},   // 1
    {instruction:instr_regv3, label:undefined},   // 2
    {instruction:instr_getregv1, label:undefined},// 3
    {instruction:instr_if, label:undefined},      // 4 IF...
    {instruction:instr_getregv2, label:undefined},// 5  THEN
    {instruction:instr_exit, label:undefined},    // 6
    {instruction:instr_getregv3, label:undefined},// 7  ELSE
    {instruction:instr_exit, label:undefined}     // 8
  ];

  return test_simple_program([value1, value2, value3], nomain, instructions);
}


describe('Engine-Instructions-2:IfPos,IfNeg,IfZero,IfPosZ,IfNegZ', () => {

  it('IfPositive: 0:reg1=123 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifpos=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const instr_ifpos7 = new VMIfPositive(3);
    const result1 = test_if(123, instr_ifpos7);
    expect( result1.to_number() ).to.equal(456);
  });

  it('IfPositive: 0:reg1=-123 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifpos=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const instr_ifpos7 = new VMIfPositive(3);
    const result1 = test_if(-123, instr_ifpos7);
    expect( result1.to_number() ).to.equal(789);
  });

  it('IfPositive: 0:reg1=0 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifpos=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const instr_ifpos7 = new VMIfPositive(3);
    const result1 = test_if(-123, instr_ifpos7);
    expect( result1.to_number() ).to.equal(789);
  });

// ********************************************************************************************

  it('IfNegative: 0:reg1=123 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifneg=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifneg7 = new VMIfNegative(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifneg7, label:undefined},   // 4 IF NEGATIVE
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(789);
  });

  it('IfNegative: 0:reg1=-123 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifneg=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, -123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifneg7 = new VMIfNegative(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifneg7, label:undefined},   // 4 IF NEGATIVE
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(456);
  });

  it('IfNegative: 0:reg1=0 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifneg=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, 0);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifneg7 = new VMIfNegative(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifneg7, label:undefined},   // 4 IF NEGATIVE
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(789);
  });

  // ********************************************************************************************

  it('IfZero: 0:reg1=123 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifzero=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifzero3 = new VMIfZero(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifzero3, label:undefined},   // 4 IF ZERO
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(789);
  });

  it('IfZero: 0:reg1=-123 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifzero=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, -123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifzero3 = new VMIfZero(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifzero3, label:undefined},   // 4 IF ZERO
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(789);
  });

  it('IfZero: 0:reg1=0 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifzero=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, 0);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifzero3 = new VMIfZero(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifzero3, label:undefined},   // 4 IF ZERO
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(456);
  });

  // ********************************************************************************************

  it('IfPositiveZero: 0:reg1=123 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifposzero=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifposzero3 = new VMIfPositiveZero(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifposzero3, label:undefined},   // 4 IF POSITIVE OR ZERO
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(456);
  });

  it('IfPositiveZero: 0:reg1=-123 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifposzero=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, -123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifposzero3 = new VMIfPositiveZero(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifposzero3, label:undefined},   // 4 IF POSITIVE OR ZERO
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(789);
  });

  it('IfPositiveZero: 0:reg1=0 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifposzero=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, 0);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifposzero3 = new VMIfPositiveZero(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifposzero3, label:undefined},   // 4 IF POSITIVE OR ZERO
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(456);
  });

  // ********************************************************************************************

  it('IfNegativeZero: 0:reg1=123 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifnegzero=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifnegzero3 = new VMIfNegativeZero(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifnegzero3, label:undefined},   // 4 IF NEGATIVE OR ZERO
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(789);
  });

  it('IfNegativeZero: 0:reg1=-123 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifnegzero=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, -123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifnegzero3 = new VMIfNegativeZero(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifnegzero3, label:undefined},   // 4 IF NEGATIVE OR ZERO
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(456);
  });

  it('IfNegativeZero: 0:reg1=0 1:reg2=456 2:reg2=789 3:getrv(1) 4:ifnegzero=3 5:getrv(2) 6:Exit 7:getrv(3) 8:exit', () => {

    const value1 = new VMValue(VMNumberType, 0);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const instr_exit = new VMExit();
    const instr_ifnegzero3 = new VMIfNegativeZero(3);
    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    
    const instructions:IInstructionRecord[] = [
      {instruction:instr_regv1, label:'main'},      // 0
      {instruction:instr_regv2, label:undefined},   // 1
      {instruction:instr_regv3, label:undefined},   // 2
      {instruction:instr_getregv1, label:undefined},// 3
      {instruction:instr_ifnegzero3, label:undefined},   // 4 IF NEGATIVE OR ZERO
      {instruction:instr_getregv2, label:undefined},// 5  THEN
      {instruction:instr_exit, label:undefined},    // 6
      {instruction:instr_getregv3, label:undefined},// 7  ELSE
      {instruction:instr_exit, label:undefined}     // 8
    ];

    const result1 = test_simple_program([value1, value2, value3], nomain, instructions);

    expect( result1.to_number() ).to.equal(456);
  });
});