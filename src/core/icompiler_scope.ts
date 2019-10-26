
import { SymbolDeclaration, ICompilerFunction } from './icompiler_function';
import { ICompilerModule } from './icompiler_module';


export interface ICompilerScope {
    add_available_lang_type(type_name:string):void;
    has_available_lang_type(type_name:string):boolean;
    get_available_lang_type(type_name:string):string;
    get_available_lang_types():Map<string,string>;

    add_available_lang_type_method(type_name:string, method_name:string, operands_types:string[]):void;
    has_available_lang_type_method(type_name:string, method_name:string, operands_types:string[]):boolean;
    get_available_lang_type_method(type_name:string, method_name:string, operands_types:string[]):string;
    get_available_lang_type_methods():Map<string,string>;

    has_module(module_name:string):boolean;
    get_module(module_name:string):ICompilerModule

    add_available_module(module:ICompilerModule):void;
    has_available_module(module_name:string):boolean;
    get_available_module(module_name:string):ICompilerModule;
    get_available_modules():Map<string,ICompilerModule>;

    add_new_module(module:ICompilerModule):void;
    has_new_module(module_name:string):boolean;
    get_new_module(module_name:string):ICompilerModule;
    get_new_modules():Map<string,ICompilerModule>;

    has_exported_function(func_name:string):boolean;
    get_exported_function(func_name:string):ICompilerFunction;

    has_exported_constant(const_name:string):boolean;
    get_exported_constant(const_name:string):SymbolDeclaration;
}
