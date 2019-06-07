import * as BigIntegerStatic from 'big-integer/BigInteger';
import VMType from '../../../engine/vm/vmtype';
import IFeature from '../../../core/ifeature';

// type BigNumber = BigIntegerStatic.BigNumber;
type BigInteger = BigIntegerStatic.BigInteger;


const BIGINT_NAME:string='BIGINT_TYPE';
const BIGINT_FEATURES:IFeature[]=[];


class VMBigIntType extends VMType {
    constructor() {
        super(BIGINT_NAME, BIGINT_FEATURES);
    }

    create(create_value:any):any {
        if ( BigIntegerStatic.isInstance(create_value) ) {
            return create_value;
        }
        if (typeof create_value == "string") {
            return this.from_string(create_value);
        }
        if (typeof create_value == "number") {
            return this.from_number(create_value);
        }
        return undefined;
    }

    to_number(value:BigInteger):number { return value.toJSNumber(); }
    to_string(value:BigInteger):string { return value.toString(); }

    from_number(value:number):BigInteger { return BigIntegerStatic(value); }
    from_string(value:string):BigInteger {
        const base = 10;
        const alphabet:string = undefined;
        const caseSensitive = true;
        return BigIntegerStatic(value, base, alphabet, caseSensitive);
    }
}

const BIGINT_TYPE = new VMBigIntType();

export default  BIGINT_TYPE;