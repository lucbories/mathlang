import OPCODES from './opcodes'
import Program from './program';
import EvalInstruction from './eval_instruction';
import { Value, Simple, Text, List, Error } from './value';

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
    private _error_cursor:number = -1;

    constructor(private _engine_name: string){
    }

    public get_engine_name() : string { return this._engine_name; }

    public has_error() : boolean { return this._has_error; }
    public get_error_message() : string { return this._error_message; }
    public get_error_cursor() : number { return this._error_cursor; }

    public run(program: Program) : Value {
        const entry_point:u32 = program.get_entry_point();
        let running = true;

        program.set_cursor(entry_point);


        let cursor_opcode:u8;
        let cursor_type:u8;
        let cursor_opd1:u8;
        let cursor_opd2:u8;
        let cursor_jump:u32;
        let cursor_tmp_value:Value;
        let cursor_tmp_u32:u32;
        let cursor_tmp_i32:u32;
        let cursor_tmp_f32:u32;

        // let cursor_operands_count:number;

        // let current_value_opds:Value[];
        // let current_i32_opds:i32[];
        // let current_u32_opds:u32[];
        // let current_f32_opds:f32[];

        program.start();

        while(running) {
            // GET CURRENT INSTRUCTION
            cursor_opcode = program.get_cursor_u8();
            // console.log('cursor opcode', cursor_opcode);

            program.move_next_unsafe();
            cursor_type = program.get_cursor_u8();
            // console.log('cursor type', cursor_type);
            
            program.move_next_unsafe();
            cursor_opd1 = program.get_cursor_u8();
            // console.log('cursor opd1', cursor_opd1);
            
            program.move_next_unsafe();
            cursor_opd2 = program.get_cursor_u8();
            // console.log('cursor opd2', cursor_opd2);
            
            switch(cursor_opcode) {
                // TERMINATION OPS
                case OPCODES.EXIT:{
                    program.stop();
                    break;
                }

                // JUMP OPS
                case OPCODES.JUMP:{
                    cursor_jump = cursor_opd1 < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32();
                    program.set_cursor(cursor_jump);
                    break;
                }
                case OPCODES.JUMP_IF_TRUE:{
                    cursor_tmp_value = program.pop_value();

                    if (cursor_tmp_value instanceof Simple) {
                        if (cursor_tmp_value.is_true()) {
                            program.move_cursor(1);
                        }
                        break;
                    }

                    cursor_jump = cursor_opd1 < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32();
                    program.move_cursor(cursor_jump);
                    break;
                }

                // CONTEXT STACK
                case OPCODES.CALL:{
                    program.push_context();
                    program.move_cursor(1);
                    break;
                }
                // case OPCODES['CALL_LEAVE']:{
                //     program.pop_context();
                //     program.move_cursor(1);
                //     break;
                // }

                // VALUES STACK OPS
                case OPCODES.POP_VALUE:{
                    cursor_tmp_value = program.pop_value(); // unused value, free ?
                    program.move_cursor(1);
                    break;
                }
                case OPCODES.PUSH_VALUE:{
                    cursor_tmp_u32 = cursor_opd1 < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32();
                    cursor_tmp_value = program.get_register_value(cursor_tmp_u32);
                    program.push_value(cursor_tmp_value);
                    program.move_cursor(1);
                    break;
                };

                // VALUES REGISTERS OPS
                case OPCODES.REG_VALUE_SET:{
                    cursor_tmp_u32 = cursor_opd1 < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32();
                    cursor_tmp_value = program.pop_value();
                    program.set_register_value(cursor_tmp_u32, cursor_tmp_value);
                    program.move_cursor(1);
                    break;
                }
                case OPCODES.REG_VALUE_GET:{
                    cursor_tmp_u32 = cursor_opd1 < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32();
                    cursor_tmp_value = program.get_register_value(cursor_tmp_u32);
                    program.push_value(cursor_tmp_value);
                    program.move_cursor(1);
                    break;
                }

                // BYTE MEMORY OPS
                case OPCODES.MEMORY_SET_VALUE:{
                    cursor_number_1 = cursor_instruction.get_inline_number_1();
                    cursor_value = this.get_operand(cursor_operands, 0);
                    program.register_value(cursor_number_1, cursor_value);
                    program.move_cursor(1);
                    break;
                }
                case OPCODES.MEMORY_GET_VALUE:{
                    cursor_tmp_u32 = cursor_opd1 < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32();
                    cursor_tmp_value = program._scope.get_value_at(cursor_tmp_u32);
                    program.push_value(cursor_tmp_value);
                    program.move_cursor(1);
                    break;
                }

                // DEFAULT ERROR
                defautl:{
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

        return 0;
    }

    private get_operand(operands:IValue[], index:number): IValue {
        if (operands) {
            if ( operands.length > index && operands[index])
            {
                return operands[index];
            }
        }
        return undefined
    }

    private get_operand_number(operands:IValue[], index:number): number {
        if (operands) {
            if ( operands.length > index && operands[index] )
            {
                return operands[index].to_number();
            }
        }
        return undefined
    }

    private error_bad_operand(cursor:number) {
        this._has_error = true;
        this._error_cursor = cursor;
        this._error_message = 'undefined or null operand';
    }

    private error_bad_instruction(cursor:number) {
        this._has_error = true;
        this._error_cursor = cursor;
        this._error_message = 'undefined or null instruction';
    }

    private error_bad_opcode(cursor:number, opcode:number) {
        this._has_error = true;
        this._error_cursor = cursor;
        this._error_message = 'unknow opcode:[' + opcode + ']';
    }
}