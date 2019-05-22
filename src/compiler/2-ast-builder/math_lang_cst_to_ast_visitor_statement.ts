
import IType from '../../core/itype';
import MathLangCstToAstVisitorBase from './math_lang_cst_to_ast_visitor_base'
import AST from '../2-ast-builder/math_lang_ast';
import TYPES from '../3-program-builder/math_lang_types';




export default class MathLangCstToAstVisitorStatement extends MathLangCstToAstVisitorBase {
    constructor(types_map:Map<string,IType>) {
        super(types_map);
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
        let cst_statement;
        let ast_statement;

        // LOOP ON FUNCTIONS DECLARATIONS STATEMENTS HEADERS
        let ast_function_header_nodes:any = {};
        if (ctx.functionStatement){
            for(cst_statement of ctx.functionStatement){
                cst_statement.children.visit_header = true;
                cst_statement.children.visit_body = false;

                ast_statement = this.visit(cst_statement);
                ast_function_header_nodes[ast_statement.name] = ast_statement;
            }
        }

        // LOOP ON OTHER STATEMENTS
        if (ctx.blockStatement){
            for(cst_statement of ctx.blockStatement){
                ast_statement = this.visit(cst_statement);
                statements.push(ast_statement);
                this._main_scope.statements.push(ast_statement);
            }
        }

        // LOOP ON FUNCTIONS DECLARATIONS STATEMENTS BODY
        if (ctx.functionStatement){
            for(cst_statement of ctx.functionStatement){
                cst_statement.children.visit_header = false;
                cst_statement.children.visit_body = true;

                ast_statement = this.visit(cst_statement);
                ast_statement.operands = ast_function_header_nodes[ast_statement.name].operands;
                statements.push(ast_statement);
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

        if (ctx.disposeStatement) {
            return this.visit(ctx.disposeStatement);
        }

        if (ctx.emitStatement) {
            return this.visit(ctx.emitStatement);
        }

        if (ctx.onStatement) {
            return this.visit(ctx.onStatement);
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

        this.register_symbol_declaration(node_var, node_type, false, undefined, ctx, AST.STAT_LOOP);
        
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
     * Visit CST Switch node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    switchStatement(ctx:any) {
        // console.log('switchStatement', ctx)

        const ast_var = ctx.switchVariable[0].image;

        const ast_items=[];
        let cst_item;
        let ast_item;
        for(cst_item of ctx.switchStatementItem){
            ast_item = this.visit(cst_item);
            ast_items.push(ast_item);
        }

        return {
            type: AST.STAT_SWITCH,
            var:ast_var,
            items:ast_items
        }
    }
    

    /**
     * Visit CST Switch Item node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    switchStatementItem(ctx:any) {
        // console.log('switchStatementItem', ctx)
        
        const node_expr = this.visit(ctx.caseExpression);

        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            item_expression:node_expr,
            item_block:statements
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

        const cst_id_left_node = ctx.idLeft[0];
        const ast_id_left_node = this.visit(cst_id_left_node);
        const assign_name = ast_id_left_node.name;

        
        // *** NOT A FUNCTION DECLARATION ***
        if (ast_id_left_node.type != AST.EXPR_MEMBER_FUNC_DECL){
            // EVALUATE RIGHT EXPRESSION
            const cst_expr_node = ctx.AssignExpr;
            const ast_expr_node = this.visit(cst_expr_node);
            const assign_ast = {
                type: AST.STAT_ASSIGN,
                ic_type: ast_expr_node.ic_type,
                name:assign_name,
                is_async:ctx.Async ? true : false,
                members:ast_id_left_node.members,
                expression:ast_expr_node
            };
            return assign_ast;
        }


        // *** FUNCTION DECLARATION ***
        let assign_ast = {
            type: AST.STAT_ASSIGN,
            ic_type: TYPES.UNKNOW,
            name:assign_name,
            is_async:ctx.Async ? true : false,
            members:ast_id_left_node.members,
            expression:<any>undefined,
            operands_types:ast_id_left_node.operands_types,
            operands_names:ast_id_left_node.operands_names
        };

        // DECLARE FUNCTION
        const operands_types = ast_id_left_node.operands_types;
        const operands_names = ast_id_left_node.operands_names;
        const default_type = operands_types.length > 0 ? operands_types[0]:'INTEGER';
        const operands = [];

        let opd_index;
        let loop_name;
        let loop_type;
        for(opd_index=0; opd_index < operands_names.length; opd_index++){
            loop_name = operands_names[opd_index];
            loop_type = opd_index < operands_types.length ?operands_types[opd_index] : default_type;
            operands.push( { opd_name:loop_name, opd_type:loop_type } )
        }

        this.register_function_declaration(assign_name, TYPES.UNKNOW, operands, [], ctx, AST.STAT_ASSIGN);
        
        // EVALUATE RIGHT EXPRESSION
        this.enter_function_declaration(assign_name);
        const cst_expr_node = ctx.AssignExpr;
        const ast_expr_node = this.visit(cst_expr_node);
        this.leave_function_declaration();

        // UPDATE RIGHT TYPE
        assign_ast.ic_type = ast_expr_node.ic_type;
        assign_ast.expression = ast_expr_node;

        // UPDATE FUNCTION DECLARATION
        this.set_function_declaration_statements(assign_name, ast_expr_node);
        this.set_function_declaration_type(assign_name, ast_expr_node.ic_type);
            
        // CHECK LEFT TYPE == RIGHT TYPE
        if (ast_id_left_node.ic_type != TYPES.UNKNOW && assign_ast.ic_type != ast_id_left_node.ic_type){
            this.add_error(ctx.ArgumentsWithIds, AST.EXPR_MEMBER_FUNC_DECL, 'Error:left type [' + assign_ast.ic_type + '] and right type [' + ast_id_left_node.ic_type + '] are different for function declaration.')
        }

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
        const returned_type = ctx.returnedType[0].image;

        let operands_decl = [];
        if (ctx.visit_header){
            operands_decl = this.visit(ctx.ArgumentsWithIds);
            const operands = [];
            if (operands_decl.items) {
                let loop_index;
                for(loop_index=0; loop_index < operands_decl.items.length; loop_index++) {
                    operands.push( { opd_name:operands_decl.items[loop_index], opd_type:operands_decl.ic_subtypes[loop_index] } );
                }
            }

            this.register_function_declaration(function_name, returned_type, operands, [], ctx, AST.STAT_FUNCTION);
        }

        const statements = [];
        if (ctx.visit_body){
            // CHANGE SCOPE FOR FUNCTION STATEMENTS
            this.enter_function_declaration(function_name);

            let statement;
            for(statement of ctx.blockStatement){
                statements.push( this.visit(statement) );
            }

            this.leave_function_declaration();

            this.set_function_declaration_statements(function_name, statements);
        }

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
    

    /**
     * Visit CST Dispose.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    disposeStatement(ctx:any) {
        // console.log('DisposeStatement', ctx)

        const name = ctx.ID[0].image;

        return {
            type: AST.STAT_DISPOSE,
            name:name
        }
    }
    

    /**
     * Visit CST Emit.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    emitStatement(ctx:any) {
        // console.log('emitStatement', ctx)

        const node_record = this.visit(ctx.Record);

        return {
            type: AST.STAT_EMIT,
            event:ctx.ID[0].image,
            operands:node_record
        }
    }
    

    /**
     * Visit CST On.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    onStatement(ctx:any) {
        // console.log('onStatement', ctx)

        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            type: AST.STAT_ON,
            event:ctx.eventName[0].image,
            record:ctx.recordName[0].image,
            block:statements
        }
    }
    

    /**
     * Visit CST Wait.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    waitStatement(ctx:any) {
        // console.log('waitStatement', ctx)

        const vars = [];
        let name;
        for(name of ctx.asyncVariables){
            vars.push(name.image);
        }

        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            type: AST.STAT_WAIT,
            asyncVariables: vars,
            block:statements
        }
    }
}

