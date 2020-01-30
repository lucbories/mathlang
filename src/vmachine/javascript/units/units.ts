// import * as convert from 'convert-units';

const convert = require('convert-units')
//  /// <reference types="../../../../node_modules/convert-units/lib/index.d.ts" />

// let r = convert(1).from('cm').to('m')
// console.log(r)
// r = convert(1).from('K').possibilities()
// console.log(r)

// CONVERT
export function units_convert(suffix_src:string, suffix_dst:string, numerator:number, denominator?:number):object { return convert(numerator, denominator).from(suffix_src).to(suffix_dst); }
console.log( units_convert('K', 'C', 78) );
console.log( units_convert('m', 'ft', 12, 3) );

// DESCRIBE UNITS
export function units_describe(u:string, numerator?:number, denominator?:number):object { return convert(numerator, denominator).describe(u); }
// console.log( units_describe('J') );
// console.log( units_describe('J', 12) );

// LIST UNITS DESCRIPTIONS
export function units_list_descriptions(m:string):object[] { return convert().list(m); }
// console.log( units_list_descriptions('energy') );
// console.log( units_list('m'), 12 );

// LIST UNITS SUFFIX
export function units_list_suffix(m:string):string[] { return convert().possibilities(m); }
// console.log( units_list_suffix('energy') );
// console.log( units_possibilities('m'), 12 );

// LIST UNITS SUFFIX
export function units_list_measures():string[] { return convert().measures(); }
// console.log( units_list_measures() );
// console.log( units_possibilities('m'), 12 );
