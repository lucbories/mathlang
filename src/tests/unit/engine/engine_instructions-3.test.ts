import * as mocha from 'mocha';
import * as chai from 'chai';

import VMValue from '../../../engine/vm/vmvalue';

import VMNumberType from '../../../features/numbers/vmnumber_type';
import VMNumberMathFt from '../../../features/numbers/vmnumber_math_ft';

import IInstruction from '../../../core/iinstruction';

import VMEqNumberReg from '../../../engine/instructions/vmeqnumreg';
import VMEqNumberTop from '../../../engine/instructions/vmeqnumtop';
import VMNeqNumberReg from '../../../engine/instructions/vmneqnumreg';
import VMNeqNumberTop from '../../../engine/instructions/vmneqnumtop';

import VMExit from '../../../engine/instructions/vmexit';

import VMRegV from '../../../engine/instructions/vmregv';
import VMGetRegV from '../../../engine/instructions/vmgetrv';

import { test_simple_program, IInstructionRecord } from '../common.test';


const expect = chai.expect;
const nomain:IInstruction = undefined;


// CONFIGURE FEATURES
VMNumberType.add_feature(VMNumberMathFt);



function test_eq(cond_value:number, instr_eq:IInstruction) {

  const value1 = new VMValue(VMNumberType, cond_value);
  const value2 = new VMValue(VMNumberType, 123);
  const value3 = new VMValue(VMNumberType, 456);
  const value4 = new VMValue(VMNumberType, 789);
  
  const instr_exit = new VMExit();
  const instr_regv1 = new VMRegV(1);
  const instr_regv2 = new VMRegV(2);
  const instr_regv3 = new VMRegV(3);
  const instr_regv4 = new VMRegV(4);
  const instr_getregv1 = new VMGetRegV(1);
  const instr_getregv2 = new VMGetRegV(2);
  const instr_getregv3 = new VMGetRegV(3);
  const instr_getregv4 = new VMGetRegV(4);
  
  const instructions:IInstructionRecord[] = [
    {instruction:instr_regv1, label:'main'},      // 0
    {instruction:instr_regv2, label:undefined},   // 1
    {instruction:instr_regv3, label:undefined},   // 2
    {instruction:instr_regv4, label:undefined},   // 3
    {instruction:instr_getregv1, label:undefined},// 4 OPERAND 1
    {instruction:instr_getregv2, label:undefined},// 5 OPERAND 2
    {instruction:instr_eq, label:undefined},      // 6 IF...
    {instruction:instr_getregv3, label:undefined},// 7 THEN
    {instruction:instr_exit, label:undefined},    // 8
    {instruction:instr_getregv4, label:undefined},// 9 ELSE
    {instruction:instr_exit, label:undefined}     // 10
  ];

  return test_simple_program([value1, value2, value3, value4], nomain, instructions);
}


describe('Engine-Instructions-3:EqNumTop,NeqNumTop,EqNumReg,NeqNumReg', () => {

  it('EqNumTop: 0:reg1=123 1:reg2=123 2:reg3=456 3:reg4=789 4:getrv(1) 5:getrv(2) 6:eqnumtop=3 7:getrv(2) 8:Exit 9:getrv(3) 10:exit', () => {

    const instr_eq = new VMEqNumberTop(3);
    const result1 = test_eq(123, instr_eq);
    expect( result1.to_number() ).to.equal(456);
  });

  it('EqNumTop: 0:reg1=-123 1:reg2=123 2:reg3=456 3:reg4=789 4:getrv(1) 5:getrv(2) 6:eqnumtop=3 7:getrv(2) 8:Exit 9:getrv(3) 10:exit', () => {

    const instr_eq = new VMEqNumberTop(3);
    const result1 = test_eq(-123, instr_eq);
    expect( result1.to_number() ).to.equal(789);
  });
  
  it('NeqNumTop: 0:reg1=123 1:reg2=123 2:reg3=456 3:reg4=789 4:getrv(1) 5:getrv(2) 6:eqnumtop=3 7:getrv(2) 8:Exit 9:getrv(3) 10:exit', () => {

    const instr_eq = new VMNeqNumberTop(3);
    const result1 = test_eq(123, instr_eq);
    expect( result1.to_number() ).to.equal(789);
  });

  it('NeqNumTop: 0:reg1=-123 1:reg2=123 2:reg3=456 3:reg4=789 4:getrv(1) 5:getrv(2) 6:eqnumtop=3 7:getrv(2) 8:Exit 9:getrv(3) 10:exit', () => {

    const instr_eq = new VMNeqNumberTop(3);
    const result1 = test_eq(-123, instr_eq);
    expect( result1.to_number() ).to.equal(456);
  });



  it('EqNumReg: 0:reg1=123 1:reg2=123 2:reg3=456 3:reg4=789 4:getrv(1) 5:getrv(2) 6:eqnumtop=3 7:getrv(2) 8:Exit 9:getrv(3) 10:exit', () => {

    const instr_eq = new VMEqNumberReg(3, 1, 2);
    const result1 = test_eq(123, instr_eq);
    expect( result1.to_number() ).to.equal(456);
  });

  it('EqNumReg: 0:reg1=-123 1:reg2=123 2:reg3=456 3:reg4=789 4:getrv(1) 5:getrv(2) 6:eqnumtop=3 7:getrv(2) 8:Exit 9:getrv(3) 10:exit', () => {

    const instr_eq = new VMEqNumberReg(3, 1, 2);
    const result1 = test_eq(-123, instr_eq);
    expect( result1.to_number() ).to.equal(789);
  });
  
  it('NeqNumTReg: 0:reg1=123 1:reg2=123 2:reg3=456 3:reg4=789 4:getrv(1) 5:getrv(2) 6:eqnumtop=3 7:getrv(2) 8:Exit 9:getrv(3) 10:exit', () => {

    const instr_eq = new VMNeqNumberReg(3, 1, 2);
    const result1 = test_eq(123, instr_eq);
    expect( result1.to_number() ).to.equal(789);
  });

  it('NeqNumReg: 0:reg1=-123 1:reg2=123 2:reg3=456 3:reg4=789 4:getrv(1) 5:getrv(2) 6:eqnumtop=3 7:getrv(2) 8:Exit 9:getrv(3) 10:exit', () => {

    const instr_eq = new VMNeqNumberReg(3, 1, 2);
    const result1 = test_eq(-123, instr_eq);
    expect( result1.to_number() ).to.equal(456);
  });
});