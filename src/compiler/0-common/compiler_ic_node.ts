
import ICompilerError from '../../core/icompiler_error';
import ICompilerType from '../../core/icompiler_type';
import ICompilerScope from '../../core/icompiler_scope';
import { IIcNodeKindOf, ICompilerIcOperand, ICompilerIcOperandSource, ICompilerIcFunction, ICompilerIcInstruction,
    ICompilerIcFunctionEnter, ICompilerIcFunctionLeave, ICompilerIcConstant, ICompilerIcConstantValue,
    ICompilerIcInstrCall } from '../../core/icompiler_ic_node';
import ICompilerIcNode from '../../core/icompiler_ic_node';



export default class CompilerIcNode implements ICompilerIcNode {
    constructor(public ic_code:IIcNodeKindOf, public ic_type:ICompilerType){}

	get_node_kindof():IIcNodeKindOf {
        return this.ic_code;
    }

	get_node_type():ICompilerType {
        return this.ic_type;
    }
	
	
	static create_error(ast_expression:any, message?:string):ICompilerError {
        return {
            ic_type:undefined,
			
            ic_source:undefined,
            ic_name:undefined,
            ic_index:undefined,
			
            ast_node:ast_expression,
            message:message
        }
    }
	
	
	static create_function(compiler_scope:ICompilerScope, module_name:string, func_name:string, return_type:ICompilerType, opds_records:ICompilerIcOperand[], ic_statements:ICompilerIcInstruction[]=[]):ICompilerIcFunction {
        const ic_function:ICompilerIcFunction = {
			ic_code:IIcNodeKindOf.FUNCTION_DECLARE,
            ic_type:return_type,
			
			module_name:module_name,
            function_name:func_name,
			
			ic_operands: opds_records,
            ic_statements:ic_statements,
            ic_labels:new Map()
        };
		
        const scope_module = compiler_scope.get_new_module(module_name);
		const scope_function = scope_module.get_module_function(func_name);
		scope_function.set_ic_node(ic_function);
		
		return ic_function;
	}
	
	static create_function_enter(compiler_scope:ICompilerScope, func_module_name:string, func_name:string, return_type:ICompilerType):ICompilerIcFunctionEnter {
        return {
			ic_code:IIcNodeKindOf.FUNCTION_DECLARE_ENTER,
            ic_type:return_type,
			
			module_name:func_module_name,
            function_name:func_name
        };
	}
	
	static create_function_leave(compiler_scope:ICompilerScope, func_module_name:string, func_name:string, return_type:ICompilerType):ICompilerIcFunctionLeave {
        return {
			ic_code:IIcNodeKindOf.FUNCTION_DECLARE_LEAVE,
            ic_type:return_type,
			
			module_name:func_module_name,
            function_name:func_name
        };
	}
    
    
    static create_function_call(func_name:string, func_ic_type:ICompilerType, operands:ICompilerIcOperand[]):ICompilerIcInstrCall {
        return {
            ic_code:IIcNodeKindOf.FUNCTION_CALL,
            ic_type:func_ic_type,
            ic_func_name:func_name,
            ic_operands:operands
        }
    }
    
    
	static create_const_true(compiler_scope:ICompilerScope):ICompilerIcConstant {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_TRUE,
            ic_type:compiler_scope.get_available_lang_type('BOOLEAN'),
            ic_source:ICompilerIcOperandSource.FROM_INLINE
        };
	}
	
	static create_const_false(compiler_scope:ICompilerScope):ICompilerIcConstant {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_FALSE,
            ic_type:compiler_scope.get_available_lang_type('BOOLEAN'),
            ic_source:ICompilerIcOperandSource.FROM_INLINE
        };
	}
	
	static create_const_null(compiler_scope:ICompilerScope):ICompilerIcConstant {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_NULL,
            ic_type:compiler_scope.get_available_lang_type('NULL'),
            ic_source:ICompilerIcOperandSource.FROM_INLINE
        };
    }
    
    static create_const_integer(compiler_scope:ICompilerScope, value:string):ICompilerIcConstantValue {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_VALUE,
            ic_type:compiler_scope.get_available_lang_type('INTEGER'),
            ic_source:ICompilerIcOperandSource.FROM_INLINE,
            ic_value:value
        };
    }
    
    static create_const_biginteger(compiler_scope:ICompilerScope, value:string):ICompilerIcConstantValue {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_VALUE,
            ic_type:compiler_scope.get_available_lang_type('BIGINTEGER'),
            ic_source:ICompilerIcOperandSource.FROM_INLINE,
            ic_value:value
        };
    }
    
    static create_const_float(compiler_scope:ICompilerScope, value:string):ICompilerIcConstantValue {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_VALUE,
            ic_type:compiler_scope.get_available_lang_type('FLOAT'),
            ic_source:ICompilerIcOperandSource.FROM_INLINE,
            ic_value:value
        };
    }
    
    static create_const_bigfloat(compiler_scope:ICompilerScope, value:string):ICompilerIcConstantValue {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_VALUE,
            ic_type:compiler_scope.get_available_lang_type('BIGFLOAT'),
            ic_source:ICompilerIcOperandSource.FROM_INLINE,
            ic_value:value
        };
    }
    
    static create_const_string(compiler_scope:ICompilerScope, value:string):ICompilerIcConstantValue {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_VALUE,
            ic_type:compiler_scope.get_available_lang_type('STRING'),
            ic_source:ICompilerIcOperandSource.FROM_INLINE,
            ic_value:value
        };
    }
    
    static create_operand_from_stack(compiler_scope:ICompilerScope, operand_type:ICompilerType):ICompilerIcOperand {
        return {
			ic_code:IIcNodeKindOf.OPERAND_FROM_STACK,
            ic_type:operand_type,
            ic_source:ICompilerIcOperandSource.FROM_STACK
        };
    }
}