
import ICompilerError from '../../core/icompiler_error';
import ICompilerType from '../../core/icompiler_type';
import ICompilerScope from '../../core/icompiler_scope';
import { IAstNodeKindOf as AST } from '../../core/icompiler_ast_node';
import { ICompilerIcInstr, ICompilerIcInstrOperand } from '../../core/icompiler_ic_instruction';
import CompilerIcBuilder from '../0-common/compiler_ic_builder';
import MathLangAstToIcVisitorStatements from './math_lang_ast_to_ic_builder_statements';
import ICompilerFunction from '../../core/icompiler_function';



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
    visit_expression(ast_expression:any):ICompilerIcInstrOperand|ICompilerError{
        
        switch(ast_expression.ast_code){
            // ID EXPRESSION
            // case AST.EXPR_ID_OPTION_METHOD_DECL:return this.visit_method_declaration(ast_expression);
            // case AST.EXPR_ID_OPTION_METHOD_CALL:return this.visit_method_call(ast_expression);

            // case AST.EXPR_FUNCTION_DECL:        return this.visit_function_declaration(ast_expression);
            case AST.EXPR_FUNCTION_LOCAL:       return this.visit_function_local(ast_expression);
            case AST.EXPR_FUNCTION_CALL:        return this.visit_function_call(ast_expression);

            // case AST.EXPR_MODULE_CONSTANT:      return this.visit_module_constant(ast_expression);
            case AST.EXPR_MODULE_FUNCTION_CALL: return this.visit_function_call(ast_expression);

            // PARENTHESIS EXPRESSION
            case AST.EXPR_PARENTHESIS:          return this.visit_expression(ast_expression.expression);

            // PRIMARY VALUE
            case AST.EXPR_PRIMARY_INTEGER:      return CompilerIcBuilder.create_const_integer(ast_expression.value);
            case AST.EXPR_PRIMARY_BIGINTEGER:   return CompilerIcBuilder.create_const_biginteger(ast_expression.value);
            case AST.EXPR_PRIMARY_FLOAT:        return CompilerIcBuilder.create_const_float(ast_expression.value);
            case AST.EXPR_PRIMARY_BIGFLOAT:     return CompilerIcBuilder.create_const_bigfloat(ast_expression.value);
            case AST.EXPR_PRIMARY_STRING:       return CompilerIcBuilder.create_const_string(ast_expression.value);
            case AST.EXPR_PRIMARY_FALSE:        return CompilerIcBuilder.create_const_false();
            case AST.EXPR_PRIMARY_NULL:         return CompilerIcBuilder.create_const_null();
            case AST.EXPR_PRIMARY_TRUE:         return CompilerIcBuilder.create_const_true();

            // BINARY OPERATOR EXPRESSION
            case AST.EXPR_BINOP_ADDSUB:         return this.visit_binop_expression(ast_expression);
            case AST.EXPR_BINOP_COMPARE:        return this.visit_binop_expression(ast_expression);
            case AST.EXPR_BINOP_MULTDIV:        return this.visit_binop_expression(ast_expression);

            // UNARY OPERATOR EXPRESSION
            case AST.EXPR_UNOP_POST:            return this.visit_postunop_expression(ast_expression);
            case AST.EXPR_UNOP_PREUNOP:         return this.visit_preunop_expression(ast_expression);
        }

        return this.add_error(ast_expression, 'Unknow AST expression type [' + (ast_expression? ast_expression.ast_code : 'null expression') + ']' );
    }


    /**
     * Visit AST Binop expression.
     * 
     * @param ast_expression AST expression
     * 
     * @returns IC Operand object
     */
    visit_binop_expression(ast_expression:any):ICompilerIcInstrOperand|ICompilerError{
        const ast_lhs = ast_expression.lhs;
        const ast_rhs = ast_expression.rhs;

        const ic_type   = ast_expression.ic_type;
        const ic_op     = ast_expression.operator.ic_function;

        // CHECK TYPE
        if (! ast_expression.ic_type){
            return this.add_error(ast_expression, 'Type [' + ast_expression.ic_type + '] not found.')
        }

        const ic_left =this.visit_expression(ast_lhs);
        const ic_right=this.visit_expression(ast_rhs);

        // CHECK LEFT
        if (this.is_error(ic_left)){
            return this.add_error(ast_lhs, 'Error in binop expression:left side is not a valid expression');
        }

        // CHECK RIGHT
        if (this.is_error(ic_right)){
            return this.add_error(ast_rhs, 'Error in binop expression:right side is not a valid expression');
        }

        // ADD IC FUNCTION CALL STATEMENT
        return this.create_ic_ebb_instruction(CompilerIcBuilder.create_function_call, [ic_op, ic_type, [ic_left, ic_right]]);
    }


    /**
     * Visit AST Preunop expression.
     * 
     * @param ast_expression AST expression
     * 
     * @returns IC Operand object
     */
    visit_preunop_expression(ast_expression:any):ICompilerIcInstrOperand|ICompilerError{
        const ast_rhs = ast_expression.rhs;

        const ic_type   = ast_expression.ic_type;
        const ic_op     = ast_expression.ic_function;
        const ic_right  = this.visit_expression(ast_rhs);

        // CHECK
        if (! this.has_type(ast_expression.ic_type) ){
            return this.add_error(ast_expression, 'Type [' + ast_expression.ic_type + '] not found.')
        }

        // CHECK RIGHT
        if (this.is_error(ic_right)){
            return this.add_error(ast_rhs, 'Error in preunop expression:right side is not a valid expression');
        }

        // ADD IC INSTRUCTION
        return this.create_ic_ebb_instruction(CompilerIcBuilder.create_function_call, [ic_op, ic_type, [ic_right]]);
    }


    /**
     * Visit AST Preunop expression.
     * 
     * @param ast_expression AST expression
     * 
     * @returns IC Operand object
     */
    visit_postunop_expression(ast_expression:any):ICompilerIcInstrOperand|ICompilerError{
        const ast_lhs = ast_expression.lhs;

        const ic_type   = ast_expression.ic_type;
        const ic_op     = ast_expression.ic_function;
        const ic_left   = this.visit_expression(ast_lhs);

        // CHECK TYPE
        if (! this.has_type(ast_expression.ic_type) ){
            return this.add_error(ast_expression, 'Type [' + ast_expression.ic_type + '] not found.')
        }

        // CHECK LEFT
        if (this.is_error(ic_left)){
            return this.add_error(ast_lhs, 'Error in postunop expression:left side is not a valid expression');
        }

        // ADD IC INSTRUCTION
        return this.create_ic_ebb_instruction(CompilerIcBuilder.create_function_call, [ic_op, ic_type, [ic_left]]);
    }


    /**
     * Visit function call. Example: f(123*2)
     * 
     * @param ast_expression AST ID expression
     * 
     * @returns ICompilerIcOperand
     */
    visit_function_call(ast_expression:any):ICompilerIcInstrOperand|ICompilerError{
        const module_name_or_alias:string = ast_expression.module_name;
        const function_type:ICompilerType = ast_expression.ic_type;
        const function_name:string = ast_expression.func_name;

        // CHECK IF MODULE EXISTS
        if ( ! this.get_compiler_scope().has_module(module_name_or_alias) ){
            return this.add_error(ast_expression, 'Module [' + module_name_or_alias + '] not found for function call [' + function_name + '].')
        }

        // PROCESS ALIAS (USE MODULE AS ...)
        const module = this.get_compiler_scope().get_module(module_name_or_alias);
        const module_name = module.get_module_name();

        // CHECK TYPE
        if (! function_type){
            return this.add_error(ast_expression, 'Type not found for function call [' + function_name + '] in module [' + module_name + '].')
        }

        // 
        const operands:ICompilerIcInstrOperand[]|ICompilerError = this.get_operands_expressions(ast_expression);
        if ( ! Array.isArray(operands) ){
            if ( this.is_error(operands) ){
                return operands;
            }
            return this.add_error(ast_expression, 'visit_value_id/no members/EXPR_MEMBER_FUNC_CALL:bad operands expressions conversion')
        }

        // ADD IC INSTRUCTION
        return this.create_ic_ebb_instruction(CompilerIcBuilder.create_function_call, [module_name + '@' + function_name, function_type, operands]);
    }


    /**
     * Visit function local: local variable or function operand
     * 
     * @param ast_expression AST ID expression
     * 
     * @returns ICompilerIcOperand
     */
    visit_function_local(ast_expression:any):ICompilerIcInstrOperand|ICompilerError{
        const local_type:ICompilerType = ast_expression.ic_type;
        const local_name:string = ast_expression.local_name;

        // CHECK TYPE
        if (! local_type){
            return this.add_error(ast_expression, 'Type not found for function local [' + local_name + '].');
        }

        // EXISTING FUNCTION VARIABLE
        const ebb_var_exists:boolean = this.get_current_ebb().ic_operands_map.has(local_name);
        if (ebb_var_exists){
            return this.get_current_ebb().ic_operands_map.get(local_name);
        }

        // FUNCTION OPERAND
        const ebb_opd_exists:boolean = this.get_current_function().has_symbol_operand(local_name);
        if (ebb_opd_exists){
            const ebb0 = this.get_current_function().get_ic_ebb('ebb0');
            return ebb0 ? ebb0.ic_operands_map.get(local_name) : undefined;
        }

        // GET LOCAL INSTRUCTION
        const var_name = this.get_current_function().add_ic_variable();
        const instr:ICompilerIcInstr = CompilerIcBuilder.create_local_var_get(var_name, local_name, local_type);
        this.add_ic_ebb_instruction(instr);
        return var_name;
    }


    /**
     * Visit module constant
     * 
     * @param ast_expression AST ID expression
     * 
     * @returns ICompilerIcOperand
     */
    visit_module_constant(ast_expression:any):ICompilerIcInstrOperand|ICompilerError{
        const module_name:string = ast_expression.module_name;
        const constant_name:string = ast_expression.constant_name;
        const constant_type:ICompilerType = ast_expression.ic_type;

        // CHECK TYPE
        if (! constant_type){
            return this.add_error(ast_expression, 'Type not found for module constant [' + module_name + '@' + constant_name + '].');
        }

        // GET MODULE CONSTANT INSTRUCTION
        // const var_name = this.get_current_function().add_ic_variable();
        // const instr:ICompilerIcInstr = CompilerIcBuilder.create_module_constant_get(var_name, local_name, local_type);
        // this.add_ic_ebb_instruction(instr);
        // return var_name;

        return this.add_error(ast_expression, 'Module constant not yet implemented for [' + module_name + '@' + constant_name + '].');
    }


    
    /**
     * Visit value ID.
     * 
     * @param ast_expression AST ID expression
     * 
     * @returns ICompilerIcOperand
     */
    visit_value_id(ast_expression:any):ICompilerIcInstrOperand|ICompilerError{
        let id_value_type:ICompilerType = ast_expression.ic_type ? ast_expression.ic_type : undefined;
        if (! id_value_type){
            id_value_type = this.get_functions_stack_symbol_type(ast_expression.name);
        } else if ( this.get_compiler_scope().has_exported_constant(ast_expression.name) ){
            id_value_type = this.get_compiler_scope().get_exported_constant(ast_expression.name).ast_code;
        } else if ( this.get_compiler_scope().has_exported_function(ast_expression.name) ){
            id_value_type = this.get_compiler_scope().get_exported_function(ast_expression.name).get_returned_type();
        }

        // CHECK TYPE
        if (! id_value_type){
            return this.add_error(ast_expression, 'Type [' + id_value_type + '] not found for var [' + ast_expression.name + '].')
        }
        // VAR ASSIGN
        if (ast_expression.members.length == 0 && ast_expression.ic_type != id_value_type){
            return this.add_error(ast_expression, 'Expression type [' + ast_expression.ic_type + '] is different of var [' + ast_expression.name + '] type [' + id_value_type + '].')
        }

        // VARIABLE ASSIGN or FUNCTION CALL OR FUNCTION ASSIGN
        if (ast_expression.members.length == 0){
            // Example: f(x:integer) = expression
            if (ast_expression.ast_code == AST.EXPR_FUNCTION_DECL){
                // ADD IC INSTRUCTION
                const opds_types = ast_expression.operands_types;
                const opds_names = ast_expression.operands_names;
                const ebb = CompilerIcBuilder.create_ebb(this.get_current_function(), opds_types, opds_names);
                this.get_current_function().add_ic_ebb(ebb, ast_expression.name);
                return ebb.ic_ebb_name;
            }

            // Example: f(123*2)
            if (ast_expression.ast_code == AST.EXPR_FUNCTION_CALL){
                const operands:ICompilerIcInstrOperand[]|ICompilerError = this.get_operands_expressions(ast_expression);
                if ( ! Array.isArray(operands) ){
                    if ( this.is_error(operands) ){
                        return operands;
                    }
                    return this.add_error(ast_expression, 'visit_value_id/no members/EXPR_MEMBER_FUNC_CALL:bad operands expressions conversion')
                }

                // ADD IC INSTRUCTION
                return this.create_ic_ebb_instruction(CompilerIcBuilder.create_function_call, [ast_expression.name, id_value_type, operands]);
            }

            // FUNCTION OPERAND
            const ebb_opd_exists:boolean = this.get_current_function().has_symbol_operand(ast_expression.name);
            if (ebb_opd_exists){
                const ebb0 = this.get_current_function().get_ic_ebb('ebb0');
                return ebb0 ? ebb0.ic_operands_map.get(ast_expression.name) : undefined;
            }

            // EXISTING FUNCTION VARIABLE
            const ebb_var_exists:boolean = this.get_current_ebb().ic_operands_map.has(ast_expression.name);
            if (ebb_var_exists){
                return this.get_current_ebb().ic_operands_map.get(ast_expression.name);
            }

            // NEW FUNCTION VARIABLE
            const ebb_var_name = this.get_current_function().add_ic_variable();
            this.get_current_ebb().ic_operands_map.set(ast_expression.name, ebb_var_name);
            return ebb_var_name;
        }

        // LOOP ON ID ACCESSORS
        let loop_index = 0;
        let loop_member = ast_expression.members[loop_index];
        let loop_previous_type:ICompilerType = id_value_type;
        let loop_previous_name:string = undefined;
        let loop_previous_ic_name:ICompilerIcInstrOperand = this.get_current_ebb().ic_operands_map.get(ast_expression.name);
        while(loop_member){
            // CHECK TYPE
            if (! this.has_type(loop_member.ic_type) ){
                return this.add_error(ast_expression, 'Type [' + loop_member.ic_type + '] not found.')
            }

            // METHOD DECLARATION
            if (loop_member.ast_code == AST.EXPR_ID_OPTION_METHOD_DECL){ // TODO
                // const operands_declarations:ICompilerIcOperand[]|ICompilerError = this.get_operands_declarations(loop_member);
                // if ( ! Array.isArray(operands_declarations) ){
                //     if ( this.is_error(operands_declarations) ){
                //         return operands_declarations;
                //     }
                //     return this.add_error(loop_member, 'visit_value_id/member[' + loop_index + ']/EXPR_MEMBER_METHOD_CALL:bad operands declarations conversion')
                // }

                // // ADD IC INSTRUCTION
                // const instr:ICompilerIcFunction = this.declare_method(loop_previous_type, loop_previous_name, loop_member.func_name, loop_member.ic_type, operands_declarations);
                // // accessors.push(instr);
                // this.get_current_function().add_ic_statement(instr);
                // this.create_ic_ebb_instruction(CompilerIcNode.create_function_call, [ic_op, ic_type, [ic_left]]);
            }

            // METHOD CALL
            if (loop_member.ast_code == AST.EXPR_ID_OPTION_METHOD_CALL){
                const operands_expressions:ICompilerIcInstrOperand[]|ICompilerError = this.get_operands_expressions(loop_member);
                if ( ! Array.isArray(operands_expressions) ){
                    if ( this.is_error(operands_expressions) ){
                        return operands_expressions;
                    }
                    return this.add_error(loop_member, 'visit_value_id/member[' + loop_index + ']/EXPR_MEMBER_METHOD_CALL:bad operands expressions conversion')
                }

                // ADD IC INSTRUCTION
                loop_previous_ic_name = this.create_ic_ebb_instruction(CompilerIcBuilder.create_function_call, [loop_member.func_name, loop_member.ic_type, operands_expressions]);
            }

            // ATTRIBUTE
            if (loop_member.ast_code == AST.EXPR_ID_OPTION_ATTRIBUTE){
                // ADD IC INSTRUCTION
                loop_previous_ic_name = this.create_ic_ebb_instruction(CompilerIcBuilder.create_operand_from_attribute, [loop_member.ic_type, loop_previous_ic_name, loop_member.attribute_name]);
            }

            // INDEXED
            if (loop_member.ast_code == AST.EXPR_ID_OPTION_INDICES){
                const ast_index_expression:any = { operands_expressions:loop_member.expression.items };
                const index_expressions:ICompilerIcInstrOperand[]|ICompilerError = this.get_operands_expressions(ast_index_expression);
                if ( ! Array.isArray(index_expressions) ){
                    if ( this.is_error(index_expressions) ){
                        return index_expressions;
                    }
                    return this.add_error(loop_member, 'visit_value_id/member[' + loop_index + ']/EXPR_MEMBER_METHOD_CALL:bad operands expressions conversion')
                }

                // ADD IC INSTRUCTION
                loop_previous_ic_name = this.create_ic_ebb_instruction(CompilerIcBuilder.create_operand_from_array_index, [loop_member.ic_type, loop_previous_ic_name, index_expressions]);
            }

            loop_previous_type = loop_member.ic_type;
            loop_previous_name = loop_member.id;
            loop_index++;
            loop_member = ast_expression.members.length > loop_index ? ast_expression.members[loop_index] : undefined;
        }

        return loop_previous_ic_name;
    }
}