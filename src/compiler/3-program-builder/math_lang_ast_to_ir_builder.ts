import AST from '../2-ast-builder/math_lang_ast';
import { SymbolDeclarationRecord, FunctionScope } from './math_lang_function_scope';
import TYPES from './math_lang_types';



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


export enum ICOperandSource {
    FROM_STACK       = 'FROM_STACK',
    FROM_REGISTER    = 'FROM_REGISTER',
    FROM_ID          = 'FROM_ID',
    FROM_INLINE      = 'FROM_INLINE'
}

export type ICIdAccessor = {
    id:string,
    is_attribute:boolean,
    is_method:boolean,
    is_box_args:boolean,
    box_args_count:number
};

export interface ICOperand {
    ic_type:string,
    ic_source:ICOperandSource,
    ic_name:string,
    ic_id_accessors:ICIdAccessor[],
    ic_id_accessors_str:string
};


export interface ICError {
    ic_type:string,
    ic_source:ICOperandSource,
    ic_name:string,
    ic_index:number,
    ast_node:any,
    message:string
};

export type ICInstruction = {
    ic_type:string,
    ic_code:string,
    operands:ICOperand[],
    text:string
};



/**
 * Test if a variable type is an ICError.
 * @param toBeDetermined variable to test type
 */
function test_if_error(var_to_test: ICOperand|ICError): var_to_test is ICError {
    if((var_to_test as ICError).message){
      return true
    }
    return false
}



/**
 * Typed AST Visitor class. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangAstToIrVisitor {
    protected _ic_functions:Map<string,ICFunction> = new Map();
    private _errors:ICError[] = [];


    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(protected _ast_functions:Map<string,FunctionScope>) {
    }


    /**
     * Get IC build functions.
     * 
     * @returns Map<string,ICFunction>.
     */
    get_ic_functions_map(){
        return this._ic_functions;
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
        let ic_statements:ICInstruction[] = [];

        const ic_function = {
            func_name:ast_func_scope.func_name,
            return_type:ast_func_scope.return_type,
            statements:ic_statements
        };
    
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
    
    
        // ADD FUNCTION IC DECLARATION
        ic_function.statements.push({
            ic_type:ast_func_scope.return_type,
            ic_code:IC.FUNCTION_DECLARE_ENTER,
            operands:opds_records,
            text:ast_func_scope.return_type + ':' + IC.FUNCTION_DECLARE_ENTER + ' ' + opds_records_str
        });
    
    
        // LOOP ON FUNCTION STATEMENTS
        let loop_ast_statement;
        for(loop_ast_statement of ast_statements){
            this.visit_statement(loop_ast_statement, ast_func_scope, ic_function);
        }

        // LEAVE FUNCTON
        ic_function.statements.push({
            ic_type:ast_func_scope.return_type,
            ic_code:IC.FUNCTION_DECLARE_LEAVE,
            operands:[],
            text:ast_func_scope.return_type + ':' + IC.FUNCTION_DECLARE_LEAVE + ' ' + ast_func_scope.func_name
        });

        this._ic_functions.set(ic_function.func_name, ic_function);
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
            case AST.STAT_ASSIGN:{
                this.visit_assign_statement(ast_statement, ast_func_scope, ic_function);
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
    visit_assign_statement(ast_statement:any, ast_func_scope:FunctionScope, ic_function:ICFunction){
        const ic_code = IC.REGISTER_SET;
        
        // GET LEFT
        const ic_left = this.visit_value_id(ast_statement, ast_func_scope, ic_function);
        const ic_left_type = ast_statement.ic_type;
       if (test_if_error(ic_left)){
           this.add_error(ast_statement, 'Error in assign statement:left side is not a valid id expression');
           return;
       }

        // GET RIGHT
        const ic_right = this.visit_expression(ast_statement.expression, ast_func_scope, ic_function);
        const ic_right_type = ast_statement.expression.ic_type;
        if (test_if_error(ic_right)){
            this.add_error(ast_statement, 'Error in assign statement:right side is not a valid expression');
            return;
        }

        let ic_right_str:string = this.get_operand_source_str(ic_right);
        
        const ic_opd_1 = ic_left_type  + ':@' + ic_left.ic_name + ic_left.ic_id_accessors_str;
        const ic_opd_2 = ic_right_type + ':' + ic_right_str;

        // ADD IC STATEMENT
        ic_function.statements.push({
            ic_type:ic_left_type,
            ic_code:ic_code,
            operands:[ic_left, ic_right],
            text:ic_left_type + ':' + ic_code + ' ' + ic_opd_1 + ' ' + ic_opd_2
        });
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
     * Visit value ID.
     * 
     * @param ast_id_expression AST ID expression
     * 
     * @returns ICOperand
     */
    visit_value_id(ast_expression:any, ast_func_scope:FunctionScope, ic_function:ICFunction):ICOperand|ICError{
        if (ast_expression.members == undefined){
            return {
                ic_type:ast_expression.ic_type,
                ic_source:ICOperandSource.FROM_ID,
                ic_name:ast_expression.name,
                ic_id_accessors:[],
                ic_id_accessors_str:''
            };
        }

        // LOOP ON ID OPTIONS
        const accessors:ICIdAccessor[] = [];
        let loop_accessor:ICIdAccessor;
        let loop_member = ast_expression.members;
        let id_str = '';
        while(loop_member){
            // METHOD
            if (loop_member.type == AST.EXPR_MEMBER_DOT){
                loop_accessor={
                    id:loop_member.identifier,
                    is_attribute:false,
                    is_method:true,
                    is_box_args:false,
                    box_args_count:0
                }
                id_str += '.' + loop_member.identifier;
                accessors.push(loop_accessor);
            }

            // ATTRIBUTE
            if (loop_member.type == AST.EXPR_MEMBER_DASH){
                loop_accessor={
                    id:loop_member.identifier,
                    is_attribute:false,
                    is_method:true,
                    is_box_args:false,
                    box_args_count:0
                }
                id_str += '#' + loop_member.identifier;
                accessors.push(loop_accessor);
            }

            // BOX OF ARGS
            if (loop_member.type == AST.EXPR_MEMBER_BOX){
                loop_accessor={
                    id:undefined,
                    is_attribute:false,
                    is_method:false,
                    is_box_args:true,
                    box_args_count:loop_member.expression.items.length
                }
                id_str += '[' + loop_member.expression.items.length + ']';
                accessors.push(loop_accessor);
            }

            loop_member = loop_member.members ? loop_member.members : undefined;
        }

        return {
            ic_type:ast_expression.ic_type,
            ic_source:ICOperandSource.FROM_ID,
            ic_name:ast_expression.name,
            ic_id_accessors:accessors,
            ic_id_accessors_str:id_str
        };
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

        const ic_left =this.visit_expression(ast_lhs, ast_func_scope, ic_function);
        const ic_right=this.visit_expression(ast_rhs, ast_func_scope, ic_function);
        if (test_if_error(ic_left)){
            return this.add_error(ast_lhs, 'Error in binop expression:left side is not a valid expression');
        }
        if (test_if_error(ic_right)){
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
        if (test_if_error(ic_right)){
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
        if (test_if_error(ic_left)){
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


    get_operand_source_str(ic_operand:ICOperand){
        let ic_str:string = 'UNKNOW';

        switch(ic_operand.ic_source){
            case ICOperandSource.FROM_ID:       ic_str='@' + ic_operand.ic_name;       break;
            case ICOperandSource.FROM_INLINE:   ic_str='[' + ic_operand.ic_name + ']'; break;
            case ICOperandSource.FROM_STACK:    ic_str=ICOperandSource.FROM_STACK;     break;
            case ICOperandSource.FROM_REGISTER: ic_str=ICOperandSource.FROM_REGISTER;  break;
        }

        return ic_str;
    }


    /**
     * Get IC function name for given operator.
     * 
     * @param ast_operator AST operator name.
     * 
     * @returns IC function name.
     */
    // get_op_function_name(ast_operator:string):string{
    //     return ast_operator.ic_function;
    // }


    /**
     * Get IC builder errors.
     * 
     * @returns ICOperand array.
     */
    get_errors():ICError[]{
        return this._errors;
    }


    /**
     * Test if builder has an error.
     * 
     * @returns boolean.
     */
    has_error(){
        return this._errors.length > 0;
    }

    /**
     * Register an error.
     * 
     * @returns Error ICOperand node.
     */
    add_error(ast_expression:any, message?:string):ICError{
        const error:ICError = {
            ic_type:TYPES.ERROR,
            ic_source:undefined,
            ic_name:undefined,
            ic_index:undefined,
            ast_node:ast_expression,
            message:message
        }
        this._errors.push(error);
        return error;
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