
/// <reference path="../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MemoryBase from '../../../vmachine/assemblyscript/assembly/runtime/memory_base';


describe('VM Memory Base', () => {
	const MEMORY_BYTES:i32 = 200;
	
	
    it('VM Memory Base: allocate, release' , () => {
		const mem:MemoryBase = new MemoryBase(MEMORY_BYTES);
	} );
} );
