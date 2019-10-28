
import ICompilerType from '../../core/icompiler_type';
import ICompilerRuntime from '../../core/icompiler_runtime';
import { SymbolDeclaration, ICompilerFunction } from '../../core/icompiler_function'
import { ICompilerModule } from '../../core/icompiler_module'
import { ICompilerScope } from '../../core/icompiler_scope'


export default class CompilerScope implements ICompilerScope {
    private _new_modules:Map<string,ICompilerModule> = new Map();

    constructor(
        private _available_modules:Map<string,ICompilerModule>,
        private _available_lang_types:Map<string,ICompilerType>,
        private _available_runtimes:Map<string,ICompilerRuntime>) {
    }

    // AVAILABLE LANGUAGE TYPES
    add_available_lang_type(type_name:string, type_instance:ICompilerType):void {
        this._available_lang_types.set(type_name, type_instance);
    }

    has_available_lang_type(type_name:string):boolean {
        return this._available_lang_types.has(type_name);
    }

    get_available_lang_type(type_name:string):ICompilerType {
        return this._available_lang_types.get(type_name);
    }

    get_available_lang_types():Map<string,ICompilerType> {
        return this._available_lang_types;
    }


    // AVAILABLE TYPES METHODS
    has_available_lang_type_method(type_name:string, method_name:string, operands_types:string[]):boolean {
        const obj_type = this._available_lang_types.get(type_name);
        return obj_type ? obj_type.has_method_with_types_names(method_name, operands_types) : false;
    }

    get_available_lang_type_method(type_name:string, method_name:string, operands_types:string[]):ICompilerFunction {
        const obj_type = this._available_lang_types.get(type_name);
        return obj_type ? obj_type.get_method_with_types_names(method_name, operands_types) : undefined;
    }



    // AVAILABLE OR NEW MODULES
    has_module(module_name:string):boolean {
        return this._available_modules.has(module_name) || this._new_modules.has(module_name);
    }

    get_module(module_name:string):ICompilerModule {
        if ( this._available_modules.has(module_name) ) {
            return this._available_modules.get(module_name);
        }
        if ( this._new_modules.has(module_name) ) {
            return this._new_modules.get(module_name);
        }
        return undefined;
    }


    // AVAILABLE MODULES
    add_available_module(module:ICompilerModule) {
        this._available_modules.set(module.get_module_name(), module);
    }

    has_available_module(module_name:string):boolean {
        return this._available_modules.has(module_name);
    }

    get_available_module(module_name:string):ICompilerModule {
        return this._available_modules.get(module_name);
    }

    get_available_modules():Map<string,ICompilerModule> {
        return this._available_modules;
    }


    // NEW MODULES
    add_new_module(module:ICompilerModule) {
        this._new_modules.set(module.get_module_name(), module);
    }

    has_new_module(module_name:string):boolean {
        return this._new_modules.has(module_name);
    }

    get_new_module(module_name:string):ICompilerModule {
        return this._new_modules.get(module_name);
    }

    get_new_modules():Map<string,ICompilerModule> {
        return this._new_modules;
    }

    
    // EXPORTED FUNCTIONS
    has_exported_function(func_name:string) {
        let found:boolean = false;
        this._new_modules.forEach(
            (value:ICompilerModule)=>{
                if (found || value.has_exported_function(func_name) ) {
                    return;
                }
            }
        );
        if (found) {
            return true;
        }
        this._available_modules.forEach(
            (value:ICompilerModule)=>{
                if (found || value.has_exported_function(func_name) ) {
                    return;
                }
            }
        );
        return found;
    }

    get_exported_function(func_name:string):ICompilerFunction {
        let found:ICompilerFunction = undefined;
        this._new_modules.forEach(
            (value:ICompilerModule)=>{
                if (found) return;
                found = value.get_exported_function(func_name);
            }
        );
        if (found) {
            return found;
        }
        this._available_modules.forEach(
            (value:ICompilerModule)=>{
                if (found) return;
                found = value.get_exported_function(func_name);
            }
        );
        return found;
    }
    
    
    // EXPORTED CONSTANTS
    has_exported_constant(const_name:string):boolean {
        let found:boolean = false;
        this._new_modules.forEach(
            (value:ICompilerModule)=>{
                if (found) return;
                found = value.has_exported_constant(const_name);
            }
        );
        if (found) {
            return found;
        }
        this._available_modules.forEach(
            (value:ICompilerModule)=>{
                if (found) return;
                found = value.has_exported_constant(const_name);
            }
        );
        return found;
    }

    get_exported_constant(const_name:string):SymbolDeclaration {
        let found:SymbolDeclaration = undefined;
        this._new_modules.forEach(
            (value:ICompilerModule)=>{
                if (found) return;
                found = value.get_exported_constant(const_name);
            }
        );
        if (found) {
            return found;
        }
        this._available_modules.forEach(
            (value:ICompilerModule)=>{
                if (found) return;
                found = value.get_exported_constant(const_name);
            }
        );
        return found;
    }
}