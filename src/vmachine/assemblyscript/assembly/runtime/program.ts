
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import ProgramOptions from './program_options';
import { Value, Text, List, Stack, Error, Null, Boolean, Integer, Float, Complex/*, BigInteger, BigFloat, BigComplex*/ } from './value';
import Scope from './scope';


const DEFAULT_STACK_SIZE:u32 = 50;
const DEFAULT_REGISTERS_STACK_SIZE:u32 = 50;
const DEFAULT_REGISTERS_SIZE:u32 = 50;

function i32(v:i32):i32 { return v; }

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
export default class Program {
    private _has_error:boolean = false;
    private _error_message:string = '';
    private _error_cursor:u32 = -1;

    private _registers:List;
    private _registers_stack:Stack;
    private _stack:Stack;
    private _cursor:u32 = 0;

    private _is_running:boolean = false;

    constructor(private _scope: Scope, options: ProgramOptions){
        // Init registers
        this._registers = new List(options.registers ? options.registers: DEFAULT_REGISTERS_SIZE);

        // Init registers stack
        this._registers_stack = new Stack(options.stack ? options.stack : DEFAULT_REGISTERS_STACK_SIZE);

        // Init stack
        this._stack = new Stack(options.stack ? options.stack : DEFAULT_STACK_SIZE);
    }

    // Error
    public has_error() : boolean { return this._has_error; }
    public get_error_message() : string { return this._error_message; }
    public get_error_cursor() : u32 { return this._error_cursor; }


    /**
     * Push current context onto the stack.
     */
    push_context():void{
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
    pop_context():void{
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
    push_value(value:Value):void{
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


    /**
     * Push a value onto the stack.
     * @param value Boolean value to put on the stack.
     */
    push_boolean(value:boolean):void{
        if ( this._stack.is_full() )
        {
            this.error_stack_overflow();
            return;
        }

        this._stack.push( new Boolean( u8(value ? 1 : 0) ) );
    }


    /**
     * Push a value onto the stack.
     * @param value Boolean value to put on the stack.
     */
    push_integer(value:i32):void{
        if ( this._stack.is_full() )
        {
            this.error_stack_overflow();
            return;
        }

        this._stack.push( new Integer(value) );
    }


    /**
     * Push a value onto the stack.
     * @param value Boolean value to put on the stack.
     */
    push_float(value:f32):void{
        if ( this._stack.is_full() )
        {
            this.error_stack_overflow();
            return;
        }

        this._stack.push( new Float(value) );
    }


    /**
     * Push a value onto the stack.
     * @param value Boolean value to put on the stack.
     */
    push_complex(re:f32, im:f32):void{
        if ( this._stack.is_full() )
        {
            this.error_stack_overflow();
            return;
        }

        this._stack.push( new Complex(re, im) );
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
    
    pop_values(count:u32): List|null {
        if ( this._stack.size() < i32(count) )
        {
            const error:Error = this.error_stack_underflow();
            return null;
        }
        
        const values:List = new List(count);
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


    // MEMORY
    set_memory_value(index:u32, value:Value):void { // TODO
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

    get_memory_value(index:u32):Value { // TODO
        if ( ! this._registers.is_valid_index(index) )
        {
            return this.error_bad_register_index(index);
        }

        return this._registers.get(index);
    }


    // Values
    free_value(value:Value):void { // TODO
    }


    // Instructions
    // add_instruction(index:u32, instr:u8, opd1:u8, opd2:u8, opd3:u8):void|Error {
    //     if (index < 0 || index >= this._scope.instructions.length)
    //     {
    //         return this.error_bad_instructions_index(index);
    //     }
    //     this._scope.instructions[index] = instr;
    //     this._scope.instructions[index+1] = opd1;
    //     this._scope.instructions[index+2] = opd2;
    //     this._scope.instructions[index+3] = opd3;
    // }
    
    set_instruction(index:u32, instr:u8, opd1:u8, opd2:u8, opd3:u8):Error|null {
        if (index < 0 || i32(index) >= this._scope.instructions.length)
        {
            return this.error_bad_instructions_index(index);
        }
        this._scope.instructions[index] = instr;
        this._scope.instructions[index+1] = opd1;
        this._scope.instructions[index+2] = opd2;
        this._scope.instructions[index+3] = opd3;
        return null;
    }

    set_instruction_i32(index:u32, opd1:i32):Error|null {
        if (index < 0 || i32(index) + 3 >= this._scope.instructions.length)
        {
            return this.error_bad_instructions_index(index);
        }
        const buffer = this._scope.instructions.buffer;
        const dv = new DataView(buffer);
        dv.setInt32(index, opd1, false);
        // this._scope.instructions[index] = opd1 << 1;
        // this._scope.instructions[index+1] = opd1 << 2;
        // this._scope.instructions[index+2] = opd1 << 3;
        // this._scope.instructions[index+3] = opd1 << 4;
        return null;
    }
    // add_instruction(instruction:Instruction, label?:string):void {
    //     this.set_instruction(this._instructions_count, instruction, label);
    //     ++this._instructions_count;
    // }

    // free_instruction(instruction:Instruction) {
    //     // ...
    // }


    get_entry_point() : u32 {
        // if (this._instructions_entry_label) {
        //     const index = this._instructions_labels.get(this._instructions_entry_label)
        //     if (index) {
        //         return index
        //     }
        // }
        return 0;
    }

    set_cursor(index:u32):void {
        if (index < 0 || i32(index) >= this._scope.instructions.length)
        {
            this.error_bad_instructions_index(index);
            return;
        }

        this._cursor = index;
    }

    get_cursor():u32 {
        return this._cursor;
    }

    move_cursor(index:u32):void {
        const new_cursor = this._cursor + index
        if (new_cursor < 0 || i32(new_cursor) >= this._scope.instructions.length)
        {
            this.error_bad_instructions_index(new_cursor);
            return;
        }

        this._cursor = new_cursor;
    }

    move_next_unsafe():void {
        this._cursor++;
    }

    get_cursor_u8_and_move(): u8 {
        if (this._cursor < 0 || i32(this._cursor) >= this._scope.instructions.length)
        {
            this.error_bad_instructions_index(this._cursor);
            return 0;
        }
        
        return this._scope.instructions[this._cursor++];
    }

    get_cursor_u32_and_move(): u32 {
        if (this._cursor < 0 || i32(this._cursor) + 3 >= this._scope.instructions.length)
        {
            this.error_bad_instructions_index(this._cursor + 3);
            return 0;
        }
        
        const buffer = this._scope.instructions.buffer;
        const dv = new DataView(buffer);
        const v = dv.getUint32(this._cursor, false);
        this._cursor += 4;
        return v;

        // const u8_1 = this._scope.instructions[this._cursor++];
        // const u8_2 = this._scope.instructions[this._cursor++];
        // const u8_3 = this._scope.instructions[this._cursor++];
        // const u8_4 = this._scope.instructions[this._cursor++];
        // const u32_combined:u32 = 2**32*u8_1 + 2**24*u8_2 + 2**16*u8_3 + u8_4;
        // return u32_combined;
    }

    get_cursor_i32_and_move(): i32 {
        if (this._cursor < 0 || i32(this._cursor) + 3 >= this._scope.instructions.length)
        {
            this.error_bad_instructions_index(this._cursor + 3);
            return 0;
        }
        
        const buffer = this._scope.instructions.buffer;
        const dv = new DataView(buffer);
        const v = dv.getInt32(this._cursor, false);
        this._cursor += 4;
        return v;
        // const u8_1 = this._scope.instructions[this._cursor++];
        // const u8_2 = this._scope.instructions[this._cursor++];
        // const u8_3 = this._scope.instructions[this._cursor++];
        // const u8_4 = this._scope.instructions[this._cursor++];
        // const i32_combined:i32 = <i32> (2**32*u8_1 + 2**24*u8_2 + 2**16*u8_3 + u8_4);
        // return i32_combined;
    }

    get_cursor_f32_and_move(): f32 {
        if (this._cursor < 0 || i32(this._cursor) + 3 >= this._scope.instructions.length)
        {
            this.error_bad_instructions_index(this._cursor + 3);
            return 0;
        }
        
        const buffer = this._scope.instructions.buffer;
        const dv = new DataView(buffer);
        const v = dv.getFloat32(this._cursor, false);
        this._cursor += 4;
        return v;
        // const u8_1 = this._scope.instructions[this._cursor++];
        // const u8_2 = this._scope.instructions[this._cursor++];
        // const u8_3 = this._scope.instructions[this._cursor++];
        // const u8_4 = this._scope.instructions[this._cursor++];
        // const f32_combined:f32 = <f32> (2**32*u8_1 + 2**24*u8_2 + 2**16*u8_3 + u8_4);
        // return f32_combined;
    }

    start():void {
        this._is_running = true;
    }

    stop():void {
        this._is_running = false;
    }

    is_running():boolean {
        return this._is_running && (i32(this._cursor) < this._scope.instructions.length);
    }

    
    // Errors
    error_stack_overflow():Error {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'stack overflow: actual size=';
        // this._error_message = 'stack overflow: actual size=[' + this._stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_stack_underflow():Error {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'stack underflow: actual size=';
        // this._error_message = 'stack underflow: actual size=[' + this._stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_registers_stack_overflow():Error {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'registers stack overflow: actual size=';
        // this._error_message = 'registers stack overflow: actual size=[' + this._registers_stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_registers_stack_underflow():Error {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'registers stack underflow: actual size=';
        // this._error_message = 'registers stack underflow: actual size=[' + this._registers_stack.size() + ']';
        return new Error(this._error_cursor, this._error_message);
    }

    error_stack_bad_value():Error {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'program want to push on the stack a bad value';
        return new Error(this._error_cursor, this._error_message);
    }

    error_register_bad_value():Error {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'program want to register a bad value';
        return new Error(this._error_cursor, this._error_message);
    }

    error_bad_register_index(index:u32):Error {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'bad register index';
        return new Error(this._error_cursor, this._error_message);
    }

    error_bad_instructions_index(index:u32):Error {
        this._has_error = true;
        this._error_cursor = this._cursor;
        this._error_message = 'bad instruction index';
        return new Error(this._error_cursor, this._error_message);
    }
}