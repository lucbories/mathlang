
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
            }
        ]);
    });

    private PostfixExpression = this.RULE("PostfixExpression", () => {
        this.OR( [
            { ALT: () => this.SUBRULE(this.idRight, { LABEL:"lhs" } ) },
            { ALT: () => this.SUBRULE(this.ParenthesisExpression, { LABEL:"lhs" } ) },
            { ALT: () => this.SUBRULE(this.PrimaryExpression, { LABEL:"lhs" } ) }
        ]);

        this.OPTION( () => {
            this.OR2( [ 
                { ALT: () => this.CONSUME(t.Incr,  { LABEL:"operator" } ) },
                { ALT: () => this.CONSUME(t.Decr, { LABEL:"operator" } ) }
            ]);
        });
    });


    private ParenthesisExpression = this.RULE("ParenthesisExpression", () => {
        this.CONSUME(t.LParen);
        this.SUBRULE(this.BinaryExpression);
        this.CONSUME(t.RParen);
    });


    /**
     * Rule for an id expression of a left part expression.
     *  id
     *      #id
     *      #id#id...
     *      #id[expr list]
     *      [expr list]
     *      [expr list]#id...
     *      [expr list] [expr list]#id...
     *          .id(id:id list)
     */
    idLeft = this.RULE("idLeft", () => {
        // MAIN ID:VAR
        this.CONSUME(t.ID);

        // OPTION 1
        this.MANY( () => 
            this.OR( [
				// VAR ATTRIBUTE
                { ALT: () => this.SUBRULE(this.dashIdExpression, { LABEL:'attributeOrIndexed' } ) },
				
				// VAR INDEXED ACCESS
                { ALT: () => this.SUBRULE1(this.indexedBracketsExpression, { LABEL:'attributeOrIndexed' } ) }
            ])
        );

        // OPTION 2
        this.OPTION( ()=>{
            this.OR2( [
				// FUNCTION DECLARATION
                { ALT: () => this.SUBRULE(this.ArgumentsWithIds) },
				
				// VAR METHOD DECLARATION
                { ALT: () => this.SUBRULE(this.dotIdArgsDeclarationExpression) }
            ])
        });
    });


    /**
     * Rule for an id expression of a right part expression.
     *  id
     *      #id
     *      #id#id...
     *      #id[expr list]
     *      [expr list]
     *      [expr list]#id...
     *      [expr list] [expr list]#id...
     *          .id(expr list)
     */
    idRight = this.RULE("idRight", () => {
        // MAIN ID:VAR OR MODULE
        this.CONSUME(t.ID);

        // OPTION 1
        this.MANY( () => 
            this.OR( [
				// VAR#ATTRIBUTE
                { ALT: () => this.SUBRULE(this.dashIdExpression, { LABEL:'attributeOrIndexed' } ) },
				
				// VAR INDEXED ACCESS
                { ALT: () => this.SUBRULE(this.indexedBracketsExpression, { LABEL:'attributeOrIndexed' } ) },
				
				// MODULE.VAR#ATTRIBUTE
                { ALT: () => {
					this.CONSUME2(t.Dot);
					this.CONSUME2(t.ID);
					this.SUBRULE2(this.dashIdExpression);
					}
				}
            ])
        );

        // OPTION 2
        this.OPTION( ()=>{
            this.OR2( [
				// FUNCTION CALL
                { ALT: () => this.SUBRULE(this.Arguments) },
				
				// MODULE.FUNCTION CALL OR VAR.METHOD CALL
                { ALT: () => this.SUBRULE(this.dotIdArgsCallExpression) },
				
				// MODULE.VAR.METHOD CALL
                { ALT: () => {
					this.CONSUME3(t.Dot);
					this.CONSUME3(t.ID);
					this.SUBRULE3(this.dotIdArgsCallExpression);
					}
				}
            ])
        });
    });


    /**
     * Rule for an id expression of a type expression.
     */
    idType = this.RULE("idType", () => {
        this.CONSUME(t.ID);
    });


    /**
     * Rule for an id expression of a type expression.
     */
    private indexedBracketsExpression = this.RULE("indexedBracketsExpression", () => {
        this.CONSUME(t.LSquare);
        this.AT_LEAST_ONE_SEP( {
            SEP: t.Comma,
            DEF: () => {
                this.SUBRULE(this.BinaryExpression);
            }
        });
        this.CONSUME(t.RSquare);
    });


    private dotIdArgsDeclarationExpression = this.RULE("dotIdArgsDeclarationExpression", () => {
        this.CONSUME(t.Dot);
        this.CONSUME(t.ID);
        this.SUBRULE(this.ArgumentsWithIds);
    });


    private dotIdArgsCallExpression = this.RULE("dotIdArgsCallExpression", () => {
        this.CONSUME(t.Dot);
        this.CONSUME(t.ID);
        this.SUBRULE(this.Arguments);
    });


    private dashIdExpression = this.RULE("dashIdExpression", () => {
        this.CONSUME(t.Dash);
        this.CONSUME(t.ID);
    });


    PrimaryExpression = this.RULE("PrimaryExpression", () => {
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
                    
                    { ALT: () => this.CONSUME(t.True) },
                    { ALT: () => this.CONSUME(t.False) },
                    { ALT: () => this.CONSUME(t.Null) }
                ])
        )
    });

    Record = this.RULE("Record", () => {
        this.CONSUME(t.LCurly);

        this.CONSUME2(t.ID, { LABEL:'key' });
        this.CONSUME3(t.Colon);
        this.SUBRULE(this.BinaryExpression, { LABEL:'value' });

        this.MANY(() => {
            this.CONSUME4(t.ID, { LABEL:'key' });
            this.CONSUME5(t.Colon);
            this.SUBRULE2(this.BinaryExpression, { LABEL:'value' });
        });

        this.CONSUME(t.RCurly);
    });

    private Arguments = this.RULE("Arguments", () => {
        this.CONSUME(t.LParen);
        this.OPTION( () => {
            this.MANY_SEP( {
                SEP: t.Comma,
                DEF: () => {
                    this.SUBRULE(this.BinaryExpression);
                }
            });
        });
        this.CONSUME(t.RParen);
    });

    ArgumentWithIds = this.RULE("ArgumentWithIds", () => {
        this.CONSUME(t.ID, { LABEL:'arg_id' });
        this.OPTION( () => {
            this.CONSUME(t.Is);
            this.SUBRULE(this.idType, { LABEL:'arg_type' });
        });
    });

    ArgumentsWithIds = this.RULE("ArgumentsWithIds", () => {
        this.CONSUME(t.LParen);

        this.MANY_SEP( {
            SEP: t.Comma,
            DEF: () => {
                this.SUBRULE(this.ArgumentWithIds);
            }
        });

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


    private BinaryCompareOps = this.RULE("BinaryCompareOps", () => {
        this.OR([
            { ALT: () => this.CONSUME(t.Equality,         { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.Difference,       { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.LessThan,         { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.LessEqualThan,    { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.GreaterThan,      { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.GreaterEqualThan, { LABEL:"binop" }) }
        ]);
    });

    private BinaryMultDivOps = this.RULE("BinaryMultDivOps", () => {
        this.OR([
            { ALT: () => this.CONSUME(t.Mult,  { LABEL:"binop" }) },
            { ALT: () => this.CONSUME(t.Div,   { LABEL:"binop" }) }
        ]);
    });

    private BinaryAddSubOps = this.RULE("BinaryAddSubOps", () => {
        this.OR([
            { ALT: () => this.CONSUME(t.Plus,   { LABEL:"binop" } ) },
            { ALT: () => this.CONSUME(t.Minus,  { LABEL:"binop" } ) }
        ]);
    });
}

