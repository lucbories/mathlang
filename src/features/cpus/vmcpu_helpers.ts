import IValue from '../../../core/ivalue';

import VMMethod from '../../../engine/vm/vmmethod';

import BOOLEAN_TYPE from '../number/vmboolean_type';
import NUMBER_TYPE from '../number/vmnumber_type';
import STRING_TYPE from '../string/vmstring_type';
import ARRAY_TYPE from '../array/vmstring_type';
import CPU_TYPE from './vmcpu_type';


// RETURNS BOOLEAN
export const bool_cpu_fn            = (fn:Function)=>(a:IValue, b:IValue)=>{ a.from_number( fn(b)) ); return a; };
export const bool_cpu_method        = (name:string, fn:Function)=>new VMMethod(name, [CPU_TYPE], BOOLEAN_TYPE, bool_cpu_fn( (a:CPU_TYPE.CpuType):string=>fn(a) ) );

export const bool_cpu_string_fn     = (fn:Function)=>(a:IValue, b:IValue, c:IValue)=>{ a.from_number( fn(b, c.to_string())) ); return a; };
export const bool_cpu_string_method = (name:string, fn:Function)=>new VMMethod(name, [CPU_TYPE, STRING_TYPE], BOOLEAN_TYPE, bool_cpu_string_fn( (a:CPU_TYPE.CpuType, b:string):string=>fn(a, b) ) );


// RETURNS STRING
export const string_cpu_fn          = (fn:Function)=>(a:IValue, b:IValue)=>{ a.from_string( fn(b.to_string()) ); return a; };
export const string_cpu_method      = (name:string, fn:Function)=>new VMMethod(name, [CPU_TYPE], STRING_TYPE, string_cpu_fn( (a:CPU_TYPE.CpuType):string=>fn(a) ) );


// RETURNS NUMBER
export const number_cpu_fn          = (fn:Function)=>(a:IValue, b:IValue)=>{ a.from_number( fn(b.to_number()) ); return a; };
export const number_cpu_method      = (name:string, fn:Function)=>new VMMethod(name, [CPU_TYPE], NUMBER_TYPE, number_cpu_fn( (a:CPU_TYPE.CpuType):number=>fn(a) ) );


// RETURNS UINT8ARRAY
export const uint8array_cpu_fn      = (fn:Function)=>(a:IValue, b:IValue)=>{ a.from_string( fn(b.to_string()) ); return a; };
export const uint8array_cpu_method  = (name:string, fn:Function)=>new VMMethod(name, [CPU_TYPE], ARRAY_TYPE, uint8array_cpu_fn( (a:CPU_TYPE.CpuType):number=>fn(a) ) );
