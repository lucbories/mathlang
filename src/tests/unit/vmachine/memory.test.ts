
// /// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { Value, Boolean, Integer, Float, Text, List, Stack, Error, Null } from '../../../vmachine/assemblyscript/assembly/runtime/value';
import Memory from '../../../vmachine/assemblyscript/assembly/runtime/memory'


describe('VM Memory', () => {
	const MEMORY_BYTES:i32 = 100;
	
    it('VM Memory: set and read' , () => {
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
} );
