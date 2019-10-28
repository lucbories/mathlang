
import ICompilerType from './icompiler_type';
import ICompilerFunction from './icompiler_function';


export default interface ICompilerRuntime {
    get_type_name():string;

    has_method_with_types_names(method_name:string, operands:string[]):boolean;
    has_method(method_name:string, operands:ICompilerType[]):boolean;
    get_method_with_types_names(method_name:string, operands:string[]):ICompilerFunction
    get_method(method_name:string, operands:ICompilerType[]):ICompilerFunction;
    add_method(method:ICompilerFunction):void
}