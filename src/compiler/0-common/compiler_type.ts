
// import ICompilerScope from '../../core/icompiler_scope';
import ICompilerType from '../../core/icompiler_type';
import ICompilerFunction from '../../core/icompiler_function';


export default class CompilerType implements ICompilerType {
    constructor(
        // private _compiler_scope:ICompilerScope,
        private _name:string,
        private _base_type:ICompilerType|undefined,
        private _attributes:Map<string,ICompilerType> = new Map(),
        private _methods:Map<string,ICompilerFunction> = new Map())
    {
        // this._compiler_scope.add_available_lang_type(this._name, this);
    }
    

    get_type_name():string {
        return this._name;
    }
    
    equals(type:ICompilerType):boolean {
        return this._name == type.get_type_name();
    }

    get_base_type():ICompilerType {
        return this._base_type;
    }

    // INDEXED TYPE
    get_indexes_count():number {
        return 0;
    }

    get_indexed_type():ICompilerType {
        return undefined;
    }

    // ATTRIBUTES
    add_attribute(attribute_name:string, attribute_type:ICompilerType):void {
        this._attributes.set(attribute_name, attribute_type);
    }
    
    del_attribute(attribute_name:string):void {
        this._attributes.delete(attribute_name);
    }

    has_attribute(attribute_name:string):boolean {
        return this._attributes.has(attribute_name);
    }

    get_attribute(attribute_name:string):ICompilerType {
        return this._attributes.get(attribute_name);
    }

    // METHODS
    has_method_with_types_names(method_name:string, operands:string[]):boolean {
        const method = this._methods.get(method_name);
        if (! method) {
            return undefined;
        }
        return method.has_symbols_opds_ordered_list(operands);
    }

    has_method(method_name:string, operands:ICompilerType[]):boolean {
        const method = this._methods.get(method_name);
        if (! method) {
            return undefined;
        }
        const types = operands.map( (value)=>value.get_type_name());
        return method.has_symbols_opds_ordered_list(types);
    }

    get_method_with_types_names(method_name:string, operands:string[]):ICompilerFunction {
        const method = this._methods.get(method_name);
        if (! method) {
            return undefined;
        }
        return method.has_symbols_opds_ordered_list(operands) ? method : undefined;
    }

    get_method(method_name:string, operands:ICompilerType[]):ICompilerFunction {
        const method = this._methods.get(method_name);
        if (! method) {
            return undefined;
        }

        const types = operands.map( (value)=>value.get_type_name());
        if ( ! method.has_symbols_opds_ordered_list(types) ) {
            return undefined;
        }

        return method;
    }

    add_method(method:ICompilerFunction):void {
        this._methods.set(method.get_func_name(), method);
    }
}