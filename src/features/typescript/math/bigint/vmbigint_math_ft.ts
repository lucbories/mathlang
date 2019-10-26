import * as BigIntegerStatic from 'big-integer/BigInteger';

import VMMethod from '../../../../engine/vm/vmmethod';
import VMFeature from '../../../../engine/vm/vmfeature';

import {
    bigint_method,
    bigint_bigint_method,
    bigint_bigint_bigint_method,
    bool_bigint_method,
    bigint_bigint_bignum_method,
    bigint_bigint_bignum_bignum_method
} from './vmbigint_helpers';

import BIGINT_CONVERTERS from './vmbigint_converters';



type BigNumber = BigIntegerStatic.BigNumber;
type BigInteger = BigIntegerStatic.BigInteger;
type BigDivMod = { quotient:BigInteger, remainder:BigInteger };
// type BaseArray = BigIntegerStatic.BaseArray;


    // Instance operations

    // Creators
const bigint_empty        = bigint_method("BigIntCreateEmpty", ()=>BigIntegerStatic() );
const bigint_minus_one    = bigint_method("BigIntCreateMinusOne", ()=>BigIntegerStatic.minusOne );
const bigint_one          = bigint_method("BigIntCreateOne", ()=>BigIntegerStatic.one );
const bigint_zero         = bigint_method("BigIntCreateZero", ()=>BigIntegerStatic.zero );
const bigint_rand_between = bigint_bigint_bigint_method("BigIntCreateRandBetween", (min:BigNumber, max:BigNumber):BigInteger=>BigIntegerStatic.randBetween(min, max) );

const BIGINT_MATH_CREATORS_METHODS:VMMethod[]=[
    bigint_empty, bigint_minus_one, bigint_one, bigint_zero, bigint_rand_between
];


    // Math properties
const bigint_is_instance  = bool_bigint_method("BigIntIsInstance", (x:any)=>BigIntegerStatic.isInstance(x) );
const bigint_is_unit      = bool_bigint_method("BigIntIsUnit",     (a:BigInteger)=>a.isUnit() );
const bigint_is_even      = bool_bigint_method("BigIntIsEven",     (a:BigInteger)=>a.isEven() );
const bigint_is_zero      = bool_bigint_method("BigIntIsZero",     (a:BigInteger)=>a.isZero() );
const bigint_is_odd       = bool_bigint_method("BigIntIsOdd",      (a:BigInteger)=>a.isOdd() );
const bigint_is_negative  = bool_bigint_method("BigIntIsNegative", (a:BigInteger)=>a.isNegative() );
const bigint_is_positive  = bool_bigint_method("BigIntIsPositive", (a:BigInteger)=>a.isPositive() );
const bigint_is_prime     = bool_bigint_method("BigIntIsPrime",    (a:BigInteger)=>a.isPrime() );
// const bigint_is_probable_prime = bool_bigint_method("BigIntIsProbablePrime", (a:BigInteger, iterations?:number)=>a.is_probable_prime(iterations) );
// const bigint_is_divisible_by   = bool_bigint_bignumber_method("BigIntIsDivisibleBy",   (a:BigInteger, b:BigNumber)=>a.isDivisibleBy(b) );

const BIGINT_MATH_PROPS_METHODS:VMMethod[]=[
    bigint_is_instance,
    bigint_is_unit, bigint_is_even, bigint_is_zero, bigint_is_odd,
    bigint_is_negative, bigint_is_positive, bigint_is_prime
];


    // Arithmetic operations
const bigint_div_mod = bigint_bigint_bignum_method("BigIntDivMod",        (a:BigInteger,b:BigNumber):BigDivMod=>a.divmod(b) );
// const bigint_mod     = bigint_bigint_bignum_method("BigIntMod",           (a:BigInteger,b:BigNumber):BigDivMod=>a.mod(b) );
const bigint_mod_inv = bigint_bigint_bignum_method("BigIntModInv",        (a:BigInteger,b:BigNumber):BigInteger=>a.modInv(b) );
const bigint_mod_pow = bigint_bigint_bignum_bignum_method("BigIntModPow", (a:BigInteger, exp:BigNumber, mod:BigNumber)=>a.modPow(exp, mod) );

const bigint_add = bigint_bigint_bignum_method("BigIntAdd", (a:BigInteger,b:BigNumber):BigInteger=>a.add(b));
const bigint_sub = bigint_bigint_bignum_method("BigIntSub", (a:BigInteger,b:BigNumber):BigInteger=>a.subtract(b));
const bigint_mul = bigint_bigint_bignum_method("BigIntMul", (a:BigInteger,b:BigNumber):BigInteger=>a.multiply(b));
const bigint_div = bigint_bigint_bignum_method("BigIntDiv", (a:BigInteger,b:BigNumber):BigInteger=>a.divide(b));
const bigint_pow = bigint_bigint_bignum_method("BigIntPow", (a:BigInteger,b:BigNumber):BigInteger=>a.pow(b));

const bigint_random = bigint_method("BigIntRandom", Math.random);
const bigint_square = bigint_bigint_method("BigIntAbs", (a:BigInteger)=>a.square() );
const bigint_negate = bigint_bigint_method("BigIntAbs", (a:BigInteger)=>a.negate() );
const bigint_abs    = bigint_bigint_method("BigIntAbs", (a:BigInteger)=>a.abs() );
const bigint_incr   = bigint_bigint_method("BigIntAbs", (a:BigInteger)=>a.next() );
const bigint_decr   = bigint_bigint_method("BigIntAbs", (a:BigInteger)=>a.prev() );
const bigint_sign   = bigint_bigint_method("BigIntSign", Math.sign);
const bigint_ceil   = bigint_bigint_method("BigIntCeil", Math.ceil);
const bigint_floor  = bigint_bigint_method("BigIntFloor", Math.floor);
const bigint_fround = bigint_bigint_method("BigIntFround", Math.fround);
const bigint_trunc  = bigint_bigint_method("BigIntTrunc", Math.trunc);

const bigint_min    = bigint_bigint_bigint_method("BigIntMin", Math.min);
const bigint_max    = bigint_bigint_bigint_method("BigIntMax", Math.max);

const BIGINT_MATH_ARITH_METHODS:VMMethod[]=[
    bigint_div_mod, bigint_mod_inv, bigint_mod_pow,
    bigint_add, bigint_sub, bigint_mul, bigint_div, bigint_pow,
    bigint_random, bigint_square, bigint_negate,
    bigint_abs, bigint_incr, bigint_decr, bigint_sign,
    bigint_ceil, bigint_floor, bigint_fround, bigint_trunc,
    bigint_min, bigint_max
];

    // Trinometric operations
const bigint_cos    = bigint_bigint_method("BigIntCos", Math.cos);
const bigint_sin    = bigint_bigint_method("BigIntSin", Math.sin);
const bigint_tan    = bigint_bigint_method("BigIntTan", Math.tan);
const bigint_acos   = bigint_bigint_method("BigIntAcos", Math.acos);
const bigint_asin   = bigint_bigint_method("BigIntAsin", Math.asin);
const bigint_atan   = bigint_bigint_method("BigIntAtan", Math.atan);
const bigint_atan2  = bigint_bigint_bigint_method("BigIntAtan2", Math.atan2);

const bigint_cosh   = bigint_bigint_method("BigIntCosh", Math.cosh);
const bigint_sinh   = bigint_bigint_method("BigIntSinh", Math.sinh);
const bigint_tanh   = bigint_bigint_method("BigIntTanh", Math.tanh);
const bigint_acosh  = bigint_bigint_method("BigIntAcosh", Math.acosh);
const bigint_asinh  = bigint_bigint_method("BigIntAsinh", Math.asinh);
const bigint_atanh  = bigint_bigint_method("BigIntAtanh", Math.atanh);

const bigint_sqrt   = bigint_bigint_method("BigIntSqrt", Math.sqrt);
const bigint_exp    = bigint_bigint_method("BigIntExp", Math.exp);
const bigint_log    = bigint_bigint_method("BigIntLog", Math.log);
const bigint_log10  = bigint_bigint_method("BigIntLog10", Math.log10);
const bigint_log1p  = bigint_bigint_method("BigIntLog1p", Math.log1p);
const bigint_log2   = bigint_bigint_method("BigIntLog2", Math.log2);
// const bigint_const_ln10 = bigint_const_method("BigIntLn10", Math.LN10);
// const bigint_const_ln2  = bigint_const_method("BigIntLn2", Math.LN2);
const BIGINT_MATH_TRIGO_METHODS:VMMethod[]=[
    bigint_cos, bigint_sin, bigint_tan, bigint_acos, bigint_asin, bigint_atan, bigint_atan2,
    bigint_cosh, bigint_sinh, bigint_tanh, bigint_acosh, bigint_asinh, bigint_atanh,
    bigint_sqrt, bigint_exp, bigint_log, bigint_log10, bigint_log1p, bigint_log2
];


const BIGINT_MATH_METHODS:VMMethod[]=
    BIGINT_MATH_CREATORS_METHODS
    .concat(BIGINT_MATH_PROPS_METHODS)
    .concat(BIGINT_MATH_ARITH_METHODS)
    .concat(BIGINT_MATH_TRIGO_METHODS);



class NumberMathFeature extends VMFeature {
    constructor(){
        super("BigIntMath", BIGINT_MATH_METHODS, BIGINT_CONVERTERS);
    }
}

const BIGINT_MATH_FEATURE = new NumberMathFeature();

export default BIGINT_MATH_FEATURE;