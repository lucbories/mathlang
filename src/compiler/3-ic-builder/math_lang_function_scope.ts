
// export type SymbolDeclarationRecord = {
//     name:string,
//     path:string,
//     ic_type:string,
//     is_constant:boolean,
//     init_value:string,
//     uses_count:number,
//     uses_scopes:string[]
// };

// export type SymbolsTable = Map<string, SymbolDeclarationRecord>;

// export type FunctionScope = {
//     module_name:string,
//     func_name:string,
//     return_type:string,
//     statements:any[],
//     symbols_consts_table:SymbolsTable,
//     symbols_vars_table:SymbolsTable,
//     symbols_opds_table:SymbolsTable,
//     symbols_opds_ordered_list:string[],
//     used_by_functions:string[]
// };

// export type ModuleScope = {
//     module_name:string,
//     used_modules:Map<string,ModuleScope>,
//     module_functions:Map<string,FunctionScope>,
//     exported_functions:Map<string,string>,
//     exported_constants:Map<string,string>
// }