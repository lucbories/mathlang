import IType from '../../core/itype';

import AST from '../2-ast-builder/math_lang_ast';

import { FunctionScope, ModuleScope } from './math_lang_function_scope';
import TYPES from '../math_lang_types';
import IC from './math_lang_ic';
import { ICError, ICFunction, ICIdAccessor, ICInstruction, ICOperand, ICOperandSource} from './math_lang_ast_to_ic_builder_base';
import MathLangAstToIcVisitorStatements from './math_lang_ast_to_ic_builder_statements';



/**
 * Typed AST Visitor class for expressions. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangAstToIcVisitorExpressions extends MathLangAstToIcVisitorStatements {

    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(ast_modules:Map<string,ModuleScope>, types_map:Map<string,IType>) {
        super(ast_modules, types_map);
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
            // ID EXPRESSION
            case AST.EXPR_MEMBER_METHOD_DECL:
            case AST.EXPR_MEMBER_METHOD_CALL:
            case AST.EXPR_MEMBER_FUNC_DECL:
            case AST.EXPR_MEMBER_FUNC_CALL:
            case AST.EXPR_MEMBER_ID:{
                return this.visit_value_id(ast_expression, ast_func_scope, ic_function);
            }


            // PARENTHESIS EXPRESSION
            case AST.EXPR_PARENTHESIS:{
                return this.visit_expression(ast_expression.expression, ast_func_scope, ic_function);
            }


            // PRIMARY VALUE
            case AST.EXPR_PRIMARY_INTEGER: return {
                ic_type:TYPES.INTEGER,
                ic_source:ICOperandSource.FROM_INLINE,
                ic_name:ast_expression.value,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            }
            case AST.EXPR_PRIMARY_BIGINTEGER: return {
                ic_type:TYPES.BIGINTEGER,
                ic_source:ICOperandSource.FROM_INLINE,
                ic_name:ast_expression.value,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            }
            case AST.EXPR_PRIMARY_FLOAT: return {
                ic_type:TYPES.FLOAT,
                ic_source:ICOperandSource.FROM_INLINE,
                ic_name:ast_expression.value,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            }
            case AST.EXPR_PRIMARY_BIGFLOAT: return {
                ic_type:TYPES.BIGFLOAT,
                ic_source:ICOperandSource.FROM_INLINE,
                ic_name:ast_expression.value,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            }
            case AST.EXPR_PRIMARY_STRING: return {
                ic_type:TYPES.STRING,
                ic_source:ICOperandSource.FROM_INLINE,
                ic_name:ast_expression.value,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            }


            // BINARY OPERATOR EXPRESSION
            case AST.EXPR_BINOP_ADDSUB:{
                return this.visit_binop_expression(ast_expression, ast_func_scope, ic_function);
            }
            case AST.EXPR_BINOP_COMPARE:{
                return this.visit_binop_expression(ast_expression, ast_func_scope, ic_function);
            }
            case AST.EXPR_BINOP_MULTDIV:{
                return this.visit_binop_expression(ast_expression, ast_func_scope, ic_function);
            }


            // UNARY OPERATOR EXPRESSION
            case AST.EXPR_UNOP_PRE_FALSE:{
                return this.get_false_operand();
            }
            case AST.EXPR_UNOP_PRE_NULL:{
                return this.get_null_operand();
            }
            case AST.EXPR_UNOP_PRE_TRUE:{
                return this.get_true_operand();
            }
            case AST.EXPR_UNOP_POST:{
                return this.visit_postunop_expression(ast_expression, ast_func_scope, ic_function);
            }
            case AST.EXPR_UNOP_PREUNOP:{
                return this.visit_preunop_expression(ast_expression, ast_func_scope, ic_function);
            }
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

        const ic_code   = IC.FUNCTION_CALL;
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

        // ADD IC OPERANDS STATEMENTS

        // ADD IC FUNCTION CALL STATEMENT
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
        const ic_source = ICOperandSource.FROM_STACK;
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
        const id_value_type = ast_expression.ic_type ? ast_expression.ic_type : this.get_symbol_type(ast_func_scope.module_name, ast_expression.name);

        // CHECK TYPE
        if (! this.has_type(id_value_type) ){
            return this.add_error(ast_expression, 'Type [' + id_value_type + '] not found for var [' + ast_expression.name + '].')
        }
        if (! this.has_type(ast_expression.ic_type) ){
            return this.add_error(ast_expression, 'Type [' + ast_expression.ic_type + '] not found for var  [' + ast_expression.name + '].')
        }
        // VAR ASSIGN
        if (ast_expression.members.length == 0 && ast_expression.ic_type != id_value_type){
            return this.add_error(ast_expression, 'Expression type [' + ast_expression.ic_type + '] is different of var [' + ast_expression.name + '] type [' + id_value_type + '].')
        }

        let ic_name_prefix = '';

        // VARIABLE
        if (ast_expression.members.length == 0){
            ic_name_prefix = ic_function.func_name + '/';

            if (ast_expression.type == AST.EXPR_MEMBER_FUNC_DECL){
                ic_name_prefix = '';
                const accessor:ICIdAccessor = {
                    id:ast_expression.name,
                    ic_type:ast_expression.ic_type,
                    operands_types:ast_expression.operands_types,
                    operands_names:ast_expression.operands_names,
                    operands_expressions:[],
                    is_attribute:false,
                    is_method_call:false,
                    is_method_decl:false,
                    is_indexed:false,
                    indexed_args_count:0
                };

                return {
                    ic_type:id_value_type,
                    ic_source:ICOperandSource.FROM_ID,
                    ic_name:ic_name_prefix + ast_expression.name,
                    ic_id_accessors:[accessor],
                    ic_id_accessors_str:''
                };
            }

            if (ast_expression.type == AST.EXPR_MEMBER_FUNC_CALL){
                ic_name_prefix = '';

                // ADD IC FUNCTION CALL STATEMENT
                const ic_type = ast_expression.ic_type;
                const ic_call = {
                    ic_type:ic_type,
                    ic_code:IC.FUNCTION_CALL,
                    ic_function:ast_expression.name,
                    ic_operands:<any>[],
                    text:ic_type + ':' + IC.FUNCTION_CALL + ' ' + ast_expression.name + ' ' + 'OPERANDS_COUNT' + '=[' + ast_expression.operands_expressions.length  + ']'
                };

                // PROCESS OPERANDS
                const opds_count = ast_expression.operands_expressions.length;
                let loop_opd_index;
                let loop_ic_opd;
                let loop_ast_opd;
                for(loop_opd_index=0; loop_opd_index < opds_count; loop_opd_index++){
                    loop_ast_opd = ast_expression.operands_expressions[loop_opd_index];
                    loop_ic_opd = this.visit_expression(loop_ast_opd, ast_func_scope, ic_function);
                    ic_call.ic_operands.push(loop_ic_opd);
                }

                ic_function.statements.push(ic_call);

                return {
                    ic_type:ic_type,
                    ic_source:ICOperandSource.FROM_STACK,
                    ic_name:undefined,
                    ic_id_accessors:[],
                    ic_id_accessors_str:''
                };
            }

            return {
                ic_type:id_value_type,
                ic_source:ICOperandSource.FROM_ID,
                ic_name:ic_name_prefix + ast_expression.name,
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
            // CHECK TYPE
            if (! this.has_type(loop_member.ic_type) ){
                return this.add_error(ast_expression, 'Type [' + loop_member.ic_type + '] not found.')
            }

            // METHOD DECLARATION
            if (loop_member.type == AST.EXPR_MEMBER_METHOD_DECL){
                ic_name_prefix = ic_function.func_name + '/';
                loop_accessor={
                    id:loop_member.func_name,
                    ic_type:loop_member.ic_type,
                    operands_types:loop_member.operands_types,
                    operands_names:loop_member.operands_names,
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
                ic_name_prefix = ic_function.func_name + '/';
                loop_accessor={
                    id:loop_member.func_name,
                    ic_type:loop_member.ic_type,
                    operands_types:loop_member.operands_types,
                    operands_names:[],
                    operands_expressions:loop_member.operands_expressions,
                    is_attribute:false,
                    is_method_call:true,
                    is_method_decl:false,
                    is_indexed:false,
                    indexed_args_count:0
                }
                id_str = loop_previous_type + '.' + loop_member.func_name;
                accessors.push(loop_accessor);
            }

            // ATTRIBUTE
            if (loop_member.type == AST.EXPR_MEMBER_ATTRIBUTE){
                ic_name_prefix = ic_function.func_name + '/';
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
                ic_name_prefix = ic_function.func_name + '/';
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
            ic_name:ic_name_prefix + ast_expression.name,
            ic_id_accessors:accessors,
            ic_id_accessors_str:id_str
        };
    }
}