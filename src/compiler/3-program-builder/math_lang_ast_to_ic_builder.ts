import IType from '../../core/itype';

import AST from '../2-ast-builder/math_lang_ast';

import { FunctionScope } from './math_lang_function_scope';
import TYPES from './math_lang_types';
import {IC, ICError, ICFunction, ICIdAccessor, ICInstruction, ICOperand, ICOperandSource} from './math_lang_ast_to_ic_builder_base';
import MathLangAstToIcVisitorStatement from './math_lang_ast_to_ic_builder_statements';



/**
 * Typed AST Visitor class for expressions. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangAstToIcVisitor extends MathLangAstToIcVisitorStatement {

    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(ast_functions:Map<string,FunctionScope>, types_map:Map<string,IType>) {
        super(ast_functions, types_map);
    }


    /**
     * Visit AST expression.
     * 
     * @param ast_expression AST expression
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     * 
     * @returns IC Operand object
     */
    visit_expression(ast_expression:any, ast_func_scope:FunctionScope, ic_function:ICFunction):ICOperand|ICError{
        
        switch(ast_expression.type){
            case AST.EXPR_MEMBER_ID: return this.visit_value_id(ast_expression, ast_func_scope, ic_function);

            case AST.EXPR_PRIMARY_INTEGER: return {
                ic_type:TYPES.INTEGER,
                ic_source:ICOperandSource.FROM_INLINE,
                ic_name:ast_expression.value,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            };
            case AST.EXPR_PRIMARY_BIGINTEGER: return {
                ic_type:TYPES.BIGINTEGER,
                ic_source:ICOperandSource.FROM_INLINE,
                ic_name:ast_expression.value,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            };
            case AST.EXPR_PRIMARY_FLOAT: return {
                ic_type:TYPES.FLOAT,
                ic_source:ICOperandSource.FROM_INLINE,
                ic_name:ast_expression.value,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            };
            case AST.EXPR_PRIMARY_BIGFLOAT: return {
                ic_type:TYPES.BIGFLOAT,
                ic_source:ICOperandSource.FROM_INLINE,
                ic_name:ast_expression.value,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            };

            case AST.EXPR_BINOP_ADDSUB:{
                return this.visit_binop_expression(ast_expression, ast_func_scope, ic_function);
            }
            case AST.EXPR_BINOP_COMPARE:{
                return this.visit_binop_expression(ast_expression, ast_func_scope, ic_function);
            }
            case AST.EXPR_BINOP_MULTDIV:{
                return this.visit_binop_expression(ast_expression, ast_func_scope, ic_function);
            }
            case AST.EXPR_UNOP_PRE_FALSE:{
                return {
                    ic_type:TYPES.BOOLEAN,
                    ic_source:ICOperandSource.FROM_INLINE,
                    ic_name:'###FALSE',
                    ic_id_accessors:[],
                    ic_id_accessors_str:''
                };
            }
            case AST.EXPR_UNOP_PRE_NULL:{
                return {
                    ic_type:TYPES.UNKNOW,
                    ic_source:ICOperandSource.FROM_INLINE,
                    ic_name:'###NULL',
                    ic_id_accessors:[],
                    ic_id_accessors_str:''
                };
            }
            case AST.EXPR_UNOP_PRE_TRUE:{
                return {
                    ic_type:TYPES.BOOLEAN,
                    ic_source:ICOperandSource.FROM_INLINE,
                    ic_name:'###TRUE',
                    ic_id_accessors:[],
                    ic_id_accessors_str:''
                };
            }
            case AST.EXPR_UNOP_POST:{
                return this.visit_postunop_expression(ast_expression, ast_func_scope, ic_function);
            }
            case AST.EXPR_UNOP_PREUNOP:{
                return this.visit_preunop_expression(ast_expression, ast_func_scope, ic_function);
            }
            case AST.EXPR_PARENTHESIS:{
                return this.visit_expression(ast_expression.expression, ast_func_scope, ic_function);
            }
            // case AST.EXPR_PRIMARY_BIGFLOAT:{
            //     return this.visit__expression(ast_expression, ast_func_scope, ic_function);
            // }
            // case AST.EXPR_PRIMARY_BIGINTEGER:{
            //     return this.visit__expression(ast_expression, ast_func_scope, ic_function);
            // }
            // case AST.EXPR_PRIMARY_FLOAT:{
            //     return this.visit__expression(ast_expression, ast_func_scope, ic_function);
            // }
            // case AST.EXPR_PRIMARY_INTEGER:{
            //     return this.visit__expression(ast_expression, ast_func_scope, ic_function);
            // }
            // case AST.EXPR_PRIMARY_STRING:{
            //     return this.visit__expression(ast_expression, ast_func_scope, ic_function);
            // }
        }

        return this.add_error(ast_expression, 'Unknow AST expression type [' + (ast_expression? ast_expression.type : 'null expression') + ']' );
    }


    /**
     * Visit AST Binop expression.
     * 
     * @param ast_expression AST expression
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     * 
     * @returns IC Operand object
     */
    visit_binop_expression(ast_expression:any, ast_func_scope:FunctionScope, ic_function:ICFunction):ICOperand|ICError{
        const ast_lhs = ast_expression.lhs;
        // const ast_op  = ast_expression.operator.value;
        const ast_rhs = ast_expression.rhs;

        const ic_code   =  IC.FUNCTION_CALL;
        const ic_source = ICOperandSource.FROM_STACK
        const ic_type   = ast_expression.ic_type;
        const ic_op     = ast_expression.operator.ic_function;

        // CHECK TYPE
        if (! this.has_type(ast_expression.ic_type) ){
            return this.add_error(ast_expression, 'Type [' + ast_expression.ic_type + '] not found.')
        }

        const ic_left =this.visit_expression(ast_lhs, ast_func_scope, ic_function);
        const ic_right=this.visit_expression(ast_rhs, ast_func_scope, ic_function);

        // CHECK LEFT
        if (! this.has_type(ic_left.ic_type) ){
            return this.add_error(ic_left, 'Type [' + ic_left.ic_type + '] not found.')
        }
        if (this.test_if_error(ic_left)){
            return this.add_error(ast_lhs, 'Error in binop expression:left side is not a valid expression');
        }

        // CHECK RIGHT
        if (! this.has_type(ic_right.ic_type) ){
            return this.add_error(ic_right, 'Type [' + ic_right.ic_type + '] not found.')
        }
        if (this.test_if_error(ic_right)){
            return this.add_error(ast_rhs, 'Error in binop expression:right side is not a valid expression');
        }

        let ic_left_str:string = this.get_operand_source_str(ic_left);
        let ic_right_str:string = this.get_operand_source_str(ic_right);

        // ADD IC STATEMENT
        ic_function.statements.push({
            ic_type:ic_type,
            ic_code:ic_code,
            ic_function:ic_op,
            ic_operands:[ic_left, ic_right],
            text:ic_type + ':' + ic_code + ' ' + ic_op + ' ' + ic_left.ic_type + ':' + ic_left_str  + ' ' + ic_right.ic_type + ':' + ic_right_str
        });

        return {
            ic_type:ic_type,
            ic_source:ic_source,
            ic_name:undefined,
            ic_id_accessors:[],
            ic_id_accessors_str:''
        }
    }


    /**
     * Visit AST Preunop expression.
     * 
     * @param ast_expression AST expression
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     * 
     * @returns IC Operand object
     */
    visit_preunop_expression(ast_expression:any, ast_func_scope:FunctionScope, ic_function:ICFunction):ICOperand|ICError{
        const ast_rhs = ast_expression.rhs;

        const ic_code   =  IC.FUNCTION_CALL;
        const ic_source = ICOperandSource.FROM_STACK
        const ic_type   = ast_expression.ic_type;
        const ic_op     = ast_expression.ic_function;
        const ic_right  = this.visit_expression(ast_rhs, ast_func_scope, ic_function);

        // CHECK
        if (! this.has_type(ast_expression.ic_type) ){
            return this.add_error(ast_expression, 'Type [' + ast_expression.ic_type + '] not found.')
        }

        // CHECK RIGHT
        if (! this.has_type(ic_right.ic_type) ){
            return this.add_error(ic_right, 'Type [' + ic_right.ic_type + '] not found.')
        }
        if (this.test_if_error(ic_right)){
            return this.add_error(ast_rhs, 'Error in preunop expression:right side is not a valid expression');
        }

        let ic_right_str:string = this.get_operand_source_str(ic_right);

        // ADD IC STATEMENT
        ic_function.statements.push({
            ic_type:ic_type,
            ic_code:ic_code,
            ic_function:ic_op,
            ic_operands:[ic_right],
            text:ic_type + ':' + ic_code + ' ' + ic_op + ' ' + ic_right.ic_type + ':' + ic_right_str
        });

        return {
            ic_type:ic_type,
            ic_source:ic_source,
            ic_name:undefined,
            ic_id_accessors:[],
            ic_id_accessors_str:''
        }
    }


    /**
     * Visit AST Preunop expression.
     * 
     * @param ast_expression AST expression
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     * 
     * @returns IC Operand object
     */
    visit_postunop_expression(ast_expression:any, ast_func_scope:FunctionScope, ic_function:ICFunction):ICOperand|ICError{
        const ast_lhs = ast_expression.lhs;

        const ic_code   =  IC.FUNCTION_CALL;
        const ic_source = ICOperandSource.FROM_STACK
        const ic_type   = ast_expression.ic_type;
        const ic_op     = ast_expression.ic_function;
        const ic_left   = this.visit_expression(ast_lhs, ast_func_scope, ic_function);

        // CHECK TYPE
        if (! this.has_type(ast_expression.ic_type) ){
            return this.add_error(ast_expression, 'Type [' + ast_expression.ic_type + '] not found.')
        }

        // CHECK LEFT
        if (! this.has_type(ic_left.ic_type) ){
            return this.add_error(ic_left, 'Type [' + ic_left.ic_type + '] not found.')
        }
        if (this.test_if_error(ic_left)){
            return this.add_error(ast_lhs, 'Error in postunop expression:left side is not a valid expression');
        }
        
        let ic_left_str:string = this.get_operand_source_str(ic_left);

        // ADD IC STATEMENT
        ic_function.statements.push({
            ic_type:ic_type,
            ic_code:ic_code,
            ic_function:ic_op,
            ic_operands:[ic_left],
            text:ic_type + ':' + ic_code + ' ' + ic_op + ' ' + ic_left.ic_type + ':' + ic_left_str
        });

        return {
            ic_type:ic_type,
            ic_source:ic_source,
            ic_name:undefined,
            ic_id_accessors:[],
            ic_id_accessors_str:''
        }
    }


    /**
     * Visit value ID.
     * 
     * @param ast_id_expression AST ID expression
     * 
     * @returns ICOperand
     */
    visit_value_id(ast_expression:any, ast_func_scope:FunctionScope, ic_function:ICFunction):ICOperand|ICError{
        const id_value_type = this.get_symbol_type(ast_expression.name);

        // CHECK TYPE
        if (! this.has_type(id_value_type) ){
            return this.add_error(ast_expression, 'Type [' + id_value_type + '] not found.')
        }

        // VARIABLE
        if (ast_expression.members.length == 0){
            return {
                ic_type:id_value_type,
                ic_source:ICOperandSource.FROM_ID,
                ic_name:ast_expression.name,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            };
        }

        // LOOP ON ID ACCESSORS
        const accessors:ICIdAccessor[] = [];
        let loop_accessor:ICIdAccessor;
        let loop_index = 0;
        let loop_member = ast_expression.members[loop_index];
        let loop_previous_type:string = id_value_type;
        let id_str = '';
        while(loop_member){
            // METHOD DECLARATION
            if (loop_member.type == AST.EXPR_MEMBER_METHOD_DECL){
                loop_accessor={
                    id:loop_member.func_name,
                    ic_type:loop_member.ic_type,
                    operands_types:[], // TODO
                    operands_names:[], // TODO
                    operands_expressions:[],
                    is_attribute:false,
                    is_method_call:false,
                    is_method_decl:true,
                    is_indexed:false,
                    indexed_args_count:0
                }

                id_str = loop_previous_type + '.' + loop_member.func_name;
                accessors.push(loop_accessor);
            }

            // METHOD CALL
            if (loop_member.type == AST.EXPR_MEMBER_METHOD_CALL){
                loop_accessor={
                    id:loop_member.func_name,
                    ic_type:loop_member.ic_type,
                    operands_types:[], // TODO
                    operands_names:[],
                    operands_expressions:[], // TODO
                    is_attribute:false,
                    is_method_call:true,
                    is_method_decl:false,
                    is_indexed:false,
                    indexed_args_count:0
                }
                id_str = loop_previous_type + '.' + loop_member.func_name;
                accessors.push(loop_accessor);
            }

            // FUNCTION DECLARATION
            if (loop_member.type == AST.EXPR_MEMBER_FUNC_DECL){
                loop_accessor={
                    id:loop_member.func_name,
                    ic_type:loop_member.ic_type,
                    operands_types:[], // TODO
                    operands_names:[], // TODO
                    operands_expressions:[],
                    is_attribute:false,
                    is_method_call:true,
                    is_method_decl:false,
                    is_indexed:false,
                    indexed_args_count:0
                }
                id_str = loop_member.func_name;
                accessors.push(loop_accessor);
            }

            // FUNCTION CALL
            if (loop_member.type == AST.EXPR_MEMBER_FUNC_CALL){
                loop_accessor={
                    id:loop_member.func_name,
                    ic_type:loop_member.ic_type,
                    operands_types:[], // TODO
                    operands_names:[],
                    operands_expressions:[], // TODO
                    is_attribute:false,
                    is_method_call:true,
                    is_method_decl:false,
                    is_indexed:false,
                    indexed_args_count:0
                }
                id_str = loop_member.func_name;
                accessors.push(loop_accessor);
            }

            // ATTRIBUTE
            if (loop_member.type == AST.EXPR_MEMBER_ATTRIBUTE){
                loop_accessor={
                    id:loop_member.attribute_name,
                    ic_type:loop_member.ic_type,
                    operands_types:[],
                    operands_names:[],
                    operands_expressions:[],
                    is_attribute:true,
                    is_method_call:false,
                    is_method_decl:false,
                    is_indexed:false,
                    indexed_args_count:0
                }
                id_str += '#' + loop_member.attribute_name;
                accessors.push(loop_accessor);
            }

            // INDEXED
            if (loop_member.type == AST.EXPR_MEMBER_INDEXED){
                loop_accessor={
                    id:undefined,
                    ic_type:undefined,
                    operands_types:[],
                    operands_names:[],
                    operands_expressions:[],
                    is_attribute:false,
                    is_method_call:false,
                    is_method_decl:false,
                    is_indexed:true,
                    indexed_args_count:loop_member.expression.items.length
                }
                id_str += '[' + loop_member.expression.items.length + ']';
                accessors.push(loop_accessor);
            }

            loop_previous_type = loop_member.ic_type;
            loop_index++;
            loop_member = ast_expression.members.length > loop_index ? ast_expression.members[loop_index] : undefined;
        }

        return {
            ic_type:ast_expression.ic_type,
            ic_source:ICOperandSource.FROM_ID,
            ic_name:ast_expression.name,
            ic_id_accessors:accessors,
            ic_id_accessors_str:id_str
        };
    }
}