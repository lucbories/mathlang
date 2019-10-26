import * as mocha from 'mocha';
import * as chai from 'chai';

import VMValue from '../../../engine/vm/vmvalue';
import VMMethodCall from '../../../engine/instructions/vmcallmethod';

import VMNumberType from '../../../features/common/number/vmnumber_type';
import VMNumberMathFt from '../../../features/common/number/vmnumber_math_ft';
import VMBigIntType from '../../../features/math/bigint/vmbigint_type';
import VMBigIntMathFt from '../../../features/math/bigint/vmbigint_math_ft';

import { test_simple_program } from '../common.test';

const expect = chai.expect;

// CONFIGURE FEATURES
VMNumberType.add_feature(VMNumberMathFt);
VMBigIntType.add_feature(VMBigIntMathFt);



describe('Feature: bigint operations', () => {

  it('add two bigint, expect a bigint' , () => {
    const value1 = new VMValue(VMBigIntType, 0);
    const value2 = new VMValue(VMBigIntType, "456123456789123456789899999999999999");
    const value3 = new VMValue(VMBigIntType, "789123456789123456789456666666666666");
    
    const int_op = new VMMethodCall('BigIntAdd', 3);
    
    const result1 = test_simple_program([value1, value2, value3], int_op);
    
    expect( result1.to_string() ).to.equal("1245246913578246913579356666666666665");
  });

  it('substract two bigint, expect a bigint' , () => {
    const value1 = new VMValue(VMBigIntType, 123);
    const value2 = new VMValue(VMBigIntType, 456);
    const value3 = new VMValue(VMBigIntType, 789);
    
    const int_op = new VMMethodCall('BigIntSub', 3);
    
    const result1 = test_simple_program([value1, value2, value3], int_op);
    
    expect( result1.to_number() ).to.equal(-333);
  });

  it('multiply two bigint, expect an bigint' , () => {
    const value1 = new VMValue(VMBigIntType, 123);
    const value2 = new VMValue(VMBigIntType, 456);
    const value3 = new VMValue(VMBigIntType, 789);
    
    const int_op = new VMMethodCall('BigIntMul', 3);
    
    const result1 = test_simple_program([value1, value2, value3], int_op);
    
    expect( result1.to_number() ).to.equal(359784);
  });

  it('divide two bigint, expect an bigint' , () => {
    const value1 = new VMValue(VMBigIntType, 123);
    const value2 = new VMValue(VMBigIntType, 1233);
    const value3 = new VMValue(VMBigIntType, 411);
    
    const int_op = new VMMethodCall('BigIntDiv', 3);
    
    const result1 = test_simple_program([value1, value2, value3], int_op);
    
    expect( result1.to_number() ).to.equal(3);
  });

});