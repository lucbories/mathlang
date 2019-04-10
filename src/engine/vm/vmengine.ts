import IValue from '../../core/ivalue';
import IInstruction from '../../core/iinstruction';
import { OPCODES } from '../../core/iinstruction';

import VMProgram from './vmprogram';
import VMError from './vmerror';


/**
 * VMEngine class is the runtime of VMPrograms.
 * 
 * @example
 *      const engine:VMEngine = new VMEngine('myengine');
 *      const program:VMProgram = ...
 *      const result:IValue = engine.run(program);
 *      if (result) {
 *         console.log('program successes with result', result.to_string());
 *      } else {
 *         console.log('program fails', program.get_error_message(), program.get_error_cursor());
 *      }
 */
export default class VMEngine {
    private _has_error:boolean = false;
    private _error_message:string = undefined;
    private _error_cursor:number = undefined;

    constructor(private _engine_name: string){
    }

    public get_engine_name() : string { return this._engine_name; }

    public has_error() : boolean { return this._has_error; }
    public get_error_message() : string { return this._error_message; }
    public get_error_cursor() : number { return this._error_cursor; }

    public run(program: VMProgram) : IValue {
        const entry_point = program.get_entry_point();
        let running = true;

        program.set_cursor(entry_point);

        let cursor_instruction:IInstruction;
        let cursor_opcode:number;
        let cursor_value:IValue;
        let cursor_operands:IValue[];
        let cursor_operands_count:number;
        let cursor_number_1:number;
        let cursor_number_2:number;
        let cursor_number_3:number;

        program.start();
        while(running) {
            // GET CURRENT INSTRUCTIONS
            cursor_instruction = program.get_cursor_instruction();
            if (! cursor_instruction) {
                this.error_bad_instruction(program.get_cursor());
                break;
            }
            // console.log('cursor instr', cursor_instruction);

            // GET CURRENT INSTRUCTIONS OPERANDS
            cursor_operands_count = cursor_instruction.get_operands_count();
            cursor_operands = program.pop_values(cursor_operands_count);
            cursor_opcode = cursor_instruction.get_opcode();

            if (cursor_operands_count > 0) {
                // Check operands error
                if (! cursor_operands || this.has_error()) {
                    this.error_bad_operand(program.get_cursor());
                    break;
                }

                // Check operands
                for(cursor_value of cursor_operands) {
                    if (cursor_value === undefined || cursor_value === null) {
                        this.error_bad_operand(program.get_cursor());
                        break;
                    }
                }
            }

            // SWITCH ON CURRENT INSTRUCTION
            cursor_value = undefined;
            cursor_number_1 = undefined;
            cursor_number_2 = undefined;
            cursor_number_3 = undefined;
            
            switch(cursor_opcode) {
                case OPCODES['EXIT']:{
                    program.stop();
                    break;
                }
                case OPCODES['GOTO']:{
                    cursor_number_1 = cursor_instruction.get_inline_number_1();
                    program.set_cursor(cursor_number_1);
                    break;
                }

                // STACK OP
                case OPCODES['POPV']:{
                    cursor_value = program.pop_value(); // unused value
                    program.move_cursor(1);
                    break;
                }
                case OPCODES['PUSHV']:{
                    cursor_value = this.get_operand(cursor_operands, 0);
                    program.push_value(cursor_value);
                    program.move_cursor(1);
                    break;
                };

                // REGISTERS OP
                case OPCODES['REGV']:{
                    cursor_number_1 = cursor_instruction.get_inline_number_1();
                    cursor_value = this.get_operand(cursor_operands, 0);
                    program.register_value(cursor_number_1, cursor_value);
                    program.move_cursor(1);
                    break;
                }
                case OPCODES['UNRV']:{
                    cursor_number_1 = cursor_instruction.get_inline_number_1();
                    cursor_value = undefined;
                    program.unregister_value(cursor_number_1);
                    program.move_cursor(1);
                    break;
                }
                case OPCODES['GETRV']:{
                    cursor_number_1 = cursor_instruction.get_inline_number_1();
                    program.push_register_value(cursor_number_1);
                    program.move_cursor(1);
                    break;
                }

                // DEBUG OP
                case OPCODES['DBUGON']:{
                    break;
                }
                case OPCODES['DBUGOFF']:{
                    break;
                }

                // TRACE OP
                case OPCODES['TRACEV']:{
                    break;
                }
                case OPCODES['TRACETOP']:{
                    break;
                }
                case OPCODES['TRACEI']:{
                    break;
                }

                // IF OP
                case OPCODES['IFPOS']:{
                    cursor_value = this.get_operand(cursor_operands, 0);
                    cursor_number_1 = cursor_value.to_number();

                    cursor_number_2 = cursor_instruction.get_inline_number_1();

                    if (cursor_number_1 > 0) {
                        program.move_cursor(1);
                        break;
                    }

                    program.move_cursor(cursor_number_2);
                    break;
                }

                case OPCODES['IFNEG']:{
                    cursor_value = this.get_operand(cursor_operands, 0);
                    cursor_number_1 = cursor_value.to_number();

                    cursor_number_2 = cursor_instruction.get_inline_number_1();

                    if (cursor_number_1 < 0) {
                        program.move_cursor(1);
                        break;
                    }
                    
                    program.move_cursor(cursor_number_2);
                    break;
                }

                case OPCODES['IFPOSZ']:{
                    cursor_value = this.get_operand(cursor_operands, 0);
                    cursor_number_1 = cursor_value.to_number();

                    cursor_number_2 = cursor_instruction.get_inline_number_1();

                    if (cursor_number_1 >= 0) {
                        program.move_cursor(1);
                        break;
                    }
                    
                    program.move_cursor(cursor_number_2);
                    break;
                }

                case OPCODES['IFNEGZ']:{
                    cursor_value = this.get_operand(cursor_operands, 0);
                    cursor_number_1 = cursor_value.to_number();

                    cursor_number_2 = cursor_instruction.get_inline_number_1();

                    if (cursor_number_1 <= 0) {
                        program.move_cursor(1);
                        break;
                    }
                    
                    program.move_cursor(cursor_number_2);
                    break;
                }

                case OPCODES['IFZERO']:{
                    cursor_value = this.get_operand(cursor_operands, 0);
                    cursor_number_1 = cursor_value.to_number();

                    cursor_number_2 = cursor_instruction.get_inline_number_1();

                    if (cursor_number_1 == 0) {
                        program.move_cursor(1);
                        break;
                    }
                    
                    program.move_cursor(cursor_number_2);
                    break;
                }

                // "EQSTR":40, "EQNUM":41, "NEQSTR":42, "NEQNUM"

                // EQUALITY
                case OPCODES['EQNUMTOP']:{
                    cursor_value = this.get_operand(cursor_operands, 0);
                    cursor_number_1 = cursor_value.to_number();

                    cursor_value = this.get_operand(cursor_operands, 1);
                    cursor_number_2 = cursor_value.to_number();

                    cursor_number_3 = cursor_instruction.get_inline_number_1();

                    if (cursor_number_1 == cursor_number_2) {
                        program.move_cursor(1);
                        break;
                    }
                    
                    program.move_cursor(cursor_number_3);
                    break;
                }

                case OPCODES['NEQNUMTOP']:{
                    cursor_value = this.get_operand(cursor_operands, 0);
                    cursor_number_1 = cursor_value.to_number();

                    cursor_value = this.get_operand(cursor_operands, 1);
                    cursor_number_2 = cursor_value.to_number();

                    cursor_number_3 = cursor_instruction.get_inline_number_1();

                    if (cursor_number_1 != cursor_number_2) {
                        program.move_cursor(1);
                        break;
                    }
                    
                    program.move_cursor(cursor_number_3);
                    break;
                }

                case OPCODES['EQNUMREG']:{
                    cursor_number_1 = cursor_instruction.get_inline_number_1();
                    cursor_number_2 = cursor_instruction.get_inline_number_2();
                    cursor_number_3 = cursor_instruction.get_inline_number_3();

                    cursor_value = program.get_register_value(cursor_number_2);
                    cursor_number_2 = cursor_value.to_number();

                    cursor_value = program.get_register_value(cursor_number_3);
                    cursor_number_3 = cursor_value.to_number();

                    if (cursor_number_2 == cursor_number_3) {
                        program.move_cursor(1);
                        break;
                    }
                    
                    program.move_cursor(cursor_number_1);
                    break;
                }

                case OPCODES['NEQNUMREG']:{
                    cursor_number_1 = cursor_instruction.get_inline_number_1();
                    cursor_number_2 = cursor_instruction.get_inline_number_2();
                    cursor_number_3 = cursor_instruction.get_inline_number_3();

                    cursor_value = program.get_register_value(cursor_number_2);
                    cursor_number_2 = cursor_value.to_number();

                    cursor_value = program.get_register_value(cursor_number_3);
                    cursor_number_3 = cursor_value.to_number();

                    if (cursor_number_2 != cursor_number_3) {
                        program.move_cursor(1);
                        break;
                    }
                    
                    program.move_cursor(cursor_number_1);
                    break;
                }

                // INC - DEC
                case OPCODES['INCNUMTOP']:{
                    cursor_value = this.get_operand(cursor_operands, 0);
                    cursor_number_1 = cursor_value.to_number();

                    cursor_number_2 = cursor_instruction.get_inline_number_1();

                    cursor_number_1 += cursor_number_2
                    cursor_value.from_number(cursor_number_1);
                    program.push_value(cursor_value);
                    
                    program.move_cursor(1);
                    break;
                }

                case OPCODES['INCNUMREG']:{
                    cursor_number_1 = cursor_instruction.get_inline_number_1();
                    cursor_number_2 = cursor_instruction.get_inline_number_2();
                    cursor_value = program.get_register_value(cursor_number_1);
                    cursor_value.from_number( cursor_value.to_number() + cursor_number_2 );
                    
                    program.move_cursor(1);
                    break;
                }

                case OPCODES['DECNUMTOP']:{
                    cursor_value = this.get_operand(cursor_operands, 0);
                    cursor_number_1 = cursor_value.to_number();

                    cursor_number_2 = cursor_instruction.get_inline_number_1();

                    cursor_number_1 -= cursor_number_2
                    cursor_value.from_number(cursor_number_1);
                    program.push_value(cursor_value);
                    
                    program.move_cursor(1);
                    break;
                }

                case OPCODES['DECNUMREG']:{
                    cursor_number_1 = cursor_instruction.get_inline_number_1();
                    cursor_number_2 = cursor_instruction.get_inline_number_2();
                    cursor_value = program.get_register_value(cursor_number_1);
                    cursor_value.from_number( cursor_value.to_number() - cursor_number_2 );
                    
                    program.move_cursor(1);
                    break;
                }

                // CUSTOM OP
                case OPCODES['CUSTOM']:{
                    cursor_value = cursor_instruction.eval_safe(...cursor_operands); // TODO CHOOSE SAFE, UNSAFE, DEBUG
                    if (cursor_value) {
                        program.push_value(cursor_value);
                    }
                    program.move_cursor(1);
                    break;
                }

                defautl:{
                    this.error_bad_opcode(program.get_cursor(), cursor_opcode);
                    break;
                }
            }

            running = program.is_running();
        }

        if (this.has_error()) {
            return new VMError(this.get_error_cursor(), this.get_error_message());
        }

        if (program.has_error()) {
            this._has_error = true;
            this._error_cursor = program.get_error_cursor();
            this._error_message = program.get_error_message();
            return new VMError(program.get_error_cursor(), program.get_error_message());
        }

        if (program.pop_value_available()) {
            return program.pop_value();
        }

        return undefined;
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