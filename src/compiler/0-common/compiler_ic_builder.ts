
import ICompilerError from '../0-api/icompiler_error';
import ICompilerSymbol from '../0-api/icompiler_symbol';
import ICompilerModule from '../0-api/icompiler_module';
import ICompilerType from '../0-api/icompiler_type';
import ICompilerFunction from '../0-api/icompiler_function';
import {
    ICompilerIcInstr, ICompilerIcEbb, IC_OPCODES, ICompilerIcEbbOperand, ICompilerIcInstrOperand
} from '../0-api/icompiler_ic_instruction';



export default class CompilerIcBuilder {
    static create_error(ast_expression: any, message?: string): ICompilerError {
        return {
            ic_type: undefined,

            ic_source: undefined,
            ic_name: undefined,
            ic_index: undefined,

            ast_node: ast_expression,
            error_message: message
        }
    }

    static create_ebb(func: ICompilerFunction, operands_types: ICompilerType[], operands_names: string[]): ICompilerIcEbb {
        const ebb_count = func.get_ic_ebb_count();
        const opds: ICompilerIcEbbOperand[] = [];
        const opds_map: Map<string,string> = new Map();
        operands_types.map(
            (value, index) => {
                const var_name = func.add_ic_variable();
                const opd_code_name = index < operands_names.length ? operands_names[index] : undefined;
                opds.push({
                    opd_name: var_name,
                    opd_type: value
                });
                opds_map.set(opd_code_name, var_name);
            }
        );
        const ebb = {
            ic_ebb_index: ebb_count,
            ic_ebb_name: 'ebb' + ebb_count,
            ic_operands: opds,
            ic_operands_map: opds_map,
            ic_instructions: <ICompilerIcInstr[]>[]
        };
        func.add_ic_ebb(ebb, func.get_func_name());
        return ebb;
    }

    static create_jump(ebb_name: string, operands: string[] = []): ICompilerIcInstr {
        return {
            ic_code: IC_OPCODES.JUMP,
            ic_type: undefined,
            ic_opds: [ebb_name, ...operands],
            ic_var_name: undefined
        };
    }

    static create_return(var_name: string): ICompilerIcInstr {
        return {
            ic_code: IC_OPCODES.RETURN,
            ic_type: undefined,
            ic_opds: [var_name],
            ic_var_name: undefined
        };
    }


    static create_function_call(var_name: string, func_name: string, func_ic_type: ICompilerType, operands: string[]): ICompilerIcInstr {
        return {
            ic_code: IC_OPCODES.CALL,
            ic_type: func_ic_type,
            ic_opds: [func_name, ...operands],
            ic_var_name: var_name
        }
    }


    static create_method_call(var_name: string, func_name: string, func_ic_type: ICompilerType, operands: string[]): ICompilerIcInstr {
        return {
            ic_code: IC_OPCODES.METHOD_CALL,
            ic_type: func_ic_type,
            ic_opds: [func_name, ...operands],
            ic_var_name: var_name
        }
    }
    

    static create_local_var_set(var_name_left: string, var_value_right: string, right_type:ICompilerType): ICompilerIcInstr {
        return {
            ic_code: IC_OPCODES.LOCAL_VAR_SET,
            ic_type: right_type,
            ic_opds: [var_value_right],
            ic_var_name: var_name_left
        };
    }
    

    static create_local_var_get(var_name: string, local_name:string, local_type:ICompilerType): ICompilerIcInstr {
        return {
            ic_code: IC_OPCODES.LOCAL_VAR_GET,
            ic_type: local_type,
            ic_opds: [local_name],
            ic_var_name: var_name
        };
    }

    // static create_register_set(var_name_left: string, var_name_right: string, right_type:ICompilerType): ICompilerIcInstr {
    //     return {
    //         ic_code: IC_OPCODES.REGISTER_SET,
    //         ic_type: right_type,
    //         ic_opds: [var_name_left, var_name_right],
    //         ic_var_name: undefined
    //     };
    // }


    static create_const_true(): ICompilerIcInstrOperand {
        return 'b_inline(1)';
    }

    static create_const_false(): ICompilerIcInstrOperand {
        return 'b_inline(0)';
    }

    static create_const_null(): ICompilerIcInstrOperand {
        return 'o_null';
    }

    static create_const_integer(value: string, base: number = 10): ICompilerIcInstrOperand {
        return 'i_inline(' + value + ')';
    }

    static create_const_biginteger(value: string, base: number = 10): ICompilerIcInstrOperand {
        return 'bi_inline(' + value + ')';
    }

    static create_const_float(value: string, base: number = 10): ICompilerIcInstrOperand {
        return 'f_inline(' + value + ')';
    }

    static create_const_bigfloat(value: string, base: number = 10): ICompilerIcInstrOperand {
        return 'bf_inline(' + value + ')';
    }

    static create_const_string(value: string): ICompilerIcInstrOperand {
        return 's_inline(' + value + ')';
    }


    static create_operand_from_stack(operand_type: ICompilerType): ICompilerIcInstrOperand {
        return 'pop';
    }

    static create_operand_from_register(operand_type: ICompilerType, register_index: number): ICompilerIcInstrOperand {
        return 'reg' + register_index;
    }

    static create_operand_from_variable(operand_type: ICompilerType, variable_index: number): ICompilerIcInstrOperand {
        return 'reg' + variable_index;
    }

    static create_operand_from_attribute(var_name: string, operand_type: ICompilerType, operand_name: ICompilerIcInstrOperand, attribute_name:string): ICompilerIcInstr {
        return {
            ic_code: IC_OPCODES.ATTRIBUTE_GET,
            ic_type: operand_type,
            ic_opds: [operand_name, attribute_name],
            ic_var_name: var_name
        };
    }

    static create_operand_from_array_index(var_name: string, operand_type: ICompilerType, array_var:ICompilerIcInstrOperand, array_index: ICompilerIcInstrOperand): ICompilerIcInstr {
        return {
            ic_code: IC_OPCODES.ARRAY_GET_AT,
            ic_type: operand_type,
            ic_opds: [array_index],
            ic_var_name: var_name
        };
    }


    // CONTROL FLOW TESTS
    static create_if_true(var_name: string, bool_type: ICompilerType, opd_name: string, jump_then_ebb_name:string): ICompilerIcInstr {
        return {
            ic_code: IC_OPCODES.IF_TRUE,
            ic_type: bool_type,
            ic_opds: [opd_name, jump_then_ebb_name],
            ic_var_name: var_name
        };
    }

    // static create_if_false(var_name: string, bool_type: ICompilerType, opd_name: string, jump_then_ebb_name:string): ICompilerIcInstr {
    //     return {
    //         ic_code: IC_OPCODES.IF_FALSE,
    //         ic_type: bool_type,
    //         ic_opds: [opd_name, jump_then_ebb_name],
    //         ic_var_name: var_name
    //     };
    // }

    // static create_if_positive(var_name: string, bool_type: ICompilerType, opd_name: string, jump_then_ebb_name:string): ICompilerIcInstr {
    //     return {
    //         ic_code: IC_OPCODES.IF_POSITIVE,
    //         ic_type: bool_type,
    //         ic_opds: [opd_name, jump_then_ebb_name],
    //         ic_var_name: var_name
    //     };
    // }

    // static create_if_negative(var_name: string, bool_type: ICompilerType, opd_name: string, jump_then_ebb_name:string): ICompilerIcInstr {
    //     return {
    //         ic_code: IC_OPCODES.IF_NEGATIVE,
    //         ic_type: bool_type,
    //         ic_opds: [opd_name, jump_then_ebb_name],
    //         ic_var_name: var_name
    //     };
    // }

    // TYPE GUARDS
    static is_compiler_error(ic_entity:ICompilerIcInstr|ICompilerIcEbb|ICompilerError|ICompilerSymbol): ic_entity is ICompilerError{
        if ((ic_entity as ICompilerError).error_message) {
            return true;
        }
        return false;
    }

    static is_compiler_ic_ebb(ic_entity:ICompilerIcInstr|ICompilerIcEbb|ICompilerError|ICompilerSymbol): ic_entity is ICompilerIcEbb{
        if ((ic_entity as ICompilerIcEbb).ic_ebb_name) {
            return true;
        }
        return false;
    }

    static is_compiler_ic_instr(ic_entity:ICompilerIcInstr|ICompilerIcEbb|ICompilerError|ICompilerSymbol): ic_entity is ICompilerIcInstr{
        if ((ic_entity as ICompilerIcInstr).ic_code) {
            return true;
        }
        return false;
    }

    static is_compiler_symbol(ic_entity:ICompilerIcInstr|ICompilerIcEbb|ICompilerError|ICompilerSymbol): ic_entity is ICompilerSymbol{
        if ((ic_entity as ICompilerSymbol).is_constant) {
            return true;
        }
        return false;
    }

    // TO TEXT
    static to_ic_text(ic_entity:ICompilerIcInstr|ICompilerIcEbb|ICompilerError|ICompilerSymbol):string {
        // ERROR
        if (CompilerIcBuilder.is_compiler_error(ic_entity)) {
            const error:ICompilerError = <ICompilerError> ic_entity;
            return `
ERROR message=[{ic_error.error_message}]
with name=[{error.ic_name}] index=[{error.ic_index}] type=[{error.ic_type.get_type_name()}] source=[{error.ic_source}]
`;
        }

        // EBB
        if (CompilerIcBuilder.is_compiler_ic_ebb(ic_entity)) {
            const ebb:ICompilerIcEbb = <ICompilerIcEbb> ic_entity;
            let text:string = ebb.ic_ebb_name + '(' + ebb.ic_operands.map(opd=>opd.opd_name + ':' + opd.opd_type.get_type_name()).join(',') + ')\n';
            ebb.ic_instructions.forEach(
                (instr)=>text += CompilerIcBuilder.to_ic_text(instr) + '\n'
            );
            return text;
        }

        // SYMBOL
        if (CompilerIcBuilder.is_compiler_symbol(ic_entity)) {
            const symb:ICompilerSymbol = <ICompilerSymbol>ic_entity;
            return 'symbol ' + (symb.is_constant ? 'constant ' : 'mutable ') + symb.name + ':' + symb.type.get_type_name() + ' = ' + symb.init_value;
        }

        // INSTRUCTIONS
        const instr:ICompilerIcInstr = <ICompilerIcInstr> ic_entity;
        switch(instr.ic_code) {
            // FUNCTION
            case IC_OPCODES.CALL: {
                return instr.ic_var_name + ':' + instr.ic_type.get_type_name() + ' = ' + 'call ' + instr.ic_opds.join(' ');
            }
            case IC_OPCODES.JUMP: {
                return 'jump ' + instr.ic_opds[0];
            }
            case IC_OPCODES.RETURN: {
                return 'return ' + instr.ic_opds[0];
            }
            case IC_OPCODES.LOCAL_VAR_SET: {
                return instr.ic_var_name + ':' + instr.ic_type.get_type_name() + ' = ' + instr.ic_opds[0];
            }
            case IC_OPCODES.LOCAL_VAR_GET: {
                return instr.ic_var_name + ':' + instr.ic_type.get_type_name() + ' = local(' + instr.ic_opds[0] + ')';
            }

            // REGISTER
            // case IC_OPCODES.REGISTER_SET: {
            //     return instr.ic_var_name + ':' + instr.ic_type.get_type_name() + ' = ' + 'reg_set ' + instr.ic_opds.join(' ');
            // }
            // case IC_OPCODES.REGISTER_GET: {
            //     return instr.ic_var_name + ':' + instr.ic_type.get_type_name() + ' = ' + 'reg_get ' + instr.ic_opds.join(' ');
            // }
            // case IC_OPCODES.REGISTER_NEW: {
            //     return instr.ic_var_name + ':' + instr.ic_type.get_type_name() + ' = ' + 'reg_new ' + instr.ic_opds.join(' ');
            // }

            // IF
            case IC_OPCODES.IF_TRUE: {
                return 'if_true ' + instr.ic_opds.join(' ');
            }

            default: return 'bad instruction op code [' + instr.ic_code + ']';
        }
    }

    static build_module_ic_source(module:ICompilerModule, trace_to_console:boolean=false):string {
        let ic_source:string = '';
    
        if (trace_to_console) { console.log('***** module ' + module.get_module_name() + ' *****'); }

        const loop_constants = module.get_module_constants();
        loop_constants.forEach(
            (loop_constant:ICompilerSymbol)=>{
                const ic_text:string = CompilerIcBuilder.to_ic_text(loop_constant);
                if (trace_to_console) console.log('constant source->', ic_text);
                if (ic_source.length > 0) { ic_source += '\n'; }
                ic_source += ic_text;
            }
        );
    
        const loop_exp_constants = module.get_exported_constants();
        loop_exp_constants.forEach(
            (loop_constant:ICompilerSymbol)=>{
                const ic_text:string = CompilerIcBuilder.to_ic_text(loop_constant);
                if (trace_to_console) console.log('exported constant source->', ic_text);
                if (ic_source.length > 0) { ic_source += '\n'; }
                ic_source += ic_text;
            }
        );
    
        const loop_functions = module.get_module_functions();
        loop_functions.forEach(
            (loop_function:ICompilerFunction)=>{
                if (loop_function.is_internal()) return;
                if (loop_function.is_external()) return;
                
                if (trace_to_console) { console.log('--- ' + (loop_function.is_exported() ? 'exported' : 'module') + ' function:' + loop_function.get_func_name() + ' ---'); }
                ic_source += (loop_function.is_exported() ? 'exported' : 'local') + ' function ' + loop_function.get_func_name();
                ic_source += '(' + loop_function.get_symbols_opds_ordered_list().map(opd=>opd + ':' + loop_function.get_symbols_opds_table().get(opd).type.get_type_name()).join(',') + ')';
                ic_source += ':' + loop_function.get_returned_type().get_type_name() + '\n';

                const ebbs = loop_function.get_ic_ebb_map();
                ebbs.forEach(
                    (ebb)=>{
                        const ic_text:string = CompilerIcBuilder.to_ic_text(ebb);
                        if (trace_to_console) { console.log('function ebb->'); console.log(ic_text); }
                        ic_source += ic_text;
                    }
                );
            }
        );
    
        // const loop_exported_functions = module.get_exported_functions();
        // loop_exported_functions.forEach(
        //     (loop_exported_function:ICompilerFunction)=>{
        //         if (trace_to_console) { console.log('--- exported function:' + loop_exported_function.get_func_name() + ' ---'); }
        //         const ebbs = loop_exported_function.get_ic_ebb_map();
        //         ebbs.forEach(
        //             (ebb)=>{
        //                 const ic_text:string = CompilerIcBuilder.to_ic_text(ebb);
        //                 if (trace_to_console) console.log('function ebb->', ic_text);
        //                 ic_source += ic_text;
        //             }
        //         );
        //     }
        // );
    
        // const main_function = module.get_main_function();
        // if (main_function){
        //     const ebbs = main_function.get_ic_ebb_map();
        //     ebbs.forEach(
        //         (ebb:ICompilerIcEbb)=>{
        //             const ic_text:string = CompilerIcBuilder.to_ic_text(ebb);
        //             if (trace_to_console) console.log('main function ebb->', ic_text);
        //             ic_source += ic_text;
        //         }
        //     );
        // }
    
        return ic_source;
    }
    
    
    static build_modules_ic_source(modules:Map<string,ICompilerModule>, trace_to_console:boolean=false):string {
        let ic_source:string = '';
        modules.forEach(
            (loop_module)=>{
                ic_source += CompilerIcBuilder.build_module_ic_source(loop_module, trace_to_console);
            }
        );
        return ic_source;
    }


    /**
     * Test if last instruction is a final instruction (JUMP or RETURN)
     * 
     * @param ebb
     * @returns boolean
     */
    static is_ebb_last_instruction_final(ebb:ICompilerIcEbb):boolean {
        if (ebb.ic_instructions.length == 0) {
            return false;
        }
        const last_code = ebb.ic_instructions[ebb.ic_instructions.length - 1].ic_code;
        return last_code == IC_OPCODES.RETURN || last_code == IC_OPCODES.JUMP;
    }
}