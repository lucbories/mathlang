import VMType from '../../../engine/vm/vmtype';
import IFeature from '../../../core/ifeature';


const TYPE_NAME:string='STRING';
const TYPE_FEATURES:IFeature[]=[];


class VMStringType extends VMType {
    constructor() {
        super(TYPE_NAME, TYPE_FEATURES);
    }

    create(create_value:string):any { return create_value; }

    to_number(value:string):number {
        try {
            return parseFloat(value);
        } catch (e) {
            return 0;
        }
    }
    to_string(value:string):string { return value; }

    from_number(value:number):string { return '' + value; }
    from_string(value:string):string { return value; }
}

const TYPE_SINGLETON = new VMStringType();

export default  TYPE_SINGLETON;