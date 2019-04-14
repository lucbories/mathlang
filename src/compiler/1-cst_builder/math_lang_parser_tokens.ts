import {
    createToken as chevrotain_createToken,
    Lexer,
    ITokenConfig
} from 'chevrotain';



// ----------------- lexer -----------------
export const math_lang_tokens:any[] = [];

// Utility to avoid manually building the math_lang_tokens array
function createToken(options?:ITokenConfig) {
    const newToken = chevrotain_createToken(options)
    math_lang_tokens.push(newToken)
    return newToken
}


// SYMBOLS
export const LCurly            = createToken({ name: "LCurly",             pattern: /{/ });
export const RCurly            = createToken({ name: "RCurly",             pattern: /}/ });

export const LParen            = createToken({ name: "LParen",             pattern: /\(/ });
export const RParen            = createToken({ name: "RParen",             pattern: /\)/ });

export const LSquare           = createToken({ name: "LSquare",            pattern: /\[/ });
export const RSquare           = createToken({ name: "RSquare",            pattern: /]/ });

export const Comma             = createToken({ name: "Comma",              pattern: /,/ });
export const Colon             = createToken({ name: "Colon",              pattern: /:/ });
export const Dot               = createToken({ name: "Dot",                pattern: /\./ });
export const Dash              = createToken({ name: "Dash",               pattern: /#/ });

// OPERATORS
export const Incr              = createToken({ name: "Incr",               pattern: /\+\+/ });
export const Decr              = createToken({ name: "Decr",               pattern: /--/ });

export const Percentage        = createToken({ name: "Percentage",         pattern: /%/ });
export const Equality          = createToken({ name: "Equality",           pattern: /==/ });
export const Difference        = createToken({ name: "Difference",         pattern: /!=/ });
export const Exclam            = createToken({ name: "Exclam",             pattern: /!/ });

export const LessEqualThan     = createToken({ name: "LessEqualThan",      pattern: /<=/ });
export const LessThan          = createToken({ name: "LessThan",           pattern: /</ });
export const GreaterEqualThan  = createToken({ name: "GreaterEqualThan",   pattern: />=/ });
export const GreaterThan       = createToken({ name: "GreaterThan",        pattern: />/ });

export const Assign            = createToken({ name: "Assign",             pattern: /=/ });

export const Plus              = createToken({ name: "Plus",               pattern: /\+/ });
export const Minus             = createToken({ name: "Minus",              pattern: /-/ });
export const Mult              = createToken({ name: "Mult",               pattern: /\*/ });
export const Div               = createToken({ name: "Div",                pattern: /\// });


// LITERALS
export const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /'(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*'/
});

export const BigFloat1Literal = createToken({
    name: "BigFloat1Literal",
    pattern: /(0|[1-9]\d{10,})\.\d+([eE][+-]?\d+)?/
});
export const BigFloat2Literal = createToken({
    name: "BigFloat2Literal",
    pattern: /(0|[1-9]\d*)\.\d{10,}([eE][+-]?\d+)?/
});
export const BigFloat3Literal = createToken({
    name: "BigFloat3Literal",
    pattern: /(0|[1-9]\d*)\.\d+[eE][+-]?\d{3,}/
});

export const FloatLiteral = createToken({
    name: "FloatLiteral",
    pattern: /(0|[1-9]\d{0,9})\.\d{1,10}([eE][+-]?\d{1,2})?/
});

export const BigInteger1Literal = createToken({
    name: "BigInteger1Literal",
    pattern: /(0|[1-9]\d{10,})/
});
export const BigInteger2Literal = createToken({
    name: "BigInteger2Literal",
    pattern: /(0|[1-9]\d*)[eE][+-]?\d{3,}/
});

export const IntegerLiteral = createToken({
    name: "IntegerLiteral",
    pattern: /(0|[1-9]\d{0,9})([eE][+-]?\d{1,2})?/
});

export const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /[ \t\n\r]+/,
    group: Lexer.SKIPPED
});


// KEYWORDS
export const Null      = createToken({ name: "Null",       pattern: /null/ });
export const True      = createToken({ name: "True",       pattern: /true/ });
export const False     = createToken({ name: "False",      pattern: /false/ });

export const If        = createToken({ name: "If",         pattern: /if/ });
export const Else      = createToken({ name: "Else",       pattern: /else/ });
export const Then      = createToken({ name: "Then",       pattern: /then/ });
export const EndIf     = createToken({ name: "EndIf",      pattern: /end if/ });

export const Do        = createToken({ name: "Do",         pattern: /do/ });
export const In        = createToken({ name: "In",         pattern: /in/ });
export const From      = createToken({ name: "From",       pattern: /from/ });
export const To        = createToken({ name: "To",         pattern: /to/ });
export const Step      = createToken({ name: "Step",       pattern: /step/ });

export const While     = createToken({ name: "While",      pattern: /while/ });
export const EndWhile  = createToken({ name: "EndWhile",   pattern: /end while/ });

export const Loop      = createToken({ name: "Loop",       pattern: /loop/ });
export const EndLoop   = createToken({ name: "EndLoop",    pattern: /end loop/ });

export const For       = createToken({ name: "For",        pattern: /for/ });
export const EndFor    = createToken({ name: "EndFor",     pattern: /end for/ });

// TODO: resolve ambiguity keywords vs identifiers
export const ID        = createToken({ name: "ID", pattern: /[a-zA-Z][a-zA-Z0-9_]*/ });
