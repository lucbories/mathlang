// import { ICompilerAstNode } from '../../core/icompiler_ast_node'
// import { ICompilerIcNode } from '../../core/icompiler_ic_node'
import ICompilerSymbol from '../../core/icompiler_symbol'
import ICompilerFunction from '../../core/icompiler_function'
import ICompilerModule from '../../core/icompiler_module'
import ICompilerScope from '../../core/icompiler_scope'


export default class CompilerModule implements ICompilerModule {
    private _used_modules:Map<string,ICompilerModule> = new Map();

    private _module_functions:Map<string,ICompilerFunction> = new Map();
    private _exported_functions:Map<string,ICompilerFunction> = new Map();

    private _module_constants:Map<string,ICompilerSymbol> = new Map();
    private _exported_constants:Map<string,ICompilerSymbol> = new Map();


    constructor(private _compiler_scope:ICompilerScope, private _module_name:string) {
        this._compiler_scope.add_new_module(this);
    }
    

    get_module_name():string {
        return this._module_name;
    }


    // USED MODULES
    add_used_module(module:ICompilerModule):void {
        this._used_modules.set(module.get_module_name(), module);
    }

    get_used_modules():Map<string,ICompilerModule> {
        return this._used_modules;
    }


    // ALL MODULE FUNCTIONS
    add_module_function(func:ICompilerFunction):void {
        this._module_functions.set(func.get_func_name(), func);
    }
    
    del_module_function(func_name:string):void {
        this._module_functions.delete(func_name);
    }
    
    has_module_function(func_name:string):boolean {
        return this._module_functions.has(func_name);
    }

    get_module_function(func_name:string) {
        return this._module_functions.get(func_name);
    }

    get_module_functions():Map<string,ICompilerFunction> {
        return this._module_functions;
    }
    
    
    // EXPORTED FUNCTIONS
    add_exported_function(func:ICompilerFunction):void {
        this._module_functions.set(func.get_func_name(), func);
        this._exported_functions.set(func.get_func_name(), func);
    }

    del_exported_function(func_name:string):void {
        this._exported_functions.delete(func_name);
    }
    
    has_exported_function(func_name:string):boolean {
        return this._exported_functions.has(func_name);
    }
    
    get_exported_function(func_name:string):ICompilerFunction {
        return this._exported_functions.get(func_name);
    }
    
    get_exported_functions():Map<string,ICompilerFunction> {
        return this._exported_functions;
    }


    // MAIN FUNCTION
    has_main_function():boolean {
        return this._module_functions.has('main');
    }
    
    get_main_function():ICompilerFunction {
        return this._module_functions.get('main');
    }
    
    
    // MODULE CONSTANTS
    add_module_constant(smb:ICompilerSymbol) {
        this._module_constants.set(smb.name, smb);
    }
    
    del_module_constant(const_name:string):void {
        this._module_constants.delete(const_name);
    }
    
    has_module_constant(const_name:string):boolean {
        return this._module_constants.has(const_name);
    }
    
    get_module_constant(const_name:string):ICompilerSymbol {
        return this._module_constants.get(const_name);
    }

    get_module_constants():Map<string,ICompilerSymbol> {
        return this._module_constants;
    }
    
    
    // EXPORTED CONSTANTS
    add_exported_constant(smb:ICompilerSymbol) {
        this._module_constants.set(smb.name, smb);
        this._exported_constants.set(smb.name, smb);
    }
    
    del_exported_constant(const_name:string):void {
        this._exported_constants.delete(const_name);
    }
    
    has_exported_constant(const_name:string):boolean {
        return this._exported_constants.has(const_name);
    }
    
    get_exported_constant(const_name:string):ICompilerSymbol {
        return this._exported_constants.get(const_name);
    }

    get_exported_constants():Map<string,ICompilerSymbol> {
        return this._exported_constants;
    }
}