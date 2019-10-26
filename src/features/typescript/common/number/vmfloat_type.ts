import VMType from '../../../../engine/vm/vmtype';
import IFeature from '../../../../core/ifeature';


const TYPE_NAME:string='FLOAT';
const TYPE_FEATURES:IFeature[]=[];


class VMFloatType extends VMType {
    constructor() {
        super(TYPE_NAME, TYPE_FEATURES);
    }

    create(create_value:number):any { return create_value; }

    to_number(value:number):number { return value; }
    to_string(value:number):string { return '' + value; }

    from_number(value:number):number { return value; }
    from_string(value:string):number {
        try{
            return parseFloat(value);
        } catch(e) {
            return undefined
        }
    }
}

const TYPE_SINGLETON = new VMFloatType();

export default  TYPE_SINGLETON;