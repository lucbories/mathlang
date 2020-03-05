/**
 * Operation codes (opcodes) identify VM atomic predefined instructions.
 *   
 * Each Opcode is stored with a 8 bits unsigned value (uint8).
 *   values from 250-255 are reserved for inline operands management
 * 
 *   001 exit VM program
 *   002 trap VM error
 *   010-019 code control: call, return, jump
 *   020-029 values stack: pop, push
 *   030-039 values registers: set, get
 *   040-049 values raw memory: set, get
 *   050-069 Integer operators: add, sub, equal...
 *   070-089 Float operators: add, sub, equal...
 *   090-109 Complex operators: add, sub, equal...
 *   110-129 Big Integer operators: add, sub, equal...
 *   130-149 Big Float operators: add, sub, equal...
 *   150-169 Big Complex operators: add, sub, equal...
 *   170-179 Collections operators for Queue, Stack, List, Set, Map
		4 all:count, size, empty, resize
		2 Queue: enqueue, dequeue
		6 Stack: pop, push, top, back, remove-top, remove-back
		5 List: has, get, insert, set, remove
		3 Set: has, insert, remove
		4 Map: has, set, get, remove
 *   180-199 Vector/Matrix operators: add, sub, mul, div, dot, diag...
 *   200-219 Tensor
 *   210-229 String
 *   230-239 Boolean
 *   240-249 Graph
 *   250
 * 
 */
enum OPCODES {
    EXIT            = 001,
    TRAP            = 002,

    RETURN          = 011,
    CALL            = 012,
    JUMP            = 013,
    // JUMP_IF_TRUE    = 014,

    POP_VALUE       = 020,
    PUSH_VALUE      = 021,

    REG_VALUE_GET   = 030,
    REG_VALUE_SET   = 031,

    MEMORY_GET_VALUE= 040,
    MEMORY_SET_VALUE= 041,

    I_EQUAL         = 050,
    I_ADD           = 051,
    I_SUB           = 052,
    I_MUL           = 053,
    I_DIV           = 054,
    I_POW           = 055,
    I_IS_TRUE       = 056,
    I_IS_POSITIVE   = 057,
    I_IS_ZERO       = 058,
    I_NEG           = 059,
    I_LT            = 060,
    I_GT            = 061,
    I_GE            = 062,
    I_LE            = 063,

    F_EQUAL         = 070,
    F_ADD           = 071,
    F_SUB           = 072,
    F_MUL           = 073,
    F_DIV           = 074,
    F_POW           = 075,
    F_IS_TRUE       = 076,
    F_IS_POSITIVE   = 077,
    F_IS_ZERO       = 078,
    F_NEG           = 079,
    F_GT            = 080,
    F_LT            = 081,
    F_GE            = 082,
    F_LE            = 083,

    C_EQUAL         = 090,
    C_ADD           = 091,
    C_SUB           = 092,
    C_MUL           = 093,
    C_DIV           = 094,
    C_POW           = 095,
    C_IS_TRUE       = 096,
    C_IS_POSITIVE   = 097,
    C_IS_ZERO       = 098,
    C_NEG           = 099,
    C_GT            = 100,
    C_LT            = 101,
    C_GE            = 102,
    C_LE            = 103,

    BI_EQUAL        = 110,
    BI_ADD          = 111,
    BI_SUB          = 112,
    BI_MUL          = 113,
    BI_DIV          = 114,
    BI_POW          = 115,
    BI_IS_TRUE      = 116,
    BI_IS_POSITIVE  = 117,
    BI_IS_ZERO      = 118,
    BI_NEG          = 119,
    BI_GT           = 120,
    BI_LT           = 121,
    BI_GE           = 122,
    BI_LE           = 123,

    BF_EQUAL        = 130,
    BF_ADD          = 131,
    BF_SUB          = 132,
    BF_MUL          = 133,
    BF_DIV          = 134,
    BF_POW          = 135,
    BF_IS_TRUE      = 136,
    BF_IS_POSITIVE  = 137,
    BF_IS_ZERO      = 138,
    BF_NEG          = 139,
    BF_GT           = 140,
    BF_LT           = 141,
    BF_GE           = 142,
    BF_LE           = 143,

    LIMIT_OPD_INLINE = 250
    
}

export default OPCODES;
