
/// <reference path="../../../../../node_modules/assemblyscript/std/portable/index.d.ts" />

import OPCODES from './opcodes'
import Program from './program';
import { Value, Simple, Text, List, Error, Boolean, Integer, Float/*, Complex, BigInteger, BigFloat, BigComplex*/ } from './value';
import Instructions from './instructions';

function i32(v:i32):i32 { return v; }

/**
 * 
            // u8 < 250: one small constant
            // u8 = 250: get operand from stack
            // u8 = 251: more than 2 operands, trigger for next u32
            // u8 = 253: one inline u32 value in next u32
            // u8 = 254: one inline i32 value in next u32
            // u8 = 255: one inline f32 value in next u32
 */
export default class VirtualMachine {
    private _has_error:boolean = false;
    private _error_message:string = '';
    private _error_cursor:u32 = 0;
    private _error_opcode:u8 = 0;

    constructor(private _engine_name: string){
    }

    public get_engine_name() : string { return this._engine_name; }

    public has_error() : boolean { return this._has_error; }
    public get_error_message() : string { return this._error_message; }
    public get_error_cursor() : u32 { return this._error_cursor; }

    public run(program: Program) : Value {
        const entry_point:u32 = program.get_entry_point();
        let running = true;

        program.set_cursor(entry_point);

        const instructions:Instructions = program.get_instructions();

        let cursor_instr:any;
        let cursor_opcode:u8;
        let cursor_type:u8;
        let cursor_opd1:u8;
        let cursor_opd2:u8;
        let cursor_next:i32;

        let cursor_jump:i32;
        let cursor_tmp_value:Value;
        let cursor_tmp_value_2:Value;
        // let cursor_tmp_u32:u32;
        let cursor_tmp_i32:i32;
        let cursor_tmp_i32_1:i32;
        let cursor_tmp_i32_2:i32;
        let cursor_tmp_f32:f32;

        // let cursor_operands_count:number;

        // let current_value_opds:Value[];
        // let current_i32_opds:i32[];
        // let current_u32_opds:u32[];
        // let current_f32_opds:f32[];

        program.start();

        while(running) {

            // GET CURRENT INSTRUCTION
            cursor_instr = instructions.get_instruction(instructions.get_cursor());

            cursor_opcode = cursor_instr.opcode;
            // console.log('cursor opcode', cursor_opcode);

            cursor_type = cursor_instr.opd_type;
            // console.log('cursor type', cursor_type);
            
            cursor_opd1 = cursor_instr.operand_1;
            // console.log('cursor opd1', cursor_opd1);
            
            cursor_opd2 = cursor_instr.operqnd_2;
            // console.log('cursor opd2', cursor_opd2);

            cursor_next = cursor_instr.next_index;

            
            cursor_tmp_i32_1 = i32(cursor_opd1);
            cursor_tmp_i32_2 = i32(cursor_opd2);

            if (i32(cursor_opd1) >= OPCODES.LIMIT_OPD_INLINE) {
                if (i32(cursor_opd1) == OPCODES.LIMIT_OPD_INLINE){
                    cursor_tmp_i32_1 = instructions.get_i32_unsafe(cursor_next);
                }
                else if (i32(cursor_opd1) == OPCODES.LIMIT_OPD_REGISTER) {
                    cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                    cursor_tmp_value = program.get_register_value(cursor_tmp_i32);
                    cursor_tmp_i32_1 = (<Integer>cursor_tmp_value).value;
                }
                else if (i32(cursor_opd1) == OPCODES.LIMIT_OPD_MEMORY) {
                    cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                    cursor_tmp_value = program.get_memory_value(cursor_tmp_i32);
                    cursor_tmp_i32_1 = (<Integer>cursor_tmp_value).value;
                }
            }
            
            if (i32(cursor_opd2) >= OPCODES.LIMIT_OPD_INLINE) {
                if (i32(cursor_opd2) == OPCODES.LIMIT_OPD_INLINE){
                    cursor_tmp_i32_2 = instructions.get_i32_unsafe(cursor_next);
                }
                else if (i32(cursor_opd2) == OPCODES.LIMIT_OPD_REGISTER) {
                    cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                    cursor_tmp_value = program.get_register_value(cursor_tmp_i32);
                    cursor_tmp_i32_2 = (<Integer>cursor_tmp_value).value;
                }
                else if (i32(cursor_opd2) == OPCODES.LIMIT_OPD_MEMORY) {
                    cursor_tmp_i32 = instructions.get_i32_unsafe(cursor_next);
                    cursor_tmp_value = program.get_memory_value(cursor_tmp_i32);
                    cursor_tmp_i32_2 = (<Integer>cursor_tmp_value).value;
                }
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
                    cursor_jump = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : program.get_cursor_u32_and_move();
                    program.move_cursor(cursor_jump);
                    break;
                }

                case OPCODES.JUMP_IF_TRUE:{
                    cursor_tmp_value = program.pop_value();

                    if (cursor_tmp_value instanceof Simple) {
                        if (! cursor_tmp_value.is_true()) {
                            break;
                        }
                    }

                    cursor_jump = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : program.get_cursor_u32_and_move();
                    program.move_cursor(cursor_jump);
                    break;
                }

                
                // ********** VALUES STACK OPS **********
                case OPCODES.POP_VALUE:{
                    cursor_tmp_value = program.pop_value(); // unused value, free ?
                    break;
                }

                case OPCODES.PUSH_VALUE_REG:{
                    cursor_tmp_i32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? i32(cursor_opd1) : program.get_cursor_u32_and_move();
                    cursor_tmp_value = program.get_register_value(cursor_tmp_u32);
                    program.push_value(cursor_tmp_value);
                    break;
                };
                
                case OPCODES.PUSH_VALUE_MEM:{
                    cursor_tmp_u32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32_and_move();
                    cursor_tmp_value = program.get_memory_value(cursor_tmp_u32);
                    program.push_value(cursor_tmp_value);
                    break;
                };


                // ********** VALUES REGISTERS OPS **********
                case OPCODES.REG_VALUE_SET:{
                    cursor_tmp_u32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32_and_move();
                    cursor_tmp_value = program.pop_value();
                    program.set_register_value(cursor_tmp_u32, cursor_tmp_value);
                    break;
                }

                case OPCODES.REG_VALUE_GET:{
                    cursor_tmp_u32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32_and_move();
                    cursor_tmp_value = program.get_register_value(cursor_tmp_u32);
                    program.push_value(cursor_tmp_value);
                    break;
                }


                // ********** VALUES MEMORY OPS **********
                case OPCODES.MEMORY_SET_VALUE:{
                    cursor_tmp_u32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32_and_move();
                    cursor_tmp_value = program.pop_value();
                    program.set_memory_value(cursor_tmp_u32, cursor_tmp_value);
                    break;
                }

                case OPCODES.MEMORY_GET_VALUE:{
                    cursor_tmp_u32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32_and_move();
                    cursor_tmp_value = program.get_memory_value(cursor_tmp_u32);
                    program.push_value(cursor_tmp_value);
                    break;
                }


                // ********** QUANTITY UNIT OPS **********
                case OPCODES.U_FROM:{
                    cursor_tmp_value = program.pop_value();
                    // TODO 
                    break;
                }

                case OPCODES.U_TO:{
                    cursor_tmp_u32 = i32(cursor_opd1) < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32_and_move();
                    cursor_tmp_value = program.pop_value();
                    // TODO 
                    break;
                }

                case OPCODES.U_NORM:{
                    cursor_tmp_value = program.pop_value();
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
                    program.push_integer(cursor_tmp_i32_1 / (cursor_tmp_i32_2 == 0 ? 1 : cursor_tmp_i32_2) ); // ERROR ?
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
                    this.error_bad_opcode(program.get_cursor(), cursor_opcode);
                    break;
                }
            }

            running = program.is_running();
        }

        if (this.has_error()) {
            return new Error(this.get_error_cursor(), this.get_error_message());
        }

        if (program.has_error()) {
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

    // private get_operand(operands:IValue[], index:number): IValue {
    //     if (operands) {
    //         if ( operands.length > index && operands[index])
    //         {
    //             return operands[index];
    //         }
    //     }
    //     return undefined
    // }

    // private get_operand_number(operands:IValue[], index:number): number {
    //     if (operands) {
    //         if ( operands.length > index && operands[index] )
    //         {
    //             return operands[index].to_number();
    //         }
    //     }
    //     return undefined
    // }

    // private error_bad_operand(cursor:number) {
    //     this._has_error = true;
    //     this._error_cursor = cursor;
    //     this._error_message = 'undefined or null operand';
    // }

    // private error_bad_instruction(cursor:number) {
    //     this._has_error = true;
    //     this._error_cursor = cursor;
    //     this._error_message = 'undefined or null instruction';
    // }

    private error_bad_opcode(cursor:u32, opcode:u8):void {
        this._has_error = true;
        this._error_cursor = cursor;
        this._error_opcode = opcode;
        this._error_message = 'unknow opcode';
    }
}