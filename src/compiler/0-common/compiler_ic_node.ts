import { IIcNodeKindOf, ICompilerIcNode } from '../../core/icompiler_ic_node'

export default class CompilerAstNode implements ICompilerIcNode {
    constructor(private _kind_of:IIcNodeKindOf, private _type:string){}

	get_node_kindof():IIcNodeKindOf {
        return this._kind_of;
    }

	get_node_type():string {
        return this._type;
    }
	
	
	static create_error(ast_expression:any, message?:string):ICompilerIcNode {
        return {
			ic_code:IIcNodeKindOf.ERROR,
            ic_type:TYPES.ERROR,
			
            ic_source:undefined,
            ic_name:undefined,
            ic_index:undefined,
			
            ast_node:ast_expression,
            message:message
        }
    }
	
	
	static create_function(module_name:string, func_name:string, return_type:string, opds_records:ICOperand[], ic_statements:ICInstruction[]=[]):ICompilerIcNode {
        const ic_function:ICompilerIcNode = {
			ic_code:IIcNodeKindOf.FUNCTION_DECLARE,
            ic_type:TYPES.FUNCTION,
			
			module_name:module_name,
            function_name:func_name,
            function_type:return_type,
			
			ic_operands: opds_records,
            ic_statements:ic_statements,
            ic_labels:new Map()
        };
		
        const scope_module = this._compiler_scope.get_new_module(module_name);
		const scope_function = scope_module.get_module_function(func_name);
		scope_function.set_ic_node(func_name, ic_function);
		
		return ic_function;
	}
	
	
	static create_function_enter(module_name:string, func_name:string, return_type:string):ICompilerIcNode {
        return {
			ic_code:IIcNodeKindOf.FUNCTION_DECLARE_ENTER,
            ic_type:TYPES.FUNCTION,
			
			module_name:module_name,
            function_name:func_name,
            function_type:return_type
        };
	}
	
	static create_function_leave(module_name:string, func_name:string, return_type:string):ICompilerIcNode {
        return {
			ic_code:IIcNodeKindOf.FUNCTION_DECLARE_LEAVE,
            ic_type:TYPES.FUNCTION,
			
			module_name:module_name,
            function_name:func_name,
            function_type:return_type
        };
	}
	
	static create_const_true():ICompilerIcNode {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_TRUE,
            ic_type:TYPES.BOOLEAN,
            ic_source:ICOperandSource.FROM_INLINE
        };
	}
	
	static create_const_false():ICompilerIcNode {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_FALSE,
            ic_type:TYPES.BOOLEAN,
            ic_source:ICOperandSource.FROM_INLINE
        };
	}
	
	static create_const_null():ICompilerIcNode {
        return {
			ic_code:IIcNodeKindOf.CONSTANT_NULL,
            ic_type:TYPES.NULL,
            ic_source:ICOperandSource.FROM_INLINE
        };
	}
}