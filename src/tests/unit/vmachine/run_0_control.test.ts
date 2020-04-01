import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />


import { Value, Simple, Text, List, Error, Boolean, Integer, Float } from '../../../vmachine/assemblyscript/assembly/runtime/value';
import Instructions from '../../../vmachine/assemblyscript/assembly/runtime/instructions'
import Program from '../../../vmachine/assemblyscript/assembly/runtime/program';
import ProgramOptions from '../../../vmachine/assemblyscript/assembly/runtime/program_options';
import VM from '../../../vmachine/assemblyscript/assembly/runtime/vm';
// import OPCODES from '../../../vmachine/assemblyscript/assembly/runtime/opcodes';



describe('VM run test: control flow operations', () => {
	const INSTRUCTIONS_BYTES:i32 = 100;
    const vm = new VM('vm1');
/*
buffer at [0] 58        MAGIC
buffer at [1] 219       MAGIC
buffer at [2] 98        MAGIC
buffer at [3] 123       MAGIC

buffer at [4] 1         MAJOR
buffer at [5] 0         MINOR
buffer at [6] 2         PATCH
buffer at [7] 25        CUSTOM

buffer at [8] 21        PUSH VALUE REG
buffer at [9] 2         TYPE INTEGER
buffer at [10] 250      OPERAND 1 IS INLINE
buffer at [11] 255      OPERAND 2 IS EMPTY
buffer at [12] 0        OPERAND 1:i32
buffer at [13] 0        OPERAND 1:i32
buffer at [14] 0        OPERAND 1:i32
buffer at [15] 0        OPERAND 1:i32

buffer at [16] 13       JUMP
buffer at [17] 2        TYPE INTEGER
buffer at [18] 32       OPERAND 1 IS INLINE
buffer at [19] 255      OPERAND 2 IS EMPTY

buffer at [20] 21       PUSH VALUE REG
buffer at [21] 2        TYPE INTEGER
buffer at [22] 250      OPERAND 1 IS INLINE
buffer at [23] 255      OPERAND 2 IS EMPTY
buffer at [24] 0        OPERAND 1:i32
buffer at [25] 0        OPERAND 1:i32
buffer at [26] 0        OPERAND 1:i32
buffer at [27] 1        OPERAND 1:i32

buffer at [28] 1        EXIT
buffer at [29] 2        TYPE INTEGER
buffer at [30] 0        NO OPERAND
buffer at [31] 255      NO OPERAND

buffer at [32] 21       PUSH VALUE REG
buffer at [33] 2        TYPE INTEGER
buffer at [34] 250      OPERAND 1 IS INLINE
buffer at [35] 255      OPERAND 2 IS EMPTY
buffer at [36] 0        OPERAND 1:i32
buffer at [37] 0        OPERAND 1:i32
buffer at [38] 0        OPERAND 1:i32
buffer at [39] 2        OPERAND 1:i32

buffer at [40] 1        EXIT
buffer at [41] 2        TYPE INTEGER
buffer at [42] 255      NO OPERAND
buffer at [43] 255      NO OPERAND
*/
    it('push 123 jump push 456 exit push 789 exit => 789 (instructions and registers)' , () => {
		const instructions:Instructions = new Instructions(undefined, 0, INSTRUCTIONS_BYTES);
        instructions.init(1, 0, 2, 25);
        
        instructions.push_value_reg(Value.INTEGER, 0);
        instructions.append_jump(32);

        instructions.push_value_reg(Value.INTEGER, 1);
        instructions.append_exit(Value.INTEGER);

        instructions.push_value_reg(Value.INTEGER, 2);
        instructions.append_exit(Value.INTEGER);

        const values:List = new List(20);
        values.set(0, new Integer(123) );
        values.set(1, new Integer(456) );
        values.set(2, new Integer(789) );

        const program_options:ProgramOptions = { // TODO no sense to redefine sizes here
            registers_size:10,
            stack_size:20,
            instructions_size:INSTRUCTIONS_BYTES
        };

        const program = new Program(instructions, 0, 0, values, program_options);
        // instructions.dump();

        const result:Value = vm.run(program);
        // console.log('result', result);

        expect(result.type).equals(Value.INTEGER);
        const result_int:Integer = <Integer>result;
        expect(result_int.value).equals(789);
    });


    it('push 123 push 456 call push 222 return => 222 (instructions and registers)' , () => {
		const instructions:Instructions = new Instructions(undefined, 0, INSTRUCTIONS_BYTES);
        instructions.init(1, 0, 2, 25);
        
        instructions.push_value_reg(Value.INTEGER, 0);
        instructions.push_value_reg(Value.INTEGER, 1);
        instructions.append_call(Value.INTEGER);
        instructions.push_value(Value.INTEGER, 222, 0);
        instructions.append_return(Value.INTEGER);
        instructions.append_exit(Value.INTEGER);

        const values:List = new List(20);
        values.set(0, new Integer(123) );
        values.set(1, new Integer(456) );
        values.set(2, new Integer(789) );

        const program_options:ProgramOptions = { // TODO no sense to redefine sizes here
            registers_size:10,
            stack_size:20,
            instructions_size:INSTRUCTIONS_BYTES
        };

        const program = new Program(instructions, 0, 0, values, program_options);
        // instructions.dump();

        const result:Value = vm.run(program);
        if (result.type == 0) {
            console.log('result', result);
        }

        expect(result.type).equals(Value.INTEGER);
        const result_int:Integer = <Integer>result;
        expect(result_int.value).equals(222);
    });
});