
import ICompilerType from '../../core/icompiler_type';
import ICompilerScope from '../../core/icompiler_scope';



/**
 * Typed AST Visitor base class. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangAstToIcVisitorBase {
    private _errors:ICError[] = [];
	private _current_function:ICompilerFunction = undefined;
	private _current_functions_stack:ICompilerFunction[] = new Array();
	

    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(private _compiler_scope:ICompilerScope ) {
    }


    /**
     * Get Compiler scope.
     * 
     * @returns CompilerScope.
     */
    get_compiler_scope(){
        return this._compiler_scope;
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
        return this._compiler_scope.has_available_lang_type(type_name);
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
		const error = CompilerIcNode.create_error(ast_expression, message);
        this._errors.push(error);
        return error;
    }


    declare_function(module_name:string, func_name:string, return_type:string, opds_records:ICOperand[], opds_records_str:string, ic_statements:ICInstruction[]){
        const ic_function = CompilerIcNode.create_function(module_name, func_name, return_type, opds_records, ic_statements);
		
		// LOOKUP CURRENT FUNCTION
		const scope_module = this._compiler_scope.get_new_module(module_name);
	}
	
	
    enter_function_declaration(module_name:string, func_name:string){
		this._current_function = scope_module.get_module_function(func_name);
		const ic_function_enter = CompilerIcNode.create_function_enter(module_name, func_name, return_type);
        this._current_function.add_ic_statement(ic_function_enter);
		this._current_functions_stack.push(this._current_function);
    }
	

    leave_function_declaration(module_name:string, func_name:string){
        const ic_function_leave = CompilerIcNode.create_function_leave(module_name, func_name, return_type);
        this._current_function.add_ic_statement(ic_function_leave);
		this._current_functions_stack.pop();
		
		this._current_function = undefined;
    }



    /**
     * Get symbol (identifier) type.
     * @param name   symbol name
     * @returns result type
     */
	get_functions_stack_symbol_type(symbol_name:string):ICompilerType {
        let symbol_type = undefined;
		
		const size = this._current_functions_stack.length;
		let stack_index = size - 1;
		let stack_function:ICompilerFunction = undefined;
		let smb: = undefined;
		
		while(symbol_type == undefined && stack_index >= 0){
			stack_function = this._current_functions_stack[stack_index];
			smb = stack_function.get_symbol(symbol_name);
			if (smb) {
				symbol_type = smb.get_type();
			}
			stack_index--;
		}
		
		return symbol_type;
	}
		
	/**
     * Get symbol (identifier) type.
     * @param name   symbol name
     * @returns result type
     */
	get_module_symbol_type(module_name:string, symbol_name:string):ICompilerType {
		// GET MODULE
		const module = this._compiler_scope.get_module(module_name);
		if (! module) {
			return undefined;
		}
		
		// SYMBOL IS A FUNCTION
		if ( module.has_module_function(symbol_name) ){
			return module.get_module_function(symbol_name).get_return_type();
		}
		if ( module.has_exported_function(symbol_name) ){
			return module.get_exported_function(symbol_name).get_return_type();
		}
		
        // SEARCH IN MODULE FUNCTIONS
		const module_functions = module.get_exported_functions();
		const exported_functions = module.get_module_functions();
		let smb: = undefined;
		
        this._ast_modules.get(module_name).module_functions.forEach(loop_scope => { // TODO OPTIMIZE SEARCH IN LOOP
            if (symbol_type != TYPES.UNKNOW){
                return;
            }
            if (loop_scope.func_name == name){
                symbol_type = loop_scope.return_type;
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
