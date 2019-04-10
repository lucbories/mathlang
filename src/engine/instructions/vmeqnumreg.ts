import VMValueIface from '../../core/ivalue';
import { OPCODES } from '../../core/iinstruction';
import VMInstruction from './vminstruction';


export default class VMEqNumberReg extends VMInstruction {
    constructor(private _number_1:number, private _number_2:number, private _number_3:number) {
        super(0);
    }

    get_opcode(): number { return OPCODES["EQNUMREG"]; }
    get_opname(): string { return "EQNUMREG"; }

    get_inline_number_1() { return this._number_1; } // INSTRUCTION CURSOR DELTA
    get_inline_number_2() { return this._number_2; } // OPERAND 1 REGISTER INDEX
    get_inline_number_3() { return this._number_3; } // OPERAND 2 REGISTER INDEX

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
