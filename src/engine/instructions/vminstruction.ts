import IValue from '../../core/ivalue';
import IInstruction from '../../core/iinstruction';
import { OPCODES } from '../../core/iinstruction';


export default abstract class VMInstruction implements IInstruction {
    constructor(private _operands_count:number) {
    }

    abstract get_opcode(): number;
    abstract get_opname(): string;

    get_operands_count():number {
        return this._operands_count;
    }

    get_inline_number_1():number { return undefined; }
    get_inline_number_2():number { return undefined; }
    get_inline_number_3():number { return undefined; }

    get_inline_string_1():string { return undefined; }
    get_inline_string_2():string { return undefined; }
    get_inline_string_3():string { return undefined; }

    eval_unsafe(...values:IValue[]):IValue {
        if (values.length != this._operands_count) {
            this.error_bad_operands_count(values.length);
            return undefined;
        }
        return this._eval_unsafe(...values);
    }
    
    eval_safe(...values:IValue[]):IValue {
        if (values.length != this._operands_count) {
            this.error_bad_operands_count(values.length);
            return undefined;
        }
        return this._eval_safe(...values);
    }

    eval_debug(...values:IValue[]):IValue {
        if (values.length != this._operands_count) {
            this.error_bad_operands_count(values.length);
            return undefined;
        }
        return this._eval_debug(...values);
    }

    abstract _eval_unsafe(...values:IValue[]):IValue;
    abstract _eval_safe  (...values:IValue[]):IValue;
    abstract _eval_debug (...values:IValue[]):IValue;


    compile_to_js_source():string { // TODO
        return "";
    }

    compile_to_js_function():Function { // TODO
        return function():any{
            return undefined;
        }
    }


    error_bad_operands_count(count:number) { // TODO
        // ...
    }

    error_bad_operands_types() { // TODO
        // ...
    }
}
