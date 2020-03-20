
/// <reference path="../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MemoryScalar from '../../../vmachine/assemblyscript/assembly/runtime/memory_scalar';


describe('VM Memory Scalar', () => {
	const MEMORY_BYTES:i32 = 200;
	
    it('VM Memory Scalar: set and read u8, i32' , () => {
		const mem:MemoryScalar = new MemoryScalar(MEMORY_BYTES);
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
	
	
    it('VM Memory Scalar: set and read f32, f64' , () => {
		const mem:MemoryScalar = new MemoryScalar(MEMORY_BYTES);
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
} );
