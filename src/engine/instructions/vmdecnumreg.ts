import VMValueIface from '../../core/ivalue';
import { OPCODES } from '../../core/iinstruction';
import VMInstruction from './vminstruction';


export default class VMDecNumberReg extends VMInstruction {
    constructor(private _number_1:number, private _number_2:number) {
        super(0);
    }

    get_opcode(): number { return OPCODES["DECNUMREG"]; }
    get_opname(): string { return "DECNUMREG"; }

    get_inline_number_1() { return this._number_1; } // REGISTER INDEX
    get_inline_number_2() { return this._number_2; } // STEP TO DECREMENT

    _eval_unsafe(...values:VMValueIface[]):VMValueIface {

        return undefined;
    }

    _eval_safe(...values:VMValueIface[]):VMValueIface {

        return undefined;
    }

    _eval_debug(...values:VMValueIface[]):VMValueIface {

        return undefined;
    }
}
