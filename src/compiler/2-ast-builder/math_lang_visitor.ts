import { MathLangCstToAstVisitorStatement } from './math_lang_visitor_statement';



class MathLangCstToAstVisitor extends MathLangCstToAstVisitorStatement {
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
                rhs: node_rhs,
                operator: node_op
            }
        }

        if (ctx.True) {
            return {
                type: "TRUE"
            }
        }

        if (ctx.False) {
            return {
                type: "FALSE"
            }
        }

        if (ctx.Null) {
            return {
                type: "NULL"
            }
        }
        
        return {
            type: "UNKNOW_UNARY_EXPRESSION",
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
                name: node_lhs,
                operator: node_op
            }
        }

        if (node_lhs && ! node_op) {
            return node_lhs
        }
        
        return {
            type: "UNKNOW_POSTFIX_EXPRESSION",
            context:ctx
        }
    }

    MemberExpression(ctx:any) {
        // this.dump_ctx('MemberExpression', ctx);

        let member_options = [];
        let option = undefined;
        let node = undefined;
        if (ctx.MemberOptionExpression) {
            for(option of ctx.MemberOptionExpression) {
                node = this.visit(option);
                member_options.push(node);
            }
        }

        if (ctx.ID) {
            const id = ctx.ID[0].image;
            return {
                type: "ID_EXPRESSION",
                name: id,
                options: member_options
            };
        }

        if (ctx.PrimaryExpression) {
            const node_prim = this.visit(ctx.PrimaryExpression);
            node_prim.options = member_options;
            return node_prim;
        }
        
        return {
            type: "UNKNOW_MEMBER_EXPRESSION",
            context:ctx
        }
    }

    MemberOptionExpression(ctx:any) {
        // this.dump_ctx('MemberOptionExpression', ctx);

        if (ctx.BoxMemberExpression) {
            return {
                type: "BOX_EXPRESSION",
                node: this.visit(ctx.BoxMemberExpression)
            }
        }
        if (ctx.DotMemberExpression) {
            return {
                type: "DOT_EXPRESSION",
                node: this.visit(ctx.DotMemberExpression)
            }
        }
        if (ctx.DashMemberExpression) {
            return {
                type: "DASH_EXPRESSION",
                node: this.visit(ctx.DashMemberExpression)
            }
        }
        if (ctx.Arguments) {
            return this.visit(ctx.Arguments);
        }
        
        return {
            type: "UNKNOW_MEMBER_ITEM_EXPRESSION",
            context: ctx
        }
    }

    AssignMemberOptionExpression(ctx:any) {
        // this.dump_ctx('AssignMemberOptionExpression', ctx);

        if (ctx.BoxMemberExpression) {
            return {
                type: "BOX_EXPRESSION",
                node: this.visit(ctx.BoxMemberExpression)
            }
        }
        if (ctx.DotMemberExpression) {
            return {
                type: "DOT_EXPRESSION",
                node: this.visit(ctx.DotMemberExpression)
            }
        }
        if (ctx.DashMemberExpression) {
            return {
                type: "DASH_EXPRESSION",
                node: this.visit(ctx.DashMemberExpression)
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
                value:ctx.StringLiteral[0].image
            }
        }

        if (ctx.NumberLiteral) {
            return {
                type: "NUMBER",
                value:ctx.NumberLiteral[0].image
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
                items: undefined
            }
        }

        if ( ! Array.isArray(ctx.BinaryExpression) ) {
            ctx.BinaryExpression = [ctx.BinaryExpression];
        }

        const nodes:any = [];
        let node:any;
        for(node of ctx.BinaryExpression) {
            nodes.push( this.visit(node) );
        }
        
        return {
            type: "ARGS_EXPRESSION",
            items: nodes
        }
    }

    ArgumentsWithIds(ctx:any) {
        // this.dump_ctx('argsList', ctx);
        
        if (!ctx.ID) {
            return {
                type: "ARGIDS_EXPRESSION",
                items: undefined
            }
        }

        if ( ! Array.isArray(ctx.ID) ) {
            ctx.ID = [ctx.ID[0].image];
        }

        const nodes:any = [];
        let node:any;
        for(node of ctx.ID) {
            nodes.push(node.image);
        }
        
        return {
            type: "ARGIDS_EXPRESSION",
            items: nodes
        }
    }

    ArrayLiteral(ctx:any) {
        // this.dump_ctx('ArrayLiteral', ctx);

        if (!ctx.BinaryExpression) {
            return {
                type: "ARRAY_EXPRESSION",
                items: undefined
            }
        }

        if ( ! Array.isArray(ctx.BinaryExpression) ) {
            ctx.BinaryExpression = [ctx.BinaryExpression];
        }

        const nodes:any = [];
        let node:any;
        for(node of ctx.BinaryExpression) {
            nodes.push( this.visit(node) );
        }
        
        return {
            type: "ARRAY_EXPRESSION",
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



export const math_lang_visitor = new MathLangCstToAstVisitor();
