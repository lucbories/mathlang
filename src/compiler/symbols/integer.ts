import SYMBOLS from './symbols'; 
import Numeric from './numeric';

export default class Integer extends Numeric { 
    constructor(private _value: Number){
        super(SYMBOLS.INTEGER.name, SYMBOLS.INTEGER.code)
    }
    get_value() : Number { return this._value; }
    set_value(new_value: Number) { this._value = new_value; }
}