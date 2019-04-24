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
    public program = this.RULE("program", () => {
        this.AT_LEAST_ONE( () => {
            this.SUBRULE(this.statement, { LABEL:"blockStatement" });
        });
    });


    // BLOCK
    private blockStatement = this.RULE("blockStatement", () => {
        this.CONSUME(t.Begin);
        this.MANY(() => {
            this.SUBRULE(this.statement, { LABEL:'blockStatement' } )
        });
        this.CONSUME(t.End);
    });

    private statement = this.RULE("statement", () => {
        this.OR( [
            { ALT: () => this.SUBRULE(this.ifStatement) },
            { ALT: () => this.SUBRULE(this.whileStatement) },
            { ALT: () => this.SUBRULE(this.forStatement) },
            { ALT: () => this.SUBRULE(this.loopStatement) },
            { ALT: () => this.SUBRULE(this.assignStatement) },
            { ALT: () => this.SUBRULE(this.functionStatement) },// TODO: MOVE TO PROGRAM FOR A FIRST LEVEL DECLARATION
            { ALT: () => this.SUBRULE(this.returnStatement) },
            { ALT: () => this.SUBRULE(this.blockStatement) }
        ]);
    });


    // IF
    private ifStatement = this.RULE("ifStatement", () => {
        this.CONSUME(t.If);
        this.SUBRULE(this.expression, { LABEL:"Condition" });
        this.CONSUME(t.Then);
        this.MANY(() => {
            this.SUBRULE(this.statement, { LABEL:"Then" });
        });
        this.OPTION(() => {
            this.CONSUME(t.Else);
            this.MANY2(() => {
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
        this.AT_LEAST_ONE( () => {
            this.SUBRULE(this.statement, { LABEL:"blockStatement" });
        });
        this.CONSUME(t.EndWhile);
    });

    private forStatement = this.RULE("forStatement", () => {
        this.CONSUME(t.For);
        this.CONSUME(t.ID, { LABEL:"ForVar" } );
        this.CONSUME(t.In);
        this.SUBRULE(this.expression, { LABEL:"ForIn" });
        this.CONSUME(t.Do);
        this.AT_LEAST_ONE( () => {
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
        this.SUBRULE(this.blockStatement);
        this.CONSUME(t.EndLoop);
    });

    // ASSIGN
    private assignStatement = this.RULE("assignStatement", () => {
        this.CONSUME(t.ID, { LABEL:"AssignName" } );
        this.MANY( () => this.SUBRULE(this.AssignMemberOptionExpression) );
        this.CONSUME(t.Assign);
        this.SUBRULE(this.expression, { LABEL:"AssignExpr" });
    });

    // FUNCTION DECLARATION
    private functionStatement = this.RULE("functionStatement", () => {
        this.CONSUME(t.Function);
        this.CONSUME2(t.ID, { LABEL:"functionName" } );
        this.SUBRULE(this.ArgumentsWithIds);
        this.CONSUME3(t.Return);
        this.CONSUME4(t.ID, { LABEL:"returnedType" } );
        this.AT_LEAST_ONE( () => {
            this.SUBRULE(this.statement, { LABEL:"blockStatement" });
        });
        this.CONSUME5(t.EndFunct);
    });

    private returnStatement = this.RULE("returnStatement", () => {
        this.CONSUME(t.Return);
        this.SUBRULE(this.expression);
    });

    protected expression:any = undefined;
    protected ArgumentsWithIds:any = undefined;
    protected BoxMemberExpression:any = undefined;
    protected DotMemberExpression:any = undefined;
    protected DashMemberExpression:any = undefined;
    protected AssignMemberOptionExpression:any = undefined;
}
