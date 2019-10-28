
import ICompilerFunction from './icompiler_function';


export default interface ICompilerType {
    get_type_name():string;
    equals(type:ICompilerType):boolean;

    get_base_type():ICompilerType;

    get_indexes_count():number;
    get_indexed_type():ICompilerType;

    add_attribute(attribute_name:string, attribute_type:ICompilerType):void;
    del_attribute(attribute_name:string):void;
    has_attribute(attribute_name:string):boolean;
    get_attribute(attribute_name:string):ICompilerType;

    has_method_with_types_names(method_name:string, operands:string[]):boolean;
    has_method(method_name:string, operands:ICompilerType[]):boolean;
    get_method_with_types_names(method_name:string, operands:string[]):ICompilerFunction
    get_method(method_name:string, operands:ICompilerType[]):ICompilerFunction;
    add_method(method:ICompilerFunction):void
}