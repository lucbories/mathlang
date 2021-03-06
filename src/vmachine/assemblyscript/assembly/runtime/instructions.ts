
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import { Value } from './value';
import OPCODES from './opcodes'



const DEFAULT_SIZE_IN_BYTES:i32 = 50;
export const MAGIC:i32 = 987456123;
// export const EMPTY_OPERAND_I32:i32 = 0;


/**
 * Instructions contains all opcodes of a program.
 * 
 * API:
 *   constructor(buffer:ArrayBuffer|undefined = undefined, start:i32 = 0, size:i32 = 0)
 *   
 *   get_magic():i32
 *   get_version_major():u8
 *   get_version_minor():u8
 *   get_version_patch():u8
 *   get_version_custom():u8
 *   
 *   get_cursor():i32
 *   set_cursor(cursor:i32):void
 *   
 *   append_instruction(opcode:u8, optype:u8, operand_1:u8, operand_2:u8)
 *
 *   append_instruction_i32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:i32)
 *   append_instruction_i32_i32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:i32, value_2:i32)
 *   append_instruction_i32_f32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:i32, value_2:f32)
 *   
 *   append_instruction_f32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f32)
 *   append_instruction_f32_f32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f32, value_2:f32)
 *   append_instruction_f32_i32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f32, value_2:i32)
 *   
 *   append_instruction_f64(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f64)
 *   append_instruction_f64_f64(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f64, value_2:f64)
 *   append_instruction_f64_i32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f64, value_2:i32)
 *   
 *
 *   get_u8(index:i32):u8
 *   get_u8_unsafe(index:i32):u8
 *   
 *   get_i32(index:i32):i32
 *   get_i32_unsafe(index:i32):i32
 *   
 *   get_f32(index:i32):f32
 *   get_f32_unsafe(index:i32):f32
 *   
 *   get_f64(index:i32):f64
 *   get_f64_unsafe(index:i32):f64
 *   
 *   get_instruction(index:i32):{
 *     opcode:u8,
 *     optype:u8,
 *     operand_1:u8,
 *     operand_2:u8,
 *     next_index:i32
 *   }
 *   
 *   i_add(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions
 *   i_sub(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions
 *   i_mul(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions
 *   i_div(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions
 *   i_pow(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions
 *   
 *   
 * @Example
 *  const instructions = new Instructions(100);
 *
 *  instructions.append_instruction(OPCODES.I_ADD, Value.INTEGER, 12, 23); // auto-increment array index.
 *  instructions.i_add(12, 23); // auto-increment array index.
 
 *  instructions.i_sub(OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_INLINE, 23356, 4589999); // auto-increment array index.
 *  instructions.i_mul(OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_INLINE, 23356, 4589999); // auto-increment array index.
 *
 */
export default class Instructions {
    private _cursor:i32 = 8;
	
    private _buffer:ArrayBuffer;
	private _view:DataView;
	
    private _magic:i32 = 0;
    private _version_major:u8 = 0;
    private _version_minor:u8 = 0;
    private _version_patch:u8 = 0;
    private _version_custom:u8 = 0;
    

	/**
	 * Create an Instructions instance.
	 
	 * @param instructions buffer or undefined
	 * @param instructions buffer offset (0 by default)
	 * @param instructions size in bytes (provides 0 to take the buffer length)
	 */
    constructor(buffer:ArrayBuffer|undefined = undefined, start:i32 = 0, size:i32 = 0){
		this._buffer = buffer ? buffer : new ArrayBuffer(size ? size : DEFAULT_SIZE_IN_BYTES);
		this._view = new DataView(this._buffer, start, size ? size : this._buffer.byteLength);

		this._magic = this._view.getInt32(0);
		this._version_major = this._view.getUint8(4);
		this._version_minor = this._view.getUint8(5);
		this._version_patch = this._view.getUint8(6);
		this._version_custom = this._view.getUint8(7);
	}
	

	/**
	 * Dump to output for debug.
	 */
	dump(){
		let i:i32;
		for(i=0 ; i < this._view.byteLength ; i++){
			console.log('buffer at [' + i + ']', this._view.getUint8(i));
		}
	}

	
	/**
	 * Init buffer with magic code and version.
	 * 
	 * @param version major u8
	 * @param version minor u8
	 * @param version patch u8
	 * @param version custom u8
	 */
	init(major:u8, minor:u8, patch:u8, custom:u8):void {
		this._magic = MAGIC;
		this._version_major = major;
		this._version_minor = minor;
		this._version_patch = patch;
		this._version_custom = custom;

		this._view.setInt32(0, this._magic);
		this._view.setUint8(4, this._version_major);
		this._view.setUint8(5, this._version_minor);
		this._view.setUint8(6, this._version_patch);
		this._view.setUint8(7, this._version_custom);
	}

	
	/**
	 * Get magic code.
	 * @returns i32
	 */
	get_magic():i32 {
		return this._magic;
	}
	
	/**
	 * Get version major.
	 * @returns u8
	 */
	get_version_major():u8 {
		return this._version_major;
	}
	
	/**
	 * Get version minor.
	 * @returns u8
	 */
	get_version_minor():u8 {
		return this._version_minor;
	}
	
	/**
	 * Get version patch.
	 * @returns u8
	 */
	get_version_patch():u8 {
		return this._version_patch;
	}
	
	/**
	 * Get version custom.
	 * @returns u8
	 */
	get_version_custom():u8 {
		return this._version_custom;
	}
	
	/**
	 * Get bytes count.
	 * @returns u32
	 */
	get_size():u32 {
		return this._view.byteLength;
	}

	
	/**
	 * Get first instruction cursor.
	 *
	 * @return cursor i32
	 */
	get_first_instruction_cursor():i32 {
		return 8;
	}

	
	/**
	 * Get current cursor value.
	 *
	 * @return cursor i32
	 */
	get_cursor():i32 {
		return this._cursor;
	}
	
	
	/**
	 * Set current cursor value.
	 *
	 * @return cursor i32
	 */
	set_cursor(cursor:i32):void {
		this._cursor = cursor;
	}
	
	
	/**
	 * Append an instruction without additional values.
	 * 
	 * @param opcode		u8 instruction code
	 * @param optype		u8 result type
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param 
	 * @param 
	 */
	append_instruction(opcode:u8, optype:u8, operand_1:u8, operand_2:u8) {
		this._view.setUint8(this._cursor, opcode);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_1);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_2);
		this._cursor++;
		
		return this;
	}


	/**
	 * Append an instruction with one additional i32.
	 * 
	 * @param opcode		u8 instruction code
	 * @param optype		u8 result type
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 */
	append_instruction_i32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:i32) {
		this._view.setUint8(this._cursor, opcode);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_1);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_2);
		this._cursor++;
		
		this._view.setInt32(this._cursor, value_1);
		this._cursor += 4;
		
		return this;
	}


	/**
	 * Append an instruction with two additional i32.
	 * 
	 * @param opcode		u8 instruction code
	 * @param optype		u8 result type
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 * @param value_2		i32
	 */
	append_instruction_i32_i32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:i32, value_2:i32) {
		this._view.setUint8(this._cursor, opcode);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_1);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_2);
		this._cursor++;
		
		this._view.setInt32(this._cursor, value_1);
		this._cursor += 4;
		this._view.setInt32(this._cursor, value_2);
		this._cursor += 4;
		
		return this;
	}


	/**
	 * Append an instruction with two additional i32 and f32.
	 * 
	 * @param opcode		u8 instruction code
	 * @param optype		u8 result type
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 * @param value_2		f32
	 */
	append_instruction_i32_f32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:i32, value_2:f32) {
		this._view.setUint8(this._cursor, opcode);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_1);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_2);
		this._cursor++;
		
		this._view.setInt32(this._cursor, value_1);
		this._cursor += 4;
		this._view.setFloat32(this._cursor, value_2);
		this._cursor += 4;
		
		return this;
	}


	/**
	 * Append an instruction with one additional f32.
	 * 
	 * @param opcode		u8 instruction code
	 * @param optype		u8 result type
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		f32
	 */
	append_instruction_f32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f32) {
		this._view.setUint8(this._cursor, opcode);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_1);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_2);
		this._cursor++;
		
		this._view.setFloat32(this._cursor, value_1);
		this._cursor += 4;
		
		return this;
	}


	/**
	 * Append an instruction with two additional f32.
	 * 
	 * @param opcode		u8 instruction code
	 * @param optype		u8 result type
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		f32
	 * @param value_2		f32
	 */
	append_instruction_f32_f32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f32, value_2:f32) {
		this._view.setUint8(this._cursor, opcode);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_1);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_2);
		this._cursor++;
		
		this._view.setFloat32(this._cursor, value_1);
		this._cursor += 4;
		this._view.setFloat32(this._cursor, value_2);
		this._cursor += 4;
		
		return this;
	}


	/**
	 * Append an instruction with two additional f32 and i32.
	 * 
	 * @param opcode		u8 instruction code
	 * @param optype		u8 result type
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		f32
	 * @param value_2		i32
	 */
	append_instruction_f32_i32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f32, value_2:i32) {
		this._view.setUint8(this._cursor, opcode);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_1);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_2);
		this._cursor++;
		
		// console.log('1: f32', value_1, 'at', this._cursor);
		this._view.setFloat32(this._cursor, value_1);
		this._cursor += 4;
		
		// console.log('2: i32', value_2, 'at', this._cursor);
		this._view.setInt32(this._cursor, value_2);
		this._cursor += 4;
		
		return this;
	}


	/**
	 * Append an instruction with one additional f64.
	 * 
	 * @param opcode		u8 instruction code
	 * @param optype		u8 result type
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		f64
	 */
	append_instruction_f64(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f64) {
		this._view.setUint8(this._cursor, opcode);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_1);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_2);
		this._cursor++;
		
		this._view.setFloat64(this._cursor, value_1);
		this._cursor += 8;
		
		return this;
	}


	/**
	 * Append an instruction with two additional f64.
	 * 
	 * @param opcode		u8 instruction code
	 * @param optype		u8 result type
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		f64
	 * @param value_2		f64
	 */
	append_instruction_f64_f64(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f64, value_2:f64) {
		this._view.setUint8(this._cursor, opcode);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_1);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_2);
		this._cursor++;
		
		this._view.setFloat64(this._cursor, value_1);
		this._cursor += 8;
		this._view.setFloat64(this._cursor, value_2);
		this._cursor += 8;
		
		return this;
	}


	/**
	 * Append an instruction with two additional f64 and i32.
	 * 
	 * @param opcode		u8 instruction code
	 * @param optype		u8 result type
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		f64
	 * @param value_2		i32
	 */
	append_instruction_f64_i32(opcode:u8, optype:u8, operand_1:u8, operand_2:u8, value_1:f64, value_2:i32) {
		this._view.setUint8(this._cursor, opcode);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_1);
		this._cursor++;
		this._view.setUint8(this._cursor, operand_2);
		this._cursor++;
		
		this._view.setFloat64(this._cursor, value_1);
		this._cursor += 8;
		this._view.setInt32(this._cursor, value_2);
		this._cursor += 4;
		
		return this;
	}
	
	
	/**
	 * Get u8 item.
	 * @param index i32
	 * @returns u8
	 */
	get_u8(index:i32):u8{
		if (index < 0 || index >= this._view.byteLength)
        {
			return 0;
		}
		return this._view.getUint8(index);
	}
	
	
	/**
	 * Get u8 item without index check.
	 * @param index i32
	 * @returns u8
	 */
	get_u8_unsafe(index:i32):u8{
		return this._view.getUint8(index);
	}
	
	
	/**
	 * Get i32 item.
	 * @param index i32
	 * @returns i32
	 */
	get_i32(index:i32):i32{
		if (index < 0 || index + 3 >= this._view.byteLength)
        {
			return -999999999;
		}
		return this._view.getInt32(index);
	}
	
	
	/**
	 * Get i32 item without index check.
	 * @param index i32
	 * @returns i32
	 */
	get_i32_unsafe(index:i32):i32{
		return this._view.getInt32(index);
	}
	
	
	/**
	 * Get u32 item.
	 * @param index i32
	 * @returns u32
	 */
	get_u32(index:i32):u32{
		if (index < 0 || index + 3 >= this._view.byteLength)
        {
			return 999999999;
		}
		return this._view.getUint32(index);
	}
	
	
	/**
	 * Get u32 item without index check.
	 * @param index i32
	 * @returns u32
	 */
	get_u32_unsafe(index:i32):u32{
		return this._view.getUint32(index);
	}
	
	
	/**
	 * Get f32 item.
	 * @param index i32
	 * @returns f32
	 */
	get_f32(index:i32):f32{
		if (index < 0 || index + 3 >= this._view.byteLength)
        {
			return -999999999.999;
		}
		return this._view.getFloat32(index);
	}
	
	
	/**
	 * Get f32 item without index check.
	 * @param index i32
	 * @returns f32
	 */
	get_f32_unsafe(index:i32):f32{
		return this._view.getFloat32(index);
	}
	
	
	/**
	 * Get one float 64 item.
	 * @param index i32
	 * @returns f64
	 */
	get_f64(index:i32):f64{
		if (index < 0 || index + 7 >= this._view.byteLength)
        {
			return -999999999.999;
		}
		return this._view.getFloat64(index);
	}
	
	
	/**
	 * Get float 64 item without index check.
	 * @param index i32
	 * @returns f64
	 */
	get_f64_unsafe(index:i32):f64{
		return this._view.getFloat64(index);
	}
	
	
	/**
	 * Get instruction at given index.
	 *
	 *   get_instruction(index:i32):{
	 *     opcode:u8,
	 *     optype:u8,
	 *     operand_1:u8,
	 *     operand_2:u8,
	 *     next_index:i32
	 *   }
	 *
	 * @param index i32
	 * @returns plain object
	 */
	get_instruction(index:i32) {
		return {
			opcode:this._view.getUint8(index),
			optype:this._view.getUint8(index + 1),
			operand_1:this._view.getUint8(index + 2),
			operand_2:this._view.getUint8(index + 3),
			next_index:index + 4
		};
	}
	
	
	/**
	 * Append an EXIT instruction.
	 * 
	 * @param optype u8 result type
	 * @returns this
	 */
	append_exit(optype:u8):Instructions {
		this._view.setUint8(this._cursor, OPCODES.EXIT);
		this._cursor++;
		this._view.setUint8(this._cursor, optype);
		this._cursor++;
		this._view.setUint8(this._cursor, OPCODES.EMPTY);
		this._cursor++;
		this._view.setUint8(this._cursor, OPCODES.EMPTY);
		this._cursor++;
		
		return this;
	}
	
	
	/**
	 * Append a TRAP instruction.
	 * 
	 * @param trap_code u8 trap code
	 * @returns this
	 */
	append_trap(trap_code:u8):Instructions {
		this._view.setUint8(this._cursor, OPCODES.TRAP);
		this._cursor++;
		this._view.setUint8(this._cursor, Value.INTEGER);
		this._cursor++;
		this._view.setUint8(this._cursor, trap_code);
		this._cursor++;
		this._view.setUint8(this._cursor, OPCODES.EMPTY);
		this._cursor++;
		
		return this;
	}
	
	
	/**
	 * Jump to an instruction.
	 * @param instr_index		i32
	 * @returns this
	 */
	append_jump(instr_index:i32=0):Instructions {
		if (instr_index < OPCODES.LIMIT_OPD_INLINE) {
			this.append_instruction(OPCODES.JUMP, Value.INTEGER, instr_index, OPCODES.EMPTY);
		} else {
			this.append_instruction_i32(OPCODES.JUMP, Value.INTEGER, OPCODES.LIMIT_OPD_INLINE, OPCODES.EMPTY, instr_index);
			this._cursor += 4;
		}

		return this;
	}
	
	
	/**
	 * Call a sub routine.
	 * @param optype		u8 result type
	 * @returns this
	 */
	append_call(optype:u8):Instructions {
		this.append_instruction(OPCODES.CALL, optype, OPCODES.EMPTY, OPCODES.EMPTY);
		return this;
	}
	
	
	/**
	 * Return from a call.
	 * @param optype		u8 result type
	 * @returns this
	 */
	append_return(optype:u8):Instructions {
		this.append_instruction(OPCODES.RETURN, optype, OPCODES.EMPTY, OPCODES.EMPTY);
		return this;
	}
	
	
	/**
	 * Push a registers value to the stack.
	 * @param optype		u8 result type
	 * @param reg_index		i32
	 * @returns this
	 */
	push_value_reg(optype:u8, reg_index:i32):Instructions {
		this.append_instruction_i32(OPCODES.PUSH_VALUE_REG, optype, OPCODES.LIMIT_OPD_INLINE, OPCODES.EMPTY, reg_index);
		return this;
	}
	
	
	/**
	 * Push a value to the stack.
	 * @param optype		u8 result type
	 * @param reg_index		i32
	 * @returns this
	 */
	push_value(optype:u8, operand_1:u8, value_1:i32=0):Instructions {
		this.append_instruction(OPCODES.PUSH_VALUE, optype, operand_1, OPCODES.EMPTY);

		if (operand_1 == OPCODES.LIMIT_OPD_INLINE) {
			this._view.setInt32(this._cursor, value_1);
			this._cursor += 4;
		} else if (operand_1 == OPCODES.LIMIT_OPD_REGISTER) {
			this._view.setInt32(this._cursor, value_1);
			this._cursor += 4;
		} else if (operand_1 == OPCODES.LIMIT_OPD_MEMORY) {
			this._view.setInt32(this._cursor, value_1);
			this._cursor += 4;
		}

		return this;
	}

	
	
	/**
	 * Append an operation on integers.
	 * @param opcode		u8 instruction code
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 * @param value_2		i32
	 * @returns this
	 */
	i_ops(opcode:u8, operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions {
		this.append_instruction(opcode, Value.INTEGER, operand_1, operand_2);

		if (operand_1 == OPCODES.LIMIT_OPD_INLINE) {
			this._view.setInt32(this._cursor, value_1);
			this._cursor += 4;
		} else if (operand_1 == OPCODES.LIMIT_OPD_REGISTER) {
			this._view.setInt32(this._cursor, value_1);
			this._cursor += 4;
		} else if (operand_1 == OPCODES.LIMIT_OPD_MEMORY) {
			this._view.setInt32(this._cursor, value_1);
			this._cursor += 4;
		}

		if (operand_2 == OPCODES.LIMIT_OPD_INLINE) {
			this._view.setInt32(this._cursor, value_2);
			this._cursor += 4;
		} else if (operand_2 == OPCODES.LIMIT_OPD_INLINE) {
			this._view.setInt32(this._cursor, value_2);
			this._cursor += 4;
		} else if (operand_2 == OPCODES.LIMIT_OPD_MEMORY) {
			this._view.setInt32(this._cursor, value_2);
			this._cursor += 4;
		}
		return this;
	}
	
	
	/**
	 * Append an comparison operation on integers.
	 * @param opcode		u8 instruction code
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 * @param value_2		i32
	 * @returns this
	 */
	i_ops_comp(opcode:u8, operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions {
		this.append_instruction(opcode, Value.INTEGER, operand_1, operand_2);
		
		if (operand_1 == OPCODES.LIMIT_OPD_INLINE) {
			this._view.setInt32(this._cursor, value_1);
			this._cursor += 4;
		} else if (operand_1 == OPCODES.LIMIT_OPD_REGISTER) {
			this._view.setInt32(this._cursor, value_1);
			this._cursor += 4;
		} else if (operand_1 == OPCODES.LIMIT_OPD_MEMORY) {
			this._view.setInt32(this._cursor, value_1);
			this._cursor += 4;
		}

		if (operand_2 == OPCODES.LIMIT_OPD_INLINE) {
			this._view.setInt32(this._cursor, value_2);
			this._cursor += 4;
		} else if (operand_2 == OPCODES.LIMIT_OPD_INLINE) {
			this._view.setInt32(this._cursor, value_2);
			this._cursor += 4;
		} else if (operand_2 == OPCODES.LIMIT_OPD_MEMORY) {
			this._view.setInt32(this._cursor, value_2);
			this._cursor += 4;
		}

		return this;
	}
	
	
	/**
	 * Append an operation EQUAL on integers.
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 * @param value_2		i32
	 * @returns this
	 */
	i_equal(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions {
		return this.i_ops_comp(OPCODES.I_EQUAL, operand_1, operand_2, value_1, value_2);
	}
	
	
	/**
	 * Append an operation ADD on integers.
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 * @param value_2		i32
	 * @returns this
	 */
	i_add(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions {
		return this.i_ops(OPCODES.I_ADD, operand_1, operand_2, value_1, value_2);
	}
	
	
	/**
	 * Append an operation SUB on integers.
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 * @param value_2		i32
	 * @returns this
	 */
	i_sub(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions {
		return this.i_ops(OPCODES.I_SUB, operand_1, operand_2, value_1, value_2);
	}
	
	
	/**
	 * Append an operation MUL on integers.
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 * @param value_2		i32
	 * @returns this
	 */
	i_mul(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions {
		return this.i_ops(OPCODES.I_MUL, operand_1, operand_2, value_1, value_2);
	}
	
	
	/**
	 * Append an operation DIV on integers.
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 * @param value_2		i32
	 * @returns this
	 */
	i_div(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions {
		return this.i_ops(OPCODES.I_DIV, operand_1, operand_2, value_1, value_2);
	}
	
	
	/**
	 * Append an operation POW on integers.
	 * @param operand_1		u8 operand 1
	 * @param operand_2		u8 operand 2
	 * @param value_1		i32
	 * @param value_2		i32
	 * @returns this
	 */
	i_pow(operand_1:u8, operand_2:u8, value_1:i32=0, value_2:i32=0):Instructions {
		return this.i_ops(OPCODES.I_POW, operand_1, operand_2, value_1, value_2);
	}
	
	
	/**
	 * Append an operation IS TRUE on integer.
	 * @param operand_1		u8 operand 1
	 * @param value_1		i32
	 * @returns this
	 */
	i_is_true(operand_1:u8, value_1:i32=0):Instructions {
		return this.i_ops_comp(OPCODES.I_IS_TRUE, operand_1, OPCODES.EMPTY, value_1, 0);
	}
	
	
	/**
	 * Append an operation IS POSITIVE on integer.
	 * @param operand_1		u8 operand 1
	 * @param value_1		i32
	 * @returns this
	 */
	i_is_positive(operand_1:u8, value_1:i32=0):Instructions {
		return this.i_ops_comp(OPCODES.I_IS_POSITIVE, operand_1, OPCODES.EMPTY, value_1, 0);
	}
	
	
	/**
	 * Append an operation IS ZERO on integer.
	 * @param operand_1		u8 operand 1
	 * @param value_1		i32
	 * @returns this
	 */
	i_is_zero(operand_1:u8, value_1:i32=0):Instructions {
		return this.i_ops_comp(OPCODES.I_IS_ZERO, operand_1, OPCODES.EMPTY, value_1, 0);
	}
}