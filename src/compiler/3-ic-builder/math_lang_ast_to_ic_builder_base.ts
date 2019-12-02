
import ICompilerError from '../../core/icompiler_error';
import ICompilerType from '../../core/icompiler_type';
import ICompilerSymbol from '../../core/icompiler_symbol';
import ICompilerFunction from '../../core/icompiler_function';
import ICompilerModule from '../../core/icompiler_module';
import ICompilerScope from '../../core/icompiler_scope';
import { ICompilerIcInstr, ICompilerIcInstrOperand, ICompilerIcEbb } from '../../core/icompiler_ic_instruction';

import CompilerIcNode from '../0-common/compiler_ic_instruction';
import CompilerModule from '../0-common/compiler_module';


/**
 * Typed AST Visitor base class. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default abstract class MathLangAstToIcVisitorBase {
    private _errors:ICompilerError[] = [];
	private _current_module:ICompilerModule = undefined;
	private _current_function:ICompilerFunction = undefined;
	private _current_functions_stack:ICompilerFunction[] = new Array();
    private _current_ebb:ICompilerIcEbb = undefined;
    

    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(private _compiler_scope:ICompilerScope ) {
    }


    abstract visit_expression(ast_expression:any):ICompilerIcInstrOperand|ICompilerError;
    abstract visit_value_id(ast_expression:any):ICompilerIcInstrOperand|ICompilerError;


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
     * Get current function ebb.
     * 
     * @returns ICompilerIcEbb.
     */
    get_current_ebb():ICompilerIcEbb{
        return this._current_ebb;
    }



    /**
     * Test if a variable type is an ICError.
     * @param toBeDetermined variable to test type
     */
    is_error(var_to_test: ICompilerIcInstrOperand|ICompilerError): var_to_test is ICompilerError {
        if((var_to_test as ICompilerError).error_message){
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


    // declare_module(module_name:string):void {
    //     this._current_module = new CompilerModule(this._compiler_scope, module_name);
    // }


    // declare_function(func_name:string, return_type:ICompilerType, opds_records:ICompilerIcOperand[], ic_statements:ICompilerIcInstruction[]=[]):ICompilerIcFunction{
    //     return CompilerIcNode.create_function(this._compiler_scope, this._current_module.get_module_name(), func_name, return_type, opds_records, ic_statements);
	// }
	
	
    enter_function_declaration(func_name:string){
        this._current_function = this._current_module.get_module_function(func_name);
		this._current_functions_stack.push(this._current_function);
    }
	

    leave_function_declaration(func_name:string){
		this._current_functions_stack.pop();
		this._current_function = undefined;
    }


    // declare_method(object_type:ICompilerType, object_name:string, method_name:string, return_type:ICompilerType, opds_records:ICompilerIcOperand[], ic_statements:ICompilerIcInstruction[]=[]):ICompilerIcMethod{
    //     return CompilerIcNode.create_method(this._compiler_scope, this._current_module.get_module_name(), object_type, object_name, method_name, return_type, opds_records, ic_statements);
	// }

    create_ebb(operands_types: ICompilerType[], operands_names: string[]): void {
        this._current_ebb = CompilerIcNode.create_ebb(this.get_current_function(), operands_types, operands_names);
    }

    add_ic_ebb_instruction(instr:ICompilerIcInstr):void {
        if (! this._current_ebb) {
            this.add_error(instr, 'add ebb instr: No current ebb');
            return;
        }
        this._current_ebb.ic_instructions.push(instr);
    }

    create_ic_ebb_instruction(func:Function, operands:any[]):string {
        const var_name = this.get_current_function().add_ic_variable();
        const instr = func(var_name, ...operands);
        this.add_ic_ebb_instruction(instr);
        return var_name;
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


    /**
     * Get symbol (identifier) type.
     * @param name   symbol name
     * @returns result type
     */
	// get_ic_operand_name(code_name:string):ICompilerIcInstrOperand {
    //     let ic_name:ICompilerIcInstrOperand = undefined;

    //     // SEARCH IN CURRENT EBB
    //     if (this._current_ebb.ic_opderands_map.has(code_name)) {
    //         return this._current_ebb.ic_opderands_map.get(code_name);
    //     }

    //     // SEARCH IN CURRENT FUNCTION
    //     const ebbs_map = this._current_function.get_ic_ebb_map();
    //     ebbs_map.forEach(
    //         (ebb)=>{
    //             if (ebb.ic_opderands_map.has(code_name)) {
    //                 ic_name = ebb.ic_opderands_map.get(code_name);
    //             }
    //         }
    //     );
    //     if (ic_name) {
    //         return ic_name;
    //     }

    //     // SEARCH IN FUNCTION STACK EBBs
	// 	const size = this._current_functions_stack.length;
	// 	let stack_index = size - 2;
	// 	let stack_function:ICompilerFunction = undefined;
    //     let ebb:ICompilerIcEbb = undefined
		
	// 	while(ic_name == undefined && stack_index >= 0){
    //         stack_function = this._current_functions_stack[stack_index];
            
    //         const ebbs_map = this._current_function.get_ic_ebb_map();
    //         ebbs_map.forEach(
    //             (ebb)=>{
    //                 if (ebb.ic_opderands_map.has(code_name)) {
    //                     ic_name = ebb.ic_opderands_map.get(code_name);
    //                 }
    //             }
    //         );
            
	// 		stack_index--;
	// 	}
		
	// 	return symbol_type;
	// }


    /**
     * Get operands expressions
     * 
     * @param ast_expression AST expression
     * 
     * @returns ICompilerIcOperand[]
     */
    get_operands_expressions(ast_expression:any):ICompilerIcInstrOperand[]|ICompilerError{
        // PROCESS OPERANDS
        const opds_count = ast_expression.operands_expressions.length;
        const operands_expressions:ICompilerIcInstrOperand[] = [];
        let loop_index;
        let loop_opd:ICompilerIcInstrOperand|ICompilerError;
        let loop_ast_opd;
        for(loop_index=0; loop_index < opds_count; loop_index++){
            loop_ast_opd = ast_expression.operands_expressions[loop_index];
            loop_opd = this.visit_expression(loop_ast_opd);
            if ( this.is_error(loop_opd) ){
                return loop_opd;
            }
            operands_expressions.push(loop_opd);
        }
        return operands_expressions;
    }
}
