
import ICompilerType from '../0-api/icompiler_type';
import ICompilerScope from '../0-api/icompiler_scope';
import ICompilerSymbol from '../0-api/icompiler_symbol';
import ICompilerFunction from '../0-api/icompiler_function';

import CompilerFunction from '../0-common/compiler_function'; // TODO replace by interface
import CompilerModule from '../0-common/compiler_module'; // TODO replace by interface

import { math_lang_parser } from '../1-cst-builder/math_lang_parser';
import { BINOP_TYPES, PREUNOP_TYPES, POSTUNOP_TYPES } from '../math_lang_types';
import ICompilerModule from '../0-api/icompiler_module';




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
    ic_type:ICompilerType,
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

    protected _default_module:CompilerModule     = undefined;
    protected _default_function:CompilerFunction = undefined;
    
    protected _current_module:CompilerModule     = undefined;
    protected _current_function:CompilerFunction = undefined;
    protected _current_type:ICompilerType        = undefined;

    protected _type_unknow:ICompilerType         = undefined;
    protected _type_integer:ICompilerType        = undefined;
    protected _type_error:ICompilerType          = undefined;
    protected _type_record:ICompilerType         = undefined;
    protected _type_array:ICompilerType          = undefined;
    
    // protected _current_scope_path:string   = 'default:main';

    protected _scopes_stack:ScopesStack          = undefined;


    /**
     * Constructor, nothing to do.
     * 
     * @param compiler_scope compiler scope.
     */
    constructor(protected _compiler_scope:ICompilerScope) {
        super();

        this.reset();

        this._type_unknow  = this._compiler_scope.get_available_lang_type('UNKNOW');
        this._type_integer = this._compiler_scope.get_available_lang_type('INTEGER');
        this._type_error   = this._compiler_scope.get_available_lang_type('ERROR');
        this._type_record  = this._compiler_scope.get_available_lang_type('RECORD');
        this._type_array   = this._compiler_scope.get_available_lang_type('ARRAY');
    }


    /**
     * Get type instance.
     * 
     * @param type_name      type name to check.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_type(type_name:string, cst_context:any, ast_node_type:any):ICompilerType{
        const get_type = this._compiler_scope.get_available_lang_type(type_name);

        if (get_type) {
            return get_type;
        }

        if (this._current_module){
            if (this._current_module.has_module_type(type_name)) {
                return this._current_module.get_module_type(type_name);
            }

            const used_modules = this._current_module.get_used_modules();
            let found_type:ICompilerType = undefined;
            used_modules.forEach(
                (loop_module)=>{
                    if (loop_module.has_module_type(type_name)){
                        found_type = loop_module.get_module_type(type_name);
                        return;
                    }
                }
            );
            if (found_type) return found_type;
        }
        
        this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
        return undefined;
    }


    /**
     * Get BOOLEAN type instance.
     * 
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_boolean_type(cst_context:any, ast_node_type:any){
        return this.get_type('BOOLEAN', cst_context, ast_node_type);
    }


    /**
     * Get INTEGER type instance.
     * 
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_integer_type(cst_context:any, ast_node_type:any){
        return this._type_integer;
        // return this.get_type('INTEGER', cst_context, ast_node_type);
    }


    /**
     * Get BIGINTEGER type instance.
     * 
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_biginteger_type(cst_context:any, ast_node_type:any){
        return this.get_type('BIGINTEGER', cst_context, ast_node_type);
    }


    /**
     * Get FLOAT type instance.
     * 
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_float_type(cst_context:any, ast_node_type:any){
        return this.get_type('FLOAT', cst_context, ast_node_type);
    }


    /**
     * Get BIGFLOAT type instance.
     * 
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_bigfloat_type(cst_context:any, ast_node_type:any){
        return this.get_type('BIGFLOAT', cst_context, ast_node_type);
    }


    /**
     * Get STRING type instance.
     * 
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_string_type(cst_context:any, ast_node_type:any){
        return this.get_type('STRING', cst_context, ast_node_type);
    }


    /**
     * Get KEYWORD type instance.
     * 
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_keyword_type(cst_context:any, ast_node_type:any){
        return this.get_type('KEYWORD', cst_context, ast_node_type);
    }


    /**
     * Get UNKNOW type instance.
     * 
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_unknow_type(cst_context:any, ast_node_type:any){
        return this.get_type('UNKNOW', cst_context, ast_node_type);
    }


    /**
     * Get RECORD type instance.
     * 
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_record_type(cst_context:any, ast_node_type:any){
        return this._type_record;
    }


    /**
     * Get ARRAY type instance.
     * 
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_array_type(cst_context:any, ast_node_type:any){
        return this._type_array;
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
    check_type(type_name:string, cst_context:string, ast_node_type:any):boolean{
        const has_type = this._compiler_scope.has_available_lang_type(type_name);
        if (has_type) {
            return true;
        }

        if (this._current_module){
            if (this._current_module.has_module_type(type_name)) {
                return true;
            }
            const used_modules = this._current_module.get_used_modules();
            let found = false;
            used_modules.forEach(
                (loop_module)=>{
                    if (loop_module.has_module_type(type_name)){
                        found = true;
                        return;
                    }
                }
            );
            if (found) return true;
        }

        this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
        return false;
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
    check_method(value_type:ICompilerType, method_name:string, operands_types:string[], cst_context:string, ast_node_type:any){
        return value_type ? value_type.has_method_with_types_names(method_name, operands_types) : false;
    }


    /**
     * Test if the named attribute exists in given value type.
     * 
     * @param value_type     value type to check.
     * @param attribute_name attribute name to check.
     * @param attribute_type attribute type name to check.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns true for success, else false.
     */
    check_attribute(value_type:ICompilerType, attribute_name:string, attribute_type:ICompilerType, cst_context:string, ast_node_type:any){
        return this.get_attribute_type(value_type, attribute_name, cst_context, ast_node_type) == attribute_type;
    }


    /**
     * Test if the named attribute exists in given value type.
     * 
     * @param value_type     value type.
     * @param attribute_name attribute name to get.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_attribute_type(value_type:ICompilerType, attribute_name:string, cst_context:string, ast_node_type:any):ICompilerType{
        if (value_type) {
            const attribute_type = value_type.get_attribute(attribute_name);
            if (attribute_type) return attribute_type;
        }

        return this.get_unknow_type(cst_context, ast_node_type);
    }


    /**
     * Test indexes count for a given type.
     * 
     * @param value_type     value type to check.
     * @param indexes_count  indexes count.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns true for success, else false.
     */
    check_type_indexes(value_type:ICompilerType, indexes_count:number, cst_context:string, ast_node_type:any):boolean{
        const has_indexes = value_type.get_indexes_count() == indexes_count;
        if (! has_indexes){
            this.add_error(cst_context, ast_node_type, 'Error:type [' + (value_type ? value_type.get_type_name() : 'bad type instance') + '] has not indexes [' + indexes_count + ']');
            return false;
        }

        return true;
    }


    /**
     * Get type at given index.
     * 
     * @param value_type     value type to check.
     * @param cst_context    CST context for error log.
     * @param ast_node_type  AST node type for error log.
     * 
     * @returns ICompilerType
     */
    get_indexed_type(value_type:ICompilerType, cst_context:any, ast_node_type:any):ICompilerType{
        const type_instance = value_type ? value_type.get_indexed_type() : this._type_unknow;
        if (! type_instance){
            this.add_error(cst_context, ast_node_type, 'Error:type [' + (value_type ? value_type.get_type_name() : 'bad type instance') + '] has no indexed type');
            return this.get_unknow_type(cst_context, ast_node_type);
        }

        return type_instance;
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
     * @returns ICompilerType
     */
	compute_binop_type(operator:string, left_type:any, right_type:any, cst_context:any, ast_node_type:string):ICompilerType {
        const key_left:string  = left_type  ? left_type.get_type_name()  : 'UNKNOW';
        const key_right:string = right_type ? right_type.get_type_name() : 'UNKNOW';
        const key:string = operator + key_left + key_right;

        const get_type_name = BINOP_TYPES.get(key);
        const type_name = get_type_name ? get_type_name : 'UNKNOW';

        // if (type_name == 'UNKNOW') {
        //     console.log('compute_binop_type.key', key, ' result:', type_name);
        // }
        this.check_type(type_name, cst_context, ast_node_type);

        return this.get_type(type_name, cst_context, ast_node_type);
    }


    /**
     * Compute prefix unary operator result type.
     * @param operator      prefix unary operator name.
     * @param right_type    right operand type.
     * @param cst_context   CST context for error log.
     * @param ast_node_type AST node type for error log.
     * @returns ICompilerType
     */
	compute_preunop_type(operator:string, right_type:any, cst_context:any, ast_node_type:string):ICompilerType {
        const key_right:string = right_type ? right_type.get_type_name() : 'UNKNOW';
        const key:string = operator + key_right;

        // console.log('compute_preunop_type.key', key);
        const get_type_name = PREUNOP_TYPES.get(key);
        const type_name = get_type_name ? get_type_name : 'UNKNOW';

        this.check_type(type_name, cst_context, ast_node_type);

        return this.get_type(type_name, cst_context, ast_node_type);
    }


    /**
     * Compute postfix unary operator result type.
     * @param operator      binary operator name.
     * @param left_type     left operand type.
     * @param cst_context   CST context for error log.
     * @param ast_node_type AST node type for error log.
     * @returns ICompilerType
     */
	compute_postunop_type(operator:string, left_type:any, cst_context:any, ast_node_type:string):ICompilerType {
        const key_left:string = left_type ? left_type.get_type_name() : 'UNKNOW';
        const key:string = operator + key_left;

        // console.log('compute_postunop_type.key', key);
        const get_type_name = POSTUNOP_TYPES.get(key);
        const type_name = get_type_name ? get_type_name : 'UNKNOW';

        this.check_type(type_name, cst_context, ast_node_type);

        return this.get_type(type_name, cst_context, ast_node_type);
    }


    /**
     * Get symbol (identifier) type.
     * @param name   symbol name
     * @returns ICompilerType
     */
	get_symbol_type(name:string):ICompilerType {
        // LOOP ON CURRENT MODULE CONSTANTS
        const has_exported_const = this._current_module.has_exported_constant(name);
        if (has_exported_const){
            return this._current_module.get_exported_constant(name).type;
        }
        const has_module_const = this._current_module.has_module_constant(name);
        if (has_module_const){
            return this._current_module.get_module_constant(name).type;
        }

        // LOOP ON FUNCTIONS STACK SYMBOLS
        let loop_scope:ICompilerFunction;
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
        return this._type_unknow;
    }


    /**
     * Get function return type.
     * @param module_name module name
     * @param func_name   function name
     * @returns return type
     */
	get_function_type(module_instance:CompilerModule, func_name:string):ICompilerType {
        const module_func = module_instance.get_module_function(func_name);
        if (! module_func) {
            if (! this._current_function){
                return this._type_unknow;
            }
            const local_func = this._current_function.get_local_function(func_name);
            return local_func.get_returned_type();
        }
        return module_func.get_returned_type();
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
    register_symbol_declaration(name:string, ic_type:ICompilerType, is_constant:boolean, init_value:string, cst_context:any, ast_node_type:string) {
        // this.check_type(ic_type, cst_context, ast_node_type);

        if (is_constant) {
            this._current_function.add_symbol_const(name, ic_type, init_value);
        } else {
            this._current_function.add_symbol_var(name, ic_type, init_value);
        }
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
    register_module_constant_declaration(symbol_name:string, symbol_type:ICompilerType, is_constant:boolean, symbol_value:string, cst_context:any, ast_node_type:string) {
        // this.check_type(ic_type, cst_context, ast_node_type);
        const smb = {
            name:symbol_name,
            // path:string,
            type:symbol_type,
            is_constant:is_constant,
            init_value: symbol_value,
            uses_count:0
        };

        this._current_module.add_module_constant(smb);
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
    register_exported_module_constant_declaration(symbol_name:string, symbol_type:ICompilerType, is_constant:boolean, symbol_value:string, cst_context:any, ast_node_type:string) {
        // this.check_type(ic_type, cst_context, ast_node_type);
        const smb = {
            name:symbol_name,
            // path:string,
            type:symbol_type,
            is_constant:is_constant,
            init_value: symbol_value,
            uses_count:0
        };

        this._current_module.add_exported_constant(smb);
    }

    /**
     * Register a function declaration.
     * @param func_name             function name.
     * @param return_type           returned value type.
     * @param is_exported           function is exported?
     * @param operands_declarations function operands declaration.
     * @param instructions          function instruction block.
     * @param cst_context           CST context for error log.
     * @param ast_node_type         AST node type for error log.
     */
    register_function_declaration(func_name:string, return_type:ICompilerType, is_exported:boolean, operands_declarations:any[], instructions:any[], cst_context:any, ast_node_type:string) {
        // this.check_type(return_type, cst_context, ast_node_type);

        const func = new CompilerFunction(func_name, return_type);
        func.set_ast_statements(instructions);

        func.set_exported(is_exported);
        func.set_module_name(this._current_module.get_module_name());
        
        if (is_exported) {
            this._current_module.add_exported_function(func);
        } else {
            this._current_module.add_module_function(func);
        }

        // PROCESS OPERANDS
        let opd_decl:any;
        for(opd_decl of operands_declarations){
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

    set_function_declaration_type(func_name:string, return_type:ICompilerType){
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
     * Register a local function declaration.
     * @param func_name             function name.
     * @param return_type           returned value type.
     * @param operands_declarations function operands declaration.
     * @param instructions          function instruction block.
     * @param cst_context           CST context for error log.
     * @param ast_node_type         AST node type for error log.
     */
    register_local_function_declaration(func_name:string, return_type:ICompilerType, operands_declarations:any[], instructions:any[], cst_context:any, ast_node_type:string) {
        // this.check_type(return_type, cst_context, ast_node_type);

        const func = new CompilerFunction(func_name, return_type);
        func.set_ast_statements(instructions);

        func.set_exported(false);
        func.set_module_name(this._current_module.get_module_name());
        
        this._current_function.add_local_function(func);

        // PROCESS OPERANDS
        let opd_decl:any;
        for(opd_decl of operands_declarations){
            func.add_symbol_operand(opd_decl.opd_name, opd_decl.opd_type, undefined);
        }
    }

    /**
     * Unregister a function declaration.
     * @param func_name             function name.
     */
    unregister_local_function_declaration(func_name:string) {
        this._current_function.del_local_function(func_name);
    }

    set_local_function_declaration_statements(func_name:string, instructions:any[]){
        const func = this._current_function.get_local_function(func_name);
        if (! func) {
            this.add_error({}, 'set_local_function_declaration_statements', 'function [' + func_name + '] not found');
            return;
        }
        func.set_ast_statements(instructions);
    }

    set_local_function_declaration_type(func_name:string, return_type:ICompilerType){
        const func = this._current_function.get_local_function(func_name);
        if (! func) {
            this.add_error({}, 'set_local_function_declaration_type', 'function [' + func_name + '] not found');
            return;
        }
        func.set_returned_type(return_type);
    }

    enter_local_function_declaration(func_name:string){
        const func_scope = this._current_function.get_local_function(func_name);
        if (! func_scope) {
            this.add_error({}, 'enter_local_function_declaration', 'function [' + func_name + '] not found');
            return;
        }
        this._scopes_stack.push(func_scope);
    }

    leave_local_function_declaration(){
        this._scopes_stack.pop();
    }


    /**
     * Test if a symbol is already declared for a function.
     * @param name symbol name
     * @returns true:symbol is a declared, false: symbol is not a declared
     */
    has_declared_func_symbol(func_name:string):boolean {
        return this._compiler_scope.has_exported_function(func_name)
         || this._current_module.has_module_function(func_name)
         || (this._current_function && this._current_function.has_local_function(func_name));
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
    get_declared_var_symbol(name:string):ICompilerSymbol {
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
            ic_type: this._type_error,
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
        this._default_function = new CompilerFunction('main', this._type_unknow); // TODO DEFINE NONE TYPE
        this._default_module.add_module_function(this._default_function);

        this._current_module   = this._default_module;
        this._current_function = this._default_function;
        this._scopes_stack.push(this._default_function);
    }
}
