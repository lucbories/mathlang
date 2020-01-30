
import ICompilerType from './icompiler_type';


export const IC_OPCODES = {
    EXIT            : 101,
    TRAP            : 102,

    FUNCTION        : 190,
    EBB             : 191,
    RETURN          : 192,
    CALL            : 193,
    JUMP            : 194,
    LOCAL_VAR_SET   : 195,
    LOCAL_VAR_GET   : 196,

    ATTRIBUTE_GET   : 181,
    ATTRIBUTE_SET   : 182,

    METHOD_CALL     : 183,
    METHOD_SET      : 184,

    // MESSAGE_EMIT    : 185,
    // MESSAGE_ON      : 186,
    
    // ERROR_EMIT      : 187,
    // ERROR_ON        : 188,

    // HEAP_NEW        : 100,
    // HEAP_GET        : 101,
    // HEAP_SET        : 102,

    // REGISTER_NEW    : 110,
    // REGISTER_GET    : 111,
    // REGISTER_SET    : 112,

    // VSTACK_NEW      : 120,
    // VSTACK_POP      : 121,
    // VSTACK_PUSH     : 122,

    // ARRAY_NEW       : 130,
    ARRAY_GET_AT    : 131,
    // ARRAY_SET_AT    : 132,

    // IF_ZERO         : 201,
    // IF_POSITIVE     : 202,
    // IF_NEGATIVE     : 203,
    IF_TRUE         : 204,
    // IF_FALSE        : 205,
    // IF_GE           : 206,
    // IF_GT           : 207,
    // IF_LE           : 208,
    // IF_LT           : 209,
    // IF_EQ           : 210,
    // IF_NEQ          : 211,
}


export type ICompilerIcOpCode = number;
export type ICompilerIcInstrOperand = string; // r1,v12, pop...
export type ICompilerIcEbbOperand = {
    opd_name:string,
    opd_type:ICompilerType
}

export interface ICompilerIcEbb {
	ic_ebb_index:number;
	ic_ebb_name:string;
    ic_operands:ICompilerIcEbbOperand[],
    ic_operands_map:Map<string,string>,
    ic_instructions:ICompilerIcInstr[];
}

export default ICompilerIcInstr;
export interface ICompilerIcInstr {
	ic_code:ICompilerIcOpCode;
	ic_type:ICompilerType;
    ic_opds:ICompilerIcInstrOperand[];
    ic_var_name:string;
}