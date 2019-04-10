import IMethod from '../../core/imethod';
import IType from '../../core/itype';
import IValue from '../../core/ivalue';


export default class VMMethod implements IMethod {
    constructor(private _name:string, private _operands_types:IType[], private _returned_type:IType, private _fn:Function){
    }

    get_name():string { return this._name; }
    
    get_operands_types():IType[] { return this._operands_types; }
    match_operands(operands:IType[]):boolean {
        let operand:IType;
        let given_operand:IType;
        let index:number=0;

        for(operand of this._operands_types){
            given_operand = operands[index];
            if (! operand.equals(given_operand)){
                return false;
            }
            ++index;
        }
        
        return true;
    }

    get_returned_type():IType { return this._returned_type; }
    has_returned_type(type:IType):boolean { return this._returned_type.equals(type); }

    eval_unsafe(instance:IValue, operands:IValue[]):IValue {
        return this._fn(instance, operands);
    }

    eval_safe(instance:IValue, operands:IValue[]):IValue {
        let operand:IType;
        let given_operand:IType;
        let index:number=0;

        for(operand of this._operands_types){
            given_operand = operands[index].get_type();
            if (! operand.equals(given_operand)){
                return this.error_bad_operands(instance, operands, index);
            }
            ++index;
        }

        return this._fn(instance, ...operands);
    }

    eval_debug(instance:IValue, operands:IValue[]):IValue {
        return undefined
    }

    error_bad_operands(instance:IValue, operands:IValue[], index:number):IValue{
        return undefined;
    }
}