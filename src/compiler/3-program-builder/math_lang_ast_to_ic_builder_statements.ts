import IType from '../../core/itype';

import AST from '../2-ast-builder/math_lang_ast';

import { FunctionScope } from './math_lang_function_scope';
import TYPES from './math_lang_types';
import MathLangAstToIcVisitorBase from './math_lang_ast_to_ic_builder_base';
import {IC, ICError, ICFunction, ICIdAccessor, ICInstruction, ICOperand, ICOperandSource} from './math_lang_ast_to_ic_builder_base';




/**
 * Typed AST Visitor class for statements. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default abstract class MathLangAstToIcVisitorStatement extends MathLangAstToIcVisitorBase{

    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(ast_functions:Map<string,FunctionScope>, types_map:Map<string,IType>) {
        super(ast_functions, types_map);
    }


    abstract visit_expression(ast_expression:any, ast_func_scope:FunctionScope, ic_function:ICFunction):ICOperand|ICError;
    abstract visit_value_id(ast_expression:any, ast_func_scope:FunctionScope, ic_function:ICFunction):ICOperand|ICError;


    /**
     * Visit the AST entry point.
     */
    visit() {
        const main_scope:FunctionScope = this._ast_functions.get('main');

        this.visit_function(main_scope);
    }


    /**
     * Visit given function.
     * 
     * @param ast_func_scope function scope
     */
    visit_function(ast_func_scope:FunctionScope) {
        // CHECK RETURN TYPE
        if (ast_func_scope.func_name != 'main'){
            if (! this.has_type(ast_func_scope.return_type) ){
                return this.add_error(ast_func_scope, 'Type [' + ast_func_scope.return_type + '] not found.')
            }
        }
    
        // LOOP ON FUNCTION OPERANDS
        let opds_records = <any>[ast_func_scope.func_name];
        let opds_records_str = ast_func_scope.func_name;
    
        let loop_opd_nane;
        let loop_opd_record;
        for(loop_opd_nane of ast_func_scope.symbols_opds_ordered_list){
            loop_opd_record = ast_func_scope.symbols_opds_table.get(loop_opd_nane);
    
            opds_records.push({
                name:loop_opd_record.name,
                ic_type:loop_opd_record.ic_type
            });
            opds_records_str += ' ' + loop_opd_record.ic_type + ':' + loop_opd_record.name;
        }

        // REGISTER IC FUNCTION
        const ic_statements:ICInstruction[] = [];
        this.declare_function(ast_func_scope.func_name, ast_func_scope.return_type, opds_records, opds_records_str, ic_statements);
        const ic_function = this._ic_functions.get(ast_func_scope.func_name);
        if (! ic_function){
            this.add_error(ast_func_scope, 'Error:function registration error [' + ast_func_scope.func_name + ']');
            return;
        }

        // LOOP ON FUNCTION STATEMENTS
        const ast_statements = ast_func_scope.statements;
        let loop_ast_statement;
        for(loop_ast_statement of ast_statements){
            this.visit_statement(loop_ast_statement, ast_func_scope, ic_function);
        }

        this.leave_function_declaration(ast_func_scope.func_name);
    }


    /**
     * Visit AST statement.
     * 
     * @param ast_statement AST statement to convert
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    visit_statement(ast_statement:any, ast_func_scope:FunctionScope, ic_function:ICFunction) {
         switch(ast_statement.type){
            case AST.BLOCK:{
                // LOOP ON FUNCTION STATEMENTS
                let loop_ast_statement;
                for(loop_ast_statement of ast_statement.statements){
                    this.visit_statement(loop_ast_statement, ast_func_scope, ic_function);
                }
                return;
            }
            case AST.STAT_ASSIGN_VARIABLE:{
                this.visit_assign_variable_statement(ast_statement, ast_func_scope, ic_function);
                return;
            }
            case AST.STAT_ASSIGN_FUNCTION:{
                this.visit_assign_function_or_method_statement(ast_statement, ast_func_scope, ic_function);
                return;
            }
            case AST.STAT_ASSIGN_ATTRIBUTE:{
                this.visit_assign_attribute_statement(ast_statement, ast_func_scope, ic_function);
                return;
            }
            case AST.STAT_ASSIGN_METHOD:{
                this.visit_assign_function_or_method_statement(ast_statement, ast_func_scope, ic_function);
                return;
            }
            // case AST.STAT_FOR:{
            //     this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
            //     return;
            // }
            // case AST.STAT_IF:{
            //     this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
            //     return;
            // }
            // case AST.STAT_LOOP:{
            //     this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
            //     return;
            // }
            // case AST.STAT_RETURN:{
            //     this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
            //     return;
            // }
            // case AST.STAT_WHILE:{
            //     this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
            //     return;
            // }
        }
    }


    /**
     * Visit AST Assign statement.
     * 
     * @param ast_statement AST statement
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    visit_assign_variable_statement(ast_statement:any, ast_func_scope:FunctionScope, ic_function:ICFunction){
        // GET LEFT
        const ic_left = this.visit_value_id(ast_statement, ast_func_scope, ic_function);
        const ic_left_type = ast_statement.ic_type;

        // CHECK RETURN TYPE
        if (! this.has_type(ic_left_type) ){
            return this.add_error(ast_statement, 'Type [' + ic_left_type + '] not found.')
        }
        
        // CHECK LEFT EXPRESSION
        if (this.test_if_error(ic_left)){
            this.add_error(ast_statement, 'Error in assign statement:left side is not a valid id expression');
            return;
        }


        // GET RIGHT
        const ic_right = this.visit_expression(ast_statement.expression, ast_func_scope, ic_function);
        const ic_right_type = ast_statement.expression.ic_type;

        // CHECK RETURN TYPE
        if (! this.has_type(ic_right_type) ){
            return this.add_error(ast_statement.expression, 'Type [' + ic_right_type + '] not found.')
        }

        // CHECK RIGHT EXPRESSION
        if (this.test_if_error(ic_right)){
            this.add_error(ast_statement, 'Error in assign statement:right side is not a valid expression');
            return;
        }


        // BUILD IC
        let ic_right_str:string = this.get_operand_source_str(ic_right);
        
        const ic_opd_1 = ic_left_type  + ':@' + ic_left.ic_name + ic_left.ic_id_accessors_str;
        const ic_opd_2 = ic_right_type + ':' + ic_right_str;

        const ic_code = IC.REGISTER_SET;
        const right_statement = {
            ic_type:ic_left_type,
            ic_code:ic_code,
            operands:[ic_left, ic_right],
            text:ic_left_type + ':' + ic_code + ' ' + ic_opd_1 + ' ' + ic_opd_2
        };
        
        ic_function.statements.push(right_statement);
    }


    /**
     * Visit AST Assign statement.
     * 
     * @param ast_statement AST statement
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    visit_assign_attribute_statement(ast_statement:any, ast_func_scope:FunctionScope, ic_function:ICFunction){
        // GET LEFT
        const ic_left = this.visit_value_id(ast_statement, ast_func_scope, ic_function);
        const ic_left_type = ast_statement.ic_type;

        // CHECK RETURN TYPE
        if (! this.has_type(ic_left_type) ){
            return this.add_error(ast_statement, 'Type [' + ic_left_type + '] not found.')
        }
        
        // CHECK LEFT EXPRESSION
        if (this.test_if_error(ic_left)){
            this.add_error(ast_statement, 'Error in assign statement:left side is not a valid id expression');
            return;
        }


        // GET RIGHT
        const ic_right = this.visit_expression(ast_statement.expression, ast_func_scope, ic_function);
        const ic_right_type = ast_statement.expression.ic_type;

        // CHECK RETURN TYPE
        if (! this.has_type(ic_right_type) ){
            return this.add_error(ast_statement.expression, 'Type [' + ic_right_type + '] not found.')
        }

        // CHECK RIGHT EXPRESSION
        if (this.test_if_error(ic_right)){
            this.add_error(ast_statement, 'Error in assign statement:right side is not a valid expression');
            return;
        }


        // BUILD IC
        let ic_right_str:string = this.get_operand_source_str(ic_right);
        
        const ic_opd_1 = ic_left_type  + ':@' + ic_left.ic_name + ic_left.ic_id_accessors_str;
        const ic_opd_2 = ic_right_type + ':' + ic_right_str;

        const ic_code = IC.REGISTER_SET;
        const right_statement = {
            ic_type:ic_left_type,
            ic_code:ic_code,
            operands:[ic_left, ic_right],
            text:ic_left_type + ':' + ic_code + ' ' + ic_opd_1 + ' ' + ic_opd_2
        };
        
        ic_function.statements.push(right_statement);
    }


    /**
     * Visit AST Methor or Function Assign statement.
     * 
     * @param ast_statement AST statement
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    visit_assign_function_or_method_statement(ast_statement:any, ast_func_scope:FunctionScope, ic_function:ICFunction){
        // GET LEFT
        const ic_left = this.visit_value_id(ast_statement, ast_func_scope, ic_function);
        const ic_left_type = ast_statement.ic_type;

        // CHECK RETURN TYPE
        if (! this.has_type(ic_left_type) ){
            return this.add_error(ast_statement, 'Type [' + ic_left_type + '] not found.')
        }

        // CHECK LEFT EXPRESSION
        if (this.test_if_error(ic_left)){
            this.add_error(ast_statement, 'Error in assign statement:left side is not a valid id expression');
            return;
        }
        const assign_function_name = ic_left.ic_id_accessors_str;


        // LOOP ON FUNCTION OPERANDS
        let opds_records = <any>[];
        let opds_records_str = assign_function_name;
    
        let loop_opd_nane;
        let loop_opd_record;
        for(loop_opd_nane of ast_func_scope.symbols_opds_ordered_list){
            loop_opd_record = ast_func_scope.symbols_opds_table.get(loop_opd_nane);
    
            opds_records.push({
                name:loop_opd_record.name,
                ic_type:loop_opd_record.ic_type
            });
            opds_records_str += ' ' + loop_opd_record.ic_type + ':' + loop_opd_record.name;
        }

        // DECLARE METHOD
        this.declare_function(assign_function_name, ast_func_scope.return_type, opds_records, opds_records_str, []);
        const assign_function = this._ic_functions.get(assign_function_name);


        // GET RIGHT
        const ic_right = this.visit_expression(ast_statement.expression, ast_func_scope, assign_function);
        const ic_right_type = ast_statement.expression.ic_type;

        // CHECK RETURN TYPE
        if (! this.has_type(ic_right_type) ){
            return this.add_error(ast_statement.expression, 'Type [' + ic_right_type + '] not found.')
        }

        // CHECK RIGHT EXPRESSION
        if (this.test_if_error(ic_right)){
            this.add_error(ast_statement, 'Error in assign statement:right side is not a valid expression');
            return;
        }


        // BUILD IC STATEMENT
        let ic_right_str:string = this.get_operand_source_str(ic_right);
        
        const ic_opd_1 = ic_left_type  + ':@' + ic_left.ic_name + ic_left.ic_id_accessors_str;
        const ic_opd_2 = ic_right_type + ':' + ic_right_str;

        const ic_code = IC.FUNCTION_RETURN;
        const right_statement = {
            ic_type:ic_left_type,
            ic_code:ic_code,
            operands:[ic_left, ic_right],
            text:ic_left_type + ':' + ic_code +  ' ' + ic_opd_2
        };
        assign_function.statements.push(right_statement);


        // DECLARE METHOD
        this.leave_function_declaration(assign_function_name);
    }


    /**
     * Visit AST Assign left part.
     * 
     * @param ast_statement AST statement
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    // visit_assign_left(ast_statement:any, ast_func_scope:FunctionScope, ic_function:ICFunction):ICOperand|ICError{
    //     // GET LEFT
    //     const ic_left = this.visit_value_id(ast_statement, ast_func_scope, ic_function);
    //     const ic_left_type = ast_statement.ic_type;

    //     // CHECK RETURN TYPE
    //     if (! this.has_type(ic_left_type) ){
    //         return this.add_error(ast_statement, 'Type [' + ic_left_type + '] not found.')
    //     }

    //     // CHECK LEFT EXPRESSION
    //     if (this.test_if_error(ic_left)){
    //         this.add_error(ast_statement, 'Error in assign statement:left side is not a valid id expression');
    //         return;
    //     }

    //     return ic_left;
    // }


    /**
     * Visit AST Assign right part.
     * 
     * @param ast_statement AST statement
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    // visit_assign_right(ast_statement:any, ast_func_scope:FunctionScope, ic_function:ICFunction){
        // BUILD IC STATEMENT

        // return right_statement
    // }
}