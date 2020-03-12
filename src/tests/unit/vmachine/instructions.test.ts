
// /// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { Value } from '../../../vmachine/assemblyscript/assembly/runtime/value'
import Instructions from '../../../vmachine/assemblyscript/assembly/runtime/instructions'
import OPCODES from '../../../vmachine/assemblyscript/assembly/runtime/opcodes'


describe('VM Instructions', () => {
	const INSTRUCTIONS_BYTES:i32 = 100;
	
    it('VM Instructions: append instructions' , () => {
		const instr:Instructions = new Instructions(INSTRUCTIONS_BYTES);
		
		instr.append_instruction(OPCODES.JUMP, Value.EMPTY, 4, OPCODES.EMPTY);
		instr.append_instruction(OPCODES.I_ADD, Value.INTEGER, 11, 22);
		instr.append_instruction_i32(OPCODES.I_DIV, Value.INTEGER, 99, OPCODES.LIMIT_OPD_INLINE, 456789);
		instr.append_instruction_f32_i32(OPCODES.I_DIV, Value.INTEGER, OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_INLINE, 6789.999, 789456);
		instr.append_instruction_f64_i32(OPCODES.I_DIV, Value.INTEGER, OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_INLINE, 6789.999, 789456);
		
		expect(instr.get_u8(0), 'instructions u8 at [0]').equals(OPCODES.JUMP);
		expect(instr.get_u8(1), 'instructions u8 at [1]').equals(Value.EMPTY);
		expect(instr.get_u8(2), 'instructions u8 at [2]').equals(4);
		expect(instr.get_u8(3), 'instructions u8 at [3]').equals(OPCODES.EMPTY);
		
		expect(instr.get_u8(4), 'instructions u8 at [4]').equals(OPCODES.I_ADD);
		expect(instr.get_u8(5), 'instructions u8 at [5]').equals(Value.INTEGER);
		expect(instr.get_u8(6), 'instructions u8 at [6]').equals(11);
		expect(instr.get_u8(7), 'instructions u8 at [7]').equals(22);
		
		expect(instr.get_u8(8),   'instructions u8 at [8]').equals(OPCODES.I_DIV);
		expect(instr.get_u8(9),   'instructions u8 at [9]').equals(Value.INTEGER);
		expect(instr.get_u8(10),  'instructions u8 at [10]').equals(99);
		expect(instr.get_u8(11),  'instructions u8 at [11]').equals(OPCODES.LIMIT_OPD_INLINE);
		expect(instr.get_i32(12), 'instructions i32 at [12]').equals(456789);
		
		expect(instr.get_u8(16),  'instructions u8  at [16]').equals(OPCODES.I_DIV);
		expect(instr.get_u8(17),  'instructions u8  at [17]').equals(Value.INTEGER);
		expect(instr.get_u8(18),  'instructions u8  at [18]').equals(OPCODES.LIMIT_OPD_INLINE);
		expect(instr.get_u8(19),  'instructions u8  at [19]').equals(OPCODES.LIMIT_OPD_INLINE);
		expect(instr.get_f32(20) - 6789.999, 'instructions f32 at [20]').to.be.lt(0.001);
		expect(instr.get_i32(24), 'instructions i32 at [24]').equals(789456);
		
		let i = 28;
		expect(instr.get_u8(i+0),  'instructions u8  at [16]').equals(OPCODES.I_DIV);
		expect(instr.get_u8(i+1),  'instructions u8  at [17]').equals(Value.INTEGER);
		expect(instr.get_u8(i+2),  'instructions u8  at [18]').equals(OPCODES.LIMIT_OPD_INLINE);
		expect(instr.get_u8(i+3),  'instructions u8  at [19]').equals(OPCODES.LIMIT_OPD_INLINE);
		expect(instr.get_f64(i+4) - 6789.999, 'instructions f64 at [20]').to.be.lt(0.001);
		expect(instr.get_i32(i+12), 'instructions i32 at [24]').equals(789456);
	} );
	
    it('VM Instructions: read instructions' , () => {
		const instr:Instructions = new Instructions(INSTRUCTIONS_BYTES);
		
		instr.append_instruction(OPCODES.JUMP, Value.EMPTY, 4, OPCODES.EMPTY);
		instr.append_instruction(OPCODES.I_ADD, Value.INTEGER, 11, 22);
		instr.append_instruction_i32(OPCODES.I_DIV, Value.INTEGER, 99, OPCODES.LIMIT_OPD_INLINE, 456789);
		instr.append_instruction_f32_i32(OPCODES.I_DIV, Value.INTEGER, OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_INLINE, 6789.999, 789456);
		instr.append_instruction_f64_i32(OPCODES.I_DIV, Value.INTEGER, OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_INLINE, 6789.999, 789456);
		
		let oprecord;
		
		oprecord = instr.get_instruction(0);
		expect(oprecord.opcode,    'instructions u8 at [0]').equals(OPCODES.JUMP);
		expect(oprecord.optype,    'instructions u8 at [1]').equals(Value.EMPTY);
		expect(oprecord.operand_1, 'instructions u8 at [2]').equals(4);
		expect(oprecord.operand_2, 'instructions u8 at [3]').equals(OPCODES.EMPTY);
		
		oprecord = instr.get_instruction(oprecord.next_index);
		expect(oprecord.opcode,    'instructions u8 at [4]').equals(OPCODES.I_ADD);
		expect(oprecord.optype,    'instructions u8 at [5]').equals(Value.INTEGER);
		expect(oprecord.operand_1, 'instructions u8 at [6]').equals(11);
		expect(oprecord.operand_2, 'instructions u8 at [7]').equals(22);
		
		oprecord = instr.get_instruction(oprecord.next_index);
		expect(oprecord.opcode,    'instructions u8  at [8]').equals(OPCODES.I_DIV);
		expect(oprecord.optype,    'instructions u8  at [9]').equals(Value.INTEGER);
		expect(oprecord.operand_1, 'instructions u8  at [10]').equals(99);
		expect(oprecord.operand_2, 'instructions u8  at [11]').equals(OPCODES.LIMIT_OPD_INLINE);
		expect(instr.get_i32(12),  'instructions i32 at [12]').equals(456789);
		
		oprecord = instr.get_instruction(oprecord.next_index + 4);
		expect(oprecord.opcode,    'instructions u8  at [16]').equals(OPCODES.I_DIV);
		expect(oprecord.optype,    'instructions u8  at [17]').equals(Value.INTEGER);
		expect(oprecord.operand_1, 'instructions u8  at [18]').equals(OPCODES.LIMIT_OPD_INLINE);
		expect(oprecord.operand_2, 'instructions u8  at [19]').equals(OPCODES.LIMIT_OPD_INLINE);
		expect(instr.get_f32(20) - 6789.999,  'instructions f32 at [20]').to.be.lt(0.001);
		expect(instr.get_i32(24),  'instructions i32 at [24]').equals(789456);
		
		oprecord = instr.get_instruction(oprecord.next_index + 8);
		expect(oprecord.opcode,    'instructions u8  at [28]').equals(OPCODES.I_DIV);
		expect(oprecord.optype,    'instructions u8  at [29]').equals(Value.INTEGER);
		expect(oprecord.operand_1, 'instructions u8  at [30]').equals(OPCODES.LIMIT_OPD_INLINE);
		expect(oprecord.operand_2, 'instructions u8  at [31]').equals(OPCODES.LIMIT_OPD_INLINE);
		expect(instr.get_f64(32) - 6789.999,  'instructions f64 at [32]').to.be.lt(0.001);
		expect(instr.get_i32(40),  'instructions i32 at [40]').equals(789456);
	} );
	
} );