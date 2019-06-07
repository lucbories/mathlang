import IValue from './ivalue';


export default interface IInstruction {
    get_opcode(): number;
    get_opname(): string;

    get_operands_count():number;

    get_inline_number_1():number;
    get_inline_number_2():number;
    get_inline_number_3():number;

    get_inline_string_1():string;
    get_inline_string_2():string;
    get_inline_string_3():string;

    eval_unsafe(...operands:IValue[]):IValue;
    eval_safe(...operands:IValue[]):IValue;
    eval_debug(...operands:IValue[]):IValue;

    compile_to_js_source():string;
    compile_to_js_function():Function;
};


export const OPCODES = {
    "CUSTOM":0,
    "GOTO":1,
    
    "POPV":2, "PUSHV":3,
    "REGV":4, "UNRV":5, "GETRV":6,
    
    "DBUGON":10, "DBUGOFF":11,
    "TRACEV":20, "TRACETOP":21, "TRACEI":22,
    
    "IFPOS":30, "IFZERO":31, "IFNEG":32, "IFPOSZ":33, "IFNEGZ":34,

    // STRING OPERATIONS
    "EQSTR":40, "NEQSTR":41,
    
    // NUMBER OPERATIONS
    "INCNUMTOP":50, "DECNUMTOP":51, "INCNUMREG":52, "DECNUMREG":53,
    "EQNUMTOP":54, "NEQNUMTOP":55, "EQNUMREG":56, "NEQNUMREG":57,
    
    // CALL
    "CALL_ENTER":60,
    "CALL_LEAVE":61,

    "EXIT":999
};
