import * as BigIntegerStatic from 'big-integer/BigInteger';

import IMethod from '../../../core/imethod';

import {
    // bigint_method,
    // bigint_bigint_method,
    // bigint_bigint_bigint_method,
    // bool_bigint_method,
    // bigint_bigint_bignum_method,
    // bigint_bigint_bignum_bignum_method,
    bigint_number_method
} from './vmbigint_helpers';


// type BigNumber = BigIntegerStatic.BigNumber;
type BigInteger = BigIntegerStatic.BigInteger;
// type BigDivMod = { quotient:BigInteger, remainder:BigInteger };
// type BaseArray = BigIntegerStatic.BaseArray;



    // Converters
const bigint_from_number_fn     = (value:number)=>BigIntegerStatic(value)
// const bigint_from_string     = (value: string, base?:BigNumber, alphabet?: string, caseSensitive?: boolean)=>BigIntegerStatic(value, base, alphabet, caseSensitive),
// const bigint_from_biginteger = (value:BigInteger)=>BigIntegerStatic(value),
// const bigint_from_array      = (digits:BigNumber[], base?:BigNumber, isNegative?: boolean)=>BigIntegerStatic.fromArray(digits, base, isNegative),

// const bigint_to_array:       (a:BigInteger, radix: number):BaseArray=>a.toArray(radix),
// const bigint_to_number:      (a:BigInteger)=>a.toJSNumber(),
// const bigint_to_string:      (a:BigInteger)=>a.toString(),
// const bigint_to_json:        (a:BigInteger)=>a.toJSON(),

const bigint_from_number = bigint_number_method("BigIntFromNumber", bigint_from_number_fn);


const converters = new Map<string,IMethod>();
converters.set("BIGINT_TYPE", bigint_from_number);


export default converters;