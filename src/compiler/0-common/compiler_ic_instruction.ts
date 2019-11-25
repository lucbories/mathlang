
import ICompilerError from '../../core/icompiler_error';
import ICompilerType from '../../core/icompiler_type';
import ICompilerScope from '../../core/icompiler_scope';
import ICompilerFunction from '../../core/icompiler_function';
import {
    ICompilerIcInstr, ICompilerIcEbb, IC_OPCODES, ICompilerIcEbbOperand, ICompilerIcInstrOperand,
    IC_LABELS, IC_TEXTS
} from '../../core/icompiler_ic_instruction';



export default class CompilerIcNode implements ICompilerIcInstr {
    constructor(public ic_code: IIcNodeKindOf, public ic_type: ICompilerType) { }

    get_node_kindof(): IIcNodeKindOf {
        return this.ic_code;
    }

    get_node_type(): ICompilerType {
        return this.ic_type;
    }


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
            ic_opderands: opds,
            ic_opderands_map: opds_map,
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
}