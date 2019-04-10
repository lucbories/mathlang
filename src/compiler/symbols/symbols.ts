
const SYMBOLS_MAP = {
    // TYPES
    INTEGER:    {code:101, name:'INTEGER' },
    FLOAT:      {code:102, name:'FLOAT' },
    BOOLEAN:    {code:103, name:'BOOLEAN' },
    STRING:     {code:104, name:'STRING' },
    BIGINT:     {code:105, name:'BIGINT' },
    BIGFLOAT:   {code:106, name:'BIGFLOAT' },
    // OPERATIONS
    FUNCTION:   {code:200, name:'FUNCTION' },
    UNOP:       {code:201, name:'UNOP' },
    BINOP:      {code:202, name:'BINOP' },
    TRIOP:      {code:203, name:'TRIOP' },
    LAMBDA:     {code:204, name:'LAMBDA' }
};


export default SYMBOLS_MAP;