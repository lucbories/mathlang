
// /// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { Value, Boolean, Integer, Float, Text, List, Stack, Error, Null } from '../../../vmachine/assemblyscript/assembly/runtime/value';
import BitArray from '../../../vmachine/assemblyscript/assembly/runtime/bitarray';
import Memory from '../../../vmachine/assemblyscript/assembly/runtime/memory';


describe('VM Memory', () => {
	const MEMORY_BYTES:i32 = 100;
	
    it('VM Memory: set and read u8, i32' , () => {
		const mem:Memory = new Memory(MEMORY_BYTES);
		let index:i32 = 0;
		// console.log('index', index);
		
		index = mem.set_u8(index, 123);
		// console.log('index', index);
		
		index = mem.set_u8(index, 58);
		// console.log('index', index);
		
		index = mem.set_i32(index, -45123);
		// console.log('index', index);
		
		index = mem.set_i32(index, 2147483647);
		// console.log('index', index);
		
		// console.log('mem', mem);
		
		expect( mem.get_u8(0), 'read at [0]' ).equal(123);
		expect( mem.get_u8(1), 'read at [1]' ).equal(58);
		expect( mem.get_i32(2), 'read at [2]' ).equal(-45123);
		expect( mem.get_i32(6), 'read at [6]' ).equal(2147483647);
	} );
	
	
    it('VM Memory: set and read f32, f64' , () => {
		const mem:Memory = new Memory(MEMORY_BYTES);
		let index:i32 = 0;
		// console.log('index', index);
		
		index = mem.set_f32(index, 1.23e-9);
		// console.log('index', index);
		
		index = mem.set_f64(index, -2.56e-23);
		// console.log('index', index);
		
		// console.log('mem', mem);
		
		expect( mem.get_f32(0) -  1.23e-9, 'read f32 at [0]' ).lt(0.0001);
		expect( mem.get_f64(4) + 2.56e-23, 'read f64 at [4]' ).lt(0.0001);
	} );
	
	
    it('VM Memory: set and read Boolean, Integer, Float' , () => {
		const mem:Memory = new Memory(MEMORY_BYTES);
		
		const value_b_1:Boolean = new Boolean(1);
		const value_b_2:Boolean = new Boolean(0);
		const value_i_1:Integer = new Integer(123456);
		const value_i_2:Integer = new Integer(-123456);
		const value_f_1:Float = new Float(123456.789);
		const value_f_2:Float = new Float(-3456.456e-23);
		const value_n_1:Null = new Null();
		const value_e_1:Error = new Error(123, 'error msg');
		
		const next_index_0:i32 = 0;
		const next_index_1:i32 = mem.set_value(next_index_0, value_i_1);
		const next_index_2:i32 = mem.set_value(next_index_1, value_b_1);
		const next_index_3:i32 = mem.set_value(next_index_2, value_i_2);
		const next_index_4:i32 = mem.set_value(next_index_3, value_f_1);
		const next_index_5:i32 = mem.set_value(next_index_4, value_b_2);
		const next_index_6:i32 = mem.set_value(next_index_5, value_f_2);
		const next_index_7:i32 = mem.set_value(next_index_6, value_n_1);
		const next_index_8:i32 = mem.set_value(next_index_7, value_e_1);
		
		// console.log('mem', mem);
		// console.log('next_index_0', next_index_0);
		// console.log('next_index_1', next_index_1);
		// console.log('next_index_2', next_index_2);
		// console.log('next_index_3', next_index_3);
		// console.log('next_index_4', next_index_4);
		// console.log('next_index_5', next_index_5, value_f_2);
		
		const read_i_1:Integer = <Integer>mem.get_value(next_index_0);
		const read_i_2:Integer = <Integer>mem.get_value(next_index_2);
		const read_b_1:Boolean = <Boolean>mem.get_value(next_index_1);
		const read_b_2:Boolean = <Boolean>mem.get_value(next_index_4);
		const read_f_1:Float = <Float>mem.get_value(next_index_3);
		const read_f_2:Float = <Float>mem.get_value(next_index_5);
		const read_n_1:Null = <Null>mem.get_value(next_index_6);
		const read_e_1:Error = <Error>mem.get_value(next_index_7);
		
		expect( read_i_1.value, 'read Value at [' + next_index_0 + ']' ).equals(123456);
		expect( read_i_2.value, 'read Value at [' + next_index_1 + ']' ).equals(-123456);
		
		expect( read_f_1.value - 123456.789, 'read Value at [' + next_index_3 + ']' ).is.lt(0.001);
		expect( read_f_2.value + 3456.456e-23, 'read Value at [' + next_index_5 + ']' ).is.lt(0.001);
		
		expect( read_b_1.value, 'read Value at [' + next_index_2 + ']' ).equals(1);
		expect( read_b_2.value, 'read Value at [' + next_index_4 + ']' ).equals(0);
		
		expect( read_n_1.type, 'read Value at [' + next_index_6 + ']' ).equals(Value.NULL);
		
		expect( read_e_1.type, 'read Value at [' + next_index_7 + ']' ).equals(Value.ERROR);
		expect( read_e_1.value, 'read Value at [' + next_index_7 + ']' ).equals(123);
		expect( read_e_1.message, 'read Value at [' + next_index_7 + ']' ).equals('error msg');
	} );
	
	
    it('VM Memory: set and read floats 32 and 64' , () => {
		const mem:Memory = new Memory(MEMORY_BYTES);
		let index:i32 = 0;
		// console.log('index', index);
		
		index = mem.set_f32(index, 1.23e-9);
		// console.log('index', index);
		
		index = mem.set_f64(index, -2.56e-23);
		// console.log('index', index);
		
		// console.log('mem', mem);
		
		expect( mem.get_f32(0) -  1.23e-9, 'read f32 at [0]' ).lt(0.0001);
		expect( mem.get_f64(4) + 2.56e-23, 'read f64 at [4]' ).lt(0.0001);
	} );
	
	
    it('VM Memory: binary aray' , () => {
		let i:i32;
		const ba1:BitArray = new BitArray(3);
		
		// FILL WITH ONES
		ba1.fill_with_ones();
		// console.log('fill_with_ones', ba1.to_string());
		for(i = 0 ; i < 24 ; i++) {
			// console.log('fill_with_ones at [' + i + ']=', ba1.get_at(i) );
			expect( ba1.get_at(i) ).is.true;
		}
		
		// FILL WITH ZEROS
		ba1.fill_with_zeros();
		// console.log('fill_with_zeros', ba1.to_string());
		for(i = 0 ; i < 24 ; i++) {
			// console.log('fill_with_zeros at [' + i + ']=' + (ba1.get_at(i) ? '1' : '0') );
			expect( ba1.get_at(i) ).is.false;
		}
		
		// FILL AT
		ba1.set_one_at(7);
		// console.log('set_one_at(7)', ba1.to_string());
		for(i = 0 ; i < 6 ; i++) {
			// console.log('set_one_at(7) at [' + i + ']=' + (ba1.get_at(i) ? '1' : '0') );
			expect( ba1.get_at(i) ).is.false;
		}
		// console.log('set_one_at(7) at [6]=' + (ba1.get_at(6) ? '1' : '0') );
		expect( ba1.get_at(7) ).is.true;
		for(i = 8 ; i < 24 ; i++) {
			// console.log('set_one_at(7) at [' + i + ']=' + (ba1.get_at(i) ? '1' : '0') );
			expect( ba1.get_at(i) ).is.false;
		}
	} );
	
	
    // it('VM Memory: set and read list, stack' , () => {
		// const mem:Memory = new Memory(MEMORY_BYTES);
		
		// const value_b_1:Boolean = new Boolean(1);
		// const value_b_2:Boolean = new Boolean(0);
		// const value_i_1:Integer = new Integer(123456);
		// const value_i_2:Integer = new Integer(-123456);
		// const value_f_1:Float = new Float(123456.789);
		// const value_f_2:Float = new Float(-3456.456e-23);
		// const value_n_1:Null = new Null();
		// const value_e_1:Error = new Error(123, 'error msg');
		
		// console.log('19875 % 256', 19875 % 256);
		// console.log('19875 / 256', Math.floor(19875 / 256));
	// } );
} );
