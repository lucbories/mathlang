
import MathLangCstToAstVisitorBase from './math_lang_cst_to_ast_visitor_base'
import TYPES from '../3-program_builder/math_lang_types';
import AST from '../2-ast-builder/math_lang_ast';



export default class MathLangCstToAstVisitorStatement extends MathLangCstToAstVisitorBase {
    constructor() {
        super();
    }



    /**
     * Visit CST Program node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    program(ctx:any) {
        // console.log('program', ctx)

        const statements = [];
        let statement;

        // LOOP ON OTHER STATEMENTS
        if (ctx.blockStatement){
            for(statement of ctx.blockStatement){
                statements.push( this.visit(statement) );
            }
        }

        // LOOP ON FUNCTIONS DECLARATIONS STATEMENTS
        if (ctx.functionStatement){
            for(statement of ctx.functionStatement){
                statements.push( this.visit(statement) );
            }
        }

        return {
            type: AST.PROGRAM,
            block: statements
        }
    }

    
    /**
     * Visit CST Block node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    blockStatement(ctx:any) {
        // console.log('blockStatement', ctx)

        let statements:any[] = [];
        let statement;

        // LOOP ON STATEMENTS
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            type: AST.BLOCK,
            statements: statements
        }
    }

    
    /**
     * Visit CST Statement node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    statement(ctx:any) {
        // console.log('statement', ctx)

        if (ctx.blockStatement) {
            return this.visit(ctx.blockStatement);
        }

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

        if (ctx.returnStatement) {
            return this.visit(ctx.returnStatement);
        }
        
        // if (ctx.switchStatement) { // TODO SWITCH STATEMENT
        //     return this.visit(ctx.switchStatement);
        // }

        return {
            type: AST.STAT_UNKNOW,
            ctx:ctx
        }
    }
    
    
    /**
     * Visit CST IfThenElse node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    ifStatement(ctx:any) {
        // console.log('ifStatement', ctx)

        const node_1 = this.visit(ctx.Condition);

        let statement;

        const statements_then=[];
        for(statement of ctx.Then.slice(1)){
            statements_then.push( this.visit(statement) );
        }
        
        const statements_else=[];
        if (ctx.Else) {
            for(statement of ctx.Else.slice(1)){
                statements_else.push( this.visit(statement) );
            }
        }

        return {
            type: AST.STAT_IF,
            condition:node_1,
            then:statements_then,
            else:ctx.Else ? statements_else : undefined
        }
    }
    

    /**
     * Visit CST While node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    whileStatement(ctx:any) {
        // console.log('whileStatement', ctx)

        const node_1 = this.visit(ctx.expression);
        
        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            type: AST.STAT_WHILE,
            condition:node_1,
            block:statements
        }
    }
    

    /**
     * Visit CST For node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    forStatement(ctx:any) {
        // console.log('forStatement', ctx)

        const node_var = ctx.ForVar[0].image;
        const node_in = this.visit(ctx.ForIn);
        
        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            type: AST.STAT_FOR,
            var:node_var,
            in:node_in,
            block:statements
        }
    }
    

    /**
     * Visit CST Loop node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    loopStatement(ctx:any) {
        // console.log('loopStatement', ctx)

        const node_var = ctx.LoopVar[0].image;
        const node_type = ctx.LoopType ? ctx.LoopType[0].image : TYPES.INTEGER;
        const node_from = this.visit(ctx.LoopFrom);
        const node_to = this.visit(ctx.LoopTo);
        const node_step = this.visit(ctx.LoopStep);

        this.register_symbol_declaration(node_var, node_type, false, undefined);
        
        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            type: AST.STAT_LOOP,
            var:node_var,
            from:node_from,
            to:node_to,
            step:node_step,
            block:statements
        }
    }
    

    /**
     * Visit CST Assign node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    assignStatement(ctx:any) {
        // console.log('assignStatement', ctx)

        const assign_name = ctx.AssignName[0].image;
        const assign_ast ={
            type: AST.STAT_ASSIGN,
            ic_type: TYPES.UNKNOW,
            name:assign_name,
            is_async:ctx.Async ? true : false,
            members: <any>undefined,
            expression: <any>[]
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

            if (assign_ast.members) {
                // FUNCTION DECLARATION
                if (assign_ast.members.type == AST.EXPR_ARGS_IDS && assign_ast.members.ic_type == TYPES.ARRAY) {
                    const operands:any[] = [];
                    
                    let loop_name:string;
                    let loop_type:string;
                    let opd_index:number;
                    
                    const default_type = assign_ast.members.ic_subtypes.length > 0 ? assign_ast.members.ic_subtypes[0]:'INTEGER';
                    
                    for(opd_index=0; opd_index < assign_ast.members.items.length; opd_index++){
                        loop_name = assign_ast.members.items[opd_index];
                        loop_type = opd_index < assign_ast.members.ic_subtypes.length ? assign_ast.members.ic_subtypes[opd_index] : default_type;
                        operands.push( { opd_name:loop_name, opd_type:loop_type } )
                    }
                    
                    this.register_function_declaration(assign_name, TYPES.UNKNOW, operands, []);

                    this.enter_function_declaration(assign_name);
                    const expr_node = this.visit(ctx.AssignExpr);
                    this.leave_function_declaration();
                    
                    this.set_function_declaration_statements(assign_name, expr_node);
                    this.set_function_declaration_type(assign_name, expr_node.ic_type);

                    assign_ast.ic_type = expr_node.ic_type;
                    assign_ast.expression = expr_node;

                    return assign_ast;
                }

                // ERROR : AN UNDECLARED SYMBOL CANNOT HAVE MEMBERS EXPRESSION (Get method, get attribute, get index, call)
                return this.add_error(ctx, AST.STAT_UNKNOW_ID, 'Unknow symbol [' + assign_name + '] in assign expression with members');
            }

            const expr_node = this.visit(ctx.AssignExpr);
            this.register_symbol_declaration(assign_name, expr_node.ic_type, is_constant, undefined);

            assign_ast.ic_type = expr_node.ic_type;
            assign_ast.expression = expr_node;

            return assign_ast;
        }

        // TODO
        // if (assign_ast.members.ic_type == TYPES.METHOD_ID || assign_ast.members.ic_type == TYPES.ATTRIBUTE_ID || assign_ast.members.type == "BOX_EXPRESSION")
        

        const expr_node = this.visit(ctx.AssignExpr);

        assign_ast.ic_type = expr_node.ic_type;
        assign_ast.expression = expr_node;

        return assign_ast;
    }
    

    /**
     * Visit CST Function declaration node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    functionStatement(ctx:any) {
        // console.log('functionStatement', ctx)

        const function_name = ctx.functionName[0].image;
        const operands_decl = this.visit(ctx.ArgumentsWithIds);
        const returned_type = ctx.returnedType[0].image;

        const operands = [];
        if (operands_decl.items) {
            let loop_index;
            for(loop_index=0; loop_index < operands_decl.items.length; loop_index++) {
                operands.push( { opd_name:operands_decl.items[loop_index], opd_type:operands_decl.ic_subtypes[loop_index] } );
            }
        }

        this.register_function_declaration(function_name, returned_type, operands, []);

        // CHANGE SCOPE FOR FUNCTION STATEMENTS
        this.enter_function_declaration(function_name);

        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        this.leave_function_declaration();

        this.set_function_declaration_statements(function_name, statements);

        return {
            type: AST.STAT_FUNCTION,
            ic_type:returned_type,
            name:function_name,
            operands:operands_decl,
            block:statements
        }
    }
    

    /**
     * Visit CST Function Return node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    returnStatement(ctx:any) {
        // console.log('returnStatement', ctx)

        const node_expr = this.visit(ctx.expression);

        return {
            type: AST.STAT_RETURN,
            ic_type:node_expr.ic_type,
            expression:node_expr
        }
    }
}

