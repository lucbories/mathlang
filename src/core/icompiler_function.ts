
import ICompilerType    from './icompiler_type';
import ICompilerAstNode from './icompiler_ast_node';
import ICompilerIcNode  from './icompiler_ic_node';
import ICompilerSymbol  from './icompiler_symbol';


export type SymbolsTable = Map<string, ICompilerSymbol>;

export default ICompilerFunction;
export interface ICompilerFunction {
	// COMMON
	// get_func_module():string;
    get_func_name():string;
    
    set_returned_type(returned_type:ICompilerType):void;
	get_returned_type():ICompilerType;
	
    // AST
    set_ast_node(node:ICompilerAstNode):void;
    get_ast_node():ICompilerAstNode;
    
    set_ast_statements(nodes:ICompilerAstNode[]):void;
    get_ast_statements():ICompilerAstNode[];
	
    // IC
    set_ic_node(node:ICompilerIcNode):void;
    get_ic_node():ICompilerIcNode;
    
    add_ic_statement(ic_node:ICompilerIcNode):void;
    set_ic_statements(nodes:ICompilerIcNode[]):void;
    get_ic_statements():ICompilerIcNode[];

    add_ic_label(label_index:number):string;
    has_ic_label(label_name:string):boolean;
    get_ic_label_index(label_name:string):number;
    set_ic_label_index(label_name:string, label_index:number):void;
    
    // SYMBOLS
    get_symbol(symbol_name:string):ICompilerSymbol;
	
    has_symbol_const(symbol_name:string):boolean;
    get_symbol_const(symbol_name:string):ICompilerSymbol;
    add_symbol_const(symbol_name:string, symbol_type:ICompilerType, symbol_value:string):void;
    get_symbols_consts_table():SymbolsTable;

    has_symbol_var(symbol_name:string):boolean;
    get_symbol_var(symbol_name:string):ICompilerSymbol;
    add_symbol_var(symbol_name:string, symbol_type:ICompilerType, symbol_value:string):void;
    get_symbols_vars_table():SymbolsTable;

    has_symbol_operand(symbol_name:string):boolean;
    get_symbol_operand(symbol_name:string):ICompilerSymbol;
    add_symbol_operand(symbol_name:string, symbol_type:ICompilerType, symbol_value:string):void;
    get_symbols_opds_table():SymbolsTable;
    has_symbols_opds_ordered_list(opds:string[]):boolean;
    get_symbols_opds_ordered_list():string[];

    add_used_by_function(func_name:string):void;
    get_used_by_functions():string[];
}