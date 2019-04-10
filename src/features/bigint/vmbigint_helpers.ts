import * as BigIntegerStatic from 'big-integer/BigInteger';

import IValue from '../../core/ivalue';

import VMMethod from '../../engine/vm/vmmethod';

import BIGINT_TYPE from './vmbigint_type';
import NUMBER_TYPE from '../numbers/vmnumber_type';



type BigNumber = BigIntegerStatic.BigNumber;
type BigInteger = BigIntegerStatic.BigInteger;
// type BigDivMod = { quotient:BigInteger, remainder:BigInteger };
// type BaseArray = BigIntegerStatic.BaseArray;

// const bigint_const_fn = (c:BigInteger)=>(a:IValue)=>{ a.set_value(c); return a; }
export const bigint_fn = (fn:Function)=>(a:IValue)=>{ a.set_value( fn() ); return a; }
export const bigint_bigint_fn = (fn:Function)=>(a:IValue, b:IValue)=>{ a.set_value( fn(b.get_value()) ); return a; }
export const bigint_bigint_bigint_fn = (fn:Function)=>(a:IValue, b:IValue, c:IValue)=>{ a.set_value( fn(b.get_value(), c.get_value()) ); return a; }
export const bigint_bigint_bigint_bigint_fn = (fn:Function)=>(a:IValue, b:IValue, c:IValue, d:IValue)=>{ a.set_value( fn(b.get_value(), c.get_value(), d.get_value()) ); return a; }

// const bigint_const_method = (name:string, c:BigInteger)=>new VMMethod(name, [], BIGINT_TYPE, bigint_const_fn(c) );
export const bigint_method = (name:string, fn:Function)=>new VMMethod(name, [], BIGINT_TYPE, bigint_fn(fn) );
export const bigint_bigint_method = (name:string, fn:Function)=>new VMMethod(name, [BIGINT_TYPE], BIGINT_TYPE, bigint_bigint_fn( (a:BigInteger):BigInteger=>fn(a) ) )
export const bigint_bigint_bigint_method = (name:string, fn:Function)=>new VMMethod(name, [BIGINT_TYPE, BIGINT_TYPE], BIGINT_TYPE, bigint_bigint_bigint_fn( (a:BigInteger, b:BigInteger):BigInteger=>fn(a, b) ) )
// const bigint_bigint_bigint_bigint_method = (name:string, fn:Function)=>new VMMethod(name, [BIGINT_TYPE, BIGINT_TYPE, BIGINT_TYPE], BIGINT_TYPE, bigint_bigint_bigint_bigint_fn( (a:BigInteger, b:BigInteger, c:BigInteger):BigInteger=>fn(a, b, c) ) )

export const bool_bigint_fn = (fn:Function)=>(a:IValue, b:IValue)=>{ a.from_number( fn(b.get_value()) ? 1 : 0 ); return a; }
export const bool_bigint_method = (name:string, fn:Function)=>new VMMethod(name, [BIGINT_TYPE], BIGINT_TYPE, bool_bigint_fn( (a:BigInteger):boolean=>fn(a) ) )

export const bigint_bigint_bignum_method = (name:string, fn:Function)=>new VMMethod(name, [BIGINT_TYPE, BIGINT_TYPE], BIGINT_TYPE, bigint_bigint_bigint_fn( (a:BigInteger, b:BigNumber):BigInteger=>fn(a, b) ) )

export const bigint_bigint_bignum_bignum_method = (name:string, fn:Function)=>new VMMethod(name, [BIGINT_TYPE, BIGINT_TYPE, BIGINT_TYPE], BIGINT_TYPE, bigint_bigint_bigint_bigint_fn( (a:BigInteger, b:BigNumber, c:BigNumber):BigInteger=>fn(a, b, c) ) )

export const bigint_number_fn = (fn:Function)=>(a:IValue, b:number)=>{ a.set_value( fn(b) ); return a; }
export const bigint_number_method = (name:string, fn:Function)=>new VMMethod(name, [NUMBER_TYPE], BIGINT_TYPE, bigint_number_fn(fn) );
