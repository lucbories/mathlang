import IType from './itype';
import IValue from './ivalue';


export default interface IMethod {
    get_name():string;
    
    get_operands_types():IType[];
    // has_operand_type(operand:IType):boolean;
    // set_operands_types(names:string[], operands:IType[]):boolean;
    // add_operand_type(name:string, operand:IType):boolean;
    // remove_operand_type(operand:IType):boolean;
    match_operands(operands:IType[]):boolean;

    get_returned_type():IType;
    has_returned_type(type:IType):boolean;
    // set_returned_type(type:IType):boolean;

    eval_unsafe(instance:IValue, operands:IValue[]):IValue;
    eval_safe(instance:IValue, operands:IValue[]):IValue;
    eval_debug(instance:IValue, operands:IValue[]):IValue;
}
