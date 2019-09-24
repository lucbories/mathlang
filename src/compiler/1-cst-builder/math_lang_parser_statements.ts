import {
    Parser
} from 'chevrotain';
import * as t from './math_lang_parser_tokens';



// ----------------- parser -----------------

export class MathLangParserStatements extends Parser {
    constructor() {
        super(t.math_lang_tokens);
    }

    // PROGRAN
    private program = this.RULE("program", () => {
        this.AT_LEAST_ONE( () => {
            this.OR( [
                { ALT: () => this.SUBRULE(this.useStatement, { LABEL:"useStatement" }) },
                { ALT: () => this.SUBRULE(this.moduleStatement, { LABEL:"moduleStatement" }) },
                { ALT: () => this.SUBRULE(this.statement, { LABEL:"blockStatement" }) },
                { ALT: () => this.SUBRULE(this.functionStatement) }
            ] );
        });
    });


    // USE
    private useStatement = this.RULE("useStatement", () => {
        this.CONSUME(t.Use);
        this.CONSUME(t.ID);
    });


    // MODULE
    private moduleStatement = this.RULE("moduleStatement", () => {
        this.CONSUME(t.Module);
        this.CONSUME(t.ID);
    });


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


    // ASSIGN
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
        this.CONSUME(t.Function);
        this.CONSUME2(t.ID, { LABEL:"functionName" } );
        this.SUBRULE(this.ArgumentsWithIds);
        this.CONSUME3(t.Return);
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
}