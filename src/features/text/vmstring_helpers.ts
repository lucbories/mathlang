import IValue from '../../core/ivalue';

import VMMethod from '../../engine/vm/vmmethod';

import BOOLEAN_TYPE from '../logic/vmboolean_type';
import NUMBER_TYPE from '../numbers/vmnumber_type';
import STRING_TYPE from './vmstring_type';


// RETURNS STRING
export const string_const_fn = (c:string)=>(a:IValue)=>{ a.from_string(c); return a; };

export const string_fn                      = (fn:Function)=>(a:IValue)=>{ a.from_string( fn() ); return a; };
export const string_string_fn               = (fn:Function)=>(a:IValue, b:IValue)=>{ a.from_string( fn(b.to_string()) ); return a; };
export const string_string_string_fn        = (fn:Function)=>(a:IValue, b:IValue, c:IValue)=>{ a.from_string( fn(b.to_string(), c.to_string()) ); return a; };
export const string_string_string_string_fn = (fn:Function)=>(a:IValue, b:IValue, c:IValue, d:IValue)=>{ a.from_string( fn(b.to_string(), c.to_string(), d.to_string()) ); return a; };

export const string_const_method                = (name:string, c:string)=>new VMMethod(name, [], STRING_TYPE, string_const_fn(c) );
export const string_method                      = (name:string, fn:Function)=>new VMMethod(name, [], STRING_TYPE, string_fn(fn) );
export const string_string_method               = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE], STRING_TYPE, string_string_fn( (a:string):string=>fn(a) ) );
export const string_string_string_method        = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE, STRING_TYPE], STRING_TYPE, string_string_string_fn( (a:string, b:string):string=>fn(a, b) ) );
export const string_string_string_string_method = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE, STRING_TYPE, STRING_TYPE], STRING_TYPE, string_string_string_string_fn( (a:string, b:string, c:string):string=>fn(a, b, c) ) );

export const string_string_number_fn     = (fn:Function)=>(a:IValue, b:IValue, c:IValue)=>{ a.from_string( fn(b.to_string(), c.to_number()) ); return a; };
export const string_string_number_method = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE, NUMBER_TYPE], STRING_TYPE, string_string_number_fn( (a:string, b:number):string=>fn(a, b) ) );

export const string_string_number_string_fn     = (fn:Function)=>(a:IValue, b:IValue, c:IValue, d:IValue)=>{ a.from_string( fn(b.to_string(), c.to_number(), d.to_string()) ); return a; };
export const string_string_number_string_method = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE, NUMBER_TYPE, STRING_TYPE], STRING_TYPE, string_string_number_string_fn( (a:string, b:number):string=>fn(a, b) ) );


// RETURNS NUMBER
export const number_string_fn                   = (fn:Function)=>(a:IValue, b:IValue)=>{ a.from_string( fn(b.to_string()) ); return a; };
export const number_string_number_fn            = (fn:Function)=>(a:IValue, b:IValue, c:IValue)=>{ a.from_number( fn(b.to_string(), c.to_number()) ); return a; };
export const number_string_string_number_fn     = (fn:Function)=>(a:IValue, b:IValue, c:IValue, d:IValue)=>{ a.from_number( fn(b.to_string(), c.to_string(), d.to_number()) ); return a; };
export const number_string_string_string_fn     = (fn:Function)=>(a:IValue, b:IValue, c:IValue, d:IValue)=>{ a.from_number( fn(b.to_string(), c.to_string(), d.to_string()) ); return a; };

export const number_string_method               = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE], NUMBER_TYPE, number_string_fn( (a:string):number=>fn(a) ) );
export const number_string_number_method        = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE, NUMBER_TYPE], NUMBER_TYPE, number_string_number_fn( (a:string, b:number):number=>fn(a, b) ) );
export const number_string_string_number_method = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE, STRING_TYPE, NUMBER_TYPE], NUMBER_TYPE, number_string_number_fn( (a:string, b:string, c:number):number=>fn(a, b, c) ) );
export const number_string_string_string_method = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE, STRING_TYPE, STRING_TYPE], NUMBER_TYPE, number_string_number_fn( (a:string, b:string, c:string):number=>fn(a, b, c) ) );


// RETURNS BOOLEAN
export const boolean_string_string_number_fn    = (fn:Function)=>(a:IValue, b:IValue, c:IValue, d:IValue)=>{ a.from_number( fn(b.to_string(), c.to_string(), d.to_number()) ); return a; };
export const boolean_string_string_string_fn    = (fn:Function)=>(a:IValue, b:IValue, c:IValue, d:IValue)=>{ a.from_number( fn(b.to_string(), c.to_string(), d.to_string()) ); return a; };

export const boolean_string_string_number_method = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE, STRING_TYPE, NUMBER_TYPE], BOOLEAN_TYPE, boolean_string_string_number_fn( (a:string, b:string, c:number):boolean=>fn(a, b, c) ) );
export const boolean_string_string_string_method = (name:string, fn:Function)=>new VMMethod(name, [STRING_TYPE, STRING_TYPE, STRING_TYPE], BOOLEAN_TYPE, boolean_string_string_string_fn( (a:string, b:string, c:string):boolean=>fn(a, b, c) ) );