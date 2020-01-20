
// import ICompilerScope from '../../core/icompiler_scope';
import ICompilerType from '../../core/icompiler_type';
import ICompilerFunction from '../../core/icompiler_function';


export default class CompilerType implements ICompilerType {
    private _indexed_type:ICompilerType = undefined;
    private _indexed_count:number = 0;

    constructor(
        // private _compiler_scope:ICompilerScope,
        private _name:string,
        private _base_type:ICompilerType|undefined,
        private _attributes:Map<string,ICompilerType> = new Map(),
        private _methods:Map<string,ICompilerFunction> = new Map(),
        private _is_generic:boolean = false,
        private _is_scalar:boolean = false,
        private _is_textual:boolean = false,
        private _is_collection:boolean = false)
    {
        // this._compiler_scope.add_available_lang_type(this._name, this);
    }
    

    get_type_name():string {
        return this._name;
    }
    
    equals(type:ICompilerType):boolean {
        return this._name == type.get_type_name();
    }
    
    is_generic():boolean { return this._is_generic; }
	set_generic(is_generic:boolean):void  { this._is_generic = is_generic; }
    
    is_scalar():boolean { return this._is_scalar; }
	set_scalar(is_scalar:boolean):void  { this._is_scalar = is_scalar; }
    
    is_textual():boolean { return this._is_textual; }
	set_textual(is_textual:boolean):void  { this._is_textual = is_textual; }
    
    is_collection():boolean { return this._is_collection; }
	set_collection(is_collection:boolean):void  { this._is_collection = is_collection; }

    set_property(property_name:string, property_value:string):void {
        switch(property_name) {
            case 'is_scalar':     this.set_scalar(property_value == 'TRUE' ? true : false); break;
            case 'is_textual':    this.set_textual(property_value == 'TRUE' ? true : false); break;
            case 'is_collection': this.set_collection(property_value == 'TRUE' ? true : false); break;
        }
    }

    get_base_type():ICompilerType {
        return this._base_type;
    }

    // INDEXED TYPE
    get_indexes_count():number {
        return this._indexed_count;
    }

    set_indexes_count(count:number):void {
        this._indexed_count = count;
    }

    get_indexed_type():ICompilerType {
        return this._indexed_type;
    }

    set_indexed_type(indexed_type:ICompilerType):void {
        this._indexed_type = indexed_type;
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
    has_method_with_types_names(method_name:string, operands_types_names:string[]):boolean {
        const method = this._methods.get(method_name);
        if (! method) {
            return undefined;
        }
        return method.has_symbols_opds_types_ordered_list(operands_types_names);
    }

    has_method(method_name:string, operands_types:ICompilerType[]):boolean {
        const method = this._methods.get(method_name);
        if (! method) {
            return undefined;
        }
        const types = operands_types.map( (value)=>value.get_type_name());
        return method.has_symbols_opds_types_ordered_list(types);
    }

    get_method_with_types_names(method_name:string, operands_types_names:string[]):ICompilerFunction {
        const method = this._methods.get(method_name);
        if (! method) {
            return undefined;
        }
        return method.has_symbols_opds_types_ordered_list(operands_types_names) ? method : undefined;
    }

    get_method(method_name:string, operands_types:ICompilerType[]):ICompilerFunction {
        const method = this._methods.get(method_name);
        if (! method) {
            return undefined;
        }

        const types = operands_types.map( (value)=>value.get_type_name());
        if ( ! method.has_symbols_opds_types_ordered_list(types) ) {
            return undefined;
        }

        return method;
    }

    add_method(method:ICompilerFunction):void {
        this._methods.set(method.get_func_name(), method);
    }
}