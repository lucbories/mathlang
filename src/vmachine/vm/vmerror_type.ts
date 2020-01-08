import VMType from './vmtype';
import IFeature from '../../core/ifeature';


const ERROR_NAME:string='ERROR_TYPE';
const ERROR_FEATURES:IFeature[]=[];


class VMErrorType extends VMType {
    constructor() {
        super(ERROR_NAME, ERROR_FEATURES);
    }

    create(create_value:number):any { return create_value; }

    to_number(value:number):number { return value; }
    to_string(value:number):string { return '' + value; }

    from_number(value:number):number { return value; }
    from_string(value:string):string { return value; }
}

const ERROR_TYPE = new VMErrorType();

export default  ERROR_TYPE;