/**
 * Operation codes (opcodes) identify VM atomic predefined instructions.
 *   
 * Each Opcode is stored with a 8 bits unsigned value (uint8).
 *   values from 250-255 are reserved for inline operands management
 * 
 *   001 exit VM program
 *   002 trap VM error
 *   010-019 code control: call, return, jump
 *   020-021 values stack: pop, push
 *   022-023 values registers: set, get
 *   024-025 values raw memory: set, get
 *   030-039 Algebric operators: simplify, solve, devrivate, integrate
 *   040-049 Unit operators fro quantity: from_unit, to_unit, to_norm_unit
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
    EMPTY            = 0,
    EXIT            = 1,
    TRAP            = 2,

    RETURN          = 11,
    CALL            = 12,
    JUMP            = 13,
    JUMP_IF_TRUE    = 14,

    POP_VALUE       = 20,
    PUSH_VALUE_REG  = 21,
    PUSH_VALUE_MEM  = 22,

    REG_VALUE_GET   = 30,
    REG_VALUE_SET   = 31,

    MEMORY_GET_VALUE= 40,
    MEMORY_SET_VALUE= 41,

    I_EQUAL         = 50,
    I_ADD           = 51,
    I_SUB           =  52,
    I_MUL           =  53,
    I_DIV           =  54,
    I_POW           =  55,
    I_IS_TRUE       =  56,
    I_IS_POSITIVE   =  57,
    I_IS_ZERO       =  58,
    I_NEG           =  59,
    I_LT            =  60,
    I_GT            =  61,
    I_GE            =  62,
    I_LE            =  63,

    F_EQUAL         =  70,
    F_ADD           =  71,
    F_SUB           =  72,
    F_MUL           =  73,
    F_DIV           =  74,
    F_POW           =  75,
    F_IS_TRUE       =  76,
    F_IS_POSITIVE   =  77,
    F_IS_ZERO       =  78,
    F_NEG           =  79,
    F_GT            =  80,
    F_LT            =  81,
    F_GE            =  82,
    F_LE            =  83,

    C_EQUAL         =  90,
    C_ADD           =  91,
    C_SUB           =  92,
    C_MUL           =  93,
    C_DIV           =  94,
    C_POW           =  95,
    C_IS_TRUE       =  96,
    C_IS_POSITIVE   =  97,
    C_IS_ZERO       =  98,
    C_NEG           =  99,
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

    BC_EQUAL        = 150,
    BC_ADD          = 151,
    BC_SUB          = 152,
    BC_MUL          = 153,
    BC_DIV          = 154,
    BC_POW          = 155,
    BC_IS_TRUE      = 156,
    BC_IS_POSITIVE  = 157,
    BC_IS_ZERO      = 158,
    BC_NEG          = 159,
    BC_GT           = 150,
    BC_LT           = 151,
    BC_GE           = 152,
    BC_LE           = 153,

    COL_COUNT       = 160,
    COL_SIZE        = 161,
    COL_EMPTY       = 162,
    COL_RESIZE      = 163,
    COL_ENQUEUE     = 164,
    COL_DEQUEUE     = 165,
    COL_POP         = 166,
    COL_PUSH        = 167,
    COL_TOP         = 168,
    COL_BACK        = 169,
    COL_REMOVE_TOP  = 170,
    COL_REMOVE_BACK = 171,
    COL_HAS         = 172,
    COL_GET         = 173,
    COL_SET         = 174,
    COL_INSERT      = 175,
    COL_REMOVE      = 176,

    M_EQUAL         = 180,
    M_ADD           = 151,
    M_SUB           = 152,
    M_MUL           = 153,
    M_DIV           = 154,

    M_DIM           = 180,
    M_DIAG          = 180,
    M_ONE           = 180,

    LIMIT_OPD_INLINE = 250,
    LIMIT_OPD_STACK  = 251,
    LIMIT_OPD_REGISTER = 252,
    LIMIT_OPD_MEMORY = 253
    
}

export default OPCODES;
