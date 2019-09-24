import IType from '../../core/itype';
// import IProgram from '../../core/iprogram';
// import VMProgram from '../../engine/vm/vmprogram';
// import TYPES from '../math_lang_types';
import IC from '../3-ic-builder/math_lang_ic';
import {ICLabel, ICFunction, ICInstruction, ICOperand, ICOperandSource} from '../3-ic-builder/math_lang_ast_to_ic_builder_base';
import {IProgramOptions} from '../../engine/vm/vmprogramoptions';
import MathLangIcToMcVisitorBase from './math_lang_ic_to_mc_builder_base';
import {MCFunction} from './math_lang_ic_to_mc_builder_base';


// VM
import VMValue from '../../engine/vm/vmvalue';
// import VMError from '../../engine/vm/vmerror';
// import VMEngine from '../../engine/vm/vmengine';
// import VMProgramOptions from '../../engine/vm/vmprogramoptions';
// import VMProgram from '../../engine/vm/vmprogram';

import VMNumberType from '../../features/common/number/vmnumber_type';
import VMNumberMathFt from '../../features/common/number/vmnumber_math_ft';

// import VMMethodCall from '../../engine/instructions/vmcallmethod';

// import VMPopV from '../../engine/instructions/vmpopv';
// import VMPushV from '../../engine/instructions/vmpushv';

// import VMIfPositive from '../../engine/instructions/vmifpositive';
// import VMIfPositiveZero from '../../engine/instructions/vmifpositivezero';
// import VMIfNegative from '../../engine/instructions/vmifnegative';
// import VMIfNegativeZero from '../../engine/instructions/vmifnegativezero';
// import VMIfZero from '../../engine/instructions/vmifzero';

import VMExit from '../../engine/instructions/vmexit';
import VMGoto from '../../engine/instructions/vmgoto';

import VMRegV from '../../engine/instructions/vmregv';
// import VMUnRegV from '../../engine/instructions/vmunrv';
import VMGetRegV from '../../engine/instructions/vmgetrv';

import VMCallEnter from '../../engine/instructions/vmcall_enter';
import VMCallLeave from '../../engine/instructions/vmcall_leave';

import IInstruction from '../../core/iinstruction';
import IValue from '../../core/ivalue';



/**
 * Typed AST Visitor base class. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default abstract class MathLangIcToMcVisitorStatements extends MathLangIcToMcVisitorBase {

    /**
     * Constructor.
     * 
     * @param engine_types        VM engine types map.
     * @param program_name        MC program name.
     * @param program_options     MC program options.
     * @param ic_functions        IC functions.
     * @param ic_functions_labels IC functions labels.
     */
    constructor(engine_types:Map<string,IType>, program_name:string, program_options:IProgramOptions, ic_functions:Map<string,ICFunction>, ic_functions_labels:Map<string,ICLabel[]>) {
        super(engine_types, program_name, program_options, ic_functions, ic_functions_labels);
    }


    /**
     * Visit IC program.
     */
    visit():any{
        const main_name = this._mc_program_options.entry_label;

        const ic_main_function = this._ic_functions.get(main_name);
        this.visit_function(ic_main_function);
    }


    /**
     * Visit IC function.
     * 
     * @param ic_function IC function.
     */
    visit_function(ic_function:ICFunction){
        // LOOP ON STATEMENTS
        let loop_ic_statement;
        for(loop_ic_statement of ic_function.statements){
            this.visit_statement(loop_ic_statement);
        }
    }


    /**
     * Visit IC statement.
     * 
     * @param ic_statement IC statement.
     */
    visit_statement(ic_statement:ICInstruction){
        let symbol_full_name = '';
        let symbol_register_index:number = -1;
        let instruction:IInstruction = undefined;
        let left_opd:ICOperand = undefined;
        let right_opd:ICOperand = undefined;
        let value:IValue = undefined;

        switch(ic_statement.ic_code){
            case IC.FUNCTION_DECLARE_ENTER:{
                const function_name:string = ic_statement.operands[0].ic_name;
                this._mc_program.add_instruction( new VMCallEnter() );
                const func_record:MCFunction = {
                    func_name:function_name,
                    cursor_begin:this._mc_program.get_cursor(),
                    cursor_end:undefined,
                    labels:new Map()
                };
                this._functions.set(function_name, func_record);
                break;
            }

            case IC.FUNCTION_DECLARE_LEAVE:{
                this._mc_program.add_instruction( new VMCallLeave() );
                break;
            }

            case IC.FUNCTION_CALL:{
                // PUSH OPERANDS
                // GOTO
                break;
            }
            case IC.FUNCTION_RETURN:{
                break;
            }

            case IC.IF_THEN:{
                break;
            }
            case IC.IF_THEN_ELSE:{
                break;
            }

            case IC.REGISTER_GET:{
                // GET LEFT SYMBOL INDEX
                left_opd = ic_statement.operands[0];
                if (! left_opd.ic_name){
                    this.left_operand_name_is_undefined_error(ic_statement);
                    return;
                }
                symbol_full_name = left_opd.ic_type  + ':@' + left_opd.ic_name + left_opd.ic_id_accessors_str;
                symbol_register_index = this.get_symbol_register(symbol_full_name, ic_statement);
                if (symbol_register_index < 0){
                    return;
                }

                // GET REGISTER VQLUE
                instruction = new VMGetRegV(symbol_register_index);
                this._mc_program.add_instruction(instruction);
                break;
            }

            case IC.REGISTER_SET:{
                // GET RIGHT SYMBOL INDEX
                right_opd = ic_statement.operands[1];
                if (! right_opd.ic_name){
                    this.left_operand_name_is_undefined_error(ic_statement);
                    return;
                }
                symbol_full_name = right_opd.ic_type  + ':@' + right_opd.ic_name + right_opd.ic_id_accessors_str;
                symbol_register_index = this.get_symbol_register(symbol_full_name, ic_statement);
                if (symbol_register_index < 0){
                    return;
                }

                // GET RIGHT VALUE
                // this.get_operand_value(right_opd);
                switch(right_opd.ic_source){
                    case ICOperandSource.FROM_ID:{
                        // TODO
                        break;
                    }
                    case ICOperandSource.FROM_INLINE:{
                        value = this.get_operand_inline_value(right_opd);
                        this._mc_program.push_value(value);
                        break;
                    }
                    case ICOperandSource.FROM_REGISTER:{
                        instruction = new VMGetRegV(symbol_register_index);
                        this._mc_program.add_instruction(instruction);
                        break;
                    }
                    case ICOperandSource.FROM_STACK:{
                        // NOTHING TO DO, VALUE ALREADY ON THE STACK
                        break;
                    }
                }

                // GET LEFT SYMBOL INDEX
                left_opd = ic_statement.operands[0];
                if (! left_opd.ic_name){
                    this.left_operand_name_is_undefined_error(ic_statement);
                    return;
                }
                symbol_full_name = left_opd.ic_type  + ':@' + left_opd.ic_name + left_opd.ic_id_accessors_str;
                symbol_register_index = this.set_symbol_register_value(symbol_full_name, ic_statement);
                if (symbol_register_index < 0){
                    return;
                }

                // SET REGISTER VALUE
                instruction = new VMRegV(symbol_register_index);
                this._mc_program.add_instruction(instruction);
                break;
            }

            case IC.GOTO:{
                break;
            }

            // case IC.STACK_POP:{}
            // case IC.STACK_POP_TO_REGISTER:{}
            // case IC.STACK_PUSH:{}
            // case IC.STACK_PUSH_FROM_REGISTER:{}

            // case IC:{}
            // case IC:{}
            // case IC:{}
            // case IC:{}
            // case IC:{}
            // case IC:{}
            // case IC:{}
            // case IC:{}
        }
    }


    create_value(mc_type:string, value:any){
        return new VMValue(VMNumberType, value);
    }
}