
import ICompilerType    from './icompiler_type';
import ICompilerAstNode from './icompiler_ast_node';
// import ICompilerIcNode  from './icompiler_ic_node';
import { ICompilerIcEbb }  from './icompiler_ic_instruction';
import ICompilerIcInstr  from './icompiler_ic_instruction';
import ICompilerSymbol  from './icompiler_symbol';


export type SymbolsTable = Map<string, ICompilerSymbol>;

export default ICompilerFunction;
export interface ICompilerFunction {
	// COMMON
    get_func_name():string;
    is_exported():boolean;
    set_exported(is_exported:boolean):void;
    get_module_name():string;
    set_module_name(module_name:string):void;
    
    set_returned_type(returned_type:ICompilerType):void;
    get_returned_type():ICompilerType;
    
    is_internal():boolean;
    is_external():boolean;
    is_inline():boolean;
    
    
    // AST
    set_ast_node(node:ICompilerAstNode):void;
    get_ast_node():ICompilerAstNode;
    
    set_ast_statements(nodes:ICompilerAstNode[]):void;
    get_ast_statements():ICompilerAstNode[];
    
    
    // IC
    set_ic_register_count(reg_count:number):void;
    get_ic_register_count():number;

    set_ic_heap_size(heap_size:number):void;
    get_ic_heap_size():number;

    set_ic_stack_length(stack_length:number):void;
    get_ic_stack_length():number;
    
    add_ic_ebb(ebb:ICompilerIcEbb, code_name:string):void;
    get_ic_ebb(ebb_name:string):ICompilerIcEbb;
    get_ic_ebb_map():Map<string,ICompilerIcEbb>;
    get_ic_ebb_count():number;

    get_ic_variable_count():number;
    add_ic_variable():string;


    // LOCAL FUNCTIONS
    has_local_function(func_name:string):boolean;
    get_local_function(func_name:string):ICompilerFunction;
    del_local_function(func_name:string):void;
    add_local_function(func:ICompilerFunction):void;
    get_local_functions():Map<string,ICompilerFunction>;

    
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
    has_symbols_opds_types_ordered_list(opds_types_names:string[]):boolean;

    add_used_by_function(func_name:string):void;
    get_used_by_functions():string[];
}