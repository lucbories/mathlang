
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
		this._current_function = scope_module.get_module_function(func_name);
		
        // ADD FUNCTION IC DECLARATION
		const ic_function_enter = CompilerIcNode.create_function_enter(module_name, func_name, return_type);
        this._current_function.add_ic_statement(ic_function_enter);
    }
	

    // set_function_declaration_statements(module_name:string, func_name:string, instructions:any[]){
        // const func_scope = this._ic_modules.get(module_name).module_functions.get(func_name);
        // func_scope.statements = instructions;
    // }

    leave_function_declaration(module_name:string, func_name:string){
        // ADD FUNCTION IC DECLARATION
        const ic_function_leave = CompilerIcNode.create_function_leave(module_name, func_name, return_type);
        this._current_function.add_ic_statement(ic_function_leave);
		
		this._current_function = undefined;
    }



    /**
     * Get symbol (identifier) type.
     * @param name   symbol name
     * @returns result type
     */
	get_symbol_type(module_name:string, name:string):string {
        let symbol_type = TYPES.UNKNOW;

        // SEARCH IN MODULE FUNCTIONS
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


    /**
     * Update IC function label index.
     * @param label_name    label name.
     * @param ic_function   function object.
     * @param target_index  label index.
     * @returns nothing.
     */
    // update_function_label_index(label_name:string, ic_function:ICFunction, target_index?:number){
		
		// this._current_function.set_ic_label
		
        // if (! ic_function.labels.has(ic_function.func_name) ){
            // return;
        // }
        // const labels = ic_function.labels.get(ic_function.func_name);
        // if (labels.length == 0){
            // return;
        // }

        // SEARCH LABEL RECORD WITH GIVEN NAME FROM THE END
        // const label_index = target_index ? target_index : ic_function.statements.length;
        // let labels_index = labels.length;
        // let label:ICLabel;
        // do{
            // --labels_index;
            // label = labels[labels_index];
            // if (label.label_name == label_name){
                // labels_index = -99;
            // }
        // } while(labels_index >= 0);

        // if (labels_index == -99){
            // label.label_index = label_index;
        // }
    // }
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