import { OPCODES } from '../../core/iinstruction';
import IInstruction from '../../core/iinstruction';
import IValue from '../../core/ivalue';
import { IProgramOptions } from './vmprogramoptions';

/**
 * VMProgram class instances contain the program instructions, stack and registers.
 * 
 * @Example
 *  const engine = new VMEngine('engine 1');
 *  const program = new VMProgram('program 1', { registers:10 });
 *  
 *  // Init program stack
 *  program.push_value(new VMInteger(45) );
 *  program.push_value(new VMBigInteger('78215411554411000') );
 * 
 *  // Fill program registers
 *  program.register_value(1, new VMInteger(33) );
 *  program.register_value(3, new VMBigInteger('9998215411554411000') );
 *  program.register_value(2, new VMDate('2018/05/14') );
 *  program.register_value(5, new VMMatrix( [[1,2,3],[4,5,6],[7,8,9]]) );
 * 
 *  // Step 0
 * 
 *  program.add_instruction(new VMInstruction('BigInteger.add') ); // Step 1
 *  program.push_register_value(1);                                // Step 2
 *  program.add_instruction(new VMInstruction('BigInteger.sub') ); // Step 3
 *  program.push_register_value(3);                                // Step 4
 *  program.add_instruction(new VMInstruction('BigInteger.div') ); // Step 5
 * 
 *  const VMProgramResult = program.run()
 * 
 *  ---->
 *              Stack
 *  Step 0      BigInteger('78215411554411000')
 *              Integer(45)
 * 
 *  Step 1      BigInteger(add result)
 * 
 *  Step 2      Integer(33)
 *              BigInteger(add result)
 * 
 *  Step 3      BigInteger(sub result)
 * 
 *  Step 4      BigInteger(9998215411554411000')
 *              BigInteger(sub result)
 * 
 *  Step 5      BigInteger(div result)
 * 
 *  Step 6      ---
 * 
 *  VMProgramResult.value = BigInteger(div result)
 */
export default class VMProgram {
    private _has_error:boolean = false;
    private _error_message:string = undefined;
    private _error_cursor:number = undefined;

    private _registers:IValue[];
    private _registers_size:number = 5;

    private _stack:IValue[];
    private _stack_size:number = 10;
    private _stack_top:number = -1;

    private _instructions:IInstruction[];
    private _instructions_size:number = 100;
    private _instructions_count:number = 0;
    private _instructions_labels:Map<string,number>;
    private _instructions_cursor:number = 0;
    private _instructions_entry_label:string = undefined;

    private _is_running = false;

    constructor(private _type_name: String, options: IProgramOptions){
        // Init registers
        if (options.registers ) {
            this._registers_size = options.registers;
        }
        this._registers = new Array(this._registers_size);

        // Init stack
        if ( options.stack ) {
            this._stack_size = options.stack ;
        }
        this._stack = new Array(this._stack_size);

        // Init instructions
        if ( options.instructions ) {
            this._instructions_size = options.instructions ;
        }
        this._instructions = new Array(this._instructions_size);
        this._instructions_labels = new Map<string,number>()

        if (options.entry_label) {
            this._instructions_entry_label = options.entry_label;
        }
    }

    // Error
    public has_error() : boolean { return this._has_error; }
    public get_error_message() : string { return this._error_message; }
    public get_error_cursor() : number { return this._error_cursor; }

    // Stack
    push_value(value:IValue){
        if (this._stack_top >= this._stack_size - 1)
        {
            this.error_stack_overflow();
            return;
        }
        if (! value) 
        {
            this.error_stack_bad_value();
            return;
        }

        ++this._stack_top;
        this._stack[this._stack_top] = value;
    }

    pop_value(): IValue {
        if (this._stack_top < 0)
        {
            this.error_stack_underflow();
            return undefined;
        }
        
        --this._stack_top;
        return this._stack[this._stack_top + 1];
    }

    pop_value_available(): boolean {
        return this._stack_top >= 0;
    }
    
    pop_values(count:number): IValue[] {
        if (this._stack_top < count - 1)
        {
            this.error_stack_underflow();
            return undefined;
        }
        
        const values = new Array<IValue>();
        let i = count;
        while(i > 0){
            values.push( this._stack[this._stack_top] );
            --this._stack_top;
            --i;
        }

        return values;
    }


    // Registers
    unregister_value(index:number) {
        if (index < 0 || index >= this._registers_size)
        {
            this.error_bad_register_index(index);
        }

        const previous_value = this._registers[index];
        if (previous_value) {
            this.free_value(previous_value)
        }
        this._registers[index] = undefined;
    }

    register_value(index:number, value:IValue) {
        if (index < 0 || index >= this._registers_size)
        {
            this.error_bad_register_index(index);
        }
        if (! value) 
        {
            this.error_register_bad_value();
            return;
        }

        const previous_value = this._registers[index];
        if (previous_value) {
            this.free_value(previous_value)
        }
        this._registers[index] = value;
    }

    get_register_value(index:number) {
        if (index < 0 || index >= this._registers_size)
        {
            this.error_bad_register_index(index);
        }

        return this._registers[index];
    }

    push_register_value(index:number) {
        if (index < 0 || index >= this._registers_size)
        {
            this.error_bad_register_index(index);
        }
        
        this.push_value( this._registers[index] )
    }


    // Values
    free_value(value:IValue) {
        // ...
    }


    // Instructions
    set_instruction(index:number, instruction:IInstruction, label?:string) {
        if (index < 0 || index >= this._instructions_size)
        {
            this.error_bad_instructions_index(index);
        }

        const previous_instr = this._instructions[index];
        if (previous_instr) {
            this.free_instruction(previous_instr)
        }

        this._instructions[index] = instruction;
        if (label) {
            this._instructions_labels.set(label, index);
        }
    }

    add_instruction(instruction:IInstruction, label?:string) {
        this.set_instruction(this._instructions_count, instruction, label);
        ++this._instructions_count;
    }

    free_instruction(instruction:IInstruction) {
        // ...
    }


    get_entry_point() : number {
        if (this._instructions_entry_label) {
            const index = this._instructions_labels.get(this._instructions_entry_label)
            if (index) {
                return index
            }
        }
        return 0;
    }

    set_cursor(index:number) {
        if (index < 0 || index >= this._instructions_size)
        {
            this.error_bad_instructions_index(index);
            return;
        }

        this._instructions_cursor = index;
    }

    get_cursor() {
        return this._instructions_cursor;
    }

    move_cursor(index:number) {
        const new_cursor = this._instructions_cursor + index
        if (new_cursor < 0 || new_cursor >= this._instructions_size)
        {
            this.error_bad_instructions_index(new_cursor);
            return;
        }

        this._instructions_cursor = new_cursor;
    }

    get_cursor_instruction(): IInstruction {
        if (this._instructions_cursor < 0 || this._instructions_cursor >= this._instructions_size)
        {
            this.error_bad_instructions_index(this._instructions_cursor);
            return undefined;
        }
        
        return this._instructions[this._instructions_cursor];
    }

    start() {
        this._is_running = true;
    }

    stop() {
        this._is_running = false;
    }

    is_running() {
        return this._is_running && (this._instructions_cursor < this._instructions_count);
    }


    // Errors
    error_stack_overflow() {
        this._has_error = true;
        this._error_cursor = this._instructions_cursor;
        this._error_message = 'stack overflow: actual size=[' + this._stack_size + ']';
    }

    error_stack_underflow() {
        this._has_error = true;
        this._error_cursor = this._instructions_cursor;
        this._error_message = 'stack underflow: actual size=[' + this._stack_size + ']';
    }

    error_stack_bad_value() {
        this._has_error = true;
        this._error_cursor = this._instructions_cursor;
        this._error_message = 'program want to push on the stack a bad value';
    }

    error_register_bad_value() {
        this._has_error = true;
        this._error_cursor = this._instructions_cursor;
        this._error_message = 'program want to register a bad value';
    }

    error_bad_register_index(index:number) {
        this._has_error = true;
        this._error_cursor = this._instructions_cursor;
        this._error_message = 'bad register index [' + index + ']';
    }

    error_bad_instructions_index(index:number) {
        this._has_error = true;
        this._error_cursor = this._instructions_cursor;
        this._error_message = 'bad instruction index [' + index + ']';
    }
}