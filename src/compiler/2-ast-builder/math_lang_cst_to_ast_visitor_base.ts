
import ICompilerType from '../../core/icompiler_type';
import { math_lang_parser } from '../1-cst-builder/math_lang_parser';
import { BINOP_TYPES, PREUNOP_TYPES, POSTUNOP_TYPES,  TYPES } from '../math_lang_types';
// import { SymbolDeclarationRecord, FunctionScope, ModuleScope } from '../3-ic-builder/math_lang_function_scope';

import { SymbolDeclaration, ICompilerFunction } from '../../core/icompiler_function';
import CompilerFunction from '../0-common/compiler_function';
import CompilerModule from '../0-common/compiler_module';
import IMethod from '../../core/imethod';

import CompilerScope from '../0-common/compiler_scope';


/**
 * CST visitor base class.
 */
const BaseVisitor = math_lang_parser.getBaseCstVisitorConstructor()

/**
 * AST builder error record type.
 */
type AstBuilderErrorRecord = {
    context:object,
    type:string,
    ic_type:string,
    message:string
};

/**
 * Array of AST buider errors.
 */
type AstBuilderErrorArray = Array<AstBuilderErrorRecord>;

/**
 * Stack of function scopes.
 */
type ScopesStack = Array<ICompilerFunction>;

/**
 * Map of function scopes.
 */
// type ScopesMap = Map<string,CompilerModule>;



/**
 * Base class for CST Visitors class. Provides scopes, symbols, types and errors features.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangCstToAstVisitorBase extends BaseVisitor {
    protected _errors:AstBuilderErrorArray       = undefined;
    protected _unknow_symbols:string[]           = undefined;

    protected _compiler_scope:CompilerScope      = undefined;
    protected _default_module:CompilerModule     = undefined;
    protected _default_function:CompilerFunction = undefined;
    
    protected _current_module:CompilerModule     = undefined;
    protected _current_function:CompilerFunction = undefined;
    
    // protected _current_scope_path:string   = 'default:main';

    protected _scopes_stack:ScopesStack          = undefined;


    /**
     * Constructor, nothing to do.
     * 
     * @param _types_map private property, map of types.
     */
    constructor(compiler_scope:CompilerScope) {
        super();
        this._compiler_scope   = compiler_scope;

        this.reset();
    }


    /**
     * Test if the named type exists in features.
     * 
     * @param type_name      type name to check.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns true for success, else false.
     */
    check_type(type_name:string, cst_context:string, ast_node_type:any){
        const has_type = this._compiler_scope.has_available_lang_type(type_name);
        if (! has_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
        }
        return true;
    }


    /**
     * Test if the named method exists in given value type.
     * 
     * @param type_name      value type name.
     * @param method_name    method name.
     * @param operands_types method operands types names.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns true for success, else false.
     */
    check_method(type_name:string, method_name:string, operands_types:string[], cst_context:string, ast_node_type:any){
        const obj_type = this._compiler_scope.get_available_lang_type(type_name);
        return obj_type ? obj_type.has_method_with_types_names(method_name, operands_types) : false;
/*
        let has_error = false;

        // CHECK VALUE TYPE
        const value_type:IType = this._types_map.get(type_name);
        if (! value_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
            has_error = true;
        }

        // CHECK METHOD OPERANDS TYPES
        const opd_types:IType[] = [];
        
        operands_types.forEach(
            (opd_type_name, index)=>{
                const opd_type:IType = this._types_map.get(type_name);
                if (! opd_type){
                    this.add_error(cst_context, ast_node_type, 'Error:type [' + opd_type.get_name() + '] not found for operand [' + index + '] of value type [' + type_name + '] method [' + method_name + ']');
                    has_error = true;
                } else {
                    opd_types.push(opd_type);
                }
            }
        )

        // CHECK VALUE TYPE METHOD
        if (! has_error){
            const has_method:IMethod = value_type.get_method(method_name, opd_types);
            if (! has_method){
                this.add_error(cst_context, ast_node_type, 'Error:method not found [' + method_name + '] for value type [' + type_name + ']');
                has_error = true;
            }
        }

        return ! has_error;*/
    }


    /**
     * Test if the named attribute exists in given value type.
     * 
     * @param type_name      value type name to check.
     * @param attribute_name attribute name to check.
     * @param attribute_type attribute type name to check.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns true for success, else false.
     */
    check_attribute(type_name:string, attribute_name:string, attribute_type_name:string, cst_context:string, ast_node_type:any){
        let has_error = false;

        // CHECK VALUE TYPE
        const value_type:ICompilerType = this._compiler_scope.get_available_lang_type(type_name);
        if (! value_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
            return false;
        }

        const attribute_type = value_type.get_attribute(attribute_name);
        return attribute_type ? attribute_type.get_type_name() == attribute_type_name : false;
    }


    /**
     * Test if the named attribute exists in given value type.
     * 
     * @param type_name      value type name to check.
     * @param attribute_name attribute name to check.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns type name.
     */
    get_attribute_type(type_name:string, attribute_name:string, cst_context:string, ast_node_type:any){
        let has_error = false;

        // CHECK VALUE TYPE
        const value_type:ICompilerType = this._compiler_scope.get_available_lang_type(type_name);
        if (! value_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
           return TYPES.UNKNOW;
        }

        const attribute_type = value_type.get_attribute(attribute_name);

        return attribute_type ? attribute_type.get_type_name() : TYPES.UNKNOW;
    }


    /**
     * Test indexes count for a given type.
     * 
     * @param type_name      value type name to check.
     * @param indexes_count  indexes count.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns true for success, else false.
     */
    check_type_indexes(type_name:string, indexes_count:number, cst_context:string, ast_node_type:any):boolean{
        // CHECK VALUE TYPE
        const value_type:ICompilerType = this._compiler_scope.get_available_lang_type(type_name);
        if (! value_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
            return false;
        }

        const has_indexes = value_type.get_indexes_count() == indexes_count;
        if (! has_indexes){
            this.add_error(cst_context, ast_node_type, 'Error:type [' + type_name + '] has not indexes [' + indexes_count + ']');
            return false;
        }

        // TODO: to rework check_type_indexes

        return true;
    }


    /**
     * Get type at given index.
     * 
     * @param type_name      value type name to check.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns type.
     */
    get_indexed_type(type_name:string, cst_context:any, ast_node_type:any):string{
        // CHECK VALUE TYPE
        const value_type:ICompilerType = this._compiler_scope.get_available_lang_type(type_name);
        if (! value_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
            return TYPES.UNKNOW;
        }

        const type_instance = value_type.get_indexed_type();
        if (! type_instance){
            this.add_error(cst_context, ast_node_type, 'Error:type [' + type_name + '] has no indexed type');
            return TYPES.UNKNOW;
        }

        return type_instance.get_type_name();
        
        // TODO rework get_indexed_type
    }


    /**
     * Get scopes map.
     * @return Map 
     */
    get_compiler_scope() {
        return this._compiler_scope;
    }


    /**
     * Dump a CST contextual node.
     * 
     * @param label dump label
     * @param ctx   cst node
     */
    dump_ctx(label:string, ctx:any) {
        const json = JSON.stringify(ctx);
        console.log(label, json)
    }


    /**
     * Compute binary operator result type.
     * @param operator      binary operator name.
     * @param left_type     left operand type.
     * @param right_type    right operand type.
     * @param cst_context   CST context for error log.
     * @param ast_node_type AST node type for error log.
     * @returns result type
     */
	compute_binop_type(operator:string, left_type:any, right_type:any, cst_context:any, ast_node_type:string):string {
        const key:string = operator + left_type.ic_type + right_type.ic_type;
        // console.log('compute_binop_type.key', key);
        const get_type_name = BINOP_TYPES.get(key);
        const type_name = get_type_name ? get_type_name : TYPES.UNKNOW;

        this.check_type(type_name, cst_context, ast_node_type);

        return type_name;
    }


    /**
     * Compute prefix unary operator result type.
     * @param operator      prefix unary operator name.
     * @param right_type    right operand type.
     * @param cst_context   CST context for error log.
     * @param ast_node_type AST node type for error log.
     * @returns result type
     */
	compute_preunop_type(operator:string, right_type:any, cst_context:any, ast_node_type:string):string {
        const key:string = operator + right_type.ic_type;
        // console.log('compute_preunop_type.key', key);
        const get_type_name = PREUNOP_TYPES.get(key);
        const type_name = get_type_name ? get_type_name : TYPES.UNKNOW;

        this.check_type(type_name, cst_context, ast_node_type);

        return type_name;
    }


    /**
     * Compute postfix unary operator result type.
     * @param operator      binary operator name.
     * @param left_type     left operand type.
     * @param cst_context   CST context for error log.
     * @param ast_node_type AST node type for error log.
     * @returns result type
     */
	compute_postunop_type(operator:string, left_type:any, cst_context:any, ast_node_type:string):string {
        const key:string = operator + left_type.ic_type;
        // console.log('compute_postunop_type.key', key);
        const get_type_name = POSTUNOP_TYPES.get(key);
        const type_name = get_type_name ? get_type_name : TYPES.UNKNOW;

        this.check_type(type_name, cst_context, ast_node_type);

        return type_name;
    }


    /**
     * Get symbol (identifier) type.
     * @param name   symbol name
     * @returns result type
     */
	get_symbol_type(name:string):string {
        let loop_scope;
        for(loop_scope of this._scopes_stack) {
            if (loop_scope.has_symbol_const(name)) {
                return loop_scope.get_symbol_const(name).type;
            }
            if (loop_scope.has_symbol_var(name)) {
                return loop_scope.get_symbol_var(name).type;
            }
            if (loop_scope.has_symbol_operand(name)) {
                return loop_scope.get_symbol_operand(name).type;
            }
        }
        return TYPES.UNKNOW;
    }


    /**
     * Get function return type.
     * @param module_name module name
     * @param func_name   function name
     * @returns return type
     */
	get_function_type(module_instance:CompilerModule, func_name:string):string {
        const func_scope = module_instance.get_module_function(func_name);
        if (! func_scope) {
            return TYPES.UNKNOW;
        }
        return func_scope.get_returned_type();
    }

    
    /**
     * Register a symbol declaration.
     * @param name          symbol name.
     * @param ic_type       symbol value type.
     * @param is_constant   symbol is a constant ?
     * @param init_value    symbol initialization value.
     * @param cst_context   CST context for error log.
     * @param ast_node_type AST node type for error log.
     * @returns true for success or false for failure
     */
    register_symbol_declaration(name:string, ic_type:string, is_constant:boolean, init_value:string, cst_context:any, ast_node_type:string) {
        this.check_type(ic_type, cst_context, ast_node_type);

        if (is_constant) {
            this._current_function.add_symbol_const(name, ic_type, init_value);
        } else {
            this._current_function.add_symbol_var(name, ic_type, init_value);
        }
    }

    /**
     * Register a function declaration.
     * @param func_name             function name.
     * @param return_type           returned value type.
     * @param operands_declarations function operands declaration.
     * @param instructions          function instruction block.
     * @param cst_context           CST context for error log.
     * @param ast_node_type         AST node type for error log.
     */
    register_function_declaration(func_name:string, return_type:string, operands_declarations:any[], instructions:any[], cst_context:any, ast_node_type:string) {
        this.check_type(return_type, cst_context, ast_node_type);

        const func = new CompilerFunction(func_name, return_type);
        func.set_ast_statements(instructions);
        this._current_module.add_exported_function(func);

        // PROCESS OPERANDS
        let opd_decl:any;
        for(opd_decl of operands_declarations){
            this.check_type(opd_decl.opd_type, cst_context, ast_node_type);

            func.add_symbol_operand(opd_decl.opd_name, opd_decl.opd_type, undefined);
        }
    }

    /**
     * Unregister a function declaration.
     * @param func_name             function name.
     */
    unregister_function_declaration(func_name:string) {
        this._current_module.del_exported_function(func_name);
    }

    set_function_declaration_statements(func_name:string, instructions:any[]){
        const func = this._current_module.get_module_function(func_name);
        if (! func) {
            this.add_error({}, 'set_function_declaration_statements', 'function [' + func_name + '] not found');
            return;
        }
        func.set_ast_statements(instructions);
    }

    set_function_declaration_type(func_name:string, return_type:string){
        const func = this._current_module.get_module_function(func_name);
        if (! func) {
            this.add_error({}, 'set_function_declaration_type', 'function [' + func_name + '] not found');
            return;
        }
        func.set_returned_type(return_type);
    }

    enter_function_declaration(func_name:string){
        const func_scope = this._current_module.get_module_function(func_name);
        if (! func_scope) {
            this.add_error({}, 'enter_function_declaration', 'function [' + func_name + '] not found');
            return;
        }
        this._scopes_stack.push(func_scope);
    }

    leave_function_declaration(){
        this._scopes_stack.pop();
    }

    /**
     * Test if a symbol is already declared for a function.
     * @param name symbol name
     * @returns true:symbol is a declared, false: symbol is not a declared
     */
    has_declared_func_symbol(func_name:string):boolean {
        return this._compiler_scope.has_exported_function(func_name) || this._current_module.has_module_function(func_name);
    }

    /**
     * Test if a symbol is already declared for a variable.
     * @param name symbol name
     * @returns true:symbol is a declared variable, false: symbol is not a declared variable
     */
    has_declared_var_symbol(name:string):boolean {
        let loop_scope;
        for(loop_scope of this._scopes_stack) {
            if (loop_scope.has_symbol_const(name)) {
                return true;
            }
            if (loop_scope.has_symbol_var(name)) {
                return true;
            }
            if (loop_scope.has_symbol_operand(name)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Test if a symbol is already declared for a constant.
     * @param name symbol name
     * @returns true:symbol is a declared, false: symbol is not a declared
     */
    has_declared_consts_symbol(name:string):boolean {
        let loop_scope;
        for(loop_scope of this._scopes_stack) {
            if (loop_scope.has_symbol_const(name)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Test if a symbol is already declared for a variable.
     * @param name symbol name
     * @returns true:symbol is a declared, false: symbol is not a declared
     */
    has_declared_vars_symbol(name:string):boolean {
        let loop_scope;
        for(loop_scope of this._scopes_stack) {
            if (loop_scope.has_symbol_var(name)) {
                return true;
            }
        }
        return false;
    }


    /**
     * Test if a symbol is already declared for an operand.
     * @param name symbol name
     * @returns true:symbol is a declared, false: symbol is not a declared
     */
    has_declared_opds_symbol(name:string):boolean {
        let loop_scope;
        for(loop_scope of this._scopes_stack) {
            if (loop_scope.has_symbol_operand(name)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Test if a symbol is already declared for a variable.
     * @param name symbol name
     * @returns declared variable or undefined if not found
     */
    get_declared_var_symbol(name:string):SymbolDeclaration {
        let loop_scope;
        for(loop_scope of this._scopes_stack) {
            if (loop_scope.has_symbol_const(name)) {
                return loop_scope.get_symbol_const(name);
            }
            if (loop_scope.has_symbol_var(name)) {
                return loop_scope.get_symbol_var(name);
            }
            if (loop_scope.has_symbol_operand(name)) {
                return loop_scope.get_symbol_operand(name);
            }
        }
        return undefined;
    }


    /**
     * Get current function scope.
     * @returns current scope
     */
    get_current_scope():ICompilerFunction {
        return this._current_function;
    }


    /**
     * Test errors.
     * 
     * @returns boolean
     */
    has_errors(){
        return this._errors.length > 0;
    }


    /**
     * Get errors.
     * 
     * @returns errors
     */
    get_errors():AstBuilderErrorArray{
        return this._errors;
    }


    /**
     * Add an error.
     * 
     * @param cst_context   CST context.
     * @param ast_node_type  AST node type.
     * @param message   human text to explain the error.
     * 
     * @returns 
     */
    add_error(cst_context:any, ast_node_type:string, message:string){

        const error_node = {
            type: ast_node_type,
            ic_type: TYPES.ERROR,
            context:cst_context,
            message:message
        };

        this._errors.push(error_node);

        return error_node;
    }


    /**
     * Get unknow symbols.
     * 
     * @returns array of symbols strings.
     */
    get_unknow_symbols() {
        return this._unknow_symbols;
    }


    /**
     * Test unknow symbols.
     * 
     * @returns boolean.
     */
    has_unknow_symbols() {
        return this._unknow_symbols.length > 0;
    }


    /**
     * Reset state.
     */
    reset(){
        this._errors           = new Array();
        this._unknow_symbols   = new Array();

        this._scopes_stack     = new Array();
        this._default_module   = new CompilerModule(this._compiler_scope, 'default');
        this._default_function = new CompilerFunction('main', 'none');
        this._default_module.add_module_function(this._default_function);

        this._current_module   = this._default_module;
        this._current_function = this._default_function;
        this._scopes_stack.push(this._default_function);
    }
}
