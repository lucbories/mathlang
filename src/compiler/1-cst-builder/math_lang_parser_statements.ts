import {
    Parser
} from 'chevrotain';
import * as t from './math_lang_parser_tokens';



// ----------------- parser -----------------

export class MathLangParserStatements extends Parser {
    constructor() {
        super(t.math_lang_tokens);
    }

    // PROGRAM
    private program = this.RULE("program", () => {
        this.AT_LEAST_ONE( () => {
            this.OR( [
                { ALT: () => this.SUBRULE(this.moduleStatement, { LABEL:"moduleStatement" }) },
                { ALT: () => this.SUBRULE(this.constantStatement, { LABEL:"constantStatement" }) },
                { ALT: () => this.SUBRULE(this.exportedConstantStatement, { LABEL:"exportedConstantStatement" }) },
                { ALT: () => this.SUBRULE(this.functionStatement) }
            ] );
        });
    });


    // MODULE
    private moduleStatement = this.RULE("moduleStatement", () => {
        this.CONSUME(t.Module);
        this.CONSUME(t.ID);

        this.MANY(() => {
            this.SUBRULE(this.useStatement, { LABEL:"useStatement" })
        });

        this.MANY2(() => {
            this.SUBRULE(this.typeStatement, { LABEL:"typeStatement" })
        });

        this.MANY3(() => {
            this.OR( [
                { ALT: () => this.SUBRULE(this.functionStatement, { LABEL:'functionStatement' } ) },
                { ALT: () => this.SUBRULE(this.exportedConstantStatement, { LABEL:'exportedConstantStatement' } ) },
                { ALT: () => this.SUBRULE(this.constantStatement, { LABEL:'constantStatement' } ) }
            ]);
        });
    });


    // USE MODULE
    private useStatement = this.RULE("useStatement", () => {
        this.CONSUME(t.Use);
        this.CONSUME(t.ID);
        this.OPTION(() => {
            this.CONSUME(t.LParen);
            this.CONSUME2(t.ID, { LABEL:'importedModuleItem' } )
            this.MANY(() => {
                this.CONSUME(t.Comma);
                this.CONSUME3(t.ID, { LABEL:'importedModuleItem' } )
            } )
            this.CONSUME(t.RParen);
        });
        this.OPTION2(() => {
            this.CONSUME(t.As);
            this.CONSUME4(t.ID, { LABEL:'alias' } );
        });
    });


    // TYPE DECLARATION
    private typeStatement = this.RULE("typeStatement", () => {
        this.CONSUME(t.Type);
        this.CONSUME(t.ID, { LABEL:'typeName' } );
        this.CONSUME(t.Extends);
        this.CONSUME2(t.ID, { LABEL:'baseType' } );

        this.MANY(
            ()=>{
                this.OR( [
                    { ALT: () => this.SUBRULE(this.typeAttributeStatement, { LABEL:'typeAttributeStatement' } ) },
                    { ALT: () => this.SUBRULE(this.typePropertyStatement, { LABEL:'typePropertyStatement' } ) },
                    { ALT: () => this.SUBRULE(this.typeMethodStatement, { LABEL:'typeMethodStatement' } ) }
                ] );
            }
        );

        this.CONSUME(t.EndType);
    });

    private typeAttributeStatement = this.RULE("typeAttributeStatement", () => {
        this.CONSUME(t.ID, { LABEL:"attributeName" });
        this.CONSUME(t.Is);
        this.SUBRULE(this.idType, { LABEL:"attributeType" });
    } );

    private typePropertyStatement = this.RULE("typePropertyStatement", () => {
        this.CONSUME(t.ID, { LABEL:"propertyName" });
        this.CONSUME(t.Assign);
        this.SUBRULE(this.PrimaryExpression, { LABEL:"propertyValue" });
    } );

    private typeMethodStatement = this.RULE("typeMethodStatement", () => {
        this.CONSUME2(t.ID, { LABEL:"methodName" } );
        this.SUBRULE(this.ArgumentsWithIds);
        this.CONSUME3(t.As);
        this.SUBRULE2(this.idType, { LABEL:"methodType" });
        this.CONSUME(t.Assign);
        this.SUBRULE(this.expression, { LABEL:"methodExpr" });
    } );


    // BLOCK
    private blockStatement = this.RULE("blockStatement", () => {
        this.CONSUME(t.Begin);
        this.AT_LEAST_ONE(() => {
            this.SUBRULE(this.statement, { LABEL:'blockStatement' } )
        });
        this.CONSUME(t.End);
    });

    // STATEMENT
    private statement = this.RULE("statement", () => {
        this.OR( [
            { ALT: () => this.SUBRULE(this.blockStatement) },
            { ALT: () => this.SUBRULE(this.ifStatement) },
            { ALT: () => this.SUBRULE(this.whileStatement) },
            { ALT: () => this.SUBRULE(this.forStatement) },
            { ALT: () => this.SUBRULE(this.loopStatement) },
            { ALT: () => this.SUBRULE(this.switchStatement) },
            { ALT: () => this.SUBRULE(this.assignStatement) },
            { ALT: () => this.SUBRULE(this.returnStatement) },
            { ALT: () => this.SUBRULE(this.disposeStatement) },
            { ALT: () => this.SUBRULE(this.emitStatement) },
            { ALT: () => this.SUBRULE(this.onStatement) },
            { ALT: () => this.SUBRULE(this.waitStatement) }
        ] );
    });


    // IF
    private ifStatement = this.RULE("ifStatement", () => {
        this.CONSUME(t.If);
        this.SUBRULE(this.expression, { LABEL:"Condition" });
        this.CONSUME(t.Then);
        this.AT_LEAST_ONE(() => {
            this.SUBRULE(this.statement, { LABEL:"Then" });
        });
        this.OPTION(() => {
            this.CONSUME(t.Else);
            this.AT_LEAST_ONE2(() => {
                this.SUBRULE2(this.statement, { LABEL:"Else" });
            });
        });
        this.CONSUME(t.EndIf);
    });


    // LOOPS
    private whileStatement = this.RULE("whileStatement", () => {
        this.CONSUME(t.While);
        this.SUBRULE(this.expression);
        this.CONSUME(t.Do);
        this.AT_LEAST_ONE(() => {
            this.SUBRULE(this.statement, { LABEL:"blockStatement" });
        });
        this.CONSUME(t.EndWhile);
    });

    private forStatement = this.RULE("forStatement", () => {
        this.CONSUME(t.For);
        this.CONSUME(t.ID, { LABEL:"ForVar" } );
        this.OPTION( () => {
            this.CONSUME(t.Is);
            this.CONSUME2(t.ID, { LABEL:"ForType" } );
        });
        this.CONSUME(t.In);
        this.SUBRULE(this.expression, { LABEL:"ForIn" });
        this.CONSUME(t.Do);
        this.AT_LEAST_ONE(() => {
            this.SUBRULE(this.statement, { LABEL:"blockStatement" });
        });
        this.CONSUME(t.EndFor);
    });

    private loopStatement = this.RULE("loopStatement", () => {
        this.CONSUME(t.Loop);
        this.CONSUME(t.ID, { LABEL:"LoopVar" } );
        this.CONSUME(t.From);
        this.SUBRULE(this.expression, { LABEL:"LoopFrom" });
        this.CONSUME(t.To);
        this.SUBRULE2(this.expression, { LABEL:"LoopTo" });
        this.CONSUME(t.Step);
        this.SUBRULE3(this.expression, { LABEL:"LoopStep" });
        this.CONSUME(t.Do);
        this.AT_LEAST_ONE(() => {
            this.SUBRULE(this.statement, { LABEL:"blockStatement" });
        });
        this.CONSUME(t.EndLoop);
    });

    // SWITCH
    private switchStatement = this.RULE("switchStatement", () => {
        this.CONSUME(t.Switch);
        this.CONSUME2(t.ID, { LABEL:"switchVariable" } );
        this.AT_LEAST_ONE( () => {
            this.SUBRULE(this.switchStatementItem);
        });
        this.CONSUME3(t.EndSwitch);
    });

    private switchStatementItem = this.RULE("switchStatementItem", () => {
        this.SUBRULE(this.expression, { LABEL:"caseExpression" });
        this.MANY( () => this.SUBRULE(this.statement, { LABEL:"blockStatement" }) );
    });


    // EXPORTED CONSTANT
    private exportedConstantStatement = this.RULE("exportedConstantStatement", () => {
        this.CONSUME(t.Export);
        this.SUBRULE(this.constantStatement);
    });


    // CONSTANT
    private constantStatement = this.RULE("constantStatement", () => {
        this.CONSUME(t.ID);
        this.CONSUME(t.Assign);
        this.SUBRULE(this.PrimaryExpression, { LABEL:"PrimaryExpression" });
    });

   // VARIABLE ASSIGN
    private assignStatement = this.RULE("assignStatement", () => {
        this.SUBRULE(this.idLeft);
        this.CONSUME(t.Assign);
        this.OPTION(
            ()=>{ this.CONSUME(t.Async); }
        );
        this.SUBRULE(this.expression, { LABEL:"AssignExpr" });
    });

    // FUNCTION DECLARATION
    private functionStatement = this.RULE("functionStatement", () => {
        this.OPTION(
            ()=>{ this.CONSUME(t.Export); }
        );
        this.CONSUME(t.Function);
        this.CONSUME2(t.ID, { LABEL:"functionName" } );
        this.SUBRULE(this.ArgumentsWithIds);
        this.CONSUME3(t.As);
        this.SUBRULE2(this.idType, { LABEL:"returnedType" });
        this.AT_LEAST_ONE( () => {
            this.SUBRULE(this.statement, { LABEL:"blockStatement" });
        });
        this.CONSUME5(t.EndFunct);
    });

    private returnStatement = this.RULE("returnStatement", () => {
        this.CONSUME(t.Return);
        this.SUBRULE(this.expression);
    });

    // DISPOSE
    private disposeStatement = this.RULE("disposeStatement", () => {
        this.CONSUME(t.Dispose);
        this.SUBRULE(this.idLeft);
    });

    // EMIT
    private emitStatement = this.RULE("emitStatement", () => {
        this.CONSUME(t.Emit);
        this.CONSUME(t.ID);
        this.SUBRULE(this.Record);
    });

    // ON .. END ON
    private onStatement = this.RULE("onStatement", () => {
        this.CONSUME(t.On);
        this.CONSUME2(t.ID, { LABEL:"eventName" } );
        this.CONSUME3(t.LCurly);
        this.CONSUME4(t.ID, { LABEL:'recordName' });
        this.CONSUME5(t.RCurly);
        this.CONSUME6(t.Do);
        this.MANY( () => this.SUBRULE(this.statement, { LABEL:"blockStatement" }) );
        this.CONSUME7(t.EndOn);
    });

    // WAIT
    private waitStatement = this.RULE("waitStatement", () => {
        this.CONSUME(t.Wait);
        this.AT_LEAST_ONE_SEP( {
            SEP: t.Comma,
            DEF: () => {
                this.SUBRULE(this.idLeft, { LABEL:"asyncVariable" } );
            }
        } );
        this.CONSUME4(t.Do);
        this.MANY( () => this.SUBRULE(this.statement, { LABEL:"blockStatement" }) );
        this.CONSUME5(t.EndWait);
    });

    protected idLeft:any = undefined;
    protected idRight:any = undefined;
    protected idType:any = undefined;
    protected expression:any = undefined;
    protected ArgumentsWithIds:any = undefined;
    protected AssignMemberOptionExpression:any = undefined;
    protected Record:any = undefined;
    protected PrimaryExpression:any = undefined;
}