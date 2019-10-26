import { ICompilerAstNode } from '../../core/icompiler_ast_node'
import { ICompilerIcNode } from '../../core/icompiler_ic_node'
import { SymbolDeclaration, SymbolsTable, ICompilerFunction } from '../../core/icompiler_function'
import { ICompilerModule } from '../../core/icompiler_module'

export default class CompilerFunction implements ICompilerFunction {
    private _ast_node:ICompilerAstNode;
    private _ast_statements:ICompilerAstNode[];

    private _ic_node:ICompilerIcNode;
    private _ic_statements:ICompilerIcNode[];

    private _symbols_consts_table:SymbolsTable = new Map();
    private _symbols_vars_table:SymbolsTable = new Map();
    private _symbols_opds_table:SymbolsTable = new Map();
    private _symbols_opds_ordered_list:string[] = [];
    private _used_by_functions:string[] = [];

    constructor(private _module:ICompilerModule, private _func_name:string, private _type:string){}

	// COMMON
	get_func_module():string {
        return this._module.get_module_name();
    }

	get_func_name():string {
        return this._func_name;
    }


    set_returned_type(returned_type:string):void {
        this._type = returned_type;
    }
    
	get_returned_type():string {
        return this._type;
    }

	
    // AST
    set_ast_node(node:ICompilerAstNode) {
        this._ast_node = node;
    }

	get_ast_node():ICompilerAstNode {
        return this._ast_node;
    }

    set_ast_statements(nodes:ICompilerAstNode[]) {
        this._ast_statements = nodes;
    }

    get_ast_statements():ICompilerAstNode[] {
        return this._ast_statements;
    }

	
	// IC
    set_ic_node(node:ICompilerIcNode) {
        this._ic_node = node;
    }

	get_ic_node():ICompilerIcNode{
        return this._ic_node;
    }

    set_ic_statements(nodes:ICompilerIcNode[]) {
        this._ic_statements = nodes;
    }

    get_ic_statements():ICompilerIcNode[] {
        return this._ic_statements;
    }

    
	// SYMBOLS
    has_symbol_const(symbol_name:string):boolean {
        return this._symbols_consts_table.has(symbol_name);
    }

    get_symbol_const(symbol_name:string):SymbolDeclaration {
        return this._symbols_consts_table.get(symbol_name);
    }

	add_symbol_const(symbol_name:string, symbol_type:string, symbol_value:string) {
        const smb = new SymbolDeclaration();
        smb.name        = symbol_name;
        smb.type        = symbol_type;
        smb.is_constant = true;
        smb.init_value  = symbol_value;
        smb.uses_count  = 0;
        // smb.uses_scopes = [];

        this._symbols_consts_table.set(symbol_name, smb);
    }

	get_symbols_consts_table():SymbolsTable {
        return this._symbols_consts_table;
    }


    has_symbol_var(symbol_name:string):boolean {
        return this._symbols_vars_table.has(symbol_name);
    }

    get_symbol_var(symbol_name:string):SymbolDeclaration {
        return this._symbols_vars_table.get(symbol_name);
    }
    
	add_symbol_var(symbol_name:string, symbol_type:string, symbol_value:string) {
        const smb = new SymbolDeclaration();
        smb.name        = symbol_name;
        smb.type        = symbol_type;
        smb.is_constant = false;
        smb.init_value  = symbol_value;
        smb.uses_count  = 0;
        // smb.uses_scopes = [];

        this._symbols_vars_table.set(symbol_name, smb);
    }

    get_symbols_vars_table():SymbolsTable {
        return this._symbols_vars_table;
    }


    has_symbol_operand(symbol_name:string):boolean {
        return this._symbols_opds_table.has(symbol_name);
    }

    get_symbol_operand(symbol_name:string):SymbolDeclaration {
        return this._symbols_opds_table.get(symbol_name);
    }
    
	add_symbol_operand(symbol_name:string, symbol_type:string, symbol_value:string) {
        const smb = new SymbolDeclaration();
        smb.name        = symbol_name;
        smb.type        = symbol_type;
        smb.is_constant = true;
        smb.init_value  = symbol_value;
        smb.uses_count  = 0;
        // smb.uses_scopes = [];

        this._symbols_opds_table.set(symbol_name, smb);
        this._symbols_opds_ordered_list.push(symbol_name)
    }

    get_symbols_opds_table():SymbolsTable {
        return this._symbols_opds_table;
    }

    get_symbols_opds_ordered_list():string[] {
        return this._symbols_opds_ordered_list;
    }

	add_used_by_function(func_name:string) {
        this._used_by_functions.push(func_name);
    }

    get_used_by_functions():string[] {
        return this._used_by_functions;
    }
}