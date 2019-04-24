import MathLangCstToAstVisitorStatement from './math_lang_cst_to_ast_visitor_statement';
import TYPES from '../3-program_builder/program_types';



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

        const node_lhs = this.visit(ctx.lhs);
        const node_op  = ctx.operator   ? this.visit(ctx.operator)  : undefined;
        const node_rhs = ctx.rhs        ? this.visit(ctx.rhs)       : undefined;

        if (! node_op && ! node_rhs) {
            return node_lhs;
        }

        return {
            type: "COMPARATOR_EXPRESSION",
            ic_type:TYPES.BOOLEAN,
            lhs: node_lhs,
            operator: node_op,
            rhs: node_rhs
        }
    }

    BinaryMultDivExpression(ctx:any) {
        // this.dump_ctx('BinaryMultDivExpression', ctx);

        const node_lhs = this.visit(ctx.lhs);
        const node_op  = ctx.operator   ? this.visit(ctx.operator)  : undefined;
        const node_rhs = ctx.rhs        ? this.visit(ctx.rhs)       : undefined;

        if (! node_op && ! node_rhs) {
            return node_lhs;
        }

        return {
            type: "MULTDIV_EXPRESSION",
            ic_type:this.compute_binop_type(node_op.value, node_lhs, node_rhs),
            lhs: node_lhs,
            operator: node_op,
            rhs: node_rhs
        }
    }

    BinaryAddSubExpression(ctx:any) {
        // this.dump_ctx('BinaryAddSubExpression', ctx);

        const node_lhs = this.visit(ctx.lhs);
        const node_op  = ctx.operator   ? this.visit(ctx.operator)  : undefined;
        const node_rhs = ctx.rhs        ? this.visit(ctx.rhs)       : undefined;

        if (! node_op && ! node_rhs) {
            return node_lhs;
        }

        return {
            type: "ADDSUB_EXPRESSION",
            ic_type:this.compute_binop_type(node_op.value, node_lhs, node_rhs),
            lhs: node_lhs,
            operator: node_op,
            rhs: node_rhs
        }
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
                type: "PREUNOP_EXPRESSION",
                ic_type:this.compute_preunop_type(node_op, node_rhs),
                rhs: node_rhs,
                operator: node_op
            }
        }

        if (ctx.True) {
            return {
                type: "TRUE",
                ic_type:TYPES.KEYWORD
            }
        }

        if (ctx.False) {
            return {
                type: "FALSE",
                ic_type:TYPES.KEYWORD
            }
        }

        if (ctx.Null) {
            return {
                type: "NULL",
                ic_type:TYPES.KEYWORD
            }
        }
        
        return {
            type: "UNKNOW_UNARY_EXPRESSION",
            ic_type: TYPES.ERROR,
            context:ctx
        }
    }

    PostfixExpression(ctx:any) {
        // this.dump_ctx('PostfixExpression', ctx);

        const node_lhs  = ctx.lhs       ? this.visit(ctx.lhs)    : undefined;
        const node_op   = ctx.operator  ? ctx.operator[0].image  : undefined;
        
        if (node_lhs && node_op) {
            return {
                type: "POSTUNOP_EXPRESSION",
                ic_type:this.compute_postunop_type(node_op, node_lhs),
                lhs: node_lhs,
                operator: node_op
            }
        }

        if (node_lhs && ! node_op) {
            return node_lhs
        }
        
        return {
            type: "UNKNOW_POSTFIX_EXPRESSION",
            ic_type: TYPES.ERROR,
            context:ctx
        }
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


        if (ctx.ID) {
            const id = ctx.ID[0].image;
            return {
                type: "ID_EXPRESSION",
                ic_type:this.get_symbol_type(id),
                name: id,
                members: loop_ast_member.is_default_ast ? loop_ast_member.members : loop_ast_member
            };
        }

        if (ctx.PrimaryExpression) {
            const node_prim = this.visit(ctx.PrimaryExpression);
            node_prim.members = loop_ast_member.is_default_ast ? loop_ast_member.members : loop_ast_member;
            return node_prim;
        }
        
        return {
            type: "UNKNOW_MEMBER_EXPRESSION",
            ic_type: TYPES.ERROR,
            context:ctx
        }
    }

    MemberOptionExpression(ctx:any) {
        // this.dump_ctx('MemberOptionExpression', ctx);

        if (ctx.BoxMemberExpression) {
            const ast_node = this.visit(ctx.BoxMemberExpression);
            return {
                type: "BOX_EXPRESSION",
                ic_type:ast_node.ic_type,
                expression: ast_node
            }
        }
        if (ctx.DotMemberExpression) {
            const ast_node = this.visit(ctx.DotMemberExpression);
            return {
                type: "DOT_EXPRESSION",
                ic_type:ast_node.ic_type,
                identifier: ast_node
            }
        }
        if (ctx.DashMemberExpression) {
            const ast_node = this.visit(ctx.DashMemberExpression);
            return {
                type: "DASH_EXPRESSION",
                ic_type:ast_node.ic_type,
                expression: ast_node
            }
        }
        if (ctx.Arguments) {
            return this.visit(ctx.Arguments);
        }
        
        return {
            type: "UNKNOW_MEMBER_ITEM_EXPRESSION",
            ic_type: TYPES.ERROR,
            context: ctx
        }
    }

    AssignMemberOptionExpression(ctx:any) {
        // this.dump_ctx('AssignMemberOptionExpression', ctx);

        if (ctx.BoxMemberExpression) {
            const ast_node = this.visit(ctx.BoxMemberExpression);
            return {
                type: "BOX_EXPRESSION",
                ic_type:ast_node.ic_type,
                expression: ast_node
            }
        }
        if (ctx.DotMemberExpression) {
            return {
                type: "DOT_EXPRESSION",
                ic_type:TYPES.METHOD_ID,
                identifier: this.visit(ctx.DotMemberExpression)
            }
        }
        if (ctx.DashMemberExpression) {
            return {
                type: "DASH_EXPRESSION",
                ic_type:TYPES.ATTRIBUTE_ID,
                expression: this.visit(ctx.DashMemberExpression)
            }
        }
        if (ctx.ArgumentsWithIds) {
            return this.visit(ctx.ArgumentsWithIds);
        }
        
        return {
            type: "UNKNOW_MEMBER_ITEM_EXPRESSION",
            context: ctx
        }
    }

    PrimaryExpression(ctx:any) {
        // this.dump_ctx('PrimaryExpression', ctx)

        if (ctx.StringLiteral) {
            return {
                type: "STRING",
                ic_type:TYPES.STRING,
                value:ctx.StringLiteral[0].image
            }
        }

        if (ctx.Integer1Literal) {
            return {
                type: "INTEGER",
                ic_type:TYPES.INTEGER,
                value:ctx.Integer1Literal[0].image
            }
        }

        if (ctx.Integer2Literal) {
            return {
                type: "INTEGER",
                ic_type:TYPES.INTEGER,
                value:ctx.Integer2Literal[0].image
            }
        }

        if (ctx.FloatLiteral) {
            return {
                type: "FLOAT",
                ic_type:TYPES.FLOAT,
                value:ctx.FloatLiteral[0].image
            }
        }

        if (ctx.BigInteger1Literal) {
            return {
                type: "BIGINTEGER",
                ic_type:TYPES.BIGINTEGER,
                value:ctx.BigInteger1Literal[0].image
            }
        }

        if (ctx.BigInteger2Literal) {
            return {
                type: "BIGINTEGER",
                ic_type:TYPES.BIGINTEGER,
                value:ctx.BigInteger2Literal[0].image
            }
        }

        if (ctx.BigFloat1Literal) {
            return {
                type: "BIGFLOAT",
                ic_type:TYPES.BIGFLOAT,
                value:ctx.BigFloat1Literal[0].image
            }
        }

        if (ctx.BigFloat2Literal) {
            return {
                type: "BIGFLOAT",
                ic_type:TYPES.BIGFLOAT,
                value:ctx.BigFloat2Literal[0].image
            }
        }

        if (ctx.BigFloat3Literal) {
            return {
                type: "BIGFLOAT",
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
            type: "UNKNOW_EXPRESSION",
            ctx:ctx
        }
    }

    ParenthesisExpression(ctx:any) {
        // this.dump_ctx('ParenthesisExpression', ctx);

        const node_expr = this.visit(ctx.BinaryExpression);
        return {
            type: "PARENTHESIS_EXPRESSION",
            ic_type:node_expr.ic_type,
            expression: node_expr
        }
    }

    BoxMemberExpression(ctx:any) {
        return this.visit(ctx.BinaryExpression);
    }


    DotMemberExpression(ctx:any) {
        return ctx.ID[0].image;
    }


    DashMemberExpression(ctx:any) {
        return ctx.ID[0].image;
    }

    Arguments(ctx:any) {
        // this.dump_ctx('argsList', ctx);
        
        if (!ctx.BinaryExpression) {
            return {
                type: "ARGS_EXPRESSION",
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
            type: "ARGS_EXPRESSION",
            ic_type:TYPES.ARRAY,
            ic_subtypes:ic_unique_subtypes.length == 1 ? ic_unique_subtypes : ic_subtypes,
            items: nodes
        }
    }

    ArgumentsWithIds(ctx:any) {
        // this.dump_ctx('ArgumentsWithIds', ctx);
        
        // EMPTY LIST OF ARGUMENTS
        if ( ! ctx.ArgumentWithIds) {
            return {
                type: "ARGIDS_EXPRESSION",
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
            type: "ARGIDS_EXPRESSION",
            ic_type:TYPES.ARRAY,
            ic_subtypes:ic_subtypes,
            items: ids
        }
    }

    ArgumentWithIds(ctx:any) {
        // this.dump_ctx('ArgumentWithIds', ctx);
        
        const arg_type = ctx.arg_type && ctx.arg_type[0].image ? ctx.arg_type[0].image : 'INTEGER';
        return { id:ctx.arg_id[0].image, type: arg_type };
    }

    ArrayLiteral(ctx:any) {
        // this.dump_ctx('ArrayLiteral', ctx);

        if (!ctx.BinaryExpression) {
            return {
                type: "ARRAY_EXPRESSION",
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
            type: "ARRAY_EXPRESSION",
            ic_type:TYPES.ARRAY,
            ic_subtypes:ic_unique_subtypes.length == 1 ? ic_unique_subtypes : ic_subtypes,
            items: nodes
        }
    }

    BinaryCompareOps(ctx:any) {
        // this.dump_ctx('BinaryCompareOps', ctx);
        return {
            type: "BINOP",
            value: ctx.binop[0].image
        }
    }

    BinaryMultDivOps(ctx:any) {
        // this.dump_ctx('BinaryMultDivOps', ctx);
        return {
            type: "BINOP",
            value: ctx.binop[0].image
        }
    }

    BinaryAddSubOps(ctx:any) {
        // this.dump_ctx('BinaryAddSubOps', ctx);
        return {
            type: "BINOP",
            value: ctx.binop[0].image
        }
    }
}

