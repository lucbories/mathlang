import Cpu from 'cpu.ts';


export default class Cpu8Bits extends Cpu<Uint8Array> {
	constructor(
		index:number,
		label:string,
		instructions_size:number,
		memory_size:number,
		register_size:number) {
			super(index, label, 8, instructions_size, memory_size, register_size)
	}
}