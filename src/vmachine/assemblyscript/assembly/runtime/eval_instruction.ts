import OPCODES from './opcodes'
import Program from './program';
import { Value, Simple, Text, List, Error } from './value';

/**
 * Eval function for one instruction.
 */
export default function eval_instruction(vm:VM, program:Program, cursor_opcode:u8) {
    private _has_error:boolean = false;
    private _error_message:string = '';
    private _error_cursor:number = -1;

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
	
	// GET CURRENT INSTRUCTION
	const cursor_opcode:u8 = program.get_cursor_u8();
	// console.log('cursor opcode', cursor_opcode);

	program.move_next_unsafe();
	const cursor_type:u8 = program.get_cursor_u8();
	// console.log('cursor type', cursor_type);
	
	program.move_next_unsafe();
	const cursor_opd1:u8 = program.get_cursor_u8();
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
		
		case OPCODES.TRAP:{
			// TODO: trace context and error
			program.stop();
			break;
		}


		// CONTROL OPS
		case OPCODES.CALL:{
			program.push_context();
			program.move_cursor(1);
			break;
		}
		
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
		
		case OPCODES.RETURN:{
		    program.pop_context();
		    program.move_cursor(1);
			break;
		}


		// VALUES STACK OPS
		case OPCODES.POP_VALUE:{
			cursor_tmp_value = program.pop_value(); // unused value, free ?
			program.move_cursor(1);
			break;
		}
		case OPCODES.PUSH_VALUE_REG:{
			cursor_tmp_u32 = cursor_opd1 < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32();
			cursor_tmp_value = program.get_register_value(cursor_tmp_u32);
			program.push_value(cursor_tmp_value);
			program.move_cursor(1);
			break;
		}
		case OPCODES.PUSH_VALUE_MEM:{
			cursor_tmp_u32 = cursor_opd1 < OPCODES.LIMIT_OPD_INLINE ? u32(cursor_opd1) : program.get_cursor_u32();
			cursor_tmp_value = program.get_memory_value(cursor_tmp_u32);
			program.push_value(cursor_tmp_value);
			program.move_cursor(1);
			break;
		}
		

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
		

		// VALUES MEMORY OPS
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
	}
	
    return 0;
}