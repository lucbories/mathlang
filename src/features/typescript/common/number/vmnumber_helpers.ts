import IValue from '../../../../core/ivalue';

import VMMethod from '../../../../engine/vm/vmmethod';

import NUMBER_TYPE from './vmnumber_type';


export const number_const_fn = (c:number)=>(a:IValue)=>{ a.from_number(c); return a; }
export const number_fn = (fn:Function)=>(a:IValue)=>{ a.from_number( fn() ); return a; }
export const number_number_fn = (fn:Function)=>(a:IValue, b:IValue)=>{ a.from_number( fn(b.to_number()) ); return a; }
export const number_number_number_fn = (fn:Function)=>(a:IValue, b:IValue, c:IValue)=>{ a.from_number( fn(b.to_number(), c.to_number()) ); return a; }

export const number_const_method = (name:string, c:number)=>new VMMethod(name, [], NUMBER_TYPE, number_const_fn(c) ); // (a:IValue)=>{ a.from_number(c); return a; } );
export const number_method = (name:string, fn:Function)=>new VMMethod(name, [], NUMBER_TYPE, number_fn(fn) );
export const number_number_method = (name:string, fn:Function)=>new VMMethod(name, [NUMBER_TYPE], NUMBER_TYPE, number_number_fn( (a:number):number=>fn(a) ) )
export const number_number_number_method = (name:string, fn:Function)=>new VMMethod(name, [NUMBER_TYPE, NUMBER_TYPE], NUMBER_TYPE, number_number_number_fn( (a:number, b:number):number=>fn(a, b) ) )
