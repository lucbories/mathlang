
import VMMethod from '../../engine/vm/vmmethod';
import VMFeature from '../../engine/vm/vmfeature';

import {
    boolean_const_method,
    boolean_method,
    boolean_boolean_method,
    boolean_boolean_boolean_method
} from './vmboolean_helpers';

import TYPE_CONVERTERS from './vmboolean_converters';


const boolean_and   = boolean_boolean_boolean_method("BooleanAnd", (a:boolean,b:boolean):boolean=>a && b);
const boolean_nand   = boolean_boolean_boolean_method("BooleanNand", (a:boolean,b:boolean):boolean=>(a && b) ? false : true);

const boolean_or    = boolean_boolean_boolean_method("BooleanOr", (a:boolean,b:boolean):boolean=>a || b);
const boolean_nor   = boolean_boolean_boolean_method("BooleanNor", (a:boolean,b:boolean):boolean=>(a && b) ? false : ! (a || b));

const boolean_xor   = boolean_boolean_boolean_method("BooleanXor", (a:boolean,b:boolean):boolean=>(a && b) ? false : (a || b) );
const boolean_xnor   = boolean_boolean_boolean_method("BooleanXnor", (a:boolean,b:boolean):boolean=>a == b);

const boolean_not    = boolean_boolean_method("BooleanAbs", (a:boolean)=>! a);


const TYPE_LOGIC_METHODS:VMMethod[]=[
    boolean_and, boolean_or, boolean_xor,
    boolean_nand, boolean_nor, boolean_xnor,
    boolean_not
];


class BooleanLogicFeature extends VMFeature {
    constructor(){
        super("BooleanLogic", TYPE_LOGIC_METHODS, TYPE_CONVERTERS);
    }
}

const TYPE_FEATURE_SINGLETON = new BooleanLogicFeature();

export default TYPE_FEATURE_SINGLETON;