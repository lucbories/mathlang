import IType from '../../core/itype';
import IValue from '../../core/ivalue';
// import VMTypeFeatureIface from '../../core/ifeature'

export default class VMValue implements IValue {
    private _value:any;

    constructor(private _type:IType, private create_value:any ) {
        this._value = this._type.create(create_value);
    }

    get_type():IType { return this._type; }
    of_type(type:IType):boolean {
        return this._type.equals(type);
    }

    get_value() { return this._value; }
    set_value(value:any) { this._value = value; }

    to_number():number { return this._type.to_number(this._value); }
    to_string():string { return this._type.to_string(this._value); }

    get_unit():string { return undefined; }

    from_number(value:number):boolean {
        this._value = this._type.from_number(value);
        return this._value != undefined;
    }
    
    from_string(value:string):boolean {
        this._value = this._type.from_string(value);
        return this._value != undefined;
    }

    from(value:any):boolean {
        return false;
    }

    eval_unsafe(method_nane:string, operands:IValue[]):IValue {
        const method = this._type.get_method(method_nane, this.get_types(operands) );
        if (method) {
            return method.eval_unsafe(this, operands);
        }
        return undefined;
    }

    eval_safe(method_nane:string, operands:IValue[]):IValue {
        const method = this._type.get_method(method_nane, this.get_types(operands) );
        if (method) {
            return method.eval_safe(this, operands);
        }
        return undefined;
    }

    eval_debug(method_nane:string, operands:IValue[]):IValue {
        const method = this._type.get_method(method_nane, this.get_types(operands) );
        if (method) {
            return method.eval_debug(this, operands);
        }
        return undefined;
    }


    get_types(operands:IValue[]):IType[] {
        return operands.map( (value, index, array)=>value.get_type() );
    }
}