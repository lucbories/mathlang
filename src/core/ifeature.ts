import IValue from './ivalue';
import IType from './itype';
import IMethod from './imethod';


export default interface IFeature {
    get_name():string;

    get_method(method_name:string, operands:IType[]):IMethod;

    get_converters():Map<string,IMethod>;
    get_methods():Map<string,IMethod>;
}