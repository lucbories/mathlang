
import ICompilerType    from './icompiler_type';


export default interface ICompilerSymbol {
    name:string;
    type:ICompilerType;
    is_constant:boolean;
    init_value:string;
    uses_count:number;
}