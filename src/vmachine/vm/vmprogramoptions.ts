

export interface IProgramOptions {
     registers:number; // registers count
     stack:number; // stack max size
     instructions:number; // instructions max size
     entry_label:string; // program entry point label
 }

export default class VMProgramOptions {
    registers:number; // registers count
    stack:number; // stack max size
    instructions:number; // instructions max size
    entry_label:string; // program entry point label
}