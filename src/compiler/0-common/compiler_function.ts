
import ICompilerType from '../../core/icompiler_type';
import ICompilerAstNode from '../../core/icompiler_ast_node';
import { ICompilerIcEbb } from '../../core/icompiler_ic_instruction';
import ICompilerIcInstr from '../../core/icompiler_ic_instruction';
import ICompilerSymbol from '../../core/icompiler_symbol';
import { SymbolsTable, ICompilerFunction } from '../../core/icompiler_function';
// import { ICompilerModule } from '../../core/icompiler_module';


export default class CompilerFunction implements ICompilerFunction {
    private _is_exported:boolean = false;
    private _module_name:string = undefined;

    private _ast_node:ICompilerAstNode;
    private _ast_statements:ICompilerAstNode[];

    // private _ic_node:ICompilerIcNode;
    // private _ic_statements:ICompilerIcNode[];
    // private _ic_labels_index:Map<string,number>= new Map();

    private _ic_registers_count = 0;
    private _ic_variables_count = 0;
    private _ic_heap_size = 0;
    private _ic_stack_length = 0;
    private _ic_ebb_map:Map<string,ICompilerIcEbb> = new Map();
    private _ic_ebb_code_map:Map<string,ICompilerIcEbb> = new Map();
    
    private _local_functions:Map<string,ICompilerFunction> = new Map();

    private _symbols_consts_table:SymbolsTable = new Map();
    private _symbols_vars_table:SymbolsTable = new Map();
    private _symbols_opds_table:SymbolsTable = new Map();
    private _symbols_opds_ordered_list:string[] = [];
    private _used_by_functions:string[] = [];

    constructor(/*private _module:ICompilerModule, */private _func_name:string, private _type:ICompilerType, opds_names:string[] = [], opds_types:ICompilerType[] = [], opds_values:string[] = []){
        if ( Array.isArray(opds_names) && Array.isArray(opds_types) ) {
            if (opds_names.length == opds_types.length) {
                let i:number;
                if ( Array.isArray(opds_values) && opds_names.length == opds_values.length) {
                    for(i=0 ; i < opds_types.length ; i++) {
                        this.add_symbol_operand(opds_names[i], opds_types[i], opds_values[i]);
                    }
                } else {
                    for(i=0 ; i < opds_types.length ; i++) {
                        this.add_symbol_operand(opds_names[i], opds_types[i], '');
                    }
                }
            }
        }
    }

	// COMMON
	// get_func_module():string {
    //     return this._module.get_module_name();
    // }

	get_func_name():string {
        return this._func_name;
    }

    is_exported():boolean {
        return this._is_exported;
    }

    set_exported(is_exported:boolean):void {
        this._is_exported = is_exported;
    }

    get_module_name():string {
        return this._module_name;
    }

    set_module_name(module_name:string):void {
        this._module_name = module_name;
    }


    set_returned_type(returned_type:ICompilerType):void {
        this._type = returned_type;
    }

	get_returned_type():ICompilerType {
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
    set_ic_register_count(reg_count:number):void {
        this._ic_registers_count = reg_count;
    }

    get_ic_register_count():number { return this._ic_registers_count; }


    set_ic_heap_size(heap_size:number):void {
        this._ic_heap_size = heap_size;
    }

    get_ic_heap_size():number { return this._ic_heap_size; }


    set_ic_stack_length(stack_length:number):void {
        this._ic_stack_length = stack_length;
    }

    get_ic_stack_length():number { return this._ic_stack_length; }
    

    add_ic_ebb(ebb:ICompilerIcEbb, code_name:string):void {
        this._ic_ebb_map.set(ebb.ic_ebb_name, ebb);
        this._ic_ebb_code_map.set(code_name, ebb);
    }

    get_ic_ebb(ebb_name:string):ICompilerIcEbb {
        if (this._ic_ebb_map.has(ebb_name)) {
            return this._ic_ebb_map.get(ebb_name);
        }
        return this._ic_ebb_code_map.get(ebb_name);
    }

    get_ic_ebb_map():Map<string,ICompilerIcEbb> {
        return this._ic_ebb_map;
    }

    get_ic_ebb_count():number {
        return this._ic_ebb_map.size;
    }
    

    get_ic_variable_count():number {
        return this._ic_variables_count;
    }

    add_ic_variable():string {
        return 'v' + this._ic_variables_count++;
    }


    // LOCAL FUNCTIONS
    has_local_function(func_name:string):boolean {
        return this._local_functions.has(func_name);
    }

    get_local_function(func_name:string):ICompilerFunction {
        return this._local_functions.get(func_name);
    }

    del_local_function(func_name:string):void {
        this._local_functions.delete(func_name);
    }

    add_local_function(func:ICompilerFunction):void {
        this._local_functions.set(func.get_func_name(), func);
    }

    get_local_functions():Map<string,ICompilerFunction> {
        return this._local_functions;
    }
	
    
	// SYMBOLS
	get_symbol(symbol_name:string):ICompilerSymbol {
		let smb = this.get_symbol_const(symbol_name);
		if (smb) return smb;
		
		smb = this.get_symbol_var(symbol_name);
		if (smb) return smb;
		
		smb = this.get_symbol_operand(symbol_name);
		if (smb) return smb;
		
		return undefined;
	}
	
	
    has_symbol_const(symbol_name:string):boolean {
        return this._symbols_consts_table.has(symbol_name);
    }

    get_symbol_const(symbol_name:string):ICompilerSymbol {
        return this._symbols_consts_table.get(symbol_name);
    }

	add_symbol_const(symbol_name:string, symbol_type:ICompilerType, symbol_value:string) {
        const smb = {
            name:symbol_name,
            // path:string,
            type:symbol_type,
            is_constant:true,
            init_value: symbol_value,
            uses_count:0
        };

        this._symbols_consts_table.set(symbol_name, smb);
    }

	get_symbols_consts_table():SymbolsTable {
        return this._symbols_consts_table;
    }


    has_symbol_var(symbol_name:string):boolean {
        return this._symbols_vars_table.has(symbol_name);
    }

    get_symbol_var(symbol_name:string):ICompilerSymbol {
        return this._symbols_vars_table.get(symbol_name);
    }
    
	add_symbol_var(symbol_name:string, symbol_type:ICompilerType, symbol_value:string) {
        const smb = {
            name:symbol_name,
            // path:string,
            type:symbol_type,
            is_constant:false,
            init_value: symbol_value,
            uses_count:0
        };

        this._symbols_vars_table.set(symbol_name, smb);
    }

    get_symbols_vars_table():SymbolsTable {
        return this._symbols_vars_table;
    }


    has_symbol_operand(symbol_name:string):boolean {
        return this._symbols_opds_table.has(symbol_name);
    }

    get_symbol_operand(symbol_name:string):ICompilerSymbol {
        return this._symbols_opds_table.get(symbol_name);
    }
    
	add_symbol_operand(symbol_name:string, symbol_type:ICompilerType, symbol_value:string) {
        const smb = {
            name:symbol_name,
            // path:string,
            type:symbol_type,
            is_constant:true,
            init_value: symbol_value,
            uses_count:0
        };

        this._symbols_opds_table.set(symbol_name, smb);
        this._symbols_opds_ordered_list.push(symbol_name)
    }

    get_symbols_opds_table():SymbolsTable {
        return this._symbols_opds_table;
    }

    has_symbols_opds_ordered_list(opds:string[]):boolean {
        let match = true;
        this._symbols_opds_ordered_list.map(
            (value, index)=>{
                if (index >= opds.length || value != opds[index]) {
                    match = false;
                }
            }
        );
        return match;
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