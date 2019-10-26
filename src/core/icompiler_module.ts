
import { SymbolDeclaration, ICompilerFunction } from './icompiler_function';


export interface ICompilerModule {
    get_module_name():string;

    add_used_module(module:ICompilerModule):void;
    get_used_modules():Map<string,ICompilerModule>;

    add_module_function(func:ICompilerFunction):void;
    del_module_function(func_name:string):void;
    has_module_function(func_name:string):boolean;
    get_module_function(func_name:string):ICompilerFunction;
    get_module_functions():Map<string,ICompilerFunction>;

    add_exported_function(func:ICompilerFunction):void;
    del_exported_function(func_name:string):void;
    has_exported_function(func_name:string):boolean;
    get_exported_function(func_name:string):ICompilerFunction;
    get_exported_functions():Map<string,ICompilerFunction>;

    add_module_constant(smb:SymbolDeclaration):void;
    del_module_constant(const_name:string):void;
    has_module_constant(const_name:string):boolean;
    get_module_constant(const_name:string):SymbolDeclaration;
    get_module_constants():Map<string,SymbolDeclaration>;

    add_exported_constant(smb:SymbolDeclaration):void;
    del_exported_constant(const_name:string):void;
    has_exported_constant(const_name:string):boolean;
    get_exported_constant(const_name:string):SymbolDeclaration;
    get_exported_constants():Map<string,SymbolDeclaration>;
}
