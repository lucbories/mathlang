import VMValueIface from '../../core/ivalue';
import { OPCODES } from '../../core/iinstruction';
import VMInstruction from './vminstruction';


export default class VMEqNumberTop extends VMInstruction {
    constructor(private _number_1:number) {
        super(2);
    }

    get_opcode(): number { return OPCODES["EQNUMTOP"]; }
    get_opname(): string { return "EQNUMTOP"; }

    get_inline_number_1() { return this._number_1; } // INSTRUCTION CURSOR DELTA

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
