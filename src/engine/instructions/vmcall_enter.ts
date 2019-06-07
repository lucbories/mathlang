import VMValueIface from '../../core/ivalue';
import { OPCODES } from '../../core/iinstruction';
import VMInstruction from './vminstruction';


export default class VMCallEnter extends VMInstruction {
    constructor() {
        super(0);
    }

    get_opcode(): number { return OPCODES["CALL_ENTER"]; }
    get_opname(): string { return "CALL_ENTER"; }


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
