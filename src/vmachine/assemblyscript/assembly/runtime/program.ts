
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import ProgramOptions from './program_options';
import { Value, Text, List, Stack, Error, Null } from './value';
import Instructions from './instructions';
import Memory from './memory';


const DEFAULT_STACK_SIZE:u32 = 50;
const DEFAULT_REGISTERS_STACK_SIZE:u32 = 50;
const DEFAULT_REGISTERS_SIZE:u32 = 50;

/**
 * Program is a Virtual Machine thread instance.
 * It contains all instructions, memory, stack and registers.
 * 
 * @Example
 *  const engine = new VM('engine 1');
 *  const program = new Program('program 1', { registers:10 });
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
export default class Program {
	// ERRORS
    private _has_error:boolean = false;
    private _error_message:string = '';
    private _error_cursor:i32 = -1;
    private _error_index:i32 = -1;

	// BYTES INSTRUCTIONS
    private _instructions:Instructions;
    private _cursor:i32 = 0;
	
	// VALUES REGISTERS
    private _value_registers:List;
    private _value_registers_stack:Stack;
	
	// VALUES STACK
    private _value_stack:Stack;
	
	// VALUES MEMORY
    private _memory:Memory;
    
	
	// PROGRAM STATE
    private _is_running = false;

	/**
	 * Create a Program instance with given options.
	 */
    constructor(options: ProgramOptions){
        // Init values registers
        this._registers = new List(options.registers ? options.registers: DEFAULT_REGISTERS_SIZE);

        // Init values registers stack
        this._values_registers_stack = new Stack(options.stack ? options.stack : DEFAULT_REGISTERS_STACK_SIZE);

        // Init values stack
        this._values_stack = new Stack(options.stack ? options.stack : DEFAULT_STACK_SIZE);
    }

    // Error
    public has_error() : boolean { return this._has_error; }
    public get_error_message() : string { return this._error_message; }
    public get_error_cursor()  : i32 { return this._error_cursor; }
    public get_error_index()   : i32 { return this._error_index; }


    /**
     * Push current context onto the stack.
     */
    push_context(){
        if ( this._stack.is_full() )
        {
            this.error_registers_stack_overflow();
        }

        const size:u32 = this._registers.size();
        this._registers_stack.push(this._registers);
        this._registers = new List(size);
    }


    /**
     * Pop previous context from the stack.
     */
    pop_context(){
        if (this._stack.is_empty())
        {
            this.error_registers_stack_underflow();
            return;
        }
        
        this._registers = <List>this._registers_stack.pop();
    }


    /**
     * Push a value onto the stack.
     * @param value Value to put on the stack.
     */
    push_value(value:Value){
        if ( this._stack.is_full() )
        {
            this.error_stack_overflow();
            return;
        }
        if (! value) 
        {
            this.error_stack_bad_value();
            return;
        }

        this._stack.push(value);
    }

    pop_value(): Value {
        if ( this._stack.is_empty() )
        {
            return this.error_stack_underflow();
        }
        
        return this._stack.pop();
    }

    pop_value_available(): boolean {
        return ! this._stack.is_empty();
    }
    
    pop_values(count:number): List|Error {
        if ( this._stack.size() < count )
        {
            return this.error_stack_underflow();
        }
        
        const values = new List(count);
        let i = count;
        while(i > 0){
            values.set(count - i, this._stack.pop());
            --i;
        }

        return values;
    }


    // Registers
    // unregister_value(index:u32):void {
    //     if (index < 0 || index >= this._registers_size)
    //     {
    //         this.error_bad_register_index(index);
    //         return;
    //     }

    //     const previous_value = this._registers[index];
    //     if (previous_value) {
    //         this.free_value(previous_value)
    //     }

    //     this._registers[index] = new Null();
    // }

    set_register_value(index:u32, value:Value):void {
        if ( ! this._registers.is_valid_index(index) )
        {
            this.error_bad_register_index(index);
            return;
        }
        if (! value) 
        {
            this.error_register_bad_value();
            return;
        }

        const previous_value = this._registers.get(index);
        if (previous_value) {
            this.free_value(previous_value)
        }

        this._registers.set(index, value);
    }

    get_register_value(index:u32):Value {
        if ( ! this._registers.is_valid_index(index) )
        {
            return this.error_bad_register_index(index);
        }

        return this._registers.get(index);
    }

    // push_register_value(index:u32):void {
    //     if (index < 0 || index >= this._registers_size)
    //     {
    //         this.error_bad_register_index(index);
    //         return;
    //     }
        
    //     this.push_value( this._registers[index] )
    // }


    // VALUES
    free_value(value:Value) {
        // TODO ...
    }


    // INSTRUCTIONS
	get_instructions() {
		return this._instructions;
	}


	// CURSOR
    get_entry_point() : i32 {
        return 0;
    }

    set_cursor(index:i32):void {
        if (index < 0 || index >= this._scope.instructions.length)
        {
            this.error_bad_instructions_index(index);
            return;
        }

        this._cursor = index;
    }

    get_cursor():i32 {
        return this._cursor;
    }

    move_cursor(index:i32):void {
        const new_cursor = this._cursor + index
        if (new_cursor < 0 || new_cursor >= this._scope.instructions.length)
        {
            this.error_bad_instructions_index(new_cursor);
            return;
        }

        this._cursor = new_cursor;
    }

    move_next_unsafe():void {
        this._cursor++;
    }
	

	// STATE
    start():void {
        this._is_running = true;
    }

    stop():void {
        this._is_running = false;
    }


    is_running():boolean {
        return this._is_running && (this._cursor < this.instructions.bytesLength);
    }

    
    // ERRORS
    error_stack_overflow() {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'stack overflow: actual size=[' + this._stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_stack_underflow() {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'stack underflow: actual size=[' + this._stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_registers_stack_overflow() {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'registers stack overflow: actual size=[' + this._registers_stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_registers_stack_underflow() {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'registers stack underflow: actual size=[' + this._registers_stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_stack_bad_value() {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'program want to push on the stack a bad value';
        return new Error(this._error_cursor, this._error_message);
    }

    error_register_bad_value() {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'program want to register a bad value';
        return new Error(this._error_cursor, this._error_message);
    }

    error_bad_register_index(index:u32) {
        this._has_error = true;
        this._error_cursor = this.cursor;
        this._error_message = 'bad register index [' + index + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_bad_instructions_index(index:u32) {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'bad instruction index [' + index + ']';
        return new Error(this._error_cursor, this._error_message);
    }
}