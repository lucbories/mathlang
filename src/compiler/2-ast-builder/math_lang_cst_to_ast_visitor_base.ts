import { math_lang_parser } from '../1-cst_builder/math_lang_parser';
import { BINOP_TYPES, PREUNOP_TYPES, POSTUNOP_TYPES,  TYPES } from '../3-program_builder/program_types';

const BaseVisitor = math_lang_parser.getBaseCstVisitorConstructor()


type SymbolDeclarationRecord = { name:string, ic_type:string, is_constant:boolean, init_value:string, uses_count:number, uses_scopes:string[] };
type SymbolsTableRecord      = { path:string, record:SymbolDeclarationRecord };
type SymbolsTable            = Map<string, SymbolsTableRecord>;
type AstBuilderErrorRecord   = { cst_node:object, ast_node:object, path:string, message:string };
type AstBuilderErrorArray    = Array<AstBuilderErrorRecord>;
type ScopesStack             = Array<string>;



/**
 * Base class for CST Visitors class. Provides scopes, symbols, types and errors features.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangCstToAstVisitorBase extends BaseVisitor {
    protected _symbols_table:SymbolsTable  = new Map();
    protected _errors:AstBuilderErrorArray = new Array();
    protected _current_scope_path:string   = undefined;
    protected _scopes_stack:ScopesStack    = new Array();

    /**
     * Constructor, nothing to do.
     */
    constructor() {
        super();
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
        return TYPES.INTEGER;
    }

    /**
     * 
     * @param name symbol name
     * @param ic_type symbol value type
     * @param is_constant symbol is a constant ?
     * @param init_value symbol initialization value
     * @returns true for success or false for failure
     */
    register_symbol_declaration(name:string, ic_type:string, is_constant:boolean, init_value:string) {
        const current_scope = this.get_current_scope();
        const table = current_scope.symbols_table;

        if (table && table.has(name)) {
            return false;
        }

        const path = this._current_scope_path;
        const current_scope_name = this._scopes_stack.length > 0 ? this._scopes_stack[this._scopes_stack.length - 1] : 'NO SCOPE';
        const record = { name:name, ic_type:ic_type, is_constant:is_constant, init_value:init_value, uses_count:0, uses_scopes:[current_scope_name] };

        table.set(name, { path, record });
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
