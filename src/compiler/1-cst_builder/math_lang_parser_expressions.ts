
import { MathLangParserStatements } from './math_lang_parser_statements';
import * as t from './math_lang_parser_tokens';



// ----------------- parser -----------------

export class MathLangParserExpressions extends MathLangParserStatements {
    constructor() {
        super();
    
        this.expression = this.RULE("expression", () => {
            this.OR( [
                { ALT: () => this.SUBRULE(this.BinaryExpression) }
            ])
        });
        // this.IdsList = this.ArgumentsWithIds;

        this.performSelfAnalysis();
    }

    // EXPRESSION
    private c1:any = undefined;
    private c2:any = undefined;
    private c3:any = undefined;
    private c4:any = undefined;
    private c5:any = undefined;

    private BinaryExpression = this.RULE("BinaryExpression", () => {
        this.SUBRULE(this.BinaryAddSubExpression,       { LABEL:"lhs" } );
        this.MANY(() => {
            this.SUBRULE2(this.BinaryCompareOps,        { LABEL:"operator" } )
            this.SUBRULE2(this.BinaryAddSubExpression,  { LABEL:"rhs" })
        });
    });

    private BinaryAddSubExpression = this.RULE("BinaryAddSubExpression", () => {
        this.SUBRULE(this.BinaryMultDivExpression,      { LABEL:"lhs" } )
        this.MANY(() => {
            this.SUBRULE2(this.BinaryAddSubOps,         { LABEL:"operator" } )
            this.SUBRULE3(this.BinaryMultDivExpression, { LABEL:"rhs" } )
        });
    });

    private BinaryMultDivExpression = this.RULE("BinaryMultDivExpression", () => {
        this.SUBRULE(this.UnaryExpression,              { LABEL:"lhs" } )
        this.MANY(() => {
            this.SUBRULE2(this.BinaryMultDivOps,        { LABEL:"operator" } )
            this.SUBRULE3(this.BinaryMultDivExpression,         { LABEL:"rhs" } )
        });
    });

    private UnaryExpression = this.RULE("UnaryExpression", () => {
        this.OR( [
            { ALT: () => this.SUBRULE(this.PostfixExpression,      { LABEL:"lhs" } ) },
            {
                ALT: () => {
                    this.OR2(
                        this.c1 ||
                            (this.c1 = [
                                { ALT: () => this.CONSUME(t.Incr,   { LABEL:"operator" } ) },
                                { ALT: () => this.CONSUME(t.Decr,   { LABEL:"operator" } ) },
                                { ALT: () => this.CONSUME(t.Plus,   { LABEL:"operator" } ) },
                                { ALT: () => this.CONSUME(t.Minus,  { LABEL:"operator" } ) },
                                { ALT: () => this.CONSUME(t.Exclam, { LABEL:"operator" } ) }
                            ])
                    )
                    this.SUBRULE(this.UnaryExpression,              { LABEL:"rhs" } )
                }
            },
            { ALT: () => this.CONSUME(t.True) },
            { ALT: () => this.CONSUME(t.False) },
            { ALT: () => this.CONSUME(t.Null) }
        ]);
    });

    private PostfixExpression = this.RULE("PostfixExpression", () => {
        this.SUBRULE(this.MemberExpression,                         { LABEL:"lhs" } );
        this.OPTION( () => {
            this.OR( [ 
                { ALT: () => this.CONSUME(t.Incr,                   { LABEL:"operator" } ) },
                { ALT: () => this.CONSUME(t.Decr,                   { LABEL:"operator" } ) }
            ]);
        });
    });

    private MemberExpression = this.RULE("MemberExpression", () => {
        this.OR( [
            { ALT: () => this.CONSUME(t.ID) },
            { ALT: () => this.SUBRULE(this.PrimaryExpression) }
        ]);
        this.MANY( () => this.SUBRULE(this.MemberOptionExpression) );
    });
    
    private MemberOptionExpression = this.RULE("MemberOptionExpression", () => {
        this.OR( [
            { ALT: () => this.SUBRULE(this.BoxMemberExpression) },
            { ALT: () => this.SUBRULE(this.DotMemberExpression) },
            { ALT: () => this.SUBRULE(this.DashMemberExpression) },
            { ALT: () => this.SUBRULE(this.Arguments) }
        ] );
    });
    
    AssignMemberOptionExpression = this.RULE("AssignMemberOptionExpression", () => {
        this.OR( [
            { ALT: () => this.SUBRULE(this.BoxMemberExpression) },
            { ALT: () => this.SUBRULE(this.DotMemberExpression) },
            { ALT: () => this.SUBRULE(this.DashMemberExpression) },
            { ALT: () => this.SUBRULE(this.ArgumentsWithIds) }
        ] );
    });

    private PrimaryExpression = this.RULE("PrimaryExpression", () => {
        this.OR(
            this.c5 ||
                (this.c5 = [
                    { ALT: () => this.CONSUME(t.StringLiteral) },
                    
                    { ALT: () => this.CONSUME(t.BigInteger1Literal) },
                    { ALT: () => this.CONSUME(t.BigInteger2Literal) },

                    { ALT: () => this.CONSUME(t.Integer1Literal) },
                    { ALT: () => this.CONSUME(t.Integer2Literal) },
                    { ALT: () => this.CONSUME(t.FloatLiteral) },

                    { ALT: () => this.CONSUME(t.BigFloat1Literal) },
                    { ALT: () => this.CONSUME(t.BigFloat2Literal) },
                    { ALT: () => this.CONSUME(t.BigFloat3Literal) },

                    { ALT: () => this.SUBRULE(this.ArrayLiteral) },
                    { ALT: () => this.SUBRULE(this.ParenthesisExpression) }
                ])
        )
    });

    private ParenthesisExpression = this.RULE("ParenthesisExpression", () => {
        this.CONSUME(t.LParen);
        this.SUBRULE(this.BinaryExpression);
        this.CONSUME(t.RParen);
    });
    
    BoxMemberExpression = this.RULE("BoxMemberExpression", () => {
        this.CONSUME(t.LSquare);
        this.SUBRULE(this.BinaryExpression);
        this.CONSUME(t.RSquare);
    });

    DotMemberExpression = this.RULE("DotMemberExpression", () => {
        this.CONSUME(t.Dot);
        this.CONSUME(t.ID);
    });

    DashMemberExpression = this.RULE("DashMemberExpression", () => {
        this.CONSUME(t.Dash);
        this.CONSUME(t.ID);
    });

    private Arguments = this.RULE("Arguments", () => {
        this.CONSUME(t.LParen);
        this.OPTION( () => {
            this.SUBRULE(this.BinaryExpression);
            this.MANY(() => {
                this.CONSUME(t.Comma);
                this.SUBRULE2(this.BinaryExpression);
            })
        })
        this.CONSUME(t.RParen);
    });

    ArgumentWithIds = this.RULE("ArgumentWithIds", () => {
        this.CONSUME(t.ID, { LABEL:'arg_id' });
        this.OPTION( () => {
            this.CONSUME(t.Is);
            this.CONSUME2(t.ID, { LABEL:'arg_type' });
        } );
    });

    ArgumentsWithIds = this.RULE("ArgumentsWithIds", () => {
        this.CONSUME(t.LParen);this.MANY_SEP

        this.MANY_SEP( {
            SEP: t.Comma,
            DEF: () => {
                this.SUBRULE(this.ArgumentWithIds);
            }
        } );

        // this.OPTION( () => {
        //     this.CONSUME(t.ID);
        //     this.OPTION( () => {
        //         this.CONSUME(t.Is);
        //         this.CONSUME(t.ID, { LABEL:'' });
        //     });
        //     this.MANY(() => {
        //         this.CONSUME(t.Comma);
        //         this.CONSUME2(t.ID);
        //         this.OPTION( () => {
        //             this.CONSUME(t.Is);
        //             this.CONSUME(t.ID);
        //         });
        //     })
        // })

        this.CONSUME(t.RParen);
    });

    private ArrayLiteral = this.RULE("ArrayLiteral", () => {
        this.CONSUME(t.LSquare);
        this.MANY_SEP({
            SEP: t.Comma,
            DEF: () => {
                this.SUBRULE(this.BinaryExpression);
            }
        });
        this.CONSUME(t.RSquare);
    });

    // private ObjectLiteral = this.RULE("ObjectLiteral", () => {
    //     this.CONSUME(t.LCurly);
    //     this.MANY_SEP({
    //         SEP: t.Comma,
    //         DEF: () => {
    //             this.SUBRULE2(this.ObjectItem);
    //         }
    //     });
    //     this.CONSUME(t.RCurly);
    // });

    // private ObjectItem = this.RULE("ObjectItem", () => {
    //     this.CONSUME(t.StringLiteral);
    //     this.CONSUME(t.Colon);
    //     this.SUBRULE(this.BinaryExpression);
    // });



    private BinaryCompareOps = this.RULE("BinaryCompareOps", () => {
        this.OR([
            { ALT: () => this.CONSUME(t.Equality,         { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.Difference,       { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.LessThan,         { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.LessEqualThan,    { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.GreaterThan,      { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.GreaterEqualThan, { LABEL:"binop" }) }
        ])
    });

    private BinaryMultDivOps = this.RULE("BinaryMultDivOps", () => {
        this.OR([
            { ALT: () => this.CONSUME(t.Mult,  { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.Div,   { LABEL:"binop" }) }
        ])
    });

    private BinaryAddSubOps = this.RULE("BinaryAddSubOps", () => {
        this.OR([
            { ALT: () => this.CONSUME(t.Plus,   { LABEL:"binop" } ) },
            { ALT: () => this.CONSUME(t.Minus,  { LABEL:"binop" } ) }
        ])
    });
}

