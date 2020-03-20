
/// <reference path="../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { Value, Boolean, Integer, Float, Text, List, Stack, Error, Null } from '../../../vmachine/assemblyscript/assembly/runtime/value';
import BitArray from '../../../vmachine/assemblyscript/assembly/runtime/bitarray';
import Memory from '../../../vmachine/assemblyscript/assembly/runtime/memory';


describe('VM Memory', () => {
	const MEMORY_BYTES:i32 = 300;
	/*
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
		expect( read_e_1.code, 'read Value at [' + next_index_7 + ']' ).equals(123);
		expect( read_e_1.message, 'read Value at [' + next_index_7 + ']' ).equals('error msg');
	} );
	
    it('VM Memory: set and read list, stack' , () => {
		const mem:Memory = new Memory(MEMORY_BYTES);
		
		const value_b_1:Boolean = new Boolean(1);
		const value_b_2:Boolean = new Boolean(0);
		const value_i_1:Integer = new Integer(123456);
		const value_i_2:Integer = new Integer(-123456);
		const value_f_1:Float = new Float(123456.789);
		const value_f_2:Float = new Float(-3456.456e-23);
		const value_n_1:Null = new Null();
		const value_e_1:Error = new Error(123, 'error msg');
		
		const list_1:List = new List(15);
		const stack_1:Stack = new Stack(12);
		
		list_1.set(0, value_f_1);
		list_1.set(1, value_i_1);
		list_1.set(2, value_f_2);
		list_1.set(11, value_i_2);
		list_1.set(14, value_e_1);
		
		stack_1.push(value_f_2);
		stack_1.push(value_b_2);
		stack_1.push(value_n_1);
		
		const next_index_0:i32 = 0;
		mem.set_value(next_index_0, list_1);
		const next_index_1:i32 = mem.get_free_index();
		mem.set_value(next_index_1, stack_1);
		
		// console.log('mem', mem.dump() );

		const read_list_1:List = <List>mem.get_value(next_index_0);
		const read_stack_1:Stack = <Stack>mem.get_value(next_index_1);
		
		// console.log('errors', mem.get_errors());
		expect( mem.get_errors().top() ).equals(-1);
		
		expect( read_list_1.size(), 'read_list_1.size() at [' + next_index_0 + ']' ).equals(15);
		expect( read_stack_1.size(), 'read_stack_1.size() at [' + next_index_1 + ']' ).equals(12);
		expect( read_stack_1.top(), 'read_stack_1.top()' ).equals(2);
		
		expect( read_list_1.get(0).type, 'read_list_1.get(0).type' ).equals(value_f_1.type);
		expect( (<Float>read_list_1.get(0)).value, 'read_list_1.get(0).value' ).equals(value_f_1.value);

		expect( read_list_1.get(1).type, 'read_list_1.get(1).type' ).equals(value_i_1.type);
		expect( (<Integer>read_list_1.get(1)).value, 'read_list_1.get(1).value' ).equals(value_i_1.value);

		expect( read_list_1.get(2).type, 'read_list_1.get(2).type' ).equals(value_f_2.type);
		expect( (<Float>read_list_1.get(2)).value, 'read_list_1.get(2).value' ).equals(value_f_2.value);

		expect( read_list_1.get(11).type, 'read_list_1.get(11).type' ).equals(value_i_2.type);
		expect( (<Integer>read_list_1.get(11)).value, 'read_list_1.get(11).value' ).equals(value_i_2.value);

		expect( read_list_1.get(14).type, 'read_list_1.get(14).type' ).equals(value_e_1.type);
		expect( (<Error>read_list_1.get(14)).code, 'read_list_1.get(14).value' ).equals(value_e_1.code);
		expect( (<Error>read_list_1.get(14)).message, 'read_list_1.get(14).value' ).equals(value_e_1.message);
	} );*/
	
	
    it('VM Memory: set and read list with a stack value inside' , () => {
		const mem:Memory = new Memory(MEMORY_BYTES);
		
		const value_b_1:Boolean = new Boolean(1);
		const value_b_2:Boolean = new Boolean(0);
		const value_i_1:Integer = new Integer(123456);
		const value_i_2:Integer = new Integer(-123456);
		const value_f_1:Float = new Float(123456.789);
		const value_f_2:Float = new Float(-3456.456e-23);
		const value_n_1:Null = new Null();
		const value_e_1:Error = new Error(123, 'error msg');
		
		const list_1:List = new List(15);
		const stack_1:Stack = new Stack(15);
		
		stack_1.push(value_f_2);
		// stack_1.push(value_b_2);
		// stack_1.push(value_b_1);
		// stack_1.push(value_n_1);
		
		list_1.set(0, value_f_1);
		list_1.set(1, value_i_1);
		list_1.set(2, value_f_2);
		list_1.set(7, value_i_2);
		list_1.set(11, stack_1);
		list_1.set(14, value_e_1);
		
		const next_index_0:i32 = 0;
		const next_index_1:i32 = mem.set_value(next_index_0, list_1);
		// console.log('next_index_1', next_index_1);
		
		const read_list_1:List   = <List>mem.get_value(next_index_0);
		const read_stack_1:Stack = <Stack>read_list_1.get(11);
		
		mem.dump();
		// console.log('errors', mem.get_errors());
		expect( mem.get_errors().top() ).equals(-1);
		
		// CHECK LIST
		expect( read_list_1.size(), 'read_list_1.size() at [' + next_index_1 + ']' ).equals(15);
		
		// CHECK STACK VALUES
		// const read_n_1:Null    = <Null>read_stack_1.pop();
		// const read_b_1:Boolean = <Boolean>read_stack_1.pop();
		// const read_b_2:Boolean = <Boolean>read_stack_1.pop();
		const read_f_2:Float   = <Float>read_stack_1.pop();
		// console.log('read_n_1', read_n_1);
		// console.log('read_b_1', read_b_1);
		// console.log('read_b_2', read_b_2);
		console.log('read_f_2', read_f_2);
		
		// expect(read_n_1.type, 'read_n_1.type').equals(value_n_1.type);
		
		// expect(read_b_1.type, 'read_b_1.type').equals(value_b_1.type);
		// expect(read_b_1.value, 'read_b_1.value').equals(value_b_1.value);
		
		// expect(read_b_2.type, 'read_b_2.type').equals(value_b_2.type);
		// expect(read_b_2.value, 'read_b_2.value').equals(value_b_2.value);
		
		expect(read_f_2.type, 'read_f_2.type').equals(value_f_2.type);
		expect(read_f_2.value, 'read_f_2.value').equals(value_f_2.value);
	} );
} );
