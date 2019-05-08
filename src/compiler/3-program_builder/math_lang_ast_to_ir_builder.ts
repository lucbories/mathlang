import AST from '../2-ast-builder/math_lang_ast';
import { SymbolDeclarationRecord, FunctionScope } from '../3-program_builder/math_lang_function_scope';



enum IC {
    FUNCTION_DECLARE_ENTER      ='function-declare-enter',
    FUNCTION_DECLARE_LEAVE      ='function-declare-leave',
    FUNCTION_CALL               ='function-call',
    FUNCTION_RETURN             ='function-return',

    REGISTER_GET                ='register-get',
    REGISTER_SET                ='register-set',

    STACK_PUSH                  ='stack-push',
    STACK_PUSH_FROM_REGISTER    ='stack-push-from-register',
    STACK_POP                   ='stack-pop',
    STACK_POP_TO_REGISTER       ='stack-pop-to-register',

    MESSAGE_SEND                ='message-send',
    MESSAGE_RECEIVE             ='message-receive'
}


export type ICFunction = {
    func_name:string,
    return_type:string,
    statements:any[]
};



/**
 * Typed AST Visitor class. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangAstToIrVisitor {
    protected _ic_functions:Map<string,ICFunction> = new Map();


    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(protected _ast_functions:Map<string,FunctionScope>) {
    }

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
        const ast_statements = ast_func_scope.statements;
        let ic_statements = <any>[];
    
        // LOOP ON FUNCTION OPERANDS
        let opds_records = <any>[];
        let opds_records_str = '';
    
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
    
    
        // ADD FUNCTION IC DECLARATION
        ic_statements.push({
            ic_type:ast_func_scope.return_type,
            ic_code:IC.FUNCTION_DECLARE_ENTER,
            func_name:ast_func_scope.func_name,
            operands:opds_records,
            text:ast_func_scope.return_type + ':' + IC.FUNCTION_DECLARE_ENTER + ' ' + ast_func_scope.func_name + opds_records_str
        });
    
    
        // LOOP ON FUNCTION STATEMENTS
        let loop_ast_statement;
        for(loop_ast_statement of ast_statements){
            ic_statements = this.visit_statement(ic_statements, loop_ast_statement, ast_func_scope);
        }
    
        const ic_function = {
            func_name:ast_func_scope.func_name,
            return_type:ast_func_scope.return_type,
            statements:ic_statements
        };

        this._ic_functions.set(ic_function.func_name, ic_function);
    }


    /**
     * Visit AST statement.
     * 
     * @param ast_statement AST statement to convert
     * @param ast_func_scope AST functions scopes
     * @param ic_function IR functions statements array
     */
    visit_statement(ast_statement:any, ast_func_scope:FunctionScope, ic_function:ICFunction):any[] {
         switch(ast_statement.type){
            case AST.STAT_ASSIGN:{
                this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
                return;
            }
            case AST.STAT_FOR:{
                this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
                return;
            }
            case AST.STAT_IF:{
                this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
                return;
            }
            case AST.STAT_LOOP:{
                this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
                return;
            }
            case AST.STAT_RETURN:{
                this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
                return;
            }
            case AST.STAT_WHILE:{
                this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
                return;
            }
        }
    }


    /**
     * Visit AST Assign statement.
     * 
     * @param ast_statement AST statement
     * @param ast_func_scope AST functions scopes
     * @param ic_function IR functions statements array
     */
    visit_assign_statement(ast_statement:any, ast_func_scope:FunctionScope, ic_function:ICFunction){
        const ic_code = IC.REGISTER_SET;
        let ic_opd_1;
        let ic_opd_2;
        ic_code ;
        
        // GET LEFT
        const ic_left = this.visit_value_id(ast_statement.lhs);
        const ic_left_type = ast_statement.lhs.ic_type;

        // GET RIGHT
        const ic_right = this.visit_expression(ast_statement.rhs, ast_func_scope, ic_function);
        const ic_right_type = ast_statement.rhs.ic_type;

        // CHECK TYPES
        if (ic_left_type != ic_right_type){
            // TODO ERROR
        }

        // ADD IC STATEMENT
        ic_function.statements.push({
            ic_type:ic_left_type,
            ic_code:ic_code,
            lhs:ic_left,
            rhs:ic_right,
            text:ic_left_type + ':' + ic_code + ' ' + ic_opd_1 + ' ' + ic_opd_2
        });
    }


    /**
     * Visit AST expression.
     * 
     * @param ast_expression AST expression
     * @param ast_func_scope AST functions scopes
     * @param ic_function IR functions statements array
     * 
     * @returns expression object
     */
    visit_expression(ast_expression:any, ast_func_scope:FunctionScope, ic_function:ICFunction){
        
        switch(ast_expression.type){
            case AST.EXPR_BINOP_ADDSUB:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_BINOP_COMPARE:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_BINOP_MULTDIV:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_UNOP_PRE_FALSE:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_UNOP_PRE_NULL:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_UNOP_PRE_TRUE:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_UNOP_POST:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_PARENTHESIS:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_PRIMARY_BIGFLOAT:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_PRIMARY_BIGINTEGER:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_PRIMARY_FLOAT:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_PRIMARY_INTEGER:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
            case AST.EXPR_PRIMARY_STRING:{
                this.visit__expression(ast_expression, ast_func_scope, ic_function);
                return;
            }
        }
        return {}
    }


    /**
     * Visit value ID.
     * 
     * @param ast_id_expression AST ID expression
     * 
     * @returns ID object
     */
    visit_value_id(ast_id_expression:any){
        return {
            value_id:'VALUE',
            value_accessors:{}
        }
    }
}

/*

IC Commands:
	type_name:function-declare-enter	id_func_name [type_name:opd_name]*
	type_name:function-declare-leave	id_func_name
	type_name:function-call				id_func_name [type_name:value|id_value_name|from_stack|from_registre(n)]*
	type_name:function-return			id_func_name type_name:value|id_value_name|from_stack|from_registre(n)
	
	type_name:register-get				id_value_name
	type_name:register-set				id_value_name type_name:value|id_value_name|from_stack|from_registre(n)
	
	none:stack-push						type_name:value
	none:stack-push-from-register		type_name:id_value_name
	type_name:stack-pop														// get and remove top stack value
	type_name:stack-pop-to-register		id_value_name
	
	type_name:id_op_name				[type_name:value|id_value_name|from_stack|from_registre(n)]x2	// Result pushed on stack

	none:message-send					id_sender id_subject [type_name:value|id_value_name|from_stack|from_registre(n)]*
	message-receive				id_sender id_subject id_func_name

avec id_op_name=add,sub,mul,div,concat,length....

*/