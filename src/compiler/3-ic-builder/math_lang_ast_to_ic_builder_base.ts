
import ICompilerError from '../../core/icompiler_error';
import ICompilerType from '../../core/icompiler_type';
import ICompilerSymbol from '../../core/icompiler_symbol';
import ICompilerFunction from '../../core/icompiler_function';
import ICompilerModule from '../../core/icompiler_module';
import ICompilerScope from '../../core/icompiler_scope';
import { ICompilerIcOperand, ICompilerIcInstruction } from '../../core/icompiler_ic_node';

import CompilerIcNode from '../0-common/compiler_ic_node';
import CompilerModule from '../0-common/compiler_module';


/**
 * Typed AST Visitor base class. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangAstToIcVisitorBase {
    private _errors:ICompilerError[] = [];
	private _current_module:ICompilerModule = undefined;
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
     * Get current module.
     * 
     * @returns ICompilerModule.
     */
    get_current_module():ICompilerModule{
        return this._current_module;
    }


    /**
     * Get current function.
     * 
     * @returns ICompilerFunction.
     */
    get_current_function():ICompilerFunction{
        return this._current_function;
    }



    /**
     * Test if a variable type is an ICError.
     * @param toBeDetermined variable to test type
     */
    test_if_error(var_to_test: ICompilerIcOperand|ICompilerError): var_to_test is ICompilerError {
        if((var_to_test as ICompilerError).message){
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


    /**
     * Get IC builder errors.
     * 
     * @returns ICOperand array.
     */
    get_errors():ICompilerError[]{
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
    add_error(ast_expression:any, message?:string):ICompilerError{
		const error = CompilerIcNode.create_error(ast_expression, message);
        this._errors.push(error);
        return error;
    }


    /**
     * Register a module.
     * 
     * @returns nothing
     */
    declare_module(module_name:string):void {
        this._current_module = new CompilerModule(this._compiler_scope, module_name);
    }


    /**
     * Register a function.
     * 
     * @returns nothing
     */
    declare_function(func_name:string, return_type:ICompilerType, opds_records:ICompilerIcOperand[], ic_statements:ICompilerIcInstruction[]=[]):ICompilerIcFunction{
        return CompilerIcNode.create_function(this._compiler_scope, this._current_module.get_module_name(), func_name, return_type, opds_records, ic_statements);
	}
	
	
    enter_function_declaration(func_name:string, return_type:ICompilerType):void{
        this._current_function = this._current_module.get_module_function(func_name);
		this._current_functions_stack.push(this._current_function);
        
		const ic_function_enter = CompilerIcNode.create_function_enter(this._compiler_scope, this._current_module.get_module_name(), func_name, return_type);
        this._current_function.add_ic_statement(ic_function_enter);
    }
	

    leave_function_declaration(func_name:string, return_type:ICompilerType):void{
        const ic_function_leave = CompilerIcNode.create_function_leave(this._compiler_scope, this._current_module.get_module_name(), func_name, return_type);
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
		let smb:ICompilerSymbol = undefined;
		
		while(symbol_type == undefined && stack_index >= 0){
			stack_function = this._current_functions_stack[stack_index];
			smb = stack_function.get_symbol(symbol_name);
			if (smb) {
				symbol_type = smb.type;
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
	get_function_symbol_type(module_name:string, symbol_name:string):ICompilerType {
		// GET MODULE
		const module = this._compiler_scope.get_module(module_name);
		if (! module) {
			return undefined;
		}
		
		// SYMBOL IS A FUNCTION
		if ( module.has_module_function(symbol_name) ){
			return module.get_module_function(symbol_name).get_returned_type();
		}
		if ( module.has_exported_function(symbol_name) ){
			return module.get_exported_function(symbol_name).get_returned_type();
		}
		
        return undefined;
    }
}
