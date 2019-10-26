import VMType from '../../../engine/vm/vmtype';
import IFeature from '../../../core/ifeature';
import IValue from '../../../core/ivalue';


const TYPE_NAME:string='ARRAY';
const TYPE_FEATURES:IFeature[]=[];
type TYPE_VALUE=IValue[];
const ARRAY_STRING_PREFIX:string='[';
const ARRAY_STRING_SEPARATOR:string=',';
const ARRAY_STRING_SUFFIX:string=']';


class VMArrayType extends VMType {
    constructor() {
        super(TYPE_NAME, TYPE_FEATURES);
    }

    create(create_value:TYPE_VALUE):TYPE_VALUE { return create_value; }

    to_number(value:TYPE_VALUE):number { return value.length; }
    to_string(value:TYPE_VALUE):string { return ARRAY_STRING_PREFIX + value.join(ARRAY_STRING_SEPARATOR) + ARRAY_STRING_SUFFIX; }

    from_number(value:number):TYPE_VALUE { return new Array(value); }
    from_string(value:string):TYPE_VALUE {
        try{
            const content = value.substr(ARRAY_STRING_PREFIX.length, value.length - ARRAY_STRING_PREFIX.length - ARRAY_STRING_SUFFIX.length);
            const content_strings = content.split(ARRAY_STRING_SEPARATOR);
            const content_values = content_strings.map(str=>'????') // TODO
            return undefined;
        } catch(e) {
            return undefined
        }
    }
}

const TYPE_SINGLETON = new VMArrayType();

export default  TYPE_SINGLETON;