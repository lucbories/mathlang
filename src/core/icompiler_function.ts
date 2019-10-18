
import ICompilerAstNode from './icompiler_ast_node';
import ICompilerIcNode  from './icompiler_ic_node';


export type TSymbolDeclarationRecord = {
    name:string, path:string,
    type:string,
    is_constant:boolean,
    init_value:string,
    uses_count:number,
    uses_scopes:string[]
};

export type SymbolsTable = Map<string, SymbolDeclarationRecord>;

export default interface ICompilerFunction {
	// COMMON
	get_func_name():string
	get_returned_type():string
	
    // AST
	get_ast_node():ICompilerAstNode
    get_ast_statements:ICompilerAstNode[]
	
	// IC
	get_ic_node():ICompilerIcNode
    get_ic_statements:ICompilerIcNode[]
    
	// SYMBOLS
	get_symbols_consts_table():SymbolsTable
    get_symbols_vars_table():SymbolsTable
    get_symbols_opds_table():SymbolsTable
    get_symbols_opds_ordered_list():string[]
    get_used_by_functions():string[]
}