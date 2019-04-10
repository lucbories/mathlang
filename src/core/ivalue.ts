import IType from './itype';

 export default interface IValue {
    get_type():IType;
    of_type(type:IType):boolean;

    get_value():any;
    set_value(value:any):void;

    to_number():number;
    to_string():string;

    get_unit():string;
    
    from_number(value:number):boolean;
    from_string(value:string):boolean;
    from(value:any):boolean;

    eval_unsafe(method_nane:string, operands:IValue[]):IValue;
    eval_safe(method_nane:string, operands:IValue[]):IValue;
    eval_debug(method_nane:string, operands:IValue[]):IValue;
}
