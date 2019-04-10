import IFeature from '../../core/ifeature';
import IType from '../../core/itype';
import IMethod from '../../core/imethod';




export default class VMFeature implements IFeature {
    private _methods:Map<string,IMethod> = new Map<string,IMethod>();

    constructor(private _name:string, methods:IMethod[], private _converters:Map<string,IMethod>){
        let method:IMethod;
        for(method of methods){
            this._methods.set(method.get_name(), method);
        }
    }

    get_name():string { return this._name; }

    get_method(method_name:string, operands:IType[]):IMethod {
        const method = this._methods.get(method_name);
        if (method && method.match_operands(operands)) {
            return method;
        }
        return undefined;
    }

    get_converters():Map<string,IMethod> {
        return this._converters;
    }
}