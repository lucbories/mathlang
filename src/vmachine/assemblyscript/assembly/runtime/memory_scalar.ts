
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import { Value, Boolean, Integer, Float, Text, List, Stack, Error, Null } from './value';
import MemoryBase from './memory_base';



/**
 * Memory contains initial and run values of a program.
 * 
 * API:
 *   constructor(size_in_bytes:i32))
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
export default class MemoryScalar extends MemoryBase{

	/**
	 * Create an Memory instance.
	 *
	 * @param i32		memory size in bytes
	 */
    constructor(size_in_bytes:i32){
		super(size_in_bytes);
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
}