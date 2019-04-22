
export type SymbolDeclarationRecord = { name:string, path:string, ic_type:string, is_constant:boolean, init_value:string, uses_count:number, uses_scopes:string[] };
export type SymbolsTable            = Map<string, SymbolDeclarationRecord>;
export type FunctionScope           = { func_name:string, return_type:string, statements:any[], symbols_consts_table:SymbolsTable, symbols_vars_table:SymbolsTable, symbols_opds_table:SymbolsTable };
