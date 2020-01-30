
enum OPCODES {
    EXIT            = 101,
    TRAP            = 102,

    RETURN          = 111,
    CALL            = 112,
    JUMP            = 113,
    // JUMP_IF_TRUE    = 194,

    POP_VALUE       = 121,
    PUSH_VALUE      = 122,

    REG_VALUE_GET   = 123,
    REG_VALUE_SET   = 124,

    MEMORY_GET_VALUE= 125,
    MEMORY_SET_VALUE= 126,

    I_ADD           = 211,
    I_SUB           = 212,
    I_MUL           = 213,
    I_DIV           = 214,
    I_POW           = 215,
    I_IS_TRUE       = 216,
    I_IS_POSITIVE   = 217,
    I_IS_ZERO       = 218,
    I_NEG           = 219,
    I_EQUAL         = 220,
    I_GT            = 221,
    I_LT            = 222,
    I_GE            = 223,
    I_LE            = 224,

    F_ADD           = 231,
    F_SUB           = 232,
    F_MUL           = 233,
    F_DIV           = 234,
    F_POW           = 235,
    F_IS_TRUE       = 236,
    F_IS_POSITIVE   = 237,
    F_IS_ZERO       = 238,
    F_NEG           = 239,
    F_EQUAL         = 240,
    F_GT            = 241,
    F_LT            = 242,
    F_GE            = 243,
    F_LE            = 244,

    LIMIT_OPD_INLINE = 250
    // _ADD           = 21,
    // _SUB           = 22,
    // _MUL           = 23,
    // _DIV           = 24,
    // _POW           = 25,
    // _IS_TRUE       = 26,
    // _IS_POSITIVE   = 27,
    // _IS_ZERO       = 28,
    // _NEG           = 29,
    
}

export default OPCODES;
