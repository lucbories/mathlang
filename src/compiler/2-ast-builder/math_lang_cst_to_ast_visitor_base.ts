
import IType from '../../core/itype';
import { math_lang_parser } from '../1-cst-builder/math_lang_parser';
import { BINOP_TYPES, PREUNOP_TYPES, POSTUNOP_TYPES,  TYPES } from '../math_lang_types';
import { SymbolDeclarationRecord, FunctionScope } from '../3-ic-builder/math_lang_function_scope';
import IMethod from '../../core/imethod';

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
type ScopesStack = Array<FunctionScope>;

/**
 * Map of function scopes.
 */
type ScopesMap = Map<string,FunctionScope>;



/**
 * Base class for CST Visitors class. Provides scopes, symbols, types and errors features.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangCstToAstVisitorBase extends BaseVisitor {
    protected _errors:AstBuilderErrorArray = new Array();
    protected _unknow_symbols:string[] = new Array();

    protected _main_scope:FunctionScope = {
        func_name:'main',
        return_type:'none',
        statements:[],
        symbols_consts_table:new Map(),
        symbols_vars_table:new Map(),
        symbols_opds_table:new Map(),
        symbols_opds_ordered_list:[],
        used_by_functions:[]
    };
    
    protected _current_scope:FunctionScope = this._main_scope;
    protected _current_scope_path:string   = 'main';
    protected _scopes_stack:ScopesStack    = new Array();
    protected _scopes_map:ScopesMap        = new Map();


    /**
     * Constructor, nothing to do.
     * 
     * @param _types_map private property, map of types.
     */
    constructor(private _types_map:Map<string,IType>) {
        super();
        this._scopes_stack.push(this._main_scope);
        this._scopes_map.set(this._main_scope.func_name, this._main_scope);
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
        const has_type = this._types_map.has(type_name);
        if (! has_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
        }
        return has_type;
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

        return ! has_error;
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
    check_attribute(type_name:string, attribute_name:string, attribute_type:string, cst_context:string, ast_node_type:any){
        let has_error = false;

        // CHECK VALUE TYPE
        const value_type:IType = this._types_map.get(type_name);
        if (! value_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
            has_error = true;
        }

        return false;
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
        const value_type:IType = this._types_map.get(type_name);
        if (! value_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
           return TYPES.UNKNOW;
        }

        return value_type.get_name();
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
        const value_type:IType = this._types_map.get(type_name);
        if (! value_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
            return false;
        }

        const has_indexes = value_type.get_indexes_count() == indexes_count;
        if (! has_indexes){
            this.add_error(cst_context, ast_node_type, 'Error:type [' + type_name + '] has not indexes [' + indexes_count + ']');
            return false;
        }

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
        const value_type:IType = this._types_map.get(type_name);
        if (! value_type){
            this.add_error(cst_context, ast_node_type, 'Error:type not found [' + type_name + ']');
            return TYPES.UNKNOW;
        }

        const type_instance = value_type.get_indexed_type();
        if (! type_instance){
            this.add_error(cst_context, ast_node_type, 'Error:type [' + type_name + '] has no indexed type');
            return TYPES.UNKNOW;
        }

        return type_instance.get_name();
    }


    /**
     * Get scopes map.
     * @return Map 
     */
    get_scopes_map() {
        return this._scopes_map;
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
     * 
     * 
     * @param node AST node
     * 
     * @returns Program type
     */
	// find_type(node:any):string {
    //     if (node && node.program_type) {
    //         return node.program_type;
    //     }
    //     return undefined;
    // }


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
            if (loop_scope.symbols_consts_table.has(name)) {
                return loop_scope.symbols_consts_table.get(name).ic_type;
            }
            if (loop_scope.symbols_vars_table.has(name)) {
                return loop_scope.symbols_vars_table.get(name).ic_type;
            }
            if (loop_scope.symbols_opds_table.has(name)) {
                return loop_scope.symbols_opds_table.get(name).ic_type;
            }
        }
        return TYPES.UNKNOW;
    }


    /**
     * Get function return type.
     * @param func_name   function name
     * @returns return type
     */
	get_function_type(func_name:string):string {
        const func_scope = this._scopes_map.get(func_name);
        return func_scope ? func_scope.return_type : TYPES.UNKNOW;
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
        const current_scope = this.get_current_scope();
        const table = is_constant ? current_scope.symbols_consts_table : current_scope.symbols_vars_table;

        this.check_type(ic_type, cst_context, ast_node_type);

        if (table && table.has(name)) {
            return false;
        }

        const path = this._current_scope_path;
        const current_scope_name = this._scopes_stack.length > 0 ? this._scopes_stack[this._scopes_stack.length - 1].func_name : 'NO SCOPE';
        const record:SymbolDeclarationRecord = { name:name, path:path, ic_type:ic_type, is_constant:is_constant, init_value:init_value, uses_count:0, uses_scopes:[current_scope_name] };

        table.set(name, record);
    }

    /**
     * Register a function declaration.
     * @param func_name             function name.
     * @param return_type           returned value type.
     * @param operands_declarations function operands declaration.
     * @param instructions          function instruction block.
     * @param cst_context           CST context for error log.
     * @param ast_node_type         AST node type for error log.
     * @returns true for success or false for failure
     */
    register_function_declaration(func_name:string, return_type:string, operands_declarations:any[], instructions:any[], cst_context:any, ast_node_type:string) {
        const func_scope:FunctionScope = {
            func_name:func_name,
            return_type:return_type,
            statements:instructions,
            symbols_consts_table:new Map(),
            symbols_vars_table:new Map(),
            symbols_opds_table:new Map(),
            symbols_opds_ordered_list:[],
            used_by_functions:[]
        };
        this._scopes_map.set(func_name, func_scope);

        this.check_type(return_type, cst_context, ast_node_type);

        // PROCESS OPERANDS
        let opd_decl:any;
        for(opd_decl of operands_declarations){
            const opd_record:SymbolDeclarationRecord = { name:opd_decl.opd_name, path:func_name, ic_type:opd_decl.opd_type, is_constant:true, init_value:undefined, uses_count:0, uses_scopes:[func_name] };
            func_scope.symbols_opds_table.set(opd_decl.opd_name, opd_record);
            func_scope.symbols_opds_ordered_list.push(opd_decl.opd_name);

            this.check_type(opd_record.ic_type, cst_context, ast_node_type);
        }
    }

    set_function_declaration_statements(func_name:string, instructions:any[]){
        const func_scope = this._scopes_map.get(func_name);
        func_scope.statements = instructions;
    }

    set_function_declaration_type(func_name:string, return_type:string){
        const func_scope = this._scopes_map.get(func_name);
        func_scope.return_type = return_type;
    }

    enter_function_declaration(func_name:string){
        const func_scope = this._scopes_map.get(func_name);
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
    has_declared_func_symbol(name:string):boolean {
        return this._scopes_map.has(name);
    }

    /**
     * Test if a symbol is already declared for a variable.
     * @param name symbol name
     * @returns true:symbol is a declared variable, false: symbol is not a declared variable
     */
    has_declared_var_symbol(name:string):boolean {
        let loop_scope;
        for(loop_scope of this._scopes_stack) {
            if (loop_scope.symbols_consts_table.has(name)) {
                return true;
            }
            if (loop_scope.symbols_vars_table.has(name)) {
                return true;
            }
            if (loop_scope.symbols_opds_table.has(name)) {
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
            if (loop_scope.symbols_consts_table.has(name)) {
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
            if (loop_scope.symbols_vars_table.has(name)) {
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
            if (loop_scope.symbols_opds_table.has(name)) {
                return true;
            }
        }
        return false;
    }


    /**
     * Get current function scope.
     * @returns current scope
     */
    get_current_scope():FunctionScope {
        return this._current_scope;
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
        this._errors = [];
        this._unknow_symbols = [];

        this._main_scope = {
            func_name:'main',
            return_type:'none',
            statements:[],
            symbols_consts_table:new Map(),
            symbols_vars_table:new Map(),
            symbols_opds_table:new Map(),
            symbols_opds_ordered_list:[],
            used_by_functions:[]
        };
        
        this._current_scope        = this._main_scope;
        this._current_scope_path   = 'main';
        this._scopes_stack         = new Array();
        this._scopes_map           = new Map();
        
        this._scopes_stack.push(this._main_scope);
        this._scopes_map.set(this._main_scope.func_name, this._main_scope);
    }
}
