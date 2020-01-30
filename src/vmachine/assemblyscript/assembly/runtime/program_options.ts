

export default class ProgramOptions {
    registers:u32; // registers count
    stack:u32; // stack max size
    instructions:u32; // instructions max size
    entry_label:string; // program entry point label
}