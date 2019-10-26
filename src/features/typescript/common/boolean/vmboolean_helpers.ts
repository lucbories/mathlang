import IValue from '../../../../core/ivalue';

import VMMethod from '../../../../engine/vm/vmmethod';

import BOOLEAN_TYPE from './vmboolean_type';


export const boolean_const_fn = (c:boolean)=>(a:IValue)=>{ a.from_number(c ? 1 : 0); return a; }
export const boolean_fn = (fn:Function)=>(a:IValue)=>{ a.from_number( fn() ); return a; }
export const boolean_boolean_fn = (fn:Function)=>(a:IValue, b:IValue)=>{ a.from_number( fn(b.to_number()) ); return a; }
export const boolean_boolean_boolean_fn = (fn:Function)=>(a:IValue, b:IValue, c:IValue)=>{ a.from_number( fn(b.to_number(), c.to_number()) ); return a; }

export const boolean_const_method = (name:string, c:boolean)=>new VMMethod(name, [], BOOLEAN_TYPE, boolean_const_fn(c) );
export const boolean_method = (name:string, fn:Function)=>new VMMethod(name, [], BOOLEAN_TYPE, boolean_fn(fn) );
export const boolean_boolean_method = (name:string, fn:Function)=>new VMMethod(name, [BOOLEAN_TYPE], BOOLEAN_TYPE, boolean_boolean_fn( (a:boolean):boolean=>fn(a) ) )
export const boolean_boolean_boolean_method = (name:string, fn:Function)=>new VMMethod(name, [BOOLEAN_TYPE, BOOLEAN_TYPE], BOOLEAN_TYPE, boolean_boolean_boolean_fn( (a:boolean, b:boolean):boolean=>fn(a, b) ) )
