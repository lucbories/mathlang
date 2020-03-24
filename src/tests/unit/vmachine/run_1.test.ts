import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />


import { Value, Simple, Text, List, Error, Boolean, Integer, Float } from '../../../vmachine/assemblyscript/assembly/runtime/value';
import Instructions from '../../../vmachine/assemblyscript/assembly/runtime/instructions'
import Program from '../../../vmachine/assemblyscript/assembly/runtime/program';
import ProgramOptions from '../../../vmachine/assemblyscript/assembly/runtime/program_options';
import VM from '../../../vmachine/assemblyscript/assembly/runtime/vm';
import OPCODES from '../../../vmachine/assemblyscript/assembly/runtime/opcodes';



describe('VM run test: programs 1', () => {
	const INSTRUCTIONS_BYTES:i32 = 100;
    const vm = new VM('vm1');
/*
    it('1+2 => 3 (instructions only)' , () => {
		const instructions:Instructions = new Instructions(undefined, 0, INSTRUCTIONS_BYTES);
		instructions.init(1, 0, 2, 25);
        instructions.i_add(OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_INLINE, 1, 2);    // Step 1: inline + inline
        instructions.append_exit(Value.INTEGER);

        const values:List = new List(20);

        const program_options:ProgramOptions = { // TODO mo sense to redefine sizes here
            registers_size:10,
            stack_size:20,
            instructions_size:INSTRUCTIONS_BYTES
        };

        const program = new Program(instructions, 0, 0, values, program_options);
        
        const result:Value = vm.run(program);
        // console.log('result', result);

        expect(result.type).equals(Value.INTEGER);
        const result_int:Integer = <Integer>result;
        expect(result_int.value).equals(3);
    });


    it('1000+2111 => 3111 (instructions only)' , () => {
		const instructions:Instructions = new Instructions(undefined, 0, INSTRUCTIONS_BYTES);
		instructions.init(1, 0, 2, 25);
        instructions.i_add(OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_INLINE, 1000, 2111);    // Step 1: inline + inline
        instructions.append_exit(Value.INTEGER);

        const values:List = new List(20);

        const program_options:ProgramOptions = { // TODO mo sense to redefine sizes here
            registers_size:10,
            stack_size:20,
            instructions_size:INSTRUCTIONS_BYTES
        };

        const program = new Program(instructions, 0, 0, values, program_options);
        
        const result:Value = vm.run(program);
        // console.log('result', result);

        expect(result.type).equals(Value.INTEGER);
        const result_int:Integer = <Integer>result;
        expect(result_int.value).equals(3111);
    });
    */
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
buffer at [11] 0        OPERAND 2 IS EMPTY
buffer at [12] 0        OPERAND 1:i32
buffer at [13] 0        OPERAND 1:i32
buffer at [14] 0        OPERAND 1:i32
buffer at [15] 0        OPERAND 1:i32

buffer at [16] 51       OPS I_ADD
buffer at [17] 2        TYPE INTEGER
buffer at [18] 251      OPERAND 1 IS IN STACK
buffer at [19] 250      OPERAND 2 IS INLINE
buffer at [20] 0        OPERAND 2:i32
buffer at [21] 0        OPERAND 2:i32
buffer at [22] 0        OPERAND 2:i32
buffer at [23] 45       OPERAND 2:i32

buffer at [24] 52       OPS_I_SUB
buffer at [25] 2        TYPE INTEGER
buffer at [26] 252      OPERAND 1 IS IN REGISTERS
buffer at [27] 251      OPERAND 2 IS IN STACK
buffer at [28] 0        OPERAND 1:i32
buffer at [29] 0        OPERAND 1:i32
buffer at [30] 0        OPERAND 1:i32
buffer at [31] 1        OPERAND 1:i32

buffer at [32] 54       I_DIV
buffer at [33] 2        TYPE INTEGER
buffer at [34] 252      OPERAND 1 IS IN REGISTERS
buffer at [35] 251      OPERAND 2 IS IN STACK
buffer at [36] 0        OPERAND 1:i32
buffer at [37] 0        OPERAND 1:i32
buffer at [38] 0        OPERAND 1:i32
buffer at [39] 0        OPERAND 1:i32

buffer at [40] 1        EXIT
buffer at [41] 2        TYPE INTEGER
buffer at [42] 0        NO OPERAND
buffer at [43] 0        NO OPERAND
*//*
    it('4411000 / ( 33 - (782154115 + 45) ) => 17573 (instructions and registers)' , () => {
		const instructions:Instructions = new Instructions(undefined, 0, INSTRUCTIONS_BYTES);
		instructions.init(1, 0, 2, 25);
        instructions.push_value_reg(Value.INTEGER, 0);                                   // Step 0: push reg 0 value  -> 782154115
        instructions.i_add(OPCODES.LIMIT_OPD_STACK, OPCODES.LIMIT_OPD_INLINE, 0, 45);    // Step 1: pop + inline    -> 782154115 + 45
        instructions.i_sub(OPCODES.LIMIT_OPD_REGISTER, OPCODES.LIMIT_OPD_STACK, 1, 0);   // Step 2: reg 1 - pop       -> 33 - (782154115 + 45)
        instructions.i_div(OPCODES.LIMIT_OPD_REGISTER, OPCODES.LIMIT_OPD_STACK, 3, 0);       // Step 3: reg 3 / pop       -> 4411000 / ( 33 - (782154115 + 45) )
        instructions.append_exit(Value.INTEGER);

        const values:List = new List(20);
        values.set(0, new Integer(782154115) );
        values.set(1, new Integer(33) );
        values.set(3, new Integer(4411000) );
        values.set(4, new Integer(999) );

        const program_options:ProgramOptions = { // TODO mo sense to redefine sizes here
            registers_size:10,
            stack_size:20,
            instructions_size:INSTRUCTIONS_BYTES
        };

        const program = new Program(instructions, 0, 0, values, program_options);
        
        const result:Value = vm.run(program);
        console.log('result', result);

        expect(result.type).equals(Value.INTEGER);
        const result_int:Integer = <Integer>result;
        expect(result_int.value).equals(17573);
    });
*/

    it('if ( 33 - (782154115 + 45) ) > 0 then 1 else 2 => 2 (instructions and registers)' , () => {
		const instructions:Instructions = new Instructions(undefined, 0, INSTRUCTIONS_BYTES);
		instructions.init(1, 0, 2, 25);
        // instructions.push_value_reg(Value.INTEGER, 0);                                   // Step 0: push reg 0 value  -> 782154115
        instructions.i_add(OPCODES.LIMIT_OPD_STACK, OPCODES.LIMIT_OPD_INLINE, 0, 45);    // Step 1: pop + inline(45)  -> 782154115 + 45
        instructions.i_sub(OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_STACK, 33, 0);    // Step 2: inline(33) - pop  -> 33 - (782154115 + 45)
        instructions.i_is_positive(OPCODES.LIMIT_OPD_STACK, 0);                          // Step 3: pop > 0           -> ( 33 - (782154115 + 45) ) > 0
        instructions.append_instruction_i32(OPCODES.JUMP_IF_TRUE, Value.INTEGER, OPCODES.LIMIT_OPD_STACK, OPCODES.LIMIT_OPD_INLINE, 48); // Step 4: if true jump to 44
        instructions.push_value_reg(Value.INTEGER, 5);
        instructions.append_exit(Value.INTEGER);
        instructions.push_value_reg(Value.INTEGER, 4);
        instructions.append_exit(Value.INTEGER);

        const values:List = new List(20);
        values.set(0, new Integer(782154115) );
        values.set(1, new Integer(33) );
        values.set(3, new Integer(4411000) );
        values.set(4, new Integer(1) );
        values.set(5, new Integer(2) );

        const program_options:ProgramOptions = { // TODO mo sense to redefine sizes here
            registers_size:10,
            stack_size:20,
            instructions_size:INSTRUCTIONS_BYTES
        };

        const program = new Program(instructions, 0, 0, values, program_options);
        
        const result:Value = vm.run(program);
        console.log('result', result);

        expect(result.type).equals(Value.INTEGER);
        const result_int:Integer = <Integer>result;
        expect(result_int.value).equals(17573);
    });
});