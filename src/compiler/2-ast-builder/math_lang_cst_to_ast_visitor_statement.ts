import { math_lang_parser } from '../1-cst_builder/math_lang_parser';
import MathLangCstToAstVisitorBase from './math_lang_cst_to_ast_visitor_base'
import TYPES from '../3-program_builder/program_types';
import { stat } from 'fs';
import { MathLangParserStatements } from '../1-cst_builder/math_lang_parser_statements';




export default class MathLangCstToAstVisitorStatement extends MathLangCstToAstVisitorBase {
    constructor() {
        super();
    }



    /* Visit methods go here */
    program(ctx:any) {
        // console.log('program', ctx)

        const statements = this.visit(ctx.blockStatement)
        // const statements = statement ? [statement] : [];

        return {
            type: "PROGRAM",
            block: statements
        }
    }
    
    blockStatement(ctx:any) {
        // console.log('blockStatement', ctx)

        let statements:any[] = [];
        let statement;
        for(statement of ctx.statement){
            statements.push( this.visit(statement) );
        }

        return {
            type: "BLOCK",
            statements: statements
        }
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

        const expr_node = this.visit(ctx.AssignExpr);
        const assign_name = ctx.AssignName[0].image;
        const assign_ast ={
            type: "ASSIGN_STATEMENT",
            ic_type: expr_node.ic_type,
            name:assign_name,
            members: <any>[],
            expression: expr_node
        }
        let loop_ctx_member;
        let loop_ast_member = assign_ast;

        if (ctx.AssignMemberOptionExpression) {
            if ( Array.isArray(ctx.AssignMemberOptionExpression) ) {
                for(loop_ctx_member of ctx.AssignMemberOptionExpression) {
                    loop_ast_member.members = this.visit(loop_ctx_member);
                    loop_ast_member = loop_ast_member.members;
                }
            } else {
                loop_ctx_member = ctx.AssignMemberOptionExpression;
                loop_ast_member.members = this.visit(loop_ctx_member);
            }
        }

        // REGISTER ASSIGNED SYMBOL
        if (! this.has_declared_vars_symbol(assign_name)) {
            let is_constant = false;

            if (assign_ast.members.length > 0) {
                // FUNCTION DECLARATION
                if (assign_ast.members.type == "ARGIDS_EXPRESSION" && assign_ast.members.ic_type == TYPES.ARRAY) {
                    const operands:any[] = [];
                    let loop_name:string;
                    let loop_type:string;
                    let opd_index:number;
                    const default_type = assign_ast.members.ic_subtypes.length > 0 ? assign_ast.members.ic_subtypes[0]:'INTEGER';
                    for(opd_index=0; opd_index < assign_ast.members.items; opd_index++){
                        loop_name = assign_ast.members.items[opd_index];
                        loop_type = opd_index < assign_ast.members.ic_subtypes.length ? assign_ast.members.ic_subtypes[opd_index] : default_type;
                        operands.push( { opd_name:loop_name, opd_type:loop_type } )
                    }
                    this.register_function_declaration(assign_name, expr_node.ic_type, operands, expr_node);
                }

                // ERROR : AN UNDECLARED SYMBOL CANNOT HAVE MEMBERS EXPRESSION (Get method, get attribute, get index, call)
                return {
                    type: "UNDECLARED IDENTIFIER WITH MEMBERS",
                    ic_type: TYPES.ERROR,
                    context:ctx,
                    identifier:assign_name
                }
            }

            this.register_symbol_declaration(assign_name, expr_node.ic_type, is_constant, undefined);
            return assign_ast;
        }

        // TODO
        // if (assign_ast.members.ic_type == TYPES.METHOD_ID || assign_ast.members.ic_type == TYPES.ATTRIBUTE_ID || assign_ast.members.type == "BOX_EXPRESSION")
        

        return assign_ast;
    }
}

