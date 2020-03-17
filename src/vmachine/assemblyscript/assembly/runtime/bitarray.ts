
const DEFAULT_MEMORY_BYTES:i32 = 100;


/**
 * Bits array class.
 *
 * Example:
 *      9 (base 10): 00000000000000000000000000001001 (base 2)
 *                   --------------------------------
 * 9 << 2 (base 10): 00000000000000000000000000100100 (base 2) = 36 (base 10)
 *
 * 
 */
export default class BitArray {
	
	private _size:u32;
	
    private _buffer:ArrayBuffer;
    private _view:Uint8Array;
	
	private _00000001:i32 = parseInt('00000001', 2);
	private _00000010:i32 = parseInt('00000010', 2);
	private _00000100:i32 = parseInt('00000100', 2);
	private _00001000:i32 = parseInt('00001000', 2);
	private _00010000:i32 = parseInt('00010000', 2);
	private _00100000:i32 = parseInt('00100000', 2);
	private _01000000:i32 = parseInt('01000000', 2);
	private _10000000:i32 = parseInt('10000000', 2);
	
	private _11111110:i32 = parseInt('11111110', 2);
	private _11111101:i32 = parseInt('11111101', 2);
	private _11111011:i32 = parseInt('11111011', 2);
	private _11110111:i32 = parseInt('11110111', 2);
	private _11101111:i32 = parseInt('11101111', 2);
	private _11011111:i32 = parseInt('11011111', 2);
	private _10111111:i32 = parseInt('10111111', 2);
	private _01111111:i32 = parseInt('01111111', 2);
	
	
	/**
	 * Create an bits array instance.
	 * 
	 * @param i32		size in bytes
	 */
    constructor(size:i32 = DEFAULT_MEMORY_BYTES){
		this._size = size;
		this._buffer = new ArrayBuffer(size);
		this._view = new Uint8Array(this._buffer);
    }
	
	
	/**
	 * Get size.
	 * @returns size u32
	 */
	get_size() {
		return this._size;
	}
	
	
	/**
	 * Fill array with 1
	 *
	 */
	fill_with_ones(){
		this._view.fill(255);
	}
	
	
	/**
	 * Fill array with 0
	 *
	 */
	fill_with_zeros(){
		this._view.fill(0);
	}
	
	
	/**
	 * Set a binary 1 at given posuition (1-8).
	 * 
	 * @param bit index i32
	 */
	set_one_at(index:i32):void{
		const byte_index:u8 = index % 8 + 1;
		const array_index:u32 = Math.floor(index / 8);
		const byte_value:u8 = this._view[array_index];
		
		switch(byte_index){
			case 1: this._view[array_index] = byte_value | this._00000001; return;
			case 2: this._view[array_index] = byte_value | this._00000010; return;
			case 3: this._view[array_index] = byte_value | this._00000100; return;
			case 4: this._view[array_index] = byte_value | this._00001000; return;
			case 5: this._view[array_index] = byte_value | this._00010000; return;
			case 6: this._view[array_index] = byte_value | this._00100000; return;
			case 7: this._view[array_index] = byte_value | this._01000000; return;
			case 8: this._view[array_index] = byte_value | this._10000000; return;
		}
	}
	
	
	/**
	 * Set a binary 1 at given positions range.
	 * 
	 * @param first bit index i32
	 * @param last bit index i32
	 */
	set_one_in_range(index_begin:i32, index_end:i32):void{
		let array_index_begin:u32 = Math.floor(index_begin / 8);
		let array_index_end:u32 = Math.floor(index_end / 8);
		
		let for_i:i32;
		
		// PROCESS FIRST BITS
		// 12345678 12345678 12345678
		// 00111100 00000000 00000000
		// BBB  EEE
		// B=E
		if (array_index_begin == array_index_end ){
			for(for_i = index_begin ; for_i <= index_end ; for_i++){
				this.set_one_at(for_i);
			}
			return;
		}
		
		// 12345678 12345678 12345678
		// 01111111 11100000 00000000
		//  B       EEE
		// B        E
		if (index_begin > array_index_begin * 8){
			for(for_i = index_begin ; for_i < array_index_begin * 8 + 8; for_i++){
				this.set_one_at(for_i);
			}
			array_index_begin++;
		}
		
		// 12345678 12345678 12345678
		// 11111111 11000000 00000000
		//           E
		//          E
		if (index_end < (array_index_end * 8 + 8)){
			for(for_i = array_index_end * 8 ; for_i <= index_end ; for_i++){
				this.set_one_at(for_i);
			}
			array_index_end--;
		}

		// PROCESS MIDDLE BITS
		for(for_i = array_index_begin; for_i <= array_index_end ; for_i++){
			this._view[for_i] = 255;
		}
	}
	
	
	/**
	 * Set a binary 1 at given posuition (1-8).
	 * 
	 * @param bit index i32
	 */
	set_zero_at(index:i32):u8{
		const byte_index:u8 = index % 8 + 1;
		const array_index:u32 = Math.floor(index / 8);
		const byte_value:u8 = this._view[array_index];
		
		switch(byte_index){
			case 1: this._view[array_index] = byte_value | this._11111110; return;
			case 2: this._view[array_index] = byte_value | this._11111101; return;
			case 3: this._view[array_index] = byte_value | this._11111011; return;
			case 4: this._view[array_index] = byte_value | this._11110111; return;
			case 5: this._view[array_index] = byte_value | this._11101111; return;
			case 6: this._view[array_index] = byte_value | this._11011111; return;
			case 7: this._view[array_index] = byte_value | this._10111111; return;
			case 8: this._view[array_index] = byte_value | this._01111111; return;
		}
	}
	
	
	/**
	 * Set a binary 0 at given positions range.
	 * 
	 * @param first bit index i32
	 * @param last bit index i32
	 */
	set_zero_in_range(index_begin:i32, index_end:i32):void{
		let array_index_begin:u32 = Math.floor(index_begin / 8);
		let array_index_end:u32 = Math.floor(index_end / 8);
		
		let for_i:i32;
		
		// PROCESS FIRST BITS
		// 12345678 12345678 12345678
		// BBB  EEE
		// B=E
		if (array_index_begin == array_index_end ){
			for(for_i = index_begin ; for_i <= index_end ; for_i++){
				this.set_zero_at(for_i);
			}
			return;
		}
		
		// 12345678 12345678 12345678
		//  B       EEE
		// B        E
		if (index_begin > array_index_begin * 8){
			for(for_i = index_begin ; for_i < array_index_begin * 8 + 8; for_i++){
				this.set_zero_at(for_i);
			}
			array_index_begin++;
		}
		
		// 12345678 12345678 12345678
		//           E
		//          E
		if (index_end < (array_index_end * 8 + 8)){
			for(for_i = array_index_end * 8 ; for_i <= index_end ; for_i++){
				this.set_zero_at(for_i);
			}
			array_index_end--;
		}

		// PROCESS MIDDLE BITS
		for(for_i = array_index_begin; for_i <= array_index_end ; for_i++){
			this._view[for_i] = 0;
		}
	}
	
	
	/**
	 * Get a binary 0 or 1 at given position (1-8).
	 * 
	 * @param bit index i32
	 * @returns boolean
	 */
	get_at(index:i32):boolean{
		const byte_index:u8 = index % 8 + 1;
		const array_index:u32 = Math.floor(index / 8);
		const byte_value:u8 = this._view[array_index];
		
		// console.log('get_at[' + index + '], byte_index=[' + byte_index + '], array_index=[' + array_index + '], byte_value=[' + byte_value + ']');
		// console.log('get_at[' + index + '], this._00000001=[' + this._00000001 + ']', byte_value & this._00000001);
		
		switch(byte_index){
			case 1: return byte_value & this._00000001 ? true : false;
			case 2: return byte_value & this._00000010 ? true : false;
			case 3: return byte_value & this._00000100 ? true : false;
			case 4: return byte_value & this._00001000 ? true : false;
			case 5: return byte_value & this._00010000 ? true : false;
			case 6: return byte_value & this._00100000 ? true : false;
			case 7: return byte_value & this._01000000 ? true : false;
			case 8: return byte_value & this._10000000 ? true : false;
		}
		return false;
	}
	
	
	/**
	 * To string.
	 * @returns string
	 */
	to_string(){
		return this._view.toString();
	}
}