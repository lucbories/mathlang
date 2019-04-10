import IType, { IConvertersMap} from '../../core/itype';
import IValue from '../../core/ivalue';
import IMethod from '../../core/imethod';
import IFeature from '../../core/ifeature';


 export default abstract class VMType implements IType {
    private _converters_to:Map<string,IMethod[]> = new Map<string,IMethod[]>();

    constructor(private _name:string, private _features:IFeature[]) {
        this._features.map(f=>this.add_feature(f));
    }
    
    get_name():string { return this._name; }

    equals(type:IType):boolean {
        // TODO:Type.equals:comparre features or an UIID
        return type && this.get_name() == type.get_name();
    }


    // FEATURES
    get_features():IFeature[] { return this._features; }
    has_feature(feature:IFeature):boolean { return feature && this._features.indexOf(feature) > -1; }
    
    add_feature(feature:IFeature):void {
        this._features.push(feature);
        const converters = feature.get_converters();
        this.add_converters(converters);
    }
    
    remove_feature(feature:IFeature):void {
        const index = this._features.indexOf(feature);
        if (index > -1) {
            this._features.splice(index, 1);
        }
    }


    // METHODS
    get_method(method_name:string, operands:IType[]):IMethod {
        let feature:IFeature;
        for(feature of this._features) {
            const method = feature.get_method(method_name, operands);
            if (method) {
                return method;
            }
        }
        return undefined;
    }

    get_method_with_values(method_name:string, operands:IValue[]):IMethod {
        // Get values operands types
        let types:IType[] = [];
        let value:IValue;
        for(value of operands) {
            types.push(value.get_type());
        }

        // Lookup for method
        let feature:IFeature;
        for(feature of this._features) {
            const method = feature.get_method(method_name, types);
            if (method) {
                return method;
            }
        }
        return undefined;
    }

    abstract create(create_value:any):any;


    // CONVERT TO TYPE
    abstract to_number(value:any):number;
    abstract to_string(value:any):string;

    to(target_type:IType, source_value:IValue, target_value:IValue):IValue {
        const method = this.get_converter_to(target_type);
        if (method) {
            method.eval_safe(target_value, [source_value]);
            return target_value;
        }
        return undefined
    }


    // CONVERT FROM TYPE
    abstract from_number(value:number):any;
    abstract from_string(value:string):any;

    from(source_type:IType, source_value:IValue, target_value:IValue):IValue {
        const method = source_type.get_converter_to(this);
        if (method) {
            method.eval_safe(target_value, [source_value]);
            return target_value;
        }
        return undefined
    }


    // TYPES CONVERTERS
    add_converters(converters:Map<string,IMethod>) {
        let opds_types:IType[];
        let from_type:IType;
        let to_type:IType;
        let method:IMethod;
        for(method of converters.values()) {
            opds_types = method.get_operands_types();
            if (opds_types.length > 0) {
                from_type = opds_types[0];
                to_type = method.get_returned_type();
                if (from_type.get_name() == this.get_name()) {
                    if (to_type.get_name() != this.get_name()) {
                        this.add_converter_to(to_type, method);
                    }
                } else {
                    from_type.add_converter_to(to_type, method);
                }
            }
            
        }
    }

    has_converter_to(target_type:IType):boolean {
        const methods = this._converters_to.get(target_type.get_name());
        return methods.length > 0;
    }

    get_converter_to(target_type:IType):IMethod {
        const methods = this._converters_to.get(target_type.get_name());
        return methods[methods.length - 1];
    }
    
    add_converter_to(target_type:IType, method:IMethod):void {
        const name = target_type.get_name();

        if (! this._converters_to.has(name) ) {
            this._converters_to.set(name, [method]);
            return;
        }
        
        const methods = this._converters_to.get(name);
        methods.push(method);
    }

    remove_converter_to(target_type:IType, method:IMethod):void {
        if (! this._converters_to.has(name) ) {
            return;
        }
        const methods = this._converters_to.get(target_type.get_name());
        const index = methods.indexOf(method);
        if (index > -1) {
            methods.splice(index, 1);
        }
    }
}
