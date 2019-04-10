import VMValueIface from '../../core/ivalue';
import { OPCODES } from '../../core/iinstruction';
import VMInstruction from './vminstruction';


export default class VMCustom extends VMInstruction {
    constructor(operands_count:number) {
        super(operands_count);
    }

    get_opcode(): number { return OPCODES["CUSTOM"]; }
    get_opname(): string { return "CUSTOM"; }
    

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
