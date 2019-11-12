
import { IAstNodeKindOf as AST } from '../../core/icompiler_ast_node';
import ICompilerError from '../../core/icompiler_error';
import ICompilerType from '../../core/icompiler_type';
import ICompilerScope from '../../core/icompiler_scope';
import ICompilerSymbol from '../../core/icompiler_symbol';
import ICompilerFunction from '../../core/icompiler_function';
import { IIcNodeKindOf, ICompilerIcIdAccessor, ICompilerIcOperand, ICompilerIcOtherOperand, ICompilerIcOperandSource,
    ICompilerIcFunction, ICompilerIcInstruction,
    ICompilerIcFunctionEnter, ICompilerIcFunctionLeave, ICompilerIcConstant } from '../../core/icompiler_ic_node';
import ICompilerIcNode from '../../core/icompiler_ic_node';

import CompilerIcNode from '../0-common/compiler_ic_node';
import CompilerType from '../0-common/compiler_type';

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
    constructor(compiler_scope:ICompilerScope) {
        super(compiler_scope);
    }


    /**
     * Visit AST expression.
     * 
     * @param ast_expression AST expression
     * 
     * @returns IC Operand object
     */
    visit_expression(ast_expression:any):ICompilerIcOperand|ICompilerError{
        
        switch(ast_expression.type){
            // ID EXPRESSION
            case AST.EXPR_MEMBER_METHOD_DECL:
            case AST.EXPR_MEMBER_METHOD_CALL:
            case AST.EXPR_MEMBER_FUNC_DECL:
            case AST.EXPR_MEMBER_FUNC_CALL:
            case AST.EXPR_MEMBER_ID:            return this.visit_value_id(ast_expression);

            // PARENTHESIS EXPRESSION
            case AST.EXPR_PARENTHESIS:          return this.visit_expression(ast_expression.expression);

            // PRIMARY VALUE
            case AST.EXPR_PRIMARY_INTEGER:      return CompilerIcNode.create_const_integer(this.get_compiler_scope(), ast_expression.value);
            case AST.EXPR_PRIMARY_BIGINTEGER:   return CompilerIcNode.create_const_biginteger(this.get_compiler_scope(), ast_expression.value);
            case AST.EXPR_PRIMARY_FLOAT:        return CompilerIcNode.create_const_float(this.get_compiler_scope(), ast_expression.value);
            case AST.EXPR_PRIMARY_BIGFLOAT:     return CompilerIcNode.create_const_bigfloat(this.get_compiler_scope(), ast_expression.value);
            case AST.EXPR_PRIMARY_STRING:       return CompilerIcNode.create_const_string(this.get_compiler_scope(), ast_expression.value);

            // BINARY OPERATOR EXPRESSION
            case AST.EXPR_BINOP_ADDSUB:         return this.visit_binop_expression(ast_expression);
            case AST.EXPR_BINOP_COMPARE:        return this.visit_binop_expression(ast_expression);
            case AST.EXPR_BINOP_MULTDIV:        return this.visit_binop_expression(ast_expression);

            // UNARY OPERATOR EXPRESSION
            case AST.EXPR_UNOP_PRE_FALSE:       return CompilerIcNode.create_const_false(this.get_compiler_scope());
            case AST.EXPR_UNOP_PRE_NULL:        return CompilerIcNode.create_const_null(this.get_compiler_scope());
            case AST.EXPR_UNOP_PRE_TRUE:        return CompilerIcNode.create_const_true(this.get_compiler_scope());
            case AST.EXPR_UNOP_POST:            return this.visit_postunop_expression(ast_expression);
            case AST.EXPR_UNOP_PREUNOP:         return this.visit_preunop_expression(ast_expression);
        }

        return this.add_error(ast_expression, 'Unknow AST expression type [' + (ast_expression? ast_expression.type : 'null expression') + ']' );
    }


    /**
     * Visit AST Binop expression.
     * 
     * @param ast_expression AST expression
     * 
     * @returns IC Operand object
     */
    visit_binop_expression(ast_expression:any):ICompilerIcOperand|ICompilerError{
        const ast_lhs = ast_expression.lhs;
        const ast_rhs = ast_expression.rhs;

        const ic_type   = ast_expression.ic_type;
        const ic_op     = ast_expression.operator.ic_function;

        // CHECK TYPE
        if (! this.has_type(ast_expression.ic_type) ){
            return this.add_error(ast_expression, 'Type [' + ast_expression.ic_type + '] not found.')
        }

        const ic_left =this.visit_expression(ast_lhs);
        const ic_right=this.visit_expression(ast_rhs);

        // CHECK LEFT
        if (! ic_left.ic_type){
            return this.add_error(ic_left, 'Type [' + ic_left.ic_type + '] not found.')
        }
        if (this.test_if_error(ic_left)){
            return this.add_error(ast_lhs, 'Error in binop expression:left side is not a valid expression');
        }

        // CHECK RIGHT
        if (! ic_right.ic_type){
            return this.add_error(ic_right, 'Type [' + ic_right.ic_type + '] not found.')
        }
        if (this.test_if_error(ic_right)){
            return this.add_error(ast_rhs, 'Error in binop expression:right side is not a valid expression');
        }

        // ADD IC FUNCTION CALL STATEMENT
        const instr = CompilerIcNode.create_function_call(ic_op, ic_type, [ic_left, ic_right]);
        this.get_current_function()().add_ic_statement(instr);

        return CompilerIcNode.create_operand_from_stack(this.get_compiler_scope(), ic_type);
    }


    /**
     * Visit AST Preunop expression.
     * 
     * @param ast_expression AST expression
     * 
     * @returns IC Operand object
     */
    visit_preunop_expression(ast_expression:any):ICompilerIcOperand|ICompilerError{
        const ast_rhs = ast_expression.rhs;

        const ic_type   = ast_expression.ic_type;
        const ic_op     = ast_expression.ic_function;
        const ic_right  = this.visit_expression(ast_rhs);

        // CHECK
        if (! this.has_type(ast_expression.ic_type) ){
            return this.add_error(ast_expression, 'Type [' + ast_expression.ic_type + '] not found.')
        }

        // CHECK RIGHT
        if (! ic_right.ic_type){
            return this.add_error(ic_right, 'Type [' + ic_right.ic_type + '] not found.')
        }
        if (this.test_if_error(ic_right)){
            return this.add_error(ast_rhs, 'Error in preunop expression:right side is not a valid expression');
        }

        // ADD IC STATEMENT
        const instr = CompilerIcNode.create_function_call(ic_op, ic_type, [ic_right]);
        this.get_current_function()().add_ic_statement(instr);

        return CompilerIcNode.create_operand_from_stack(this.get_compiler_scope(), ic_type);
    }


    /**
     * Visit AST Preunop expression.
     * 
     * @param ast_expression AST expression
     * 
     * @returns IC Operand object
     */
    visit_postunop_expression(ast_expression:any):ICompilerIcOperand|ICompilerError{
        const ast_lhs = ast_expression.lhs;

        const ic_type   = ast_expression.ic_type;
        const ic_op     = ast_expression.ic_function;
        const ic_left   = this.visit_expression(ast_lhs);

        // CHECK TYPE
        if (! this.has_type(ast_expression.ic_type) ){
            return this.add_error(ast_expression, 'Type [' + ast_expression.ic_type + '] not found.')
        }

        // CHECK LEFT
        if (! ic_left.ic_type){
            return this.add_error(ic_left, 'Type [' + ic_left.ic_type + '] not found.')
        }
        if (this.test_if_error(ic_left)){
            return this.add_error(ast_lhs, 'Error in postunop expression:left side is not a valid expression');
        }

        // ADD IC STATEMENT
        const instr = CompilerIcNode.create_function_call(ic_op, ic_type, [ic_left]);
        this.get_current_function()().add_ic_statement(instr);

        return CompilerIcNode.create_operand_from_stack(this.get_compiler_scope(), ic_type);
    }


    /**
     * Visit value ID.
     * 
     * @param ast_expression AST ID expression
     * 
     * @returns ICompilerIcOperand
     */
    visit_value_id(ast_expression:any):ICompilerIcOperand|ICompilerIcOtherOperand|ICompilerError{
        let id_value_type:ICompilerType = ast_expression.ic_type ? ast_expression.ic_type : undefined;
        if (! id_value_type){
            id_value_type = this.get_functions_stack_symbol_type(ast_expression.name);
        } else if ( this.get_compiler_scope().has_exported_constant(ast_expression.name) ){
            id_value_type = this.get_compiler_scope().get_exported_constant(ast_expression.name).type;
        } else if ( this.get_compiler_scope().has_exported_function(ast_expression.name) ){
            id_value_type = this.get_compiler_scope().get_exported_function(ast_expression.name).get_returned_type();
        }

        // CHECK TYPE
        if (! id_value_type){
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
            ic_name_prefix = this.get_current_function()().get_func_name() + '/';

            if (ast_expression.type == AST.EXPR_MEMBER_FUNC_DECL){
				// GET FUNCTION DECLARATION OPERANDS
				let opds_records:ICompilerIcOperand[] = [];
				let loop_opd_index = 0;
				let loop_opd_type:string;
				let loop_opd_name:string;
				const opds_count = ast_expression.operands_types.length;
				for(loop_opd_index = 0; loop_opd_index < opds_count; loop_opd_index++){
					loop_opd_type = ast_expression.operands_types[loop_opd_index];
					loop_opd_name = ast_expression.operands_names[loop_opd_index];
					opds_records[loop_opd_index] = CompilerIcNode.create_(this.get_compiler_scope(), loop_opd_name, loop_opd_type);
				}
				
				return this.declare_function(ast_expression.name, id_value_type, opds_records);
            }

            if (ast_expression.type == AST.EXPR_MEMBER_FUNC_CALL){
                // PROCESS OPERANDS
				let ic_operands:ICompilerIcOperand[] = [];
                const opds_count = ast_expression.operands_expressions.length;
                let loop_opd_index;
                let loop_ic_opd;
                let loop_ast_opd;
                for(loop_opd_index=0; loop_opd_index < opds_count; loop_opd_index++){
                    loop_ast_opd = ast_expression.operands_expressions[loop_opd_index];
                    loop_ic_opd = this.visit_expression(loop_ast_opd);
                    ic_operands.push(loop_ic_opd);
                }

				const ic_call = CompilerIcNode.create_function_call(ast_expression.name, ast_expression.ic_type, ic_operands);
                this.get_current_function().add_ic_statement(ic_call);

				return CompilerIcNode.create_()
                return {
                    ic_type:ic_type,
                    ic_source:ICompilerIcOperandSource.FROM_STACK,
                    ic_name:undefined,
                    ic_id_accessors:[],
                    ic_id_accessors_str:''
                };
            }

            return {
                ic_type:id_value_type,
                ic_source:ICompilerIcOperandSource.FROM_ID,
                ic_name:ic_name_prefix + ast_expression.name,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            };
        }

        // LOOP ON ID ACCESSORS
        const accessors:ICompilerIcIdAccessor[] = [];
        let loop_accessor:ICompilerIcIdAccessor;
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
                ic_name_prefix = this.get_current_function().func_name + '/';
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
                ic_name_prefix = this.get_current_function().func_name + '/';
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
                ic_name_prefix = this.get_current_function().get_func_name() + '/';
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
                ic_name_prefix = this.get_current_function().get_func_name() + '/';
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
            ic_source:ICompilerIcOperandSource.FROM_ID,
            ic_name:ic_name_prefix + ast_expression.name,
            ic_id_accessors:accessors,
            ic_id_accessors_str:id_str
        };
    }
}