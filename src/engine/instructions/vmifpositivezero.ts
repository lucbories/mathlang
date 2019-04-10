import VMValueIface from '../../core/ivalue';
import { OPCODES } from '../../core/iinstruction';
import VMInstruction from './vminstruction';


export default class VMIfPositiveZero extends VMInstruction {
    constructor(private _number_1:number) {
        super(1);
    }

    get_opcode(): number { return OPCODES["IFPOSZ"]; }
    get_opname(): string { return "IFPOSZ"; }

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
