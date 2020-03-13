
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import { Value, Boolean, Integer, Float, Text, List, Stack, Error, Null } from './value';



const DEFAULT_MEMORY_BYTES:i32 = 1000;

/**
 * Memory contains initial and run values of a program.
 * 
 * API:
 *   constructor(size:i32 = DEFAULT_INSTRUCTIONS_SIZE
 *   
 *   get_u8(index:i32):u8
 *   get_u8_unsafe(index:i32):u8
 *   set_u8(index:i32, item:u8):i32
 *   set_u8_unsafe(index:i32, item:u8):i32
 *   
 *   get_i32(index:i32):i32
 *   get_i32_unsafe(index:i32):i32
 *   set_i32(index:i32, item:i32):i32
 *   set_i32_unsafe(index:i32, item:i32):i32
 *   
 *   get_f32(index:i32):f32
 *   get_f32_unsafe(index:i32):f32
 *   set_f32(index:i32, item:f32):i32
 *   set_f32_unsafe(index:i32, item:f32):i32
 *   
 *   get_f64(index:i32):f64
 *   get_f64_unsafe(index:i32):f64
 *   set_f64(index:i32, item:f64):i32
 *   set_f64_unsafe(index:i32, item:f64):i32
 *   
 *   get_value(index:i32):Value
 *   set_value(index:i32, item:Value):i32
 *
 */
export default class Memory {
	
    private _buffer:ArrayBuffer;
    private _view:DataView;
    private _errors:Stack;

	/**
	 * Create an Memory instance.
	 
	 * @param i32		memory size in bytes
	 */
    constructor(size:i32 = DEFAULT_MEMORY_BYTES){
		this._buffer = new ArrayBuffer(size);
		this._view = new DataView(this._buffer);
		this._errors = new Stack(10);
    }
	
	
	// **************************** Errors ****************************
	
	/**
	 * Has memory error.
	 * @returns boolean
	 */
	has_error():boolean{
		return this._errors.size() > 0;
	}
	
	/**
	 * Get memory errors.
	 * @returns Stack
	 */
	get_errors():Stack{
		return this._errors;
	}
	
	/**
	 * Add one memory error.
	 * @param
	 * @returns Error
	 */
	add_error(error:Error):Error{
		this._errors.push(error);
		return error;
	}
	
	
	// **************************** U8 ****************************
	
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
	 * Set u8 item with index checking.
	 * @param index i32
	 * @param item u8
	 * @returns next index i32
	 */
	set_u8(index:i32, item:u8):i32{
		if (index < 0 || index >= this._view.byteLength)
        {
			return -999999999;
		}
		this._view.setUint8(index, item);
		return index + 1;
	}
	
	
	/**
	 * Set u8 item without index checking.
	 * @param index i32
	 * @param item u8
	 * @returns next index
	 */
	set_u8_unsafe(index:i32, item:u8):i32{
		this._view.setUint8(index, item);
		return index + 1;
	}
	
	
	// **************************** I32 ****************************
	
	/**
	 * Get Integer (32 bits) item.
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
	 * Get Integer (32 bits) item without index check.
	 * @param index i32
	 * @returns i32
	 */
	get_i32_unsafe(index:i32):i32{
		return this._view.getInt32(index);
	}
	
	
	/**
	 * Set Integer (32 bits) item with index checking.
	 * @param index i32
	 * @param item i32
	 * @returns next index i32
	 */
	set_i32(index:i32, item:i32):i32{
		if (index < 0 || index >= this._view.byteLength)
        {
			return -999999999;
		}
		this._view.setInt32(index, item);
		return index + 4;
	}
	
	
	/**
	 * Set Integer (32 bits) item without index checking.
	 * @param index i32
	 * @param item i32
	 * @returns next index
	 */
	set_i32_unsafe(index:i32, item:i32):i32{
		this._view.setInt32(index, item);
		return index + 4;
	}
	
	
	// **************************** F32 ****************************
	
	/**
	 * Get Float (32 bits) item.
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
	 * Get Float (32 bits) item without index check.
	 * @param index i32
	 * @returns f32
	 */
	get_f32_unsafe(index:i32):f32{
		return this._view.getFloat32(index);
	}
	
	
	/**
	 * Set Float (32 bits) item with index checking.
	 * @param index i32
	 * @param item f32
	 * @returns next index
	 */
	set_f32(index:i32, item:f32):i32{
		if (index < 0 || index >= this._view.byteLength)
        {
			return -999999999;
		}
		this._view.setFloat32(index, item);
		return index + 4;
	}
	
	
	/**
	 * Set Float (32 bits) item without index checking.
	 * @param index i32
	 * @param item f32
	 * @returns next index
	 */
	set_f32_unsafe(index:i32, item:f32):i32{
		this._view.setFloat32(index, item);
		return index + 4;
	}
	
	
	// **************************** F32 ****************************
	
	
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
	 * Set Float (64 bits) item with index checking.
	 * @param index i32
	 * @param item f64
	 * @returns next index
	 */
	set_f64(index:i32, item:f64):i32{
		if (index < 0 || index >= this._view.byteLength)
        {
			return -999999999;
		}
		this._view.setFloat64(index, item);
		return index + 8;
	}
	
	
	/**
	 * Set Float (64 bits) item without index checking.
	 * @param index i32
	 * @param item f64
	 * @returns next index
	 */
	set_f64_unsafe(index:i32, item:f64):i32{
		this._view.setFloat64(index, item);
		return index + 8;
	}
	
	
	// **************************** Value ****************************
	
	/**
	 * Get a value at given index.
	 *
	 * @param index i32
	 * @returns Value
	 */
	get_value(index:i32):Value {
		if (index < 0 || index >= this._view.byteLength)
        {
			return this.add_error( new Error(index, 'Memory.get_value:bad index') );
		}
		const value_type:u8 = this._view.getUint8(index);
		index++;
		
		switch(value_type){
			
			// Simple types
			case Value.NULL: {
				if (index >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Null') );
				}
				const v:u8 = this._view.getUint8(index);
				if (v != 0)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad value reading Null') );
				}
				return new Null();
			}
			case Value.ERROR: {
				if (index + 8 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Error') );
				}
				const code:i32 = this._view.getInt32(index);
				index += 4;
				
				const size:i32 = this._view.getInt32(index);
				index += 4;
				
				if (index + size * 2 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.set_value:bad index reading Error mesage chars') );
				}
				
				let i:u32 = 0;
				let u16_code:u16;
				let msg:string = '';
				while(i < size){
					u16_code = this._view.getUint16(index + i * 2);
					msg += String.fromCharCode(u16_code);
					i++;
				}
				
				const error:Error = new Error(code, msg);
				return error;
			}
			case Value.BOOLEAN: {
				if (index >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Boolean') );
				}
				const v:u8 = this._view.getUint8(index);
				return new Boolean(v > 0 ? 1 : 0);
			}
			case Value.INTEGER: {
				if (index + 3 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Integer 32') );
				}
				const v:i32 = this._view.getInt32(index);
				return new Integer(v);
			}
			case Value.FLOAT: {
				if (index + 3 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Float 64') );
				}
				const v:f64 = this._view.getFloat64(index);
				return new Float(v);
			}
			// case Value.BIGINTEGER: {
			//     const v:i32 = this._view.getInt32(index);
			//     return new Integer(v);
			// }
			// case Value.BIGFLOAT: {
			//     const v:i32 = this._view.getInt32(index);
			//     return new Integer(v);
			// }
			case Value.STRING: {
				if (index + 3 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading String length') );
				}
				const size:u32 = this._view.getUint32(index);
				index += 4;
				
				if (index + size * 2 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading String chars') );
				}
				
				let i:u32 = 0;
				let u16_code:u16;
				let s:Text = new Text('');
				while(i < size){
					u16_code = this._view.getUint16(index + i * 2);
					s.value += String.fromCharCode(u16_code);
					i++;
				}
				
				return s;
			}

			// Collections
			case Value.LIST: {
				if (index + 3 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading List length') );
				}
				const size:u32 = this._view.getUint32(index);
				index += 4;
				
				if (index + size >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading List items') );
				}
				
				const values:List = new List(size);
				let i:u32 = 0;
				let v:Value;
				while(i < size){
					v = this.get_value(index);
					index += v.bytes;
					values.set(i, v);
					i++;
				}
				return values;
			}
			case Value.STACK: {
				if (index + 3 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Stack size') );
				}
				const size:u32 = this._view.getUint32(index);
				index += 4;
				
				if (index + size >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading List items') );
				}
				
				const values:Stack = new Stack(size);
				let i:u32 = 0;
				let v:Value;
				while(i < size){
					v = this.get_value(index);
					index += v.bytes;
					values.push(v);
					i++;
				}
				return values;
			}

			// Vectors
			// case Value.BVECTOR: {
			//     const size:u32 = this._view.getUint32(index + 1);
			//     return new Float(v);
			// }
			// case Value.IVECTOR: {
			//     const size:u32 = this._view.getUint32(index + 1);
			//     return new Float(v);
			// }
			// case Value.FVECTOR: {
			//     const size:u32 = this._view.getUint32(index + 1);
			//     return new Float(v);
			// }

			// case Value.: {
			//     const v:f32 = this._view.getFloat32(index + 1);
			//     return new Float(v);
			// }
		}
		
        return new Error(index, 'Scope.values:bad value type:[' + value_type + ']');
	}
	
	
	/**
	 * Set a value at given index.
	 *
	 * @param index i32
	 * @param item Value
	 * @returns next index
	 */
	set_value(index:i32, item:Value):i32 {
		if (index < 0 || index >= this._view.byteLength)
        {
			this.add_error( new Error(index, 'Memory.set_value:bad index') );
			return -1;
		}
		const value_type:u8 = item.type;
		this._view.setUint8(index, value_type);
		index += 1;
		
		switch(value_type){
			
			// Simple types
			case Value.NULL: {
				if (index >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Boolean') );
					return -1;
				}
				const v:Null = <Null>item;
				this._view.setUint8(index, 0);
				index += 1;
				return index;
			}
			case Value.ERROR: {
				if (index + 8 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Boolean') );
					return -1;
				}
				const v:Error = <Error>item;
				
				this._view.setInt32(index, v.value);
				index += 4;
				
				const size:u32 = v.message.length;
				this._view.setUint32(index, size);
				index += 4;
				
				if (index + size * 2 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Error mesage chars') );
					return -1;
				}
				
				let i:u32 = 0;
				let u16_code:u16;
				while(i < size){
					u16_code = v.message.codePointAt(i);
					this._view.setUint16(index + i * 2, u16_code);
					i++;
				}
				
				return index + size * 2;
			}
			case Value.BOOLEAN: {
				if (index >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Boolean') );
					return -1;
				}
				const v:Boolean = <Boolean>item;
				this._view.setUint8(index, v.value);
				index += 1;
				return index;
			}
			case Value.INTEGER: {
				if (index + 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Integer 32') );
					return -1;
				}
				const v:Integer = <Integer>item;
				this._view.setInt32(index, v.value);
				index += 4;
				return index;
			}
			case Value.FLOAT: {
				if (index + 8 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Float64') );
					return -1;
				}
				const v:Float = <Float>item;
				this._view.setFloat64(index, v.value);
				index += 8;
				return index;
			}
			// case Value.BIGINTEGER: {
				// if (index + 4 >= this._view.byteLength)
				// {
					// this.add_error( new Error(index, 'Memory.set_value:bad index writing BigInteger 32') );
					// return -1;
				// }
				// this._view.setInt32(index, item.value);
				// return index + 1;
			// }
			// case Value.BIGFLOAT: 
				// if (index + 4 >= this._view.byteLength)
				// {
					// this.add_error( new Error(index, 'Memory.set_value:bad index writing BigFloat 32') );
					// return -1;
				// }
				// this._view.setInt32(index, item.value);
				// return index + 1;
			// }
			case Value.STRING: {
				if (index + 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing String length') );
					return -1;
				}
				const size:u32 = item.bytes;
				this._view.setUint32(index, item.bytes);
				index += 4;
				
				if (index + size * 2 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing String chars') );
					return -1;
				}
				
				const v:Text = <Text>item;
				let i:u32 = 0;
				let u16_code:u16;
				while(i < size){
					u16_code = v.value.codePointAt(i);
					this._view.setUint16(index + i * 2, u16_code);
					i++;
				}
				
				return index + size * 2;
			}

			// Collections
			case Value.LIST: {
				// if (index + 2 >= this._view.byteLength)
				// {
					// this.add_error( new Error(index, 'Memory.set_value:bad index writing List length') );
					// return -1;
				// }
				// const size:u32 = buffer_view.getUint16(index + 1);
				// index += 4;
				
				// if (index + size * 2 >= this._view.byteLength)
				// {
					// this.add_error( new Error(index, 'Memory.set_value:bad index writing List items') );
					// return -1;
				// }
				
				// let i:u16 = 0;
				// let values:Value[] = [];
				// let value_index:i32 = index + 1 + 2;
				// let v:Value;
				// while(i < size){
					// v = Scope.get_buffer_value_at(buffer_view, value_index);
					// value_index = value_index + v.bytes;
				// }
				// index += size * 2;
				// return index;
			}
			case Value.STACK: {
				// if (index + 4 >= this._view.byteLength)
				// {
					// this.add_error( new Error(index, 'Memory.set_value:bad index writing Stack size') );
					// return -1;
				// }
				// const v:u32 = buffer_view.getUint32(index + 1);
				// index += size * 2;
				// return index;
			}

			// Vectors
			// case Value.BVECTOR: {
			//     const size:u32 = buffer_view.getUint32(index + 1);
			//     return new Float(v);
			// }
			// case Value.IVECTOR: {
			//     const size:u32 = buffer_view.getUint32(index + 1);
			//     return new Float(v);
			// }
			// case Value.FVECTOR: {
			//     const size:u32 = buffer_view.getUint32(index + 1);
			//     return new Float(v);
			// }

			// case Value.: {
			//     const v:f32 = buffer_view.getFloat32(index + 1);
			//     return new Float(v);
			// }
		}
		
        this.add_error( new Error(index, 'Memory.set_value:bad value type:[' + value_type + ']') );
		return -1;
	}
}