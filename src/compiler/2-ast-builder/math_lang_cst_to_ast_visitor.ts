
import MathLangCstToAstVisitorExpression from './math_lang_cst_to_ast_visitor_expressions';
import TYPES from '../math_lang_types';

import { IAstNodeKindOf as AST } from '../../core/icompiler_ast_node';
import CompilerScope from '../0-common/compiler_scope';



export default class MathLangCstToAstVisitor extends MathLangCstToAstVisitorExpression {
    constructor(compiler_scope:CompilerScope) {
        super(compiler_scope);

        // The "validateVisitor" method is a helper utility which performs static analysis
        // to detect missing or redundant visitor methods
        this.validateVisitor();
    }


    /**
     * Visit CST Record node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    Record(ctx:any) {
        // this.dump_ctx('Record', ctx);
        
        const ast_record = {
            type: AST.EXPR_RECORD,
            ic_type:TYPES.RECORD,
            items:<any> {}
        };
        const cst_keys   = Array.isArray(ctx.key)   ? ctx.key   : [ctx.key];
        const cst_values = Array.isArray(ctx.value) ? ctx.value : [ctx.value];

        if (cst_keys.length != cst_values.length){
            return this.add_error(ctx, AST.EXPR_RECORD, 'Bad keys and values lengths');
        }

        let ast_key:string;
        let ast_value:any;
        let index:number;
        for(index=0; index < cst_keys.length; index++) {
            ast_key   = cst_keys[index][0].image;
            ast_value = this.visit(cst_values[index]);

            ast_record.items[ast_key] = ast_value;
        }
        
        return ast_record;
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
                ic_subtypes:[],
                items:[]
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
                ic_subtypes:[],
                items: []
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

        const arg_type = ctx.arg_type && ctx.arg_type[0] ? this.visit(ctx.arg_type[0]) : 'INTEGER';
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
        const cst_operator = ctx.binop[0].image;
        let ic_func_name;
        switch(cst_operator){
            case '>':  ic_func_name = 'sup'; break;
            case '>=': ic_func_name = 'sup_equal'; break;
            case '<':  ic_func_name = 'inf'; break;
            case '<=': ic_func_name = 'inf_equal'; break;
            case '==': ic_func_name = 'equal'; break;
            case '!=': ic_func_name = 'not_equal'; break;
            default:   ic_func_name = 'unknow'; break;
        }
        return {
            type: AST.EXPR_BINOP,
            value: cst_operator,
            ic_function: ic_func_name
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
        const cst_operator = ctx.binop[0].image;
        return {
            type: AST.EXPR_BINOP,
            value: cst_operator,
            ic_function: cst_operator == '*' ? 'mul' : 'div'
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
        const cst_operator = ctx.binop[0].image;
        return {
            type: AST.EXPR_BINOP,
            value: cst_operator,
            ic_function: cst_operator == '+' ? 'add' : 'sub'
        }
    }




    /**
     * Get IC Function name for pre operator.
     * 
     * @param CST operator
     * 
     * @returns IC function name
     */
    get_prefix_operator_function(cst_operator:string) {
        switch(cst_operator){
            case '++': return 'add_one'; break;
            case '--': return 'sub_one'; break;
            case '+':  return 'ignore'; break;
            case '-':  return 'negate'; break;
            case '!':  return 'factorial'; break;
            default:   return 'unknow'; break;
        }
    }


    /**
     * Get IC Function name for post operator.
     * 
     * @param CST operator
     * 
     * @returns IC function name
     */
    get_postfix_operator_function(cst_operator:string):string {
        switch(cst_operator){
            case '++': return 'add_one'; break;
            case '--': return 'sub_one'; break;
            default:   return 'unknow'; break;
        }
    }
}

