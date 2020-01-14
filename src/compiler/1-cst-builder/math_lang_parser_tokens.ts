import {
    createToken as chevrotain_createToken,
    Lexer,
    ITokenConfig
} from 'chevrotain';



// ----------------- lexer -----------------
export const math_lang_tokens:any[] = [];

export const ID = chevrotain_createToken({ name: "ID", pattern: /[a-zA-Z][a-zA-Z0-9_]*/ } );

// Utility to avoid manually building the math_lang_tokens array
function createToken(options?:ITokenConfig, alt_id?:boolean) {
    if (alt_id) {
        options.longer_alt = ID;
    }
    const newToken = chevrotain_createToken(options);
    math_lang_tokens.push(newToken);
    return newToken;
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
export const At                = createToken({ name: "At",                 pattern: /@/ });

// OPERATORS
export const Incr              = createToken({ name: "Incr",               pattern: /\+\+/ });
export const Decr              = createToken({ name: "Decr",               pattern: /--/ });

export const Percentage        = createToken({ name: "Percentage",         pattern: /%/ });
export const Equality          = createToken({ name: "Equality",           pattern: /==/ });
export const Difference        = createToken({ name: "Difference",         pattern: /!=/ });
export const Exclam            = createToken({ name: "Exclam",             pattern: /!/ });

export const DoubleArrow       = createToken({ name: "DoubleArrow",        pattern: /<->/ });
export const Arrow             = createToken({ name: "Arrow",              pattern: /->/ });

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
    pattern: /([0-9]\d{10,})\.\d+([eE][+-]?\d+)?/
});
export const BigFloat2Literal = createToken({
    name: "BigFloat2Literal",
    pattern: /([0-9]\d*)\.\d{10,}([eE][+-]?\d+)?/
});
export const BigFloat3Literal = createToken({
    name: "BigFloat3Literal",
    pattern: /([0-9]\d*)\.\d+[eE][+-]?\d{3,}/
});


export const FloatLiteral = createToken({
    name: "FloatLiteral",
    pattern: /([0-9]\d{0,9})\.\d{1,10}([eE][+-]?\d{1,2})?/
});


export const BigInteger1Literal = createToken({
    name: "BigInteger1Literal",
    pattern: /([0-9]\d{10,})/
});

export const Integer2Literal = createToken({
    name: "Integer2Literal",
    pattern: /([0-9]\d{0,9})([eE][+-]?\d{1,2})?/
});

export const Integer1Literal = createToken({
    name: "Integer1Literal",
    pattern: /([0-9]\d{0,9})/
});

export const BigInteger2Literal = createToken({
    name: "BigInteger2Literal",
    pattern: /([0-9]\d*)[eE][+-]?\d{3,}/
});


export const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /[ \t\n\r]+/,
    group: Lexer.SKIPPED
});


// KEYWORDS
export const Null      = createToken({ name: "Null",       pattern: /null/ }, true);
export const True      = createToken({ name: "True",       pattern: /true/ }, true);
export const False     = createToken({ name: "False",      pattern: /false/ }, true);

export const Module    = createToken({ name: "Module",     pattern: /module/ }, true);
export const Use       = createToken({ name: "Use",        pattern: /use/ }, true);
export const All       = createToken({ name: "All",        pattern: /all/ }, true);
export const Is        = createToken({ name: "Is",         pattern: /is/ }, true);
export const Export    = createToken({ name: "Export",     pattern: /export/ }, true);

export const Async     = createToken({ name: "Async",      pattern: /async/ }, true);
export const As        = createToken({ name: "As",         pattern: /as/ }, true);
export const Wait      = createToken({ name: "Wait",       pattern: /wait/ }, true);
export const EndWait   = createToken({ name: "EndWait",    pattern: /end wait/ }, true);
export const Dispose   = createToken({ name: "Dispose",    pattern: /dispose/ }, true);

export const Emit      = createToken({ name: "Emit",       pattern: /emit/ }, true);
export const On        = createToken({ name: "On",         pattern: /on/ }, true);
export const EndOn     = createToken({ name: "EndOn",      pattern: /end on/ }, true);

export const If        = createToken({ name: "If",         pattern: /if/ }, true);
export const Else      = createToken({ name: "Else",       pattern: /else/ }, true);
export const Then      = createToken({ name: "Then",       pattern: /then/ }, true);
export const EndIf     = createToken({ name: "EndIf",      pattern: /end if/ }, true);

export const Do        = createToken({ name: "Do",         pattern: /do/ }, true);
export const In        = createToken({ name: "In",         pattern: /in/ }, true);
export const From      = createToken({ name: "From",       pattern: /from/ }, true);
export const To        = createToken({ name: "To",         pattern: /to/ }, true);
export const Step      = createToken({ name: "Step",       pattern: /step/ }, true);

export const While     = createToken({ name: "While",      pattern: /while/ }, true);
export const EndWhile  = createToken({ name: "EndWhile",   pattern: /end while/ }, true);

export const Loop      = createToken({ name: "Loop",       pattern: /loop/ }, true);
export const EndLoop   = createToken({ name: "EndLoop",    pattern: /end loop/ }, true);

export const For       = createToken({ name: "For",        pattern: /for/ }, true);
export const EndFor    = createToken({ name: "EndFor",     pattern: /end for/ }, true);

export const Switch    = createToken({ name: "Switch",     pattern: /switch/ }, true);
export const EndSwitch = createToken({ name: "EndSwitch",  pattern: /end switch/ }, true);


export const Function  = createToken({ name: "Function",   pattern: /function/ }, true);
export const EndFunct  = createToken({ name: "EndFunct",   pattern: /end function/ }, true);
export const Return    = createToken({ name: "Return",     pattern: /return/ }, true);

export const Begin     = createToken({ name: "Begin",      pattern: /begin/ }, true);
export const End       = createToken({ name: "End",        pattern: /end/ }, true);

// TODO: resolve ambiguity keywords vs identifiers
// export const ID        = createToken({ name: "ID", pattern: /[a-zA-Z][a-zA-Z0-9_]*/ });
math_lang_tokens.push(ID);