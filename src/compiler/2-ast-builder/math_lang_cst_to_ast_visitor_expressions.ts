
import IType from '../../core/itype';
import AST from './math_lang_ast';
import TYPES from '../math_lang_types';
import MathLangCstToAstVisitorStatement from './math_lang_cst_to_ast_visitor_statement';
import { MathLangParserExpressions } from '../1-cst-builder/math_lang_parser_expressions';



export default abstract class MathLangCstToAstVisitorExpression extends MathLangCstToAstVisitorStatement {
    constructor(types_map:Map<string,IType>) {
        super(types_map);
    }

    abstract get_prefix_operator_function(node_op:any):string;
    abstract get_postfix_operator_function(node_op:any):string;
    
    expression(ctx:any) {
        // this.dump_ctx('expression', ctx)

         return this.visit(ctx.BinaryExpression);
    }

    BinaryExpression(ctx:any) {
        // this.dump_ctx('BinaryExpression', ctx);

        let loop_ast_lhs = this.visit(ctx.lhs);

        // SIMPLE LHS EXPRESSION
        if (! ctx.operator || ! ctx.rhs) {
            return loop_ast_lhs;
        }

        // LOOP ON BINOP CHAIN
        let loop_index;
        let loop_ast_op;
        let loop_ast_rhs;
        let loop_ast;
        for(loop_index=0; loop_index < ctx.operator.length; loop_index++) {
            loop_ast_op  = this.visit(ctx.operator[loop_index]);
            loop_ast_rhs = this.visit(ctx.rhs[loop_index]);
            loop_ast = {
                type:     AST.EXPR_BINOP_COMPARE,
                ic_type:  TYPES.BOOLEAN,
                lhs:      loop_ast_lhs,
                operator: loop_ast_op,
                rhs:      loop_ast_rhs
            };
            loop_ast_lhs = loop_ast;
        }

        return loop_ast;
    }

    BinaryMultDivExpression(ctx:any) {
        // this.dump_ctx('BinaryMultDivExpression', ctx);

        let loop_ast_lhs = this.visit(ctx.lhs);

        // SIMPLE LHS EXPRESSION
        if (! ctx.operator || ! ctx.rhs) {
            return loop_ast_lhs;
        }

        // LOOP ON BINOP CHAIN
        let loop_index;
        let loop_ast_op;
        let loop_ast_rhs;
        let loop_ast;
        for(loop_index=0; loop_index < ctx.operator.length; loop_index++) {
            loop_ast_op  = this.visit(ctx.operator[loop_index]);
            loop_ast_rhs = this.visit(ctx.rhs[loop_index]);
            loop_ast = {
                type:     AST.EXPR_BINOP_MULTDIV,
                ic_type:  this.compute_binop_type(loop_ast_op.value, loop_ast_lhs, loop_ast_rhs, ctx, AST.EXPR_BINOP_MULTDIV),
                lhs:      loop_ast_lhs,
                operator: loop_ast_op,
                rhs:      loop_ast_rhs
            };
            loop_ast_lhs = loop_ast;
        }

        return loop_ast;
    }

    BinaryAddSubExpression(ctx:any) {
        // this.dump_ctx('BinaryAddSubExpression', ctx);

        let loop_ast_lhs = this.visit(ctx.lhs);

        // SIMPLE LHS EXPRESSION
        if (! ctx.operator || ! ctx.rhs) {
            return loop_ast_lhs;
        }

        // LOOP ON BINOP CHAIN
        let loop_index;
        let loop_ast_op;
        let loop_ast_rhs;
        let loop_ast;
        for(loop_index=0; loop_index < ctx.operator.length; loop_index++) {
            loop_ast_op  = this.visit(ctx.operator[loop_index]);
            loop_ast_rhs = this.visit(ctx.rhs[loop_index]);
            loop_ast = {
                type:     AST.EXPR_BINOP_ADDSUB,
                ic_type:  this.compute_binop_type(loop_ast_op.value, loop_ast_lhs, loop_ast_rhs, ctx, AST.EXPR_BINOP_ADDSUB),
                lhs:      loop_ast_lhs,
                operator: loop_ast_op,
                rhs:      loop_ast_rhs
            };
            loop_ast_lhs = loop_ast;
        }

        return loop_ast;
    }

    UnaryExpression(ctx:any) {
        // this.dump_ctx('UnaryExpression', ctx);

        const node_lhs  = ctx.lhs       ? this.visit(ctx.lhs)       : undefined;
        const node_op   = ctx.operator  ? ctx.operator[0].image     : undefined;
        const node_rhs  = ctx.rhs       ? this.visit(ctx.rhs)       : undefined;

        if (node_lhs) {
            return node_lhs;
        }

        if (node_rhs && node_op) {
            return {
                type: AST.EXPR_UNOP_PREUNOP,
                ic_type:this.compute_preunop_type(node_op, node_rhs, ctx, AST.EXPR_UNOP_PREUNOP),
                rhs: node_rhs,
                operator: node_op,
                ic_function: this.get_prefix_operator_function(node_op)
            }
        }

        if (ctx.True) {
            return {
                type: AST.EXPR_UNOP_PRE_TRUE,
                ic_type:TYPES.KEYWORD
            }
        }

        if (ctx.False) {
            return {
                type: AST.EXPR_UNOP_PRE_FALSE,
                ic_type:TYPES.KEYWORD
            }
        }

        if (ctx.Null) {
            return {
                type: AST.EXPR_UNOP_PRE_NULL,
                ic_type:TYPES.KEYWORD
            }
        }
        
        return this.add_error(ctx, AST.EXPR_UNOP_PRE_UNKNOW, 'Unknow prefix unary operator node');
    }

    PostfixExpression(ctx:any) {
        // this.dump_ctx('PostfixExpression', ctx);

        const node_lhs  = ctx.lhs       ? this.visit(ctx.lhs)    : undefined;
        const node_op   = ctx.operator  ? ctx.operator[0].image  : undefined;
        
        if (node_lhs && node_op) {
            return {
                type: AST.EXPR_UNOP_POST,
                ic_type:this.compute_postunop_type(node_op, node_lhs, ctx, AST.EXPR_UNOP_POST),
                lhs: node_lhs,
                operator: node_op,
                ic_function: this.get_postfix_operator_function(node_op)
            }
        }

        if (node_lhs && ! node_op) {
            return node_lhs
        }
        
        return this.add_error(ctx, AST.EXPR_UNOP_POST_UNKNOW, 'Unknow postfix unary operator node');
    }


    /**
     * Parse an indexed bracket expression [expr,expr...].
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    indexedBracketsExpression(ctx:any){
        const ast_expressions:any[] = [];
        
        ctx.BinaryExpression.forEach(
            (cst_expr:any) => ast_expressions.push( this.visit(cst_expr) )
        );

        return ast_expressions;
    }


    /**
     * Parse an id node to be a left or right part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idLeftRight(ctx:any){
        const id = ctx.ID[0].image;
        const symbol_type = this.get_symbol_type(id);

        const ast_node = {
            type: AST.EXPR_MEMBER_ID,
            ic_type: symbol_type,
            name: id,
            members:<any>[]
        };

        // PROCESS ID ATTRIBUTE OR INDEXED IN ORDER
        let member_previous_ic_type:string = ast_node.ic_type;
        let member_ast_node:any;
        const attributeOrIndexeds = ctx.attributeOrIndexed ? ctx.attributeOrIndexed : [];
        attributeOrIndexeds.forEach((cst_node:any, cst_node_index:number) => {

            // NODE IS AN INDEXED ACCESSOR (LIST OF EXPRESSIONS)
            if (cst_node.name == 'indexedBracketsExpression'){
                const ast_indexed_expressions = this.visit(cst_node);

                // LOOP ON BinaryExpression array
                let loop_ast_node:any;
                let indexes:any[] = [];
                ast_indexed_expressions.forEach((loop_ast_node:any, ast_index_index:number) => {

                    // CHECK INDEX TYPE
                    if (loop_ast_node.ic_type != TYPES.INTEGER && loop_ast_node.ic_type != TYPES.BIGINTEGER){
                        this.add_error(cst_node, AST.EXPR_MEMBER_INDEXED, 'Error:bad index type [' + loop_ast_node.ic_type + '] at [' + ast_index_index + ']');
                    }

                    indexes.push(loop_ast_node);
                });

                // APPEND AST NODE
                member_ast_node = {
                    type: AST.EXPR_MEMBER_INDEXED,
                    ic_type: this.get_indexed_type(member_previous_ic_type, cst_node, AST.EXPR_MEMBER_INDEXED),
                    member_index: cst_node_index,
                    indexes_expressions:indexes
                }

                ast_node.type = AST.EXPR_MEMBER_INDEXED;
                ast_node.members.push(member_ast_node);
            }
            
            // NODE IS AN ATTRIBUTE ACCESSOR
            else {
                // CHECK ATTRIBUTE
                const attribute_id = this.visit(cst_node);
                this.check_attribute(member_previous_ic_type, attribute_id, TYPES.UNKNOW, ctx, ast_node.type);

                // APPEND AST NODE
                member_ast_node = {
                    type: AST.EXPR_MEMBER_ATTRIBUTE,
                    ic_type: this.get_attribute_type(member_previous_ic_type, attribute_id, ctx, ast_node.type),
                    attribute_name:attribute_id
                }

                ast_node.type = AST.EXPR_MEMBER_ATTRIBUTE;
                ast_node.members.push(member_ast_node)
            }

            member_previous_ic_type = member_ast_node.ic_type;
        });

        // if (member_previous_ic_type != ) // TODO
        return ast_node;
    }


    /**
     * Parse an id node to be a left part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idLeft(ctx:any){
        const ast_node:any = this.idLeftRight(ctx);

        // FUNCTION DECLARATION
        if (ctx.ArgumentsWithIds){
            if (ctx.ArgumentsWithIds.length != 1){
                this.add_error(ctx.ArgumentsWithIds, AST.EXPR_MEMBER_FUNC_DECL, 'Error:only one function declaration at end of an id expression but [' + ctx.ArgumentsWithIds.length + '] found.')
            }

            const cst_func_decl_node:any = ctx.ArgumentsWithIds[0];
            const ast_func_decl_node:any = this.visit(cst_func_decl_node);

            // NO TEST OF EXISTING FUNCTION/METHOD TO BE ABLE TO DECLARE NEW ONE

            ast_node.type = AST.EXPR_MEMBER_FUNC_DECL;
            ast_node.operands_names = ast_func_decl_node.items;
            ast_node.operands_types = ast_func_decl_node.ic_subtypes;
        }

        // METHOD DECLARATION
        else if (ctx.dotIdArgsDeclarationExpression){
            if (ctx.dotIdArgsDeclarationExpression.length != 1){
                this.add_error(ctx.dotIdArgsDeclarationExpression, AST.EXPR_MEMBER_METHOD_DECL, 'Error:only one method declaration at end of an id expression but [' + ctx.dotIdArgsDeclarationExpression.length + '] found.')
            }

            const cst_func_decl_node:any = ctx.dotIdArgsDeclarationExpression[0];
            const ast_func_decl_node:any = this.visit(cst_func_decl_node);

            // NO TEST OF EXISTING FUNCTION/METHOD TO BE ABLE TO DECLARE NEW ONE

            ast_node.type = AST.EXPR_MEMBER_METHOD_DECL;
            ast_func_decl_node.type = AST.EXPR_MEMBER_METHOD_DECL;
            ast_node.members.push(ast_func_decl_node);
        }

        return ast_node;
    }


    /**
     * Parse an id node to be a right part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idRight(ctx:any){
        const ast_node:any = this.idLeftRight(ctx);

        // FUNCTION CALL
        if (ctx.Arguments){
            if (ctx.Arguments.length != 1){
                this.add_error(ctx.Arguments, AST.EXPR_MEMBER_FUNC_CALL, 'Error:only one function call at end of an id expression but [' + ctx.Arguments.length + '] found.')
            }

            const cst_func_call_node:any = ctx.Arguments[0];
            const ast_func_call_node:any = this.visit(cst_func_call_node);
            const id = ast_node.name;

            // TEST IF CALLED FUNCTION/METHOD EXISTS
            if (ast_node.members.length == 0 && ! this.has_declared_func_symbol(id)){
                this.add_error(ctx, AST.EXPR_MEMBER_FUNC_CALL, 'Error:unknow called function [' + id + ']');
            }
            if (ast_node.members.length > 0){
                const last_member = ast_node.members[ast_node.members.length - 1];
                const last_member_type = last_member ? last_member.ic_type : TYPES.UNKNOW;
                this.check_method(last_member_type, id, ast_func_call_node.ic_subtypes, cst_func_call_node, AST.EXPR_MEMBER_FUNC_CALL);
            }

            ast_node.type = AST.EXPR_MEMBER_FUNC_CALL;
            ast_node.ic_type = this.get_function_type(this._current_module, ast_node.name);
            ast_node.operands_expressions = ast_func_call_node.items;
            ast_node.operands_types = ast_func_call_node.ic_subtypes;
        }

        // MODULE.FUNCTION or OBJECT.METHOD CALL
        else if (ctx.dotIdArgsCallExpression){
            if (ctx.dotIdArgsCallExpression.length != 1){
                this.add_error(ctx.dotIdArgsCallExpression, AST.EXPR_MEMBER_METHOD_CALL, 'Error:only one function call at end of an id expression but [' + ctx.dotIdArgsCallExpression.length + '] found.')
            }

            const object_or_module_name = ast_node.name;
            const cst_func_call_node:any = ctx.dotIdArgsCallExpression[0];
            const ast_func_call_node:any = this.visit(cst_func_call_node);
            const id = ast_func_call_node.func_name;

            // PROCESS A MODULE.FUNCTION
            if (this._scopes_map.has(object_or_module_name)) {
                const func_scope = this.get_scopes_map().get(object_or_module_name).module_functions.get(id);
                ast_func_call_node.ic_type = func_scope? func_scope.return_type : TYPES.UNKNOW;
                // ... TODO
            
                ast_node.type = AST.EXPR_MEMBER_FUNC_CALL;
                ast_node.ic_type = ast_func_call_node.ic_type;
                ast_node.members.push(ast_func_call_node);
            }

            // PROCESS AN OBJECT METHOD
            else {
                const func_scope = this.get_scopes_map().get(this._current_module).module_functions.get(id);
                ast_func_call_node.ic_type = func_scope? func_scope.return_type : TYPES.UNKNOW;

                // TEST IF CALLED FUNCTION/METHOD EXISTS
                if (ast_node.members.length == 0 && ! this.has_declared_func_symbol(id)){
                    this.add_error(ctx, AST.EXPR_MEMBER_METHOD_CALL, 'Error:unknow called function [' + id + '] of module [' + object_or_module_name + ']');
                }
                if (ast_node.members.length > 0){
                    const last_member = ast_node.members[ast_node.members.length - 1];
                    const last_member_type = last_member ? last_member.ic_type : TYPES.UNKNOW;
                    this.check_method(last_member_type, id, ast_func_call_node.operands_types, cst_func_call_node, AST.EXPR_MEMBER_METHOD_CALL);
                }
            
                ast_node.type = AST.EXPR_MEMBER_METHOD_CALL;
                ast_node.ic_type = ast_func_call_node.ic_type;
                ast_node.members.push(ast_func_call_node);
            }
        }

        return ast_node;
    }


    /**
     * Parse an id node to be a value type.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idType(ctx:any){
        const id = ctx.ID[0].image;
        this.check_type(id, ctx, AST.EXPR_TYPE_ID)
        return id;
    }


    /**
     * Parse a function declaration id expression.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    dotIdArgsDeclarationExpression(ctx:any){
        const id = ctx.ID[0].image;
        const cst_args_node:any = ctx.ArgumentsWithIds[0];
        const ast_args_node:any = this.visit(cst_args_node);

        const ast_function_declaration = {
            type: AST.EXPR_MEMBER_METHOD_DECL,
            ic_type: TYPES.UNKNOW,
            func_name:id,
            operands_types:ast_args_node.ic_subtypes,
            operands_names:ast_args_node.items
        };

        return ast_function_declaration;
    }


    /**
     * Parse a function call id expression.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    dotIdArgsCallExpression(ctx:any){
        const id = ctx.ID[0].image;
        const cst_args_node = ctx.Arguments[0];
        const ast_args_node = this.visit(cst_args_node);
        // const func_scope = this.get_scopes_map().get(id);

        const ast_func_call_node = {
            type:AST.EXPR_MEMBER_METHOD_CALL,
            ic_type: TYPES.UNKNOW,
            func_name:id,
            operands_types:ast_args_node.ic_subtypes ? ast_args_node.ic_subtypes : [],
            operands_expressions:ast_args_node.items ? ast_args_node.items : []
        };

        return ast_func_call_node;
    }


    PrimaryExpression(ctx:any) {
        // this.dump_ctx('PrimaryExpression', ctx)

        if (ctx.StringLiteral) {
            return {
                type: AST.EXPR_PRIMARY_STRING,
                ic_type:TYPES.STRING,
                value:ctx.StringLiteral[0].image
            }
        }

        if (ctx.Integer1Literal) {
            return {
                type: AST.EXPR_PRIMARY_INTEGER,
                ic_type:TYPES.INTEGER,
                value:ctx.Integer1Literal[0].image
            }
        }

        if (ctx.Integer2Literal) {
            return {
                type: AST.EXPR_PRIMARY_INTEGER,
                ic_type:TYPES.INTEGER,
                value:ctx.Integer2Literal[0].image
            }
        }

        if (ctx.FloatLiteral) {
            return {
                type: AST.EXPR_PRIMARY_FLOAT,
                ic_type:TYPES.FLOAT,
                value:ctx.FloatLiteral[0].image
            }
        }

        if (ctx.BigInteger1Literal) {
            return {
                type: AST.EXPR_PRIMARY_BIGINTEGER,
                ic_type:TYPES.BIGINTEGER,
                value:ctx.BigInteger1Literal[0].image
            }
        }

        if (ctx.BigInteger2Literal) {
            return {
                type: AST.EXPR_PRIMARY_BIGINTEGER,
                ic_type:TYPES.BIGINTEGER,
                value:ctx.BigInteger2Literal[0].image
            }
        }

        if (ctx.BigFloat1Literal) {
            return {
                type: AST.EXPR_PRIMARY_BIGFLOAT,
                ic_type:TYPES.BIGFLOAT,
                value:ctx.BigFloat1Literal[0].image
            }
        }

        if (ctx.BigFloat2Literal) {
            return {
                type: AST.EXPR_PRIMARY_BIGFLOAT,
                ic_type:TYPES.BIGFLOAT,
                value:ctx.BigFloat2Literal[0].image
            }
        }

        if (ctx.BigFloat3Literal) {
            return {
                type: AST.EXPR_PRIMARY_BIGFLOAT,
                ic_type:TYPES.BIGFLOAT,
                value:ctx.BigFloat3Literal[0].image
            }
        }


        if (ctx.ArrayLiteral) {
            return this.visit(ctx.ArrayLiteral);
        }

        if (ctx.NumberLiteral) {
            return this.visit(ctx.NumberLiteral);
        }

        if (ctx.ParenthesisExpression) {
            return this.visit(ctx.ParenthesisExpression);
        }

        return {
            type: AST.EXPR_PRIMARY_UNKNOW,
            ctx:ctx
        }
    }

    ParenthesisExpression(ctx:any) {
        // this.dump_ctx('ParenthesisExpression', ctx);

        const node_expr = this.visit(ctx.BinaryExpression);
        return {
            type: AST.EXPR_PARENTHESIS,
            ic_type:node_expr.ic_type,
            expression: node_expr
        }
    }


    /**
     * Visit CST Id member (id#id) node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    dashIdExpression(ctx:any) {
        return ctx.ID[0].image;
    }
}
