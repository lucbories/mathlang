import { math_lang_parser } from '../1-cst_builder/math_lang_parser';
import MathLangCstToAstVisitorBase from './math_lang_cst_to_ast_visitor_base'




export default class MathLangCstToAstVisitorStatement extends MathLangCstToAstVisitorBase {
    constructor() {
        super();
    }



    /* Visit methods go here */
    program(ctx:any) {
        // console.log('program', ctx)

        const statement = this.visit(ctx.statement)
        const statements = statement ? [statement] : [];

        return {
            type: "PROGRAM",
            statements: statements
        }
    }
    
    blockStatement(ctx:any) {
        // console.log('blockStatement', ctx)

        return this.visit(ctx.statement);
    }
    
    statement(ctx:any) {
        // console.log('statement', ctx)

        if (ctx.assignStatement) {
            return this.visit(ctx.assignStatement);
        }

        if (ctx.ifStatement) {
            return this.visit(ctx.ifStatement);
        }

        if (ctx.whileStatement) {
            return this.visit(ctx.whileStatement);
        }

        if (ctx.forStatement) {
            return this.visit(ctx.forStatement);
        }

        if (ctx.loopStatement) {
            return this.visit(ctx.loopStatement);
        }

        if (ctx.expressionStatement) {
            return this.visit(ctx.expressionStatement);
        }

        // if (ctx.switchStatement) {
        //     return this.visit(ctx.switchStatement);
        // }

        return {
            type: "UNKNOW_STATEMENT",
            ctx:ctx
        }
    }
    
    ifStatement(ctx:any) {
        // console.log('ifStatement', ctx)

        const node_1 = this.visit(ctx.Condition);
        const node_2 = this.visit(ctx.Then[1]);
        const node_3 = ctx.Else ? this.visit(ctx.Else[1]) : undefined;

        return {
            type: "IF_STATEMENT",
            condition:node_1,
            then:node_2,
            else:node_3
        }
    }
    
    whileStatement(ctx:any) {
        // console.log('whileStatement', ctx)

        const node_1 = this.visit(ctx.expression);
        const node_2 = this.visit(ctx.blockStatement);

        return {
            type: "WHILE_STATEMENT",
            condition:node_1,
            block:node_2
        }
    }
    
    forStatement(ctx:any) {
        // console.log('forStatement', ctx)

        const node_var = ctx.ForVar[0].image;
        const node_in = this.visit(ctx.ForIn);
        const node_block = this.visit(ctx.blockStatement);

        return {
            type: "FOR_STATEMENT",
            var:node_var,
            in:node_in,
            block:node_block
        }
    }
    
    loopStatement(ctx:any) {
        // console.log('loopStatement', ctx)

        const node_var = ctx.LoopVar[0].image;
        const node_from = this.visit(ctx.LoopFrom);
        const node_to = this.visit(ctx.LoopTo);
        const node_step = this.visit(ctx.LoopStep);
        const node_block = this.visit(ctx.blockStatement);

        return {
            type: "LOOP_STATEMENT",
            var:node_var,
            from:node_from,
            to:node_to,
            step:node_step,
            block:node_block
        }
    }
    
    assignStatement(ctx:any) {
        // console.log('assignStatement', ctx)

        const node = this.visit(ctx.AssignExpr);
        const members = this.visit(ctx.AssignMemberOptionExpression);

        return {
            type: "ASSIGN_STATEMENT",
            name:ctx.AssignName[0].image,
            members: Array.isArray(members) ? members : (members ? [members] : undefined),
            expression: node
        }
    }
}

