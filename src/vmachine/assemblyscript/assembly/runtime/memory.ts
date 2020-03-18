
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import { Value, Boolean, Integer, Float, Text, List, Stack, Error, Null } from './value';
import BitArray from './bitarray';


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
	
	/*
		Memory allocation is needed if the Memory is used in a dynamic way, not only readonly.
		Allocation is used to know which part of the memory is free to store new data.
		
		Many allocation strategies exist: save free ranges, save allocate ranges, pages management...
		It's a very hard task, not the purpose of this project.
		So keep simple.
		
		To every byte in _buffer corresponds a bit flag in _free_flags: true if the byte is free and false else.
		_last_allocated_index is the last index after all allocate ranges.
	*/
	// private type MemRange = {
		// index:i32;
		// size:i32;
	// }
	private _last_allocated_index:i32;
    private _free_flags:BitArray;
	// private _free_ranges:Map
	
    private _errors:Stack;
	
	

	/**
	 * Create an Memory instance.
	 *
	 * @param i32		memory size in bytes
	 */
    constructor(size:i32 = DEFAULT_MEMORY_BYTES){
		this._buffer = new ArrayBuffer(size);
		this._view = new DataView(this._buffer);
		
		this._last_allocated_index = 0;
		this._free_flags = new BitArray( Math.floor(size / 8) + 1 );
		this._free_flags.fill_with_ones();
		
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
	
	
	// **************************** ALLOCATION ****************************
	
	/**
	 * Get free space.
	 * @param size i32
	 * @returns index i32
	 */
	allocate(size:i32):i32{
		const memory_size:i32 = this._view.byteLength;
		
		if (this._last_allocated_index + 1 + size < memory_size){
			const allocated_index = this._last_allocated_index + 1;
			this.reserve(allocated_index, size);
			this._last_allocated_index = allocated_index + size;
			return allocated_index;
		}
		
		let index:i32 = 0;
		let for_i:i32 = 0;
		let found:boolean=false;
		
		while(! found && index < size){
			for_i = index;
			for(; for_i < size ; for_i++) {
				const b:boolean = this._free_flags.get_at(for_i);
				if (b) {
					continue;
				}
			}
			index = for_i + 1;
		}
		
		this._last_allocated_index = Math.max(this._last_allocated_index, index + size);
		return index;
	}
	
	
	/**
	 * Free space.
	 * @param index i32
	 * @param size i32
	 */
	release(index:i32, size:i32):void{
		let i:i32 = index;
		for(i ; i < size ; i++) {
			this._free_flags.set_one_at(i);
		}
		
		// if (this._last_allocated_index)
	}
	
	
	/**
	 * Reserve space.
	 * @param index i32
	 * @param size i32
	 */
	reserve(index:i32, size:i32):void{
		let i:i32 = index;
		for(i ; i < size ; i++) {
			this._free_flags.set_zero_at(index);
			index++;
		}
	}
	
	
	/**
	 * Free space.
	 * @param size i32
	 * @returns index i32
	 */
	// get_free_ranges():Map<i32,MemRange>{
		// return this._free_ranges;
	// }
	
	
	
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
	 * Get Signed Integer (32 bits) item.
	 * @param index i32
	 * @returns i32
	 */
	get_i32(index:i32):i32{
		if (index < 0 || index + 3 >= this._view.byteLength)
        {
			return 999999999;
		}
		return this._view.getInt32(index);
	}
	
	
	/**
	 * Get Signed Integer (32 bits) item without index check.
	 * @param index i32
	 * @returns i32
	 */
	get_i32_unsafe(index:i32):i32{
		return this._view.getInt32(index);
	}
	
	
	/**
	 * Set Signed Integer (32 bits) item with index checking.
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
	 * Set Signed Integer (32 bits) item without index checking.
	 * @param index i32
	 * @param item i32
	 * @returns next index
	 */
	set_i32_unsafe(index:i32, item:i32):i32{
		this._view.setInt32(index, item);
		return index + 4;
	}
	
	
	
	// **************************** U32 ****************************
	
	/**
	 * Get Unsigned Integer (32 bits) item.
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
	 * Get Unsigned Integer (32 bits) item without index check.
	 * @param index i32
	 * @returns u32
	 */
	get_u32_unsafe(index:i32):u32{
		return this._view.getUint32(index);
	}
	
	
	/**
	 * Set Integer (32 bits) item with index checking.
	 * @param index i32
	 * @param item iu32
	 * @returns next index i32
	 */
	set_u32(index:i32, item:u32):i32{
		if (index < 0 || index >= this._view.byteLength)
        {
			return -999999999;
		}
		this._view.setUint32(index, item);
		return index + 4;
	}
	
	
	/**
	 * Set Unsigned Integer (32 bits) item without index checking.
	 * @param index i32
	 * @param item u32
	 * @returns next index
	 */
	set_u32_unsafe(index:i32, item:u32):i32{
		this._view.setUint32(index, item);
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
		console.log('get_value:type', index);
		if (index < 0 || index >= this._view.byteLength)
        {
			return this.add_error( new Error(index, 'Memory.get_value:bad index [' + index + '], mem size [' + this._view.byteLength + ']') );
		}
		const value_type:u8 = this._view.getUint8(index);
		index++;
		console.log('get_value:after load type', index);
		
		switch(value_type){
			
			// Simple types
			case Value.NULL: {
				if (index >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Null at [' + index + '], mem size [' + this._view.byteLength + ']') );
				}
				const v:u8 = this._view.getUint8(index);
				if (v != 0)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad value reading Null at [' + index + '], mem size [' + this._view.byteLength + ']') );
				}
				return new Null();
			}
			case Value.ERROR: {
				if (index + 8 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Error at [' + index + '], mem size [' + this._view.byteLength + ']') );
				}
				const code:i32 = this._view.getInt32(index);
				index += 4;
				
				const size:i32 = this._view.getInt32(index);
				console.log('get_value:Error:chars count', size);
				console.log('get_value:Error:chars count index', index);
				index += 4;
				
				if (index + size * 2 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Error message chars at [' + index + '], chars count [' + size + '], mem size [' + this._view.byteLength + ']') );
				}
				
				let i:i32 = 0;
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
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Boolean at [' + index + '], mem size [' + this._view.byteLength + ']') );
				}
				const v:u8 = this._view.getUint8(index);
				return new Boolean(v > 0 ? 1 : 0);
			}
			case Value.INTEGER: {
				if (index + 3 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Integer 32 at [' + index + '], mem size [' + this._view.byteLength + ']') );
				}
				const v:i32 = this._view.getInt32(index);
				return new Integer(v);
			}
			case Value.FLOAT: {
				if (index + 3 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Float 64 at [' + index + '], mem size [' + this._view.byteLength + ']') );
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
			
			case Value.STRING: { // READ STRING CHARS
				if (index + 3 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading String length at [' + index + '], mem size [' + this._view.byteLength + ']') );
				}
				const size:i32 = this._view.getInt32(index);
				index += 4;
				
				if (index + size * 2 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading String chars at [' + index + '], chars count [' + size + '], mem size [' + this._view.byteLength + ']') );
				}
				
				let i:i32 = 0;
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
			case Value.LIST: { // READ LIST ITEMS
				if (index + 3 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading List length at [' + index + '], mem size [' + this._view.byteLength + ']') );
				}
				const size:i32 = this._view.getInt32(index);
				index += 4;
				
				if (index + size >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading List items at [' + index + '], items count [' + size + '], mem size [' + this._view.byteLength + ']') );
				}
				
				const values:List = new List(size);
				let i:i32 = 0;
				let item_index:i32 = 0;
				let v:Value;
				while(i < size){
					item_index = this.get_i32(index);
					console.log('get_value:List:read item ', i, ' at ', item_index);
					if (item_index > 0) {
						v = this.get_value(item_index);
						if (v) {
							console.log('get_value:List:set item ', i, ' from ', item_index);
							values.set(i, v);
						}
					}
					index += 4;
					i++;
				}
				return values;
			}
			
			case Value.STACK: { // READ STACK ITEMS
				if (index + 7 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Stack size at [' + index + '], mem size [' + this._view.byteLength + ']') );
				}
				const size:i32 = this._view.getInt32(index);
				index += 4;
				
				const top:i32 = this._view.getInt32(index);
				index += 4;
				
				if (index + size >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading List items at [' + index + '], items count [' + size + '], mem size [' + this._view.byteLength + ']') );
				}
				
				const values:Stack = new Stack(size);
				let i:i32 = 0;
				let item_index:i32 = 0;
				let v:Value;
				while(i <= top){
					item_index = this.get_i32(index);
					if (item_index > 0) {
						v = this.get_value(item_index);
						if (v) {
							values.push(v);
						}
					}
					index += 4;
					i++;
				}
				return values;
			}
			
			// Vectors
			// case Value.BVECTOR: {
			//     const size:i32 = this._view.getInt32(index + 1);
			//     return new Float(v);
			// }
			// case Value.IVECTOR: {
			//     const size:i32 = this._view.getInt32(index + 1);
			//     return new Float(v);
			// }
			// case Value.FVECTOR: {
			//     const size:i32 = this._view.getInt32(index + 1);
			//     return new Float(v);
			// }

			// case Value.: {
			//     const v:f32 = this._view.getFloat32(index + 1);
			//     return new Float(v);
			// }
		}
		
        return new Error(index, 'Scope.values:bad value type:[' + value_type + '], mem size [' + this._view.byteLength + ']');
	}
	
	
	/**
	 * Set a value at given index.
	 *
	 * @param index i32
	 * @param item Value
	 * @returns next index
	 */
	set_value(index:i32, item:Value):i32 {
		console.log('set_value:type', index);
		if (index < 0 || index >= this._view.byteLength)
        {
			this.add_error( new Error(index, 'Memory.set_value:bad index at [' + index + '], mem size [' + this._view.byteLength + ']') );
			return -1;
		}
		const value_type:u8 = item.type;
		this._view.setUint8(index, value_type);
		index += 1;
		console.log('set_value:index after save type', index);
		
		switch(value_type){
			
			// Simple types
			case Value.NULL: {
				if (index >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Null at [' + index + '], mem size [' + this._view.byteLength + ']') );
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
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Error at [' + index + '], mem size [' + this._view.byteLength + ']') );
					return -1;
				}
				const v:Error = <Error>item;
				
				const code:i32 = v.code;
				this._view.setInt32(index, code);
				index += 4;
				
				const size:i32 = v.message.length;
				this._view.setInt32(index, size);
				console.log('set_value:Error:chars [' + v.message + ']');
				console.log('set_value:Error:chars count', size);
				console.log('set_value:Error:chars count index', index);
				console.log('set_value:Error:chars count read', this._view.getInt32(index));
				index += 4;
				
				if (index + size * 2 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Error message chars at [' + index + '], chars count [' + size + '], mem size [' + this._view.byteLength + ']') );
					return -1;
				}
				
				let i:i32 = 0;
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
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Boolean at [' + index + '], mem size [' + this._view.byteLength + ']') );
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
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Integer 32 at [' + index + '], mem size [' + this._view.byteLength + ']') );
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
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Float 64 at [' + index + '], mem size [' + this._view.byteLength + ']') );
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
					// this.add_error( new Error(index, 'Memory.set_value:bad index writing BigInteger at [' + index + ']') );
					// return -1;
				// }
				// this._view.setInt32(index, item.value);
				// return index + 1;
			// }
			// case Value.BIGFLOAT: 
				// if (index + 4 >= this._view.byteLength)
				// {
					// this.add_error( new Error(index, 'Memory.set_value:bad index writing BigFloat at [' + index + ']') );
					// return -1;
				// }
				// this._view.setInt32(index, item.value);
				// return index + 1;
			// }
			
			case Value.STRING: { // WRITE STRING CHARS
				if (index + 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing String length at [' + index + '], mem size [' + this._view.byteLength + ']') );
					return -1;
				}
				const size:i32 = item.bytes;
				this._view.setInt32(index, item.bytes);
				index += 4;
				
				if (index + size * 2 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing String chars at [' + index + '], chars count [' + size + '], mem size [' + this._view.byteLength + ']') );
					return -1;
				}
				
				const v:Text = <Text>item;
				let i:i32 = 0;
				let u16_code:u16;
				while(i < size){
					u16_code = v.value.codePointAt(i);
					this._view.setUint16(index + i * 2, u16_code);
					i++;
				}
				
				return index + size * 2;
			}
			

			// Collections
			case Value.LIST: { // WRITE LIST ITEMS
				if (index + 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing List length at [' + index + '], mem size [' + this._view.byteLength + ']') );
					return -1;
				}
				const list:List = <List>item;
				const size:i32 = list.size();
				this._view.setInt32(index, size);
				index += 4;
				
				let i:i32 = 0;
				let item_index:i32 = 0;
				let v:Value;
				while(i < size){
					console.log('set_value:List:write item? ', i);
					v = list.get(i);
					if (v) {
						item_index = this.allocate(v.bytes);
						console.log('set_value:List:write item ', i, ' at ', index, ' with own index', item_index);
						this.set_value(item_index, v);
						this._view.setInt32(index, item_index);
					} else {
						this._view.setInt32(index, -1);
					}
					index += 4;
					i++;
				}

				return index;
			}

			case Value.STACK: { // WRITE STACK ITEMS
				if (index + 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Stack length at [' + index + '], mem size [' + this._view.byteLength + ']') );
					return -1;
				}
				const stack:Stack = <Stack>item;
				
				const size:i32 = stack.size();
				this._view.setUint32(index, size);
				index += 4;
				
				const top:i32 = stack.top();
				this._view.setUint32(index, top);
				index += 4;
				
				let i:i32 = 0;
				let item_index:i32 = 0;
				let v:Value;
				while(i <= top){
					v = stack.get(i);
					if (v) {
						item_index = this.allocate(v.bytes);
						this.set_value(item_index, v);
						this._view.setUint32(index, item_index);
					}
					index += 4;
					i++;
				}

				return index;
			}

			// Vectors
			// case Value.BVECTOR: {
			//     const size:i32 = buffer_view.getInt32(index + 1);
			//     return new Float(v);
			// }
			// case Value.IVECTOR: {
			//     const size:i32 = buffer_view.getInt32(index + 1);
			//     return new Float(v);
			// }
			// case Value.FVECTOR: {
			//     const size:i32 = buffer_view.getInt32(index + 1);
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
	
	
	/**
	 * Realease value space at given index.
	 *
	 * @param index i32
	 */
	release_value(index:i32):void {
		if (index < 0 || index >= this._view.byteLength)
        {
			this.add_error( new Error(index, 'Memory.release_value:bad index at [' + index + ']') );
			return;
		}
		const value_type:u8 = this._view.getUint8(index);
		this.release(index, 1);
		index += 1;
		
		switch(value_type){
			
			// Simple types
			case Value.NULL: {
				if (index >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing Null at [' + index + ']') );
					return;
				}
				this.release(index, 1);
				
				return;
			}
			case Value.ERROR: {
				if (index + 8 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing Error at [' + index + ']') );
					return;
				}
				const code:i32 = this._view.getInt32(index);
				this.release(index, 4);
				index += 4;
				
				const size:i32 = this._view.getInt32(index);
				this.release(index, 4);
				index += 4;
				
				if (index + size * 2 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing Error message chars at [' + index + ']') );
					return;
				}
				this.release(index, size * 2);
				
				return;
			}
			case Value.BOOLEAN: {
				if (index >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing Boolean at [' + index + ']') );
					return;
				}
				this.release(index, 1);
				
				return;
			}
			case Value.INTEGER: {
				if (index + 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing Integer 32 at [' + index + ']') );
					return;
				}
				this.release(index, 4);
				
				return;
			}
			case Value.FLOAT: {
				if (index + 8 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing Float 64 at [' + index + ']') );
					return;
				}
				this.release(index, 8);
				
				return;
			}
			
			// case Value.BIGINTEGER: {
				// if (index + 4 >= this._view.byteLength)
				// {
					// this.add_error( new Error(index, 'Memory.release_value:bad index releasing BigInteger at [' + index + ']') );
					// return -1;
				// }
				// this._view.setInt32(index, item.value);
				// return index + 1;
			// }
			// case Value.BIGFLOAT: 
				// if (index + 4 >= this._view.byteLength)
				// {
					// this.add_error( new Error(index, 'Memory.release_value:bad index releasing BigFloat at [' + index + ']') );
					// return -1;
				// }
				// this._view.setInt32(index, item.value);
				// return index + 1;
			// }
			
			case Value.STRING: { // RELEASE STRING CHARS
				if (index + 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing String length at [' + index + ']') );
					return;
				}
				const size:i32 = this._view.getInt32(index);
				this.release(index, 4);
				index += 4;
				
				if (index + size * 2 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing String chars at [' + index + ']') );
					return;
				}
				this.release(index, size * 2);
				
				return;
			}
			

			// Collections
			case Value.LIST: { // RELEASE LIST ITEMS
				if (index + 3 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing List length at [' + index + ']') );
					return;
				}
				const size:i32 = this._view.getInt32(index);
				this.release(index, 4);
				index += 4;
				
				if (index + size * 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing List items at [' + index + ']') );
					return;
				}
				const indices_index = index;
				
				let i:i32 = 0;
				let item_index:i32 = 0;
				while(i < size){
					item_index = this.get_i32(index);
					this.release_value(item_index);
					index += 4;
					i++;
				}
				this.release(indices_index, size * 4);
				
				return;
			}
			
			case Value.STACK: { // RELEASE STACK ITEMS
				if (index + 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing Stack length at [' + index + ']') );
					return;
				}
				const size:i32 = this._view.getInt32(index);
				this.release(index, 4);
				index += 4;
				
				if (index + size * 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.release_value:bad index releasing Stack items at [' + index + ']') );
					return;
				}
				const indices_index = index;
				
				let i:i32 = 0;
				let item_index:i32 = 0;
				while(i < size){
					item_index = this.get_i32(index);
					this.release_value(item_index);
					index += 4;
					i++;
				}
				this.release(indices_index, size * 4);
				
				return;
			}

			// Vectors
			// case Value.BVECTOR: {
			//     const size:i32 = buffer_view.getInt32(index + 1);
			//     return new Float(v);
			// }
			// case Value.IVECTOR: {
			//     const size:i32 = buffer_view.getInt32(index + 1);
			//     return new Float(v);
			// }
			// case Value.FVECTOR: {
			//     const size:i32 = buffer_view.getInt32(index + 1);
			//     return new Float(v);
			// }

			// case Value.: {
			//     const v:f32 = buffer_view.getFloat32(index + 1);
			//     return new Float(v);
			// }
		}
		
        this.add_error( new Error(index, 'Memory.release_value:bad value type:[' + value_type + ']') );
		return;
	}
}