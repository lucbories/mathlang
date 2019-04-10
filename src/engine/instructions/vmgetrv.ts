import VMValueIface from '../../core/ivalue';
import { OPCODES } from '../../core/iinstruction';
import VMInstruction from './vminstruction';


export default class VMGetRegV extends VMInstruction {
    constructor(private _number_1:number) {
        super(0);
    }

    get_opcode(): number { return OPCODES["GETRV"]; }
    get_opname(): string { return "GETRV"; }

    get_inline_number_1() { return this._number_1; }


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
