import IType from '../../core/itype';

import AST from '../2-ast-builder/math_lang_ast';

import { FunctionScope } from './math_lang_function_scope';
import TYPES from './math_lang_types';



export enum IC {
    FUNCTION_DECLARE_ENTER      ='function-declare-enter',
    FUNCTION_DECLARE_LEAVE      ='function-declare-leave',
    FUNCTION_CALL               ='function-call',
    FUNCTION_RETURN             ='function-return',

    REGISTER_GET                ='register-get',
    REGISTER_SET                ='register-set',

    STACK_PUSH                  ='stack-push',
    STACK_PUSH_FROM_REGISTER    ='stack-push-from-register',
    STACK_POP                   ='stack-pop',
    STACK_POP_TO_REGISTER       ='stack-pop-to-register',

    MESSAGE_SEND                ='message-send',
    MESSAGE_RECEIVE             ='message-receive'
}


export type ICFunction = {
    func_name:string,
    return_type:string,
    statements:any[]
};


export enum ICOperandSource {
    FROM_STACK       = 'FROM_STACK',
    FROM_REGISTER    = 'FROM_REGISTER',
    FROM_ID          = 'FROM_ID',
    FROM_INLINE      = 'FROM_INLINE'
}

export type ICIdAccessor = {
    id:string,
    ic_type:string,
    operands_types:[],
    operands_names:[],
    operands_expressions:[],
    is_attribute:boolean,
    is_method_call:boolean,
    is_method_decl:boolean,
    is_indexed:boolean,
    indexed_args_count:number
};

export interface ICOperand {
    ic_type:string,
    ic_source:ICOperandSource,
    ic_name:string,
    ic_id_accessors:ICIdAccessor[],
    ic_id_accessors_str:string
};


export interface ICError {
    ic_type:string,
    ic_source:ICOperandSource,
    ic_name:string,
    ic_index:number,
    ast_node:any,
    message:string
};

export type ICInstruction = {
    ic_type:string,
    ic_code:string,
    operands:ICOperand[],
    text:string
};



/**
 * Typed AST Visitor base class. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangAstToIcVisitorBase {
    protected _ic_functions:Map<string,ICFunction> = new Map();
    private _errors:ICError[] = [];


    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(protected _ast_functions:Map<string,FunctionScope>, private _types_map:Map<string,IType>) {
    }


    /**
     * Test if a variable type is an ICError.
     * @param toBeDetermined variable to test type
     */
    test_if_error(var_to_test: ICOperand|ICError): var_to_test is ICError {
        if((var_to_test as ICError).message){
            return true
        }
        return false
    }


    /**
     * Test if the named type exists in features.
     * 
     * @returns boolean, true if type exists.
     */
    has_type(type_name:string){
        return this._types_map.has(type_name);
    }


    /**
     * Get IC build functions.
     * 
     * @returns Map<string,ICFunction>.
     */
    get_ic_functions_map(){
        return this._ic_functions;
    }


    get_operand_source_str(ic_operand:ICOperand){
        let ic_str:string = 'UNKNOW';

        switch(ic_operand.ic_source){
            case ICOperandSource.FROM_ID:       ic_str='@' + ic_operand.ic_name;       break;
            case ICOperandSource.FROM_INLINE:   ic_str='[' + ic_operand.ic_name + ']'; break;
            case ICOperandSource.FROM_STACK:    ic_str=ICOperandSource.FROM_STACK;     break;
            case ICOperandSource.FROM_REGISTER: ic_str=ICOperandSource.FROM_REGISTER;  break;
        }

        return ic_str;
    }


    /**
     * Get IC function name for given operator.
     * 
     * @param ast_operator AST operator name.
     * 
     * @returns IC function name.
     */
    // get_op_function_name(ast_operator:string):string{
    //     return ast_operator.ic_function;
    // }


    /**
     * Get IC builder errors.
     * 
     * @returns ICOperand array.
     */
    get_errors():ICError[]{
        return this._errors;
    }


    /**
     * Test if builder has an error.
     * 
     * @returns boolean.
     */
    has_error(){
        return this._errors.length > 0;
    }

    /**
     * Register an error.
     * 
     * @returns Error ICOperand node.
     */
    add_error(ast_expression:any, message?:string):ICError{
        const error:ICError = {
            ic_type:TYPES.ERROR,
            ic_source:undefined,
            ic_name:undefined,
            ic_index:undefined,
            ast_node:ast_expression,
            message:message
        }
        this._errors.push(error);
        return error;
    }


    declare_function(func_name:string, return_type:string, opds_records:[], opds_records_str:string, ic_statements:ICInstruction[]){
        const ic_function = {
            func_name:func_name,
            return_type:return_type,
            statements:ic_statements
        };

        // ADD FUNCTION IC DECLARATION
        ic_function.statements.push({
            ic_type:return_type,
            ic_code:IC.FUNCTION_DECLARE_ENTER,
            operands:opds_records,
            text:return_type + ':' + IC.FUNCTION_DECLARE_ENTER + ' ' + opds_records_str
        });

        this._ic_functions.set(ic_function.func_name, ic_function);
    }

    set_function_declaration_statements(func_name:string, instructions:any[]){
        const func_scope = this._ic_functions.get(func_name);
        func_scope.statements = instructions;
    }

    leave_function_declaration(func_name:string){
        const ic_function = this._ic_functions.get(func_name);

        // LEAVE FUNCTON
        ic_function.statements.push({
            ic_type:ic_function.return_type,
            ic_code:IC.FUNCTION_DECLARE_ENTER,
            operands:[],
            text:ic_function.return_type + ':' + IC.FUNCTION_DECLARE_LEAVE + ' ' + func_name
        });
    }



    /**
     * Get symbol (identifier) type.
     * @param name   symbol name
     * @returns result type
     */
	get_symbol_type(name:string):string {
        let symbol_type = TYPES.UNKNOW;
        this._ast_functions.forEach(loop_scope => { // TODO OPTIMIZE SEARCH IN LOOP
            if (symbol_type != TYPES.UNKNOW){
                return;
            }
            if (loop_scope.symbols_consts_table.has(name)) {
                symbol_type = loop_scope.symbols_consts_table.get(name).ic_type;
                return;
            }
            if (loop_scope.symbols_vars_table.has(name)) {
                symbol_type = loop_scope.symbols_vars_table.get(name).ic_type;
                return;
            }
            if (loop_scope.symbols_opds_table.has(name)) {
                symbol_type = loop_scope.symbols_opds_table.get(name).ic_type;
                return;
            }
        });
        return symbol_type;
    }
}

/*

IC Commands:
	type_name:function-declare-enter	id_func_name [type_name:opd_name]*
	type_name:function-declare-leave	id_func_name
	type_name:function-call				id_func_name [type_name:value|id_value_name|from_stack|from_registre(n)]*
	type_name:function-return			id_func_name type_name:value|id_value_name|from_stack|from_registre(n)
	
	type_name:register-get				id_value_name
	type_name:register-set				id_value_name type_name:value|id_value_name|from_stack|from_registre(n)
	
	none:stack-push						type_name:value
	none:stack-push-from-register		type_name:id_value_name
	type_name:stack-pop														// get and remove top stack value
	type_name:stack-pop-to-register		id_value_name
	
	type_name:id_op_name				[type_name:value|id_value_name|from_stack|from_registre(n)]x2	// Result pushed on stack

	none:message-send					id_sender id_subject [type_name:value|id_value_name|from_stack|from_registre(n)]*
	message-receive				id_sender id_subject id_func_name

avec id_op_name=add,sub,mul,div,concat,length....

*/