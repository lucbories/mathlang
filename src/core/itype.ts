import IValue from './ivalue';
import IMethod from './imethod';
import IFeature from './ifeature';


export default interface IType {
    get_name():string;
    equals(type:IType):boolean;

    get_features():IFeature[];
    has_feature(feature:IFeature):boolean;
    add_feature(feature:IFeature):void;
    remove_feature(feature:IFeature):void;

    get_indexes_count():number;
    get_indexed_type():IType;

    has_attribute(attribute_name:string):boolean;
    get_attribute(attribute_name:string):IType;

    has_method(method_name:string, operands:IType[]):boolean;
    get_method(method_name:string, operands:IType[]):IMethod;
    get_method_with_values(method_name:string, operands:IValue[]):IMethod;

    create(create_value:any):any;

    to_number(value:any):number;
    to_string(value:any):string;
    to(target_type:IType, source_value:IValue, target_value:IValue):IValue;

    from_number(value:number):any;
    from_string(value:string):any;
    from(source_type:IType, source_value:IValue, target_value:IValue):IValue;

    get_converter_to(target_type:IType):IMethod;
    has_converter_to(target_type:IType):boolean;
    add_converter_to(target_type:IType, method:IMethod):void;
    remove_converter_to(target_type:IType, method:IMethod):void;
}

export type IConvertersMap = Map<string,IMethod[]>;
