
// /// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { Value, Simple, Text, List, Error, Boolean, Integer, Float } from '../../../vmachine/assemblyscript/assembly/runtime/value';
import Instructions from '../../../vmachine/assemblyscript/assembly/runtime/instructions'
import Program from '../../../vmachine/assemblyscript/assembly/runtime/program';
import ProgramOptions from '../../../vmachine/assemblyscript/assembly/runtime/program_options';
import OPCODES from '../../../vmachine/assemblyscript/assembly/runtime/opcodes';


describe('VM Program', () => {
	const INSTRUCTIONS_BYTES:i32 = 100;
	
    it('VM Program: append instructions' , () => {
		const instructions:Instructions = new Instructions(undefined, 0, INSTRUCTIONS_BYTES);
		instructions.init(1, 0, 2, 25);
        instructions.i_add(OPCODES.LIMIT_OPD_STACK, OPCODES.LIMIT_OPD_INLINE, 0, 45);    // Step 1: pop + inline
        instructions.i_sub(OPCODES.LIMIT_OPD_REGISTER, OPCODES.LIMIT_OPD_STACK, );       // Step 2: reg - pop
        instructions.i_div(OPCODES.LIMIT_OPD_REGISTER, OPCODES.LIMIT_OPD_STACK, );       // Step 3: reg / pop
        instructions.i_div(OPCODES.LIMIT_OPD_REGISTER, OPCODES.LIMIT_OPD_STACK, );       // Step 3: reg / pop
        instructions.append_exit(Value.INTEGER);

        const values:List = new List(20);
        values.set(0, new Integer(782154115) );
        values.set(1, new Integer(33) );
        values.set(3, new Integer(4411000) );

        const program_options:ProgramOptions = { // TODO mo sense to redefine sizes here
            registers_size:10,
            stack_size:20,
            instructions_size:INSTRUCTIONS_BYTES
        };

        const program = new Program(instructions, 0, 0, values, program_options);

        /*
        
        *  push_context():void
        *  pop_context():void
        * 
        *  push_value(value:Value):void
        *  push_boolean(value:boolean):void
        *  push_integer(value:i32):void
        *  push_float(value:f64):void
        *  push_complex(re:f64, im:f64):void
        * 
        *  pop_value(): Value
        *  pop_value_available(): boolean
        *  pop_values(count:u32): List|null
        * 
        *  set_register_value(index:u32, value:Value):void
        *  get_register_value(index:u32):Value
        * 
        *  free_value(value:Value):void
        * 
        *  get_instructions():Instructions
        *  get_entry_point():i32
        * 
        *  start():void
        *  stop():void
        *  is_running():boolean
        */
	} );
} );