import * as mocha from 'mocha';
import * as chai from 'chai';

import VMValue from '../../../engine/vm/vmvalue';

import VMNumberType from '../../../features/numbers/vmnumber_type';
import VMNumberMathFt from '../../../features/numbers/vmnumber_math_ft';

import IInstruction from '../../../core/iinstruction';

import VMCallMethod from '../../../engine/instructions/vmcallmethod';

import VMIfPositiveZero from '../../../engine/instructions/vmifpositivezero';

import VMIncNumberReg from '../../../engine/instructions/vmincnumreg';
// import VMEqNumberTop from '../../../engine/instructions/vmeqnumtop';
// import VMNeqNumberReg from '../../../engine/instructions/vmneqnumreg';
// import VMNeqNumberTop from '../../../engine/instructions/vmneqnumtop';

import VMExit from '../../../engine/instructions/vmexit';
import VMGoto from '../../../engine/instructions/vmgoto';

import VMRegV from '../../../engine/instructions/vmregv';
import VMGetRegV from '../../../engine/instructions/vmgetrv';

import { test_simple_program, IInstructionRecord } from '../common.test';


const expect = chai.expect;
const nomain:IInstruction = undefined;


// CONFIGURE FEATURES
VMNumberType.add_feature(VMNumberMathFt);



describe('Examples:', () => {

  it('Factorial: n=? r=1 i=1 while(i<=n){ r=r*i i+=1 } return r', () => {
   
    const value1 = new VMValue(VMNumberType, 4);  // n+1
    const value2 = new VMValue(VMNumberType, 1);  // i
    const value3 = new VMValue(VMNumberType, 1);  // r
    const value4 = new VMValue(VMNumberType, 0);  // tmp
    
    const instr_exit = new VMExit();
    const instr_goto4 = new VMGoto(4);
    const instr_num_mul = new VMCallMethod('NumberMul', 3);
    const instr_num_sub = new VMCallMethod('NumberSub', 3);
    const instr_incnumreg2_1 = new VMIncNumberReg(2, 1);
    const instr_ifposzero8 = new VMIfPositiveZero(8);

    const instr_regv1 = new VMRegV(1);
    const instr_regv2 = new VMRegV(2);
    const instr_regv3 = new VMRegV(3);
    const instr_regv4 = new VMRegV(4);
    
    const instr_getregv1 = new VMGetRegV(1);
    const instr_getregv2 = new VMGetRegV(2);
    const instr_getregv3 = new VMGetRegV(3);
    const instr_getregv4 = new VMGetRegV(4);
    
    const instructions:IInstructionRecord[] = [
       // n=? r=1 i=0 tmp=0: pushv(n) pushv(i) pushv(r) pushv(tmp) regv(1) regv(2) regv(3) regv(4)
      {instruction:instr_regv1, label:'main'},        // 0
      {instruction:instr_regv2, label:undefined},     // 1
      {instruction:instr_regv3, label:undefined},     // 2
      {instruction:instr_regv4, label:undefined},     // 3
      
      // tmp = n-i: getrv(4) getrv(2) getrv(1) call(numsub) regv(4)
      {instruction:instr_getregv2, label:undefined},  // 4
      {instruction:instr_getregv1, label:undefined},  // 5
      {instruction:instr_getregv4, label:undefined},  // 6
      {instruction:instr_num_sub, label:undefined},   // 7
      {instruction:instr_regv4, label:undefined},     // 8

      // while(n-i>=0): getrv4 ifposzero(return)
      {instruction:instr_getregv4, label:undefined},  // 9
      {instruction:instr_ifposzero8, label:undefined}, // 10

      // r=r*i: getrv(3) getrv(1) getrv(3) call(nummum) regv(3)
      {instruction:instr_getregv3, label:undefined},  // 11
      {instruction:instr_getregv2, label:undefined},  // 12
      {instruction:instr_getregv3, label:undefined},  // 13
      {instruction:instr_num_mul, label:undefined},   // 14
      {instruction:instr_regv3, label:undefined},     // 15

      // i+=1: incnumreg(2,1) goto(while)
      {instruction:instr_incnumreg2_1, label:undefined}, // 16
      {instruction:instr_goto4, label:undefined},     // 17

      // return r: pushrv(3)
      {instruction:instr_getregv3, label:undefined},  // 18
      {instruction:instr_exit, label:undefined}       // 19
    ];

    const result1 = test_simple_program([value1, value2, value3, value4], nomain, instructions);
    expect( result1.to_number() ).to.equal(24);
  });
});