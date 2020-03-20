
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import { Value, Boolean, Integer, Float, Text, List, Stack, Error, Null } from './value';
import MemoryScalar from './memory_scalar';


/**
 * Memory contains initial and run values of a program.
 * 
 * API:
 *   constructor(size_in_bytes:i32)
 *   
 *   has_error():boolean
 *   get_errors():Stack
 *   add_error(error:Error):Error
 *   
 *   get_value(index:i32):Value
 *   set_value(index:i32, item:Value):i32
 *   release_value(index:i32):void
 */
export default class Memory extends MemoryScalar {
	
    private _errors:Stack;
	
	

	/**
	 * Create an Memory instance.
	 *
	 * @param size_in_bytes		i32		memory size in bytes
	 */
    constructor(size_in_bytes:i32){
		super(size_in_bytes);
		
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
				// console.log('get_value:Error:chars count', size);
				// console.log('get_value:Error:chars count index', index);
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
				// console.log('get_value:List:index', index);
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
					// console.log('get_value:List:read item ', i, ' at ', item_index);
					if (item_index > 0) {
						v = this.get_value(item_index);
						if (v) {
							// console.log('get_value:List:add item ', i, ' from ', item_index);
							values.set(i, v);
						}
					}
					index += 4;
					i++;
				}
				return values;
			}
			
			case Value.STACK: { // READ STACK ITEMS
				// console.log('get_value:Stack:index', index);
				if (index + 7 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Stack size at [' + index + '], mem size [' + this._view.byteLength + ']') );
				}
				const size:i32 = this._view.getInt32(index);
				// console.log('get_value:Stack:get size index', index, ' size ', size);
				index += 4;
				
				const top:i32 = this._view.getInt32(index);
				// console.log('get_value:Stack:get top index', index, ' top ', top);
				index += 4;
				
				if (index + size * 4 >= this._view.byteLength)
				{
					return this.add_error( new Error(index, 'Memory.get_value:bad index reading Stack items at [' + index + '], items count [' + size + '], mem size [' + this._view.byteLength + ']') );
				}
				
				const values:Stack = new Stack(size);
				let i:i32 = 0;
				let item_index:i32 = 0;
				let v:Value;
				while(i <= top){
					item_index = this.get_i32(index);
					console.log('get_value:Stack:read item ', i, ' at ', index, ' pointing to', item_index);
					if (item_index > 0) {
						v = this.get_value(item_index);
						if (v) {
							console.log('get_value:Stack:set item ', i, ' from ', item_index);
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
		
        return new Error(index, 'Memory.get_value:bad type:[' + value_type + '], mem size [' + this._view.byteLength + ']');
	}
	
	
	/**
	 * Set a value at given index.
	 *
	 * @param index i32
	 * @param item Value
	 * @returns next index
	 */
	set_value(index:i32, item:Value):i32 {
		// console.log('set_value:index', index);
		if (index == -1){
			index = this.get_free_index();
		}

		if (index < 0 || index >= this._view.byteLength)
        {
			this.add_error( new Error(index, 'Memory.set_value:bad index at [' + index + '], mem size [' + this._view.byteLength + ']') );
			return -1;
		}
		const value_type:u8 = item.type;
		this._view.setUint8(index, value_type);
		index += 1;
		// console.log('set_value:index after save type', index);
		
		// console.log('set_value:type', value_type);
		switch(value_type){
			
			// Simple types
			case Value.NULL: {
				this.reserve(index-1, 1+1);
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
				const size:i32 = v.message.length;
				this.reserve(index-1, 1 + 8 + size * 2);
				
				const code:i32 = v.code;
				this._view.setInt32(index, code);
				index += 4;
				
				this._view.setInt32(index, size);
				// console.log('set_value:Error:chars [' + v.message + ']');
				// console.log('set_value:Error:chars count', size);
				// console.log('set_value:Error:chars count index', index);
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
				
				// console.log('set_value:Error:next index', index + (size - 1) * 2);
				return index + (size - 1) * 2;
			}
			case Value.BOOLEAN: {
				this.reserve(index-1, 1+1);
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
				this.reserve(index-1, 4+1);
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
				this.reserve(index-1, 8+1);
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
				this.reserve(index-1, 1 + 4 + size * 2);

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
				// console.log('set_value:List:index', index);
				const list:List = <List>item;
				const size:i32 = list.size();
				const list_bytes = list.bytes_size();
				if (index + list_bytes >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing List length at [' + index + '], mem size [' + this._view.byteLength + ']') );
					return -1;
				}
				this.reserve(index - 1, list_bytes + 1);
				
				this._view.setInt32(index, size);
				index += 4;
				// console.log('set_value:List:list_bytes', list_bytes);
				// console.log('set_value:List:write size: next index', index);
				
				let i:i32 = 0;
				let item_index:i32 = 0;
				let v:Value;
				while(i < size){
					// console.log('set_value:List:write item? ', i, ' at ', index);
					v = list.get(i);
					if (v) {
						item_index = this.allocate(v.bytes);
						// console.log('set_value:List:write item ', i, ' at ', index, ' pointing to', item_index);
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
				// console.log('set_value:Stack:index', index);
				if (index + 4 >= this._view.byteLength)
				{
					this.add_error( new Error(index, 'Memory.set_value:bad index writing Stack length at [' + index + '], mem size [' + this._view.byteLength + ']') );
					return -1;
				}
				const stack:Stack = <Stack>item;
				const size:i32 = stack.size();
				const stack_bytes = stack.bytes_size();
				this.reserve(index - 1, stack_bytes + 1);
				
				this._view.setInt32(index, size);
				// console.log('set_value:Stack:set size index', index, ' size ', size);
				index += 4;
				
				const top:i32 = stack.top();
				// console.log('set_value:Stack:set top index', index, ' top ', top);
				this._view.setInt32(index, top);
				index += 4;
				
				let i:i32 = 0;
				let item_index:i32 = 0;
				let v:Value;
				while(i < size){
					console.log('set_value:Stack:write item? ', i, ' at ', index);
					if (i <= top){
						v = stack.get(i);
						if (v) {
							item_index = this.allocate(v.bytes);
							console.log('set_value:Stack:write item ', i, ' at ', index, ' pointing to', item_index);
							this.set_value(item_index, v);
							this._view.setInt32(index, item_index);
						}
					} else {
						this._view.setInt32(index, -1);
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