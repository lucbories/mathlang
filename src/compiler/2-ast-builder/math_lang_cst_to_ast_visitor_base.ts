import { math_lang_parser } from '../1-cst_builder/math_lang_parser';
import { BINOP_TYPES, PREUNOP_TYPES, POSTUNOP_TYPES,  TYPES } from '../3-program_builder/program_types';
import { SymbolDeclarationRecord, FunctionScope } from '../3-program_builder/function_scope';


const BaseVisitor = math_lang_parser.getBaseCstVisitorConstructor()

type AstBuilderErrorRecord   = { cst_node:object, ast_node:object, path:string, message:string };
type AstBuilderErrorArray    = Array<AstBuilderErrorRecord>;

type ScopesStack             = Array<FunctionScope>;
type ScopesMap               = Map<string,FunctionScope>;



/**
 * Base class for CST Visitors class. Provides scopes, symbols, types and errors features.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangCstToAstVisitorBase extends BaseVisitor {
    protected _errors:AstBuilderErrorArray = new Array();

    protected _main_scope:FunctionScope    = { func_name:'main', return_type:'none', statements:[], symbols_consts_table:new Map(), symbols_vars_table:new Map(), symbols_opds_table:new Map() };
    
    protected _current_scope:FunctionScope = this._main_scope;
    protected _current_scope_path:string   = 'main';
    protected _scopes_stack:ScopesStack    = new Array();
    protected _scopes_map:ScopesMap        = new Map();

    /**
     * Constructor, nothing to do.
     */
    constructor() {
        super();
        this._scopes_stack.push(this._main_scope);
        this._scopes_map.set(this._main_scope.func_name, this._main_scope);
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
     * @param node AST node
     * @returns Program type
     */
	find_type(node:any):string {
        if (node && node.program_type) {
            return node.program_type;
        }
        return undefined;
    }


    /**
     * Compute binary operator result type.
     * @param operator   binary operator name
     * @param left_type  left operand type
     * @param right_type right operand type
     * @returns result type
     */
	compute_binop_type(operator:string, left_type:any, right_type:any):string {
        const key:string = operator + left_type.ic_type + right_type.ic_type;
        // console.log('compute_binop_type.key', key);
        const type = BINOP_TYPES.get(key);
        return type ? type : TYPES.UNKNOW;
    }


    /**
     * Compute prefix unary operator result type.
     * @param operator   prefix unary operator name
     * @param right_type right operand type
     * @returns result type
     */
	compute_preunop_type(operator:string, right_type:any):string {
        const key:string = operator + right_type.ic_type;
        // console.log('compute_preunop_type.key', key);
        const type = PREUNOP_TYPES.get(key);
        return type ? type : TYPES.UNKNOW;
    }


    /**
     * Compute postfix unary operator result type.
     * @param operator   binary operator name
     * @param left_type  left operand type
     * @returns result type
     */
	compute_postunop_type(operator:string, left_type:any):string {
        const key:string = operator + left_type.ic_type;
        // console.log('compute_postunop_type.key', key);
        const type = POSTUNOP_TYPES.get(key);
        return type ? type : TYPES.UNKNOW;
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
        return TYPES.INTEGER;
    }

    /**
     * Register a symbol declaration.
     * @param name symbol name
     * @param ic_type symbol value type
     * @param is_constant symbol is a constant ?
     * @param init_value symbol initialization value
     * @returns true for success or false for failure
     */
    register_symbol_declaration(name:string, ic_type:string, is_constant:boolean, init_value:string) {
        const current_scope = this.get_current_scope();
        const table = is_constant ? current_scope.symbols_consts_table : current_scope.symbols_vars_table;

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
     * @param func_name function name
     * @param return_type returned value type
     * @param operands_declarations function operands declaration
     * @param instructions function instruction block
     * @returns true for success or false for failure
     */
    register_function_declaration(func_name:string, return_type:string, operands_declarations:any[], instructions:any[]) {
        const func_scope:FunctionScope = { func_name:func_name, return_type:return_type, statements:instructions, symbols_consts_table:new Map(), symbols_vars_table:new Map(), symbols_opds_table:new Map() };
        this._scopes_map.set(func_name, func_scope);

        // PROCESS OPERANDS
        let opd_decl:any;
        for(opd_decl of operands_declarations){
            const opd_record:SymbolDeclarationRecord = { name:opd_decl.name, path:func_name, ic_type:opd_decl.type, is_constant:true, init_value:undefined, uses_count:0, uses_scopes:[func_name] };
            func_scope.symbols_opds_table.set(opd_decl.name, opd_record);
        }
    }

    set_function_declaration_statements(func_name:string, instructions:any[]){
        const func_scope = this._scopes_map.get(func_name);
        func_scope.statements = instructions;
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
    has_declared_symbol(name:string):boolean {
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


    /*
    key=this.current_scope_path: { key=symbol_name:SymbolDeclarationRecord 


	ic_type_from_ast_type={ ast_type:ic_type }
	ic_type_preunop={ ++:{ INTEGER:INTEGER } }
	ic_type_postunop={ ++:{ INTEGER:INTEGER } }
	ic_type_binop={ +:{ INTEGER-INTEGER:INTEGER } }

	
	this.find_symbol(name): SymbolDeclarationRecord
	this.register_symbol_declaration(name, ic_type, is_constant, init_value)
	this.register_symbol_use(symbol_name)

	this.enter_function(fname):this.scope_prefix.push(fname) this.current_scope_path=this.scope_prefix.join(¦)
    this.leave_function():this.scope_prefix.slice(1,)
    */
}
