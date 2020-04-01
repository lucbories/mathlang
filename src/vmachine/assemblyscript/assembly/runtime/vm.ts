
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import { debug,  debug_fn, dummy, dummy_fn } from './debug';
import { Value, Simple, Text, List, Error, Boolean, Integer, Float/*, Complex, BigInteger, BigFloat, BigComplex*/ } from './value';
import OPCODES from './opcodes'
import Program from './program';
import Instructions from './instructions';

function i32(v:i32):i32 { return v; }

const NO_VALUE_1:Value = new Error(-1, 'bad init valu 1');
const NO_VALUE_2:Value = new Error(-1, 'bad init valu 2');

// const trace = debug('VM');
// const trace_fn = debug_fn('VM');
const trace = dummy;
const trace_fn = dummy;


/**
 * 
 */
export default class VirtualMachine {
    private _has_error:boolean = false;
    private _error_message:string = '';
    private _error_cursor:i32 = 0;
    private _error_opcode:u8 = 0;


    /**
     * VM constructor.
     * 
     * @param _engine_name (string)
     */
    constructor(private _engine_name: string){
    }


    /**
     * Get engine name.
     * 
     * @returns string
     */
    public get_engine_name() : string { return this._engine_name; }


    /**
     * Test if VM has an error.
     * 
     * @returns boolean
     */
    public has_error() : boolean { return this._has_error; }

    /**
     * Get error message.
     * 
     * @returns string
     */
    public get_error_message() : string { return this._error_message; }

    /**
     * Get error cursor index.
     * 
     * @returns i32
     */
    public get_error_cursor() : i32 { return this._error_cursor; }


    /**
     * Main VM loop on program instructions.
     * 
     * @param program (Program)
     * @returns Value
     */
    public run(program: Program) : Value {
        const entry_point:i32 = program.get_entry_point();
        let running = true;

        const instructions:Instructions = program.get_instructions();
        instructions.set_cursor(entry_point);

        let cursor_instr:any;
        let cursor_opcode:u8;
        let cursor_type:u8;
        let cursor_opd1:u8;
        let cursor_opd2:u8;
        let cursor_next:i32;

        let cursor_tmp_value_1:Value = NO_VALUE_1;
        let cursor_tmp_value_2:Value = NO_VALUE_2;

        let cursor_index_i32_1:i32 = 0;
        let cursor_index_i32_2:i32 = 0;

        let cursor_tmp_i32_1:i32 = 0;
        let cursor_tmp_i32_2:i32 = 0;

        let cursor_tmp_f64_1:f32 = 0.0;
        let cursor_tmp_f64_2:f32 = 0.0;

        // let cursor_operands_count:number;

        // let current_value_opds:Value[];
        // let current_i32_opds:i32[];
        // let current_f32_opds:f32[];

        program.start();

        const ds:Function = ()=>{
            return program.dump_stack();
        }

        while(running) {
            trace('main-loop', '---------------------------------------------------');

            trace('main-loop', 'program stack before processing operation');
            trace_fn('main-loop:stack', ds);

            // INIT TMP VALUES
            cursor_tmp_value_1 = NO_VALUE_1;
            cursor_tmp_value_2 = NO_VALUE_2;
            cursor_index_i32_1 = -1;
            cursor_index_i32_2 = -1;
            cursor_tmp_i32_1 = -1;
            cursor_tmp_i32_2 = -1;
            cursor_tmp_f64_1 = -1.0;
            cursor_tmp_f64_2 = -1.0;

            // GET CURRENT INSTRUCTION
            cursor_instr = instructions.get_instruction(instructions.get_cursor());

            cursor_opcode = cursor_instr.opcode;
            trace('main-loop', 'cursor opcode', cursor_opcode);

            cursor_type = cursor_instr.optype;
            trace('main-loop', 'cursor type', cursor_type);
            
            cursor_opd1 = cursor_instr.operand_1;
            trace('main-loop', 'cursor opd1', cursor_opd1);
            
            cursor_opd2 = cursor_instr.operand_2;
            trace('main-loop', 'cursor opd2', cursor_opd2);

            cursor_next = cursor_instr.next_index;
            trace('main-loop', 'cursor next', cursor_next);

            // GET INTEGER OPERANDS
            if (cursor_type == Value.INTEGER) {
                if (cursor_opd1 == OPCODES.LIMIT_OPD_INLINE){
                    cursor_tmp_i32_1 = instructions.get_i32_unsafe(cursor_next);
                    cursor_next += 4;
                }
                else if (cursor_opd1 == OPCODES.LIMIT_OPD_REGISTER) {
                    cursor_index_i32_1 = instructions.get_i32_unsafe(cursor_next);
                    cursor_next += 4;

                    cursor_tmp_value_1 = program.get_register_value(cursor_index_i32_1);
                    cursor_tmp_i32_1 = (<Integer>cursor_tmp_value_1).value;
                }
                else if (cursor_opd1 == OPCODES.LIMIT_OPD_STACK) {
                    cursor_tmp_value_1 = program.pop_value();
                    cursor_tmp_i32_1 = (<Integer>cursor_tmp_value_1).value;
                //} else if (i32(cursor_opd1) == OPCODES.LIMIT_OPD_MEMORY) {
                //     cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_1 = program.get_memory_value(cursor_tmp_i32);
                //     cursor_tmp_i32_1 = (<Integer>cursor_tmp_value_1).value;
                } else {
                    cursor_tmp_i32_1 = cursor_opd1;
                }

                if (cursor_opd2 == OPCODES.LIMIT_OPD_INLINE){
                    cursor_tmp_i32_2 = instructions.get_i32_unsafe(cursor_next);
                    cursor_next += 4;
                }
                else if (cursor_opd2 == OPCODES.LIMIT_OPD_REGISTER) {
                    cursor_index_i32_2 = instructions.get_i32_unsafe(cursor_next);
                    cursor_next += 4;

                    cursor_tmp_value_2 = program.get_register_value(cursor_index_i32_2);
                    cursor_tmp_i32_2 = (<Integer>cursor_tmp_value_2).value;
                }
                else if (cursor_opd2 == OPCODES.LIMIT_OPD_STACK) {
                    cursor_tmp_value_2 = program.pop_value();
                    cursor_tmp_i32_2 = (<Integer>cursor_tmp_value_2).value;
                //} else if (cursor_opd2 == OPCODES.LIMIT_OPD_MEMORY) {
                //     cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_2 = program.get_memory_value(cursor_tmp_i32);
                //     cursor_tmp_i32_2 = (<Integer>cursor_tmp_value_2).value;
                } else {
                    cursor_tmp_i32_2 = cursor_opd2;
                }
            }

            // GET FLOAT OPERANDS
            else if (cursor_type == Value.FLOAT) {
                if (cursor_opd1 == OPCODES.LIMIT_OPD_INLINE){
                    cursor_tmp_f64_1 = instructions.get_f64_unsafe(cursor_next);
                    cursor_next += 4;
                }
                else if (cursor_opd1 == OPCODES.LIMIT_OPD_REGISTER) {
                    cursor_index_i32_1 = instructions.get_i32_unsafe(cursor_next);
                    cursor_next += 4;

                    cursor_tmp_value_1 = program.get_register_value(cursor_index_i32_1);
                    cursor_tmp_f64_1 = (<Float>cursor_tmp_value_1).value;
                }
                else if (cursor_opd1 == OPCODES.LIMIT_OPD_STACK) {
                    cursor_tmp_value_1 = program.pop_value();
                    cursor_tmp_f64_1 = (<Float>cursor_tmp_value_1).value;
                //} else if (cursor_opd1 == OPCODES.LIMIT_OPD_MEMORY) {
                //     cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_1 = program.get_memory_value(cursor_tmp_i32);
                //     cursor_tmp_f64_1 = (<Float>cursor_tmp_value_1).value;
                } else {
                    cursor_tmp_f64_1 = cursor_opd1;
                }

                if (cursor_opd2 == OPCODES.LIMIT_OPD_INLINE){
                    cursor_tmp_f64_2 = instructions.get_f64_unsafe(cursor_next);
                    cursor_next += 4;
                }
                else if (cursor_opd2 == OPCODES.LIMIT_OPD_REGISTER) {
                    cursor_index_i32_2 = instructions.get_i32_unsafe(cursor_next);
                    cursor_next += 4;

                    cursor_tmp_value_2 = program.get_register_value(cursor_index_i32_2);
                    cursor_tmp_f64_2 = (<Float>cursor_tmp_value_2).value;
                }
                else if (cursor_opd2 == OPCODES.LIMIT_OPD_STACK) {
                    cursor_tmp_value_2 = program.pop_value();
                    cursor_tmp_f64_2 = (<Float>cursor_tmp_value_2).value;
                //} else if (cursor_opd2 == OPCODES.LIMIT_OPD_MEMORY) {
                //     cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_2 = program.get_memory_value(cursor_tmp_i32);
                //     cursor_tmp_f64_2 = (<Float>cursor_tmp_value_2).value;
                } else {
                    cursor_tmp_f64_2 = cursor_opd2;
                }
            }

            trace('main-loop', 'cursor_index_i32_1', cursor_index_i32_1);
            trace('main-loop', 'cursor_index_i32_2', cursor_index_i32_2);
            trace('main-loop', 'cursor_tmp_i32_1', cursor_tmp_i32_1);
            trace('main-loop', 'cursor_tmp_i32_2', cursor_tmp_i32_2);
            trace('main-loop', 'cursor_tmp_f64_1', cursor_tmp_f64_1);
            trace('main-loop', 'cursor_tmp_f64_2', cursor_tmp_f64_2);
            trace('main-loop', 'cursor_tmp_value_1.type', cursor_tmp_value_1.type);
            trace('main-loop', 'cursor_tmp_value_1', cursor_tmp_value_1);
            trace('main-loop', 'cursor_tmp_value_2.type', cursor_tmp_value_2.type);
            trace('main-loop', 'cursor_tmp_value_2', cursor_tmp_value_2);

            switch(cursor_opcode) {

                // ********** PROGRAM TERMINATION **********
                case OPCODES.EXIT:{
                    program.stop();
                    break;
                }
                
                case OPCODES.TRAP:{
                    // TODO PUSH CONTEXT ON STACK
                    program.stop();
                    break;
                }


                // ********** CODE CONTROL **********
                case OPCODES.CALL:{
                    trace('main-loop:CALL', 'call, push context');
                    program.push_context();
                    break;
                }

                case OPCODES.RETURN:{
                    trace('main-loop:RETURN', 'return, pop context');
                    program.pop_context();
                    break;
                }

                case OPCODES.JUMP:{
                    cursor_next = cursor_tmp_i32_1;
                    trace('main-loop:JUMP', 'cursor next after jump', cursor_next);
                    break;
                }

                case OPCODES.JUMP_IF_TRUE:{
                    trace('main-loop:JUMP_IF_TRUE', 'jump if true');
                    if (cursor_tmp_value_1 instanceof Simple) {
                        if (! cursor_tmp_value_1.is_true()) {
                            break;
                        }
                    }

                    cursor_next = cursor_tmp_i32_2;
                    break;
                }

                case OPCODES.JUMP_IF_EQUAL:{
                    trace('main-loop:JUMP_IF_EQUAL', 'jump if equal');
                    if (cursor_tmp_value_1 instanceof Simple) {
                        if (! cursor_tmp_value_1.is_true()) {
                            break;
                        }
                    }

                    cursor_next = cursor_tmp_i32_2;
                    break;
                }

                
                // ********** VALUES STACK OPS **********
                case OPCODES.POP_VALUE:{
                    trace('main-loop:POP_VALUE', 'pop value');
                    cursor_tmp_value_1 = program.pop_value(); // unused value, free ?
                    break;
                }

                case OPCODES.PUSH_VALUE_REG:{
                    trace('main-loop:PUSH_VALUE_REG', 'push value from register');
                    cursor_tmp_value_2 = program.get_register_value(cursor_tmp_i32_1);
                    program.push_value(cursor_tmp_value_2);
                    break;
                };
                
                // case OPCODES.PUSH_VALUE_MEM:{
                //     cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_2 = program.get_memory_value(cursor_tmp_i32);
                //     program.push_value(cursor_tmp_value_2);
                //     break;
                // };

                case OPCODES.PUSH_VALUE:{
                    cursor_tmp_value_1 = NO_VALUE_1;
                    trace('main-loop:PUSH_VALUE', 'cursor_type', cursor_type);
                    switch(cursor_type){
                        case Value.BOOLEAN:{
                            cursor_tmp_value_1 = new Boolean(cursor_tmp_i32_1 > 0 ? 1 : 0);
                            break;
                        }
                        case Value.INTEGER:{
                            trace('main-loop:PUSH_VALUE', 'cursor_tmp_i32_1', cursor_tmp_i32_1);
                            cursor_tmp_value_1 = new Integer(cursor_tmp_i32_1);
                            break;
                        }
                        // case Value.FLOAT:{
                        //     cursor_tmp_value_1 = new Float(cursor_tmp_f64_1);
                        //     break;
                        // }
                    }
                    if (cursor_tmp_value_1){
                        program.push_value(cursor_tmp_value_1);
                        trace('main-loop:PUSH_VALUE', 'stack has value ?', program.pop_value_available());
                    } else {
                        trace('main-loop:PUSH_VALUE', 'no value');
                        this.error_bad_value(cursor_opcode, instructions.get_cursor());
                    }
                    break;
                };


                // ********** VALUES REGISTERS OPS **********
                case OPCODES.REG_VALUE_SET:{
                    cursor_tmp_i32_1 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                    // cursor_tmp_value_2 = program.pop_value();
                    program.set_register_value(cursor_tmp_i32_1, cursor_tmp_value_2);
                    break;
                }

                case OPCODES.REG_VALUE_GET:{
                    cursor_tmp_i32_1 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                    cursor_tmp_value_2 = program.get_register_value(cursor_tmp_i32_1);
                    program.push_value(cursor_tmp_value_2);
                    break;
                }


                // ********** VALUES MEMORY OPS **********
                case OPCODES.MEMORY_SET_VALUE:{
                //     cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_2 = program.pop_value();
                //     program.set_memory_value(cursor_tmp_i32, cursor_tmp_value_2);
                    this.error_not_implented(instructions.get_cursor(), cursor_opcode);
                    break;
                }

                case OPCODES.MEMORY_GET_VALUE:{
                //     cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_2 = program.get_memory_value(cursor_tmp_i32);
                //     program.push_value(cursor_tmp_value_2);
                    this.error_not_implented(instructions.get_cursor(), cursor_opcode);
                    break;
                }


                // ********** QUANTITY UNIT OPS **********
                case OPCODES.U_FROM:{
                    // cursor_tmp_value_2 = program.pop_value();
                    // TODO 
                    this.error_not_implented(instructions.get_cursor(), cursor_opcode);
                    break;
                }

                case OPCODES.U_TO:{
                    // cursor_tmp_i32_1 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                    // cursor_tmp_value_2 = program.pop_value();
                    // TODO 
                    this.error_not_implented(instructions.get_cursor(), cursor_opcode);
                    break;
                }

                case OPCODES.U_NORM:{
                    // cursor_tmp_value_2 = program.pop_value();
                    // TODO 
                    this.error_not_implented(instructions.get_cursor(), cursor_opcode);
                    break;
                }


                // ********** INTEGER OPS **********
                case OPCODES.I_EQUAL:{
                    program.push_boolean(cursor_tmp_i32_1 == cursor_tmp_i32_2);
                    break;
                }

                case OPCODES.I_ADD:{
                    program.push_integer(cursor_tmp_i32_1 + cursor_tmp_i32_2);
                    break;
                }

                case OPCODES.I_SUB:{
                    program.push_integer(cursor_tmp_i32_1 - cursor_tmp_i32_2);
                    break;
                }

                case OPCODES.I_MUL:{
                    program.push_integer(cursor_tmp_i32_1 * cursor_tmp_i32_2);
                    break;
                }

                case OPCODES.I_DIV:{
                    const denominator:i32 = cursor_tmp_i32_2 == 0 ? 1 : cursor_tmp_i32_2;
                    const r:f32 = cursor_tmp_i32_1 / denominator;
                    cursor_tmp_i32_2 = Math.floor(r);
                    program.push_integer(cursor_tmp_i32_2);
                    break;
                }

                case OPCODES.I_POW:{
                    if (cursor_tmp_i32_2 > 50){
                        // ERROR ????
                        cursor_tmp_i32_2 = 1;
                    }
                    program.push_integer( Math.pow(cursor_tmp_i32_1, cursor_tmp_i32_2) );
                    break;
                }

                case OPCODES.I_IS_TRUE:{
                    program.push_boolean(cursor_tmp_i32_1 > 0);
                    break;
                }

                case OPCODES.I_IS_POSITIVE:{
                    program.push_boolean(cursor_tmp_i32_1 > 0);
                    break;
                }

                case OPCODES.I_IS_ZERO:{
                    program.push_boolean(cursor_tmp_i32_1 == 0);
                    break;
                }

                case OPCODES.I_NEG:{
                    program.push_integer(cursor_tmp_i32_1 * -1);
                    break;
                }

                case OPCODES.I_LT:{
                    program.push_boolean(cursor_tmp_i32_1 < cursor_tmp_i32_2);
                    break;
                }

                case OPCODES.I_GT:{
                    program.push_boolean(cursor_tmp_i32_1 > cursor_tmp_i32_2);
                    break;
                }

                case OPCODES.I_LE:{
                    program.push_boolean(cursor_tmp_i32_1 <= cursor_tmp_i32_2);
                    break;
                }

                case OPCODES.I_GE:{
                    program.push_boolean(cursor_tmp_i32_1 >= cursor_tmp_i32_2);
                    break;
                }


                // ********** DEFAULT ERROR **********
                default:{
                    this.error_bad_opcode(instructions.get_cursor(), cursor_opcode);
                    break;
                }
            }

            instructions.set_cursor(cursor_next);

            trace('main-loop', 'program stack after processing operation');
            trace_fn('main-loop', ds);

            running = (! this.has_error() ) && (! program.has_error()) && program.is_running();
        }

        if (this.has_error()) {
            // instructions.dump();
            // console.log('program stack dump', program.dump_stack() );
            return new Error(this.get_error_cursor(), this.get_error_message());
        }

        if (program.has_error()) {
            // instructions.dump();
            // console.log('program stack dump', program.dump_stack() );
            this._has_error = true;
            this._error_cursor = program.get_error_cursor();
            this._error_message = program.get_error_message();
            return new Error(program.get_error_cursor(), program.get_error_message());
        }

        if (program.pop_value_available()) {
            return program.pop_value();
        }

        return new Error(0, 'no result');
    }

    private  error_bad_opcode(cursor:i32, opcode:u8):void {
        this._has_error = true;
        this._error_cursor = cursor;
        this._error_opcode = opcode;
        this._error_message = 'unknow opcode';
    }

    private  error_bad_value(cursor:i32, opcode:u8):void {
        this._has_error = true;
        this._error_cursor = cursor;
        this._error_opcode = opcode;
        this._error_message = 'bad value';
    }

    private  error_not_implented(cursor:i32, opcode:u8):void {
        this._has_error = true;
        this._error_cursor = cursor;
        this._error_opcode = opcode;
        this._error_message = 'not implemented';
    }
}