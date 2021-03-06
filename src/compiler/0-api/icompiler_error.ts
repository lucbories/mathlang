
import ICompilerType from './icompiler_type';
// import IIcNodeKindOf from './icompiler_ic_node';

export default interface ICompilerError {
    ic_type:ICompilerType,
    ic_source:string,
    ic_name:string,
    ic_index:number,
    ast_node:any,
    error_message:string
}