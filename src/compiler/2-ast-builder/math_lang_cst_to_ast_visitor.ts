import MathLangCstToAstVisitorStatement from './math_lang_cst_to_ast_visitor_statement';
import TYPES from '../3-program_builder/math_lang_types';
import AST from '../2-ast-builder/math_lang_ast';



export default class MathLangCstToAstVisitor extends MathLangCstToAstVisitorStatement {
    constructor() {
        super();

        // The "validateVisitor" method is a helper utility which performs static analysis
        // to detect missing or redundant visitor methods
        this.validateVisitor();
    }
    
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
                ic_type:  this.compute_binop_type(loop_ast_op.value, loop_ast_lhs, loop_ast_rhs),
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
                ic_type:  this.compute_binop_type(loop_ast_op.value, loop_ast_lhs, loop_ast_rhs),
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
                ic_type:this.compute_preunop_type(node_op, node_rhs),
                rhs: node_rhs,
                operator: node_op
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
                ic_type:this.compute_postunop_type(node_op, node_lhs),
                lhs: node_lhs,
                operator: node_op
            }
        }

        if (node_lhs && ! node_op) {
            return node_lhs
        }
        
        return this.add_error(ctx, AST.EXPR_UNOP_POST_UNKNOW, 'Unknow postfix unary operator node');
    }

    MemberExpression(ctx:any) {
        // this.dump_ctx('MemberExpression', ctx);

        const assign_ast ={
            members:<any>undefined,
            is_default_ast:true
        }
        let loop_ctx_member;
        let loop_ast_member = assign_ast;

        if (ctx.MemberOptionExpression) {
            if ( Array.isArray(ctx.MemberOptionExpression) ) {
                for(loop_ctx_member of ctx.MemberOptionExpression) {
                    loop_ast_member.members = this.visit(loop_ctx_member);
                    loop_ast_member = loop_ast_member.members;
                }
            } else {
                loop_ctx_member = ctx.MemberOptionExpression;
                loop_ast_member = this.visit(loop_ctx_member);
            }
        }

        const expression_members = loop_ast_member.is_default_ast ? loop_ast_member.members : loop_ast_member;


        if (ctx.ID) {
            const id = ctx.ID[0].image;
            const symbol_type = this.get_symbol_type(id);
            const ast_node = {
                type: AST.EXPR_MEMBER_ID,
                ic_type: symbol_type,
                name: id,
                members: expression_members
            };
            if (symbol_type == TYPES.UNKNOW){
                // CHECK FUNCTION CALL
                if (ast_node.members && ast_node.members.type == AST.EXPR_ARGS){
                    if (this.has_declared_func_symbol(id)){
                        ast_node.ic_type = this.get_scopes_map().get(id).return_type;
                        return ast_node;
                    }
                }

                // ERROR
                if (this.has_declared_var_symbol(id) || this.has_declared_func_symbol(id)){
                    this.add_error(ctx.ID[0], ast_node, 'Unknow symbol type [' + id + ']');
                } else {
                    this._unknow_symbols.push(id);
                    this.add_error(ctx.ID[0], ast_node, 'Unknow symbol [' + id + ']');
                }
            }
            return ast_node;
        }

        if (ctx.PrimaryExpression) {
            const node_prim = this.visit(ctx.PrimaryExpression);
            node_prim.members = expression_members;
            return node_prim;
        }
        
        return this.add_error(ctx, AST.EXPR_MEMBER_UNKNOW, 'Unknow member expression node');
    }

    MemberOptionExpression(ctx:any) {
        // this.dump_ctx('MemberOptionExpression', ctx);

        if (ctx.BoxMemberExpression) {
            const ast_node = this.visit(ctx.BoxMemberExpression);
            return {
                type: AST.EXPR_MEMBER_BOX,
                ic_type:ast_node.ic_type,
                expression: ast_node
            }
        }
        if (ctx.DotMemberExpression) {
            const ast_node = this.visit(ctx.DotMemberExpression);
            return {
                type: AST.EXPR_MEMBER_DOT,
                ic_type:ast_node.ic_type,
                identifier: ast_node
            }
        }
        if (ctx.DashMemberExpression) {
            const ast_node = this.visit(ctx.DashMemberExpression);
            return {
                type: AST.EXPR_MEMBER_DASH,
                ic_type:ast_node.ic_type,
                expression: ast_node
            }
        }
        if (ctx.Arguments) {
            return this.visit(ctx.Arguments);
        }
        
        return this.add_error(ctx, AST.EXPR_MEMBER_UNKNOW_ITEM, 'Unknow optional member expression node');
    }

    AssignMemberOptionExpression(ctx:any) {
        // this.dump_ctx('AssignMemberOptionExpression', ctx);

        if (ctx.BoxMemberExpression) {
            const ast_node = this.visit(ctx.BoxMemberExpression);
            return {
                type: AST.EXPR_MEMBER_BOX,
                ic_type:ast_node.ic_type,
                expression: ast_node
            }
        }
        if (ctx.DotMemberExpression) {
            return {
                type: AST.EXPR_MEMBER_DOT,
                ic_type:TYPES.METHOD_ID,
                identifier: this.visit(ctx.DotMemberExpression)
            }
        }
        if (ctx.DashMemberExpression) {
            return {
                type: AST.EXPR_MEMBER_DASH,
                ic_type:TYPES.ATTRIBUTE_ID,
                expression: this.visit(ctx.DashMemberExpression)
            }
        }
        if (ctx.ArgumentsWithIds) {
            return this.visit(ctx.ArgumentsWithIds);
        }
        
        return {
            type: AST.EXPR_MEMBER_UNKNOW_ITEM,
            context: ctx
        }
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
     * Visit CST Id member (id\[expression, expression...\]) node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    BoxMemberExpression(ctx:any) {
        return this.visit(ctx.Arguments);
    }


    /**
     * Visit CST Id member (id.id) node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    DotMemberExpression(ctx:any) {
        return ctx.ID[0].image;
    }


    /**
     * Visit CST Id member (id#id) node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    DashMemberExpression(ctx:any) {
        return ctx.ID[0].image;
    }


    /**
     * Visit CST Arguments node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    Arguments(ctx:any) {
        // this.dump_ctx('argsList', ctx);
        
        if (!ctx.BinaryExpression) {
            return {
                type: AST.EXPR_ARGS,
                ic_type:TYPES.ARRAY,
                ic_subtypes:[TYPES.UNKNOW],
                items: undefined
            }
        }

        if ( ! Array.isArray(ctx.BinaryExpression) ) {
            ctx.BinaryExpression = [ctx.BinaryExpression];
        }

        const nodes:any = [];
        const ic_subtypes:string[] = [];
        const ic_unique_subtypes:string[] = [];

        let node:any;
        let ast_node:any;
        let ic_type:string;
        for(node of ctx.BinaryExpression) {
            ast_node = this.visit(node);
            ic_type = ast_node.ic_type;
            ic_subtypes.push(ic_type);
            nodes.push(ast_node);
        }
        
        return {
            type: AST.EXPR_ARGS,
            ic_type:TYPES.ARRAY,
            ic_subtypes:ic_unique_subtypes.length == 1 ? ic_unique_subtypes : ic_subtypes,
            items: nodes
        }
    }


    /**
     * Visit CST Arguments with ids (id1, id2...) node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    ArgumentsWithIds(ctx:any) {
        // this.dump_ctx('ArgumentsWithIds', ctx);
        
        // EMPTY LIST OF ARGUMENTS
        if ( ! ctx.ArgumentWithIds) {
            return {
                type: AST.EXPR_ARGS_IDS,
                ic_type:TYPES.ARRAY,
                ic_subtypes:[TYPES.UNKNOW],
                items: undefined
            }
        }

        const ids:any = [];
        const ic_subtypes:string[] = [];

        let loop_argument_ctx:any;
        let loop_argument:any;
        for(loop_argument_ctx of ctx.ArgumentWithIds) {
            loop_argument = this.visit(loop_argument_ctx);

            ic_subtypes.push(loop_argument.type);
            ids.push(loop_argument.id);
        }
        
        return {
            type: AST.EXPR_ARGS_IDS,
            ic_type:TYPES.ARRAY,
            ic_subtypes:ic_subtypes,
            items: ids
        }
    }


    /**
     * Visit CST Argument id node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    ArgumentWithIds(ctx:any) {
        // this.dump_ctx('ArgumentWithIds', ctx);

        const arg_type = ctx.arg_type && ctx.arg_type[0].image ? ctx.arg_type[0].image : 'INTEGER';
        return { id:ctx.arg_id[0].image, type: arg_type };
    }


    /**
     * Visit CST Array Literal node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    ArrayLiteral(ctx:any) {
        // this.dump_ctx('ArrayLiteral', ctx);

        if (!ctx.BinaryExpression) {
            return {
                type: AST.EXPR_ARRAY,
                ic_type:TYPES.ARRAY,
                ic_subtypes:[TYPES.UNKNOW],
                items:<any>undefined
            }
        }

        if ( ! Array.isArray(ctx.BinaryExpression) ) {
            ctx.BinaryExpression = [ctx.BinaryExpression];
        }

        const nodes:any[] = [];
        const ic_subtypes:string[] = [];
        const ic_unique_subtypes:string[] = [];

        let node:any;
        let ast_node:any;
        let ic_type:string;
        for(node of ctx.BinaryExpression) {
            ast_node = this.visit(node);
            ic_type = ast_node.ic_type;
            ic_subtypes.push(ic_type);
            if ( ic_unique_subtypes.indexOf(ic_type) < 0 ) {
                ic_unique_subtypes.push(ic_type);
            }
            nodes.push(ast_node);
        }
        
        return {
            type: AST.EXPR_ARRAY,
            ic_type:TYPES.ARRAY,
            ic_subtypes:ic_unique_subtypes.length == 1 ? ic_unique_subtypes : ic_subtypes,
            items: nodes
        }
    }


    /**
     * Visit CST Binary Comparator operator node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    BinaryCompareOps(ctx:any) {
        // this.dump_ctx('BinaryCompareOps', ctx);
        return {
            type: AST.EXPR_BINOP,
            value: ctx.binop[0].image
        }
    }


    /**
     * Visit CST Binary Mul/Div operator node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    BinaryMultDivOps(ctx:any) {
        // this.dump_ctx('BinaryMultDivOps', ctx);
        return {
            type: AST.EXPR_BINOP,
            value: ctx.binop[0].image
        }
    }
    

    /**
     * Visit CST Binary Add/Sub operator node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    BinaryAddSubOps(ctx:any) {
        // this.dump_ctx('BinaryAddSubOps', ctx);
        return {
            type: AST.EXPR_BINOP,
            value: ctx.binop[0].image
        }
    }
}

