
import VMMethod from '../../../engine/vm/vmmethod';
import VMFeature from '../../../engine/vm/vmfeature';

import {
    number_const_method,
    number_method,
    number_number_method,
    number_number_number_method
} from './vmnumber_helpers';

import NUMBER_CONVERTERS from './vmnumber_converters';


const number_add = number_number_number_method("NumberAdd", (a:number,b:number):number=>a+b);
const number_sub = number_number_number_method("NumberSub", (a:number,b:number):number=>a-b);
const number_mul = number_number_number_method("NumberMul", (a:number,b:number):number=>a*b);
const number_div = number_number_number_method("NumberDiv", (a:number,b:number):number=>a/b);
const number_pow = number_number_number_method("NumberPow", (a:number,b:number):number=>a^b);

const number_random = number_method("NumberRandom", Math.random);
const number_abs    = number_number_method("NumberAbs", Math.abs);
const number_sign   = number_number_method("NumberSign", Math.sign);
const number_ceil   = number_number_method("NumberCeil", Math.ceil);
const number_floor  = number_number_method("NumberFloor", Math.floor);
const number_fround = number_number_method("NumberFround", Math.fround);
const number_trunc  = number_number_method("NumberTrunc", Math.trunc);

const number_min    = number_number_number_method("NumberMin", Math.min);
const number_max    = number_number_number_method("NumberMax", Math.max);

const number_cos    = number_number_method("NumberCos", Math.cos);
const number_sin    = number_number_method("NumberSin", Math.sin);
const number_tan    = number_number_method("NumberTan", Math.tan);
const number_acos   = number_number_method("NumberAcos", Math.acos);
const number_asin   = number_number_method("NumberAsin", Math.asin);
const number_atan   = number_number_method("NumberAtan", Math.atan);
const number_atan2  = number_number_number_method("NumberAtan2", Math.atan2);

const number_cosh   = number_number_method("NumberCosh", Math.cosh);
const number_sinh   = number_number_method("NumberSinh", Math.sinh);
const number_tanh   = number_number_method("NumberTanh", Math.tanh);
const number_acosh  = number_number_method("NumberAcosh", Math.acosh);
const number_asinh  = number_number_method("NumberAsinh", Math.asinh);
const number_atanh  = number_number_method("NumberAtanh", Math.atanh);

const number_sqrt   = number_number_method("NumberSqrt", Math.sqrt);
const number_exp    = number_number_method("NumberExp", Math.exp);
const number_log    = number_number_method("NumberLog", Math.log);
const number_log10  = number_number_method("NumberLog10", Math.log10);
const number_log1p  = number_number_method("NumberLog1p", Math.log1p);
const number_log2   = number_number_method("NumberLog2", Math.log2);
const number_const_ln10 = number_const_method("NumberLn10", Math.LN10);
const number_const_ln2  = number_const_method("NumberLn2", Math.LN2);


const NUMBER_MATH_METHODS:VMMethod[]=[
    number_add, number_sub, number_mul,number_div, number_pow,
    number_random, number_abs, number_sign, number_ceil, number_floor, number_fround, number_trunc,
    number_min, number_max,
    number_cos, number_sin, number_tan, number_acos, number_asin, number_atan, number_atan2,
    number_cosh, number_sinh, number_tanh, number_acosh, number_asinh, number_atanh,
    number_sqrt, number_exp, number_log, number_log10, number_log1p, number_log2,
    number_const_ln10, number_const_ln2
];


class NumberMathFeature extends VMFeature {
    constructor(){
        super("NumberMath", NUMBER_MATH_METHODS, NUMBER_CONVERTERS);
    }
}

const NUMBER_MATH_FEATURE = new NumberMathFeature();

export default NUMBER_MATH_FEATURE;