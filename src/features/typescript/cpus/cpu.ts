
interface BitsArrayConstructor {
   <T> new (): T;
}

export default class Cpu<BitsArrayType> {
	protected _status_code:number = -1;
	protected _status_label:number = 'default value';
	
	protected _instructions:BitsArrayType = undefined;
	protected _memory:BitsArrayType = undefined;
	protected _registers:BitsArrayType = undefined;
	
	constructor(
		protected _index:number,
		protected _label:string,
		protected _bits_size:number,
		protected _instructions_size:number,
		protected _memory_size:number,
		protected _register_size:number) {
	}
	
	index():number        	    	{ return this._index; }
	label():string					{ return this._label; }
	
	bits_size():number    	    	{ return this._bits_size; }
	instructions():BitsArrayType	{ return this._instructions; }
	memory():BitsArrayType       	{ return this._memory; }
	registers():BitsArrayType    	{ return this._registers; }
	
	status_code():number  			{ return this._status_code; }
	status_label():string 			{ return this._status_label; }
	
	reset() {
		this._instructions = new BitsArrayConstructor<BitsArrayType>(this._instructions_size);
		this._memory       = new BitsArrayConstructor<BitsArrayType>(this._memory_size);
		this._registers    = new BitsArrayConstructor<BitsArrayType>(this._register_size);
	}
	
	compile(text_code:string):boolean {
		return false;
	}
	
	run():boolean {
		return false;
	}
}
