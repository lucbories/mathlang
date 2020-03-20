
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import BitArray from './bitarray';


const DEFAULT_MEMORY_BYTES:i32 = 1000;

/**
 * Memory contains initial and run values of a program.
 * 
 * API:
 *   constructor(size_in_bytes:i32 = DEFAULT_MEMORY_BYTES)
 *   
 *   
 *   
 *   
 *   
 *
 */
export default class MemoryBase {
	
    private _buffer:ArrayBuffer;
    protected _view:DataView;
	
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
	
	

	/**
	 * Create an Memory instance.
	 *
	 * @param size_in_bytes		i32		memory size in bytes
	 */
    constructor(size_in_bytes:i32 = DEFAULT_MEMORY_BYTES){
		this._buffer = new ArrayBuffer(size_in_bytes);
		this._view = new DataView(this._buffer);
		
		this._last_allocated_index = 0;
		this._free_flags = new BitArray( Math.floor(size_in_bytes / 8) + 1 );
		this._free_flags.fill_with_ones();
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
			
			// console.log('MemoryBase:allocate: size=[' + size + '] allocated index=[' + this._last_allocated_index + ']');
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
		
		// console.log('MemoryBase:allocate: size=[' + size + '] allocated index=[' + this._last_allocated_index + ']');
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
		
		console.log('MemoryBase:release: index=[' + index + '] size=[' + size + '] allocated index=[' + this._last_allocated_index + ']');
	}
	
	
	/**
	 * Reserve space.
	 * @param index i32
	 * @param size i32
	 */
	reserve(index:i32, size:i32):void{
		let i:i32 = index;
		let last_index = index + size;
		for(i ; i < last_index ; i++) {
			this._free_flags.set_zero_at(index);
			index++;
		}
		this._last_allocated_index = Math.max(this._last_allocated_index, index);
		console.log('MemoryBase:reserve: index=[' + index + '] size=[' + size + '] allocated index=[' + this._last_allocated_index + ']');
	}
	
	
	/**
	 * Free space index.
	 * 
	 * @returns index i32
	 */
	get_free_index():i32{
		return this._last_allocated_index;
	}
}