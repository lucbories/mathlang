
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import ProgramOptions from './program_options';
import { Value, Boolean, Integer, Float, Complex, Text, List, Stack, Error, Null } from './value';
import Instructions from './instructions';
import Memory from './memory';


const DEFAULT_STACK_SIZE:u32 = 50;
const DEFAULT_REGISTERS_STACK_SIZE:u32 = 50;

// function i32(v:i32):i32 { return v; }


/**
 * Program is a Virtual Machine thread instance.
 * It contains all instructions, memory, stack and registers.
 * 
 * @API
 *  constructor(instructions:Instructions, instructions_start:i32, instructions_size:i32, values:List, options: ProgramOptions)
 *  
 *  push_context():void
 *  pop_context():void
 * 
 *  push_value(value:Value):void
 *  push_boolean(value:boolean):void
 *  push_integer(value:i32):void
 *  push_float(value:f64):void
 *  push_complex(re:f64, im:f64):void
 * 
 *  pop_value(): Value
 *  pop_value_available(): boolean
 *  pop_values(count:u32): List|null
 * 
 *  set_register_value(index:i32, value:Value):void
 *  get_register_value(index:i32):Value
 * 
 *  free_value(value:Value):void
 * 
 *  get_instructions():Instructions
 *  get_entry_point():i32
 * 
 *  start():void
 *  stop():void
 *  is_running():boolean
 * 
 * @Example
 *      r0 = BigInteger('78215411554411000') + Integer(45)  // Step 1
 *      r1 = Integer(33) - r0                               // Step 2
 *      r2 = BigInteger(9998215411554411000') / r1          // Step 3
 * 
 *  const instructions:Instructions = new Instructions(undefined, 0, 250);
 *  instructions.bi_add(OPCODES.LIMIT_OPD_STACK, OPCODES.LIMIT_OPD_INLINE, 0, 45);    // Step 1: pop + pop
 *  instructions.bi_sub(OPCODES.LIMIT_OPD_REGISTER, OPCODES.LIMIT_OPD_STACK, );       // Step 2: reg - pop
 *  instructions.bi_div(OPCODES.LIMIT_OPD_REGISTER, OPCODES.LIMIT_OPD_STACK, );       // Step 3: reg / pop
 * 
 *  const values:List = new List(20);
 *  values.set(0, new VMBigInteger('78215411554411000') );
 *  values.set(1, new VMInteger(33) );
 *  values.set(3, new VMBigInteger('9998215411554411000') );
 *  values.set(2, new VMDate('2018/05/14') );
 *  values.set(5, new VMMatrix( [[1,2,3],[4,5,6],[7,8,9]]) );
 * 
 *  const engine = new VM('VM name');
 *  const program = new Program(instructions, 0, 0, values, { stack_size:10 });
 * 
 *  const result:Value = program.run()
 * 
 *  ---->
 *              Stack
 * 
 *  Step 1      BigInteger('78215411554411000')
 *              Integer(45)
 * 
 *              BigInteger(add result)
 * 
 *  Step 2      Integer(33)
 *              BigInteger(add result)
 * 
 *              BigInteger(sub result)
 * 
 *  Step 3      BigInteger(9998215411554411000')
 *              BigInteger(sub result)
 * 
 *              BigInteger(div result)
 * 
 * 
 *  result = BigInteger(pop: div result)
 */
export default class Program {
	// ERRORS
    private _has_error:boolean = false;
    private _error_message:string = '';
    private _error_cursor:i32 = -1;
    private _error_index:i32 = -1;

	// BYTES INSTRUCTIONS
    private _instructions:Instructions;
	
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
    constructor(instructions:Instructions, instructions_start:i32, instructions_size:i32, values:List, options: ProgramOptions){
        // Init instructions
        this._instructions = instructions;

        // Init values registers
        this._value_registers = values;

        // Init values registers stack
        this._value_registers_stack = new Stack(options.stack_size ? options.stack_size : DEFAULT_REGISTERS_STACK_SIZE);

        // Init values stack
        this._value_stack = new Stack(options.stack_size ? options.stack_size : DEFAULT_STACK_SIZE);
    }


    /**
     * Error Management.
     */
    public has_error() : boolean { return this._has_error; }
    public get_error_message() : string { return this._error_message; }
    public get_error_cursor()  : i32 { return this._error_cursor; }
    public get_error_index()   : i32 { return this._error_index; }


    /**
     * Push current context onto the stack.
     */
    push_context():void{
        if ( this._value_registers_stack.is_full() )
        {
            this.error_registers_stack_overflow();
        }

        const size:u32 = this._value_registers.size();
        this._value_registers_stack.push(this._value_registers);
        this._value_registers = new List(size);
    }


    /**
     * Pop previous context from the stack.
     */
    pop_context():void{
        if (this._value_registers_stack.is_empty())
        {
            this.error_registers_stack_underflow();
            return;
        }
        
        this._value_registers = <List>this._value_registers_stack.pop();
    }


    /**
     * Push a value onto the stack.
     * @param value Value to put on the stack.
     */
    push_value(value:Value):void{
        if ( this._value_stack.is_full() )
        {
            this.error_stack_overflow();
            return;
        }
        if (! value) 
        {
            this.error_stack_bad_value();
            return;
        }

        this._value_stack.push(value);
    }

    
    /**
     * Push a value onto the stack.
     * @param value Boolean value to put on the stack.
     */
    push_boolean(value:boolean):void{
        if ( this._value_stack.is_full() )
        {
            this.error_stack_overflow();
            return;
        }

        const v:Value = new Boolean( (value ? 1 : 0) );
        this._value_stack.push(v);
    }


    /**
     * Push a value onto the stack.
     * @param value Boolean value to put on the stack.
     */
    push_integer(value:i32):void{
        if ( this._value_stack.is_full() )
        {
            this.error_stack_overflow();
            return;
        }

        this._value_stack.push( new Integer(value) );
    }


    /**
     * Push a value onto the stack.
     * @param value f64 value to put on the stack.
     */
    push_float(value:f64):void{
        if ( this._value_stack.is_full() )
        {
            this.error_stack_overflow();
            return;
        }

        this._value_stack.push( new Float(value) );
    }


    /**
     * Push a complex value onto the stack.
     * @param real value f64.
     * @param imaginary value f64.
     */
    push_complex(re:f64, im:f64):void{
        if ( this._value_stack.is_full() )
        {
            this.error_stack_overflow();
            return;
        }

        this._value_stack.push( new Complex(re, im) );
    }


    pop_value(): Value {
        if ( this._value_stack.is_empty() )
        {
            return this.error_stack_underflow();
        }
        
        return this._value_stack.pop();
    }
    
    pop_value_available(): boolean {
        return ! this._value_stack.is_empty();
    }
    
    pop_values(count:u32): List|null {
        if ( this._value_stack.size() < i32(count) )
        {
            const error:Error = this.error_stack_underflow();
            return null;
        }
        
        const values:List = new List(count);
        let i = count;
        while(i > 0){
            values.set(count - i, this._value_stack.pop());
            --i;
        }

        return values;
    }


    // Registers
    // unregister_value(index:i32):void {
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

    set_register_value(index:i32, value:Value):void {
        if ( ! this._value_registers.is_valid_index(index) )
        {
            this.error_bad_register_index(index);
            return;
        }
        if (! value) 
        {
            this.error_register_bad_value();
            return;
        }

        const previous_value = this._value_registers.get(index);
        if (previous_value) {
            this.free_value(previous_value)
        }

        this._value_registers.set(index, value);
    }

    get_register_value(index:i32):Value {
        if ( ! this._value_registers.is_valid_index(index) )
        {
            return this.error_bad_register_index(index);
        }

        return this._value_registers.get(index);
    }

    // push_register_value(index:i32):void {
    //     if (index < 0 || index >= this._registers_size)
    //     {
    //         this.error_bad_register_index(index);
    //         return;
    //     }
        
    //     this.push_value( this._registers[index] )
    // }


    // VALUES
    free_value(value:Value):void {
        // TODO ...
    }

    
    // INSTRUCTIONS
	get_instructions():Instructions {
		return this._instructions;
	}


	// CURSOR
    get_entry_point():i32 {
        return 8;
    }
	

	// STATE
    start():void {
        this._is_running = true;
    }

    stop():void {
        this._is_running = false;
    }


    is_running():boolean {
        return this._is_running && (this._instructions.get_cursor() < this._instructions.get_size());
    }

    
    // ERRORS
    error_stack_overflow() {
        this._has_error = true;
        this._error_cursor = this._instructions.get_cursor();
        this._error_message = 'stack overflow: actual size=[' + this._value_stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_stack_underflow():Error {
        this._has_error = true;
        this._error_cursor = this._instructions.get_cursor();
        this._error_message = 'stack underflow: actual size=[' + this._value_stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_registers_stack_overflow():Error {
        this._has_error = true;
        this._error_cursor = this._instructions.get_cursor();
        this._error_message = 'registers stack overflow: actual size=[' + this._value_registers_stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_registers_stack_underflow():Error {
        this._has_error = true;
        this._error_cursor = this._instructions.get_cursor();
        this._error_message = 'registers stack underflow: actual size=[' + this._value_registers_stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_stack_bad_value():Error {
        this._has_error = true;
        this._error_cursor = this._instructions.get_cursor();
        this._error_message = 'program want to push on the stack a bad value';
        return new Error(this._error_cursor, this._error_message);
    }

    error_register_bad_value():Error {
        this._has_error = true;
        this._error_cursor = this._instructions.get_cursor();
        this._error_message = 'program want to register a bad value';
        return new Error(this._error_cursor, this._error_message);
    }

    error_bad_register_index(index:i32):Error {
        this._has_error = true;
        this._error_index = index;
        this._error_cursor = this._instructions.get_cursor();
        this._error_message = 'bad register index [' + index + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_bad_instructions_index(index:i32):Error {
        this._has_error = true;
        this._error_index = index;
        this._error_cursor = this._instructions.get_cursor();
        this._error_message = 'bad instruction index [' + index + ']';
        return new Error(this._error_cursor, this._error_message);
    }
}
