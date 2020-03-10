
import { Value, Text, List, Stack, Error, Null } from './value';


const DEFAULT_INSTRUCTIONS_SIZE:i32 = 50;

/**
 * Instructions contains all opcodes of a program.
 * 
 * @Example
 *  const instructions = new Instructions(100);
 *
 *  instructions.i_add(12, 23); // auto-increment array index.
 *  instructions.i_sub(OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_INLINE, 23356, 4589999); // auto-increment array index.
 *  instructions.i_mul(OPCODES.LIMIT_OPD_INLINE, OPCODES.LIMIT_OPD_INLINE, 23356, 4589999); // auto-increment array index.
 *
 */
export default class Instructions {
    private _cursor:i32 = 0;
	
    private _buffer:ArrayBuffer;
    private _view:DataView;
    

	/**
	 * Create an Instructions instance.
	 
	 * @param i32		instructions size
	 */
    constructor(size:i32 = DEFAULT_INSTRUCTIONS_SIZE){
		this._buffer = new ArrayBuffer(size);
		this._view = new DataView(this._buffer);
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
		
		this._view.setFloat32(this._cursor, value_1);
		this._cursor += 4;
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
	 * Get f32 item without index check.
	 * @param index i32
	 * @returns f32
	 */
	get_f32_unsafe(index:i32):f32{
		return this._view.getFloat32(index);
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
	 * Get float 64 item without index check.
	 * @param index i32
	 * @returns f64
	 */
	get_f64_unsafe(index:i32):f64{
		return this._view.getFloat64(index);
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
		return this._view.getFloa64(index);
	}
}