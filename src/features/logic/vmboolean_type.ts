import VMType from '../../engine/vm/vmtype';
import IFeature from '../../core/ifeature';


const TYPE_NAME:string='BOOLEAN_TYPE';
const TYPE_FEATURES:IFeature[]=[];


class VMBooleanType extends VMType {
    constructor() {
        super(TYPE_NAME, TYPE_FEATURES);
    }

    create(create_value:boolean):any { return create_value; }

    to_number(value:boolean):number { return value ? 1 : 0; }
    to_string(value:boolean):string { return value ? '1' : '0'; }

    from_number(value:number):boolean { return value > 0 ? true : false; }
    from_string(value:string):boolean { return value == '1' ? true : false; }
}

const TYPE_SINGLETON = new VMBooleanType();

export default  TYPE_SINGLETON;