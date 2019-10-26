import * as mocha from 'mocha';
import * as chai from 'chai';

import VMValue from '../../../engine/vm/vmvalue';
import VMMethodCall from '../../../engine/instructions/vmcallmethod';

import {
  VMNumberType,   VMNumberMathFt,
  VMBigIntType,   VMBigIntMathFt
} from '../../../features/index';

import { test_simple_program } from '../common.test';

const expect = chai.expect;


// CONFIGURE FEATURES
VMNumberType.add_feature(VMNumberMathFt);
VMBigIntType.add_feature(VMBigIntMathFt);



describe('Feature: number operations', () => {

  it('add two integer, expect an integer' , () => {
    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const int_op = new VMMethodCall('NumberAdd', 3);
    
    const result1 = test_simple_program([value1, value2, value3], int_op);
    
    expect( result1.to_number() ).to.equal(1245);
  });

  it('substract two integer, expect an integer' , () => {
    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const int_op = new VMMethodCall('NumberSub', 3);
    
    const result1 = test_simple_program([value1, value2, value3], int_op);
    
    expect( result1.to_number() ).to.equal(-333);
  });

  it('multiply two integer, expect an integer' , () => {
    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 456);
    const value3 = new VMValue(VMNumberType, 789);
    
    const int_op = new VMMethodCall('NumberMul', 3);
    
    const result1 = test_simple_program([value1, value2, value3], int_op);
    
    expect( result1.to_number() ).to.equal(359784);
  });

  it('divide two integer, expect an integer' , () => {
    const value1 = new VMValue(VMNumberType, 123);
    const value2 = new VMValue(VMNumberType, 1233);
    const value3 = new VMValue(VMNumberType, 411);
    
    const int_op = new VMMethodCall('NumberDiv', 3);
    
    const result1 = test_simple_program([value1, value2, value3], int_op);
    
    expect( result1.to_number() ).to.equal(3);
  });
});