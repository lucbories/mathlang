
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import { Value, Simple, Text, List, Error, Boolean, Integer, Float/*, Complex, BigInteger, BigFloat, BigComplex*/ } from './value';
import OPCODES from './opcodes'
import Program from './program';
import Instructions from './instructions';

function i32(v:i32):i32 { return v; }

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
        let cursor_jump:i32;

        let cursor_tmp_value_1:Value = new Error(-1, 'bad init valu 1');
        let cursor_tmp_value_2:Value = new Error(-1, 'bad init valu 2');

        let cursor_tmp_i32:i32   = 0;
        let cursor_tmp_i32_1:i32 = 0;
        let cursor_tmp_i32_2:i32 = 0;

        let cursor_tmp_f32:f32   = 0.0;

        // let cursor_operands_count:number;

        // let current_value_opds:Value[];
        // let current_i32_opds:i32[];
        // let current_f32_opds:f32[];

        program.start();

        while(running) {

            // GET CURRENT INSTRUCTION
            cursor_instr = instructions.get_instruction(instructions.get_cursor());

            cursor_opcode = cursor_instr.opcode;
            // console.log('cursor opcode', cursor_opcode);

            cursor_type = cursor_instr.optype;
            // console.log('cursor type', cursor_type);
            
            cursor_opd1 = cursor_instr.operand_1;
            // console.log('cursor opd1', cursor_opd1);
            
            cursor_opd2 = cursor_instr.operand_2;
            // console.log('cursor opd2', cursor_opd2);

            cursor_next = cursor_instr.next_index;
            // console.log('cursor next', cursor_next);

            // TODO INLINE FLOATS
            cursor_tmp_i32_1 = i32(cursor_opd1);
            cursor_tmp_i32_2 = i32(cursor_opd2);

            if (i32(cursor_opd1) >= OPCODES.LIMIT_OPD_INLINE) {
                if (i32(cursor_opd1) == OPCODES.LIMIT_OPD_INLINE){
                    if (cursor_type == Value.INTEGER) {
                        cursor_tmp_i32_1 = instructions.get_i32_unsafe(cursor_next);
                        cursor_next += 4;
                    }
                }
                else if (i32(cursor_opd1) == OPCODES.LIMIT_OPD_REGISTER) {
                    cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                    cursor_tmp_value_1 = program.get_register_value(cursor_tmp_i32);
                    if (cursor_type == Value.INTEGER) {
                        cursor_tmp_i32_1 = (<Integer>cursor_tmp_value_1).value;
                        cursor_next += 4;
                    }
                }
                else if (i32(cursor_opd1) == OPCODES.LIMIT_OPD_STACK) {
                    cursor_tmp_value_1 = program.pop_value();
                }
                // else if (i32(cursor_opd1) == OPCODES.LIMIT_OPD_MEMORY) {
                //     cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_1 = program.get_memory_value(cursor_tmp_i32);
                //     cursor_tmp_i32_1 = (<Integer>cursor_tmp_value_1).value;
                // }
            }
            
            if (i32(cursor_opd2) >= OPCODES.LIMIT_OPD_INLINE) {
                if (i32(cursor_opd2) == OPCODES.LIMIT_OPD_INLINE){
                    if (cursor_type == Value.INTEGER) {
                        cursor_tmp_i32_2 = instructions.get_i32_unsafe(cursor_next);
                        cursor_next += 4;
                    }
                }
                else if (i32(cursor_opd2) == OPCODES.LIMIT_OPD_REGISTER) {
                    cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                    cursor_tmp_value_2 = program.get_register_value(cursor_tmp_i32);
                    if (cursor_type == Value.INTEGER) {
                        cursor_tmp_i32_2 = (<Integer>cursor_tmp_value_2).value;
                        cursor_next += 4;
                    }
                }
                else if (i32(cursor_opd2) == OPCODES.LIMIT_OPD_STACK) {
                    cursor_tmp_value_2 = program.pop_value();
                }
                // else if (i32(cursor_opd2) == OPCODES.LIMIT_OPD_MEMORY) {
                //     cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_2 = program.get_memory_value(cursor_tmp_i32);
                //     cursor_tmp_i32_2 = (<Integer>cursor_tmp_value_2).value;
                // }
            }

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
                    program.push_context();
                    break;
                }

                case OPCODES.RETURN:{
                    program.pop_context();
                    break;
                }

                case OPCODES.JUMP:{
                    cursor_jump = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                    instructions.set_cursor(cursor_jump);
                    break;
                }

                case OPCODES.JUMP_IF_TRUE:{
                    // cursor_tmp_value_1 = program.pop_value();

                    if (cursor_tmp_value_1 instanceof Simple) {
                        if (! cursor_tmp_value_1.is_true()) {
                            break;
                        }
                    }

                    cursor_jump = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                    instructions.set_cursor(cursor_jump);
                    break;
                }

                
                // ********** VALUES STACK OPS **********
                case OPCODES.POP_VALUE:{
                    cursor_tmp_value_1 = program.pop_value(); // unused value, free ?
                    break;
                }

                case OPCODES.PUSH_VALUE_REG:{
                    // cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                    cursor_tmp_value_2 = program.get_register_value(cursor_tmp_i32);
                    program.push_value(cursor_tmp_value_2);
                    break;
                };
                
                // case OPCODES.PUSH_VALUE_MEM:{
                //     cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_2 = program.get_memory_value(cursor_tmp_i32);
                //     program.push_value(cursor_tmp_value_2);
                //     break;
                // };


                // ********** VALUES REGISTERS OPS **********
                case OPCODES.REG_VALUE_SET:{
                    cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                    // cursor_tmp_value_2 = program.pop_value();
                    program.set_register_value(cursor_tmp_i32, cursor_tmp_value_2);
                    break;
                }

                case OPCODES.REG_VALUE_GET:{
                    cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                    cursor_tmp_value_2 = program.get_register_value(cursor_tmp_i32);
                    program.push_value(cursor_tmp_value_2);
                    break;
                }


                // ********** VALUES MEMORY OPS **********
                // case OPCODES.MEMORY_SET_VALUE:{
                //     cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_2 = program.pop_value();
                //     program.set_memory_value(cursor_tmp_i32, cursor_tmp_value_2);
                //     break;
                // }

                // case OPCODES.MEMORY_GET_VALUE:{
                //     cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                //     cursor_tmp_value_2 = program.get_memory_value(cursor_tmp_i32);
                //     program.push_value(cursor_tmp_value_2);
                //     break;
                // }


                // ********** QUANTITY UNIT OPS **********
                case OPCODES.U_FROM:{
                    cursor_tmp_value_2 = program.pop_value();
                    // TODO 
                    break;
                }

                case OPCODES.U_TO:{
                    cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : instructions.get_i32_unsafe(cursor_next);
                    cursor_tmp_value_2 = program.pop_value();
                    // TODO 
                    break;
                }

                case OPCODES.U_NORM:{
                    cursor_tmp_value_2 = program.pop_value();
                    // TODO 
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
                    program.push_integer(cursor_tmp_i32_1 ^ (cursor_tmp_i32_2)); // CHECK ?
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
            console.log('cursor', instructions.get_cursor());

            running = (! this.has_error() ) && program.is_running();
        }

        if (this.has_error()) {
            instructions.dump();
            return new Error(this.get_error_cursor(), this.get_error_message());
        }

        if (program.has_error()) {
            instructions.dump();
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
}