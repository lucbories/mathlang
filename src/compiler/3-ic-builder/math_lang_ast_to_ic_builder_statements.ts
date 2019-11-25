
import ICompilerError from '../../core/icompiler_error';
import ICompilerType from '../../core/icompiler_type';
import ICompilerScope from '../../core/icompiler_scope';
import ICompilerModule from '../../core/icompiler_module';
import ICompilerFunction from '../../core/icompiler_function';
import { IAstNodeKindOf as AST } from '../../core/icompiler_ast_node';
import { ICompilerIcInstr, ICompilerIcInstrOperand } from '../../core/icompiler_ic_instruction';
import CompilerIcNode from '../0-common/compiler_ic_instruction'
import MathLangAstToIcVisitorBase from './math_lang_ast_to_ic_builder_base';



/**
 * Typed AST Visitor class for statements. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default abstract class MathLangAstToIcVisitorStatements extends MathLangAstToIcVisitorBase{

    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(compiler_scope:ICompilerScope) {
        super(compiler_scope);
    }


    /**
     * Visit the AST entry point.
     */
    visit() {
        const new_modules:Map<string,ICompilerModule> = this.get_compiler_scope().get_new_modules();
        new_modules.forEach(
            (loop_module, loop_module_name)=>{
                // PROCESS MODULE CONSTANTS
                const modules_constants = loop_module.get_module_constants(); // TODO
                
                // PROCESS MODULE FUNCTIONS
                const modules_functions = loop_module.get_module_functions();
                modules_functions.forEach(
                    (loop_function, loop_function_name)=>{
                        this.visit_function(loop_function);
                    }
                )
            }
        )
    }


    /**
     * Visit given function.
     * 
     * @param ast_func_scope function scope
     */
    visit_function(func:ICompilerFunction) {
        this.enter_function_declaration(func.get_func_name());

        this.get_current_function().set_ic_heap_size(0);
        this.get_current_function().set_ic_register_count(0);
        this.get_current_function().set_ic_stack_length(10);

        const operands_map = func.get_symbols_opds_table();
        const operands_names:string[] = func.get_symbols_opds_ordered_list();
        const operands_types:ICompilerType[] = operands_names.map( (name)=>operands_map.get(name).type );
        const ebb = CompilerIcNode.create_ebb(this.get_current_function(), operands_types, operands_names);

        // LOOP ON FUNCTION STATEMENTS
        const ast_statements = func.get_ast_statements();
        let loop_ast_statement;
        for(loop_ast_statement of ast_statements){
            this.visit_statement(loop_ast_statement);
        }

        this.leave_function_declaration(func.get_func_name());
    }


    /**
     * Visit AST statements.
     * 
     * @param ast_statements AST statements array
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    visit_statements(ast_statements:any[]) {
        ast_statements.forEach(
            (ast_statement)=>this.visit_statement(ast_statement)
        );
    }


    /**
     * Visit AST statement.
     * 
     * @param ast_statement AST statement to convert
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    visit_statement(ast_statement:any) {
         switch(ast_statement.type){
            case AST.BLOCK:{
                // LOOP ON FUNCTION STATEMENTS
                let loop_ast_statement;
                for(loop_ast_statement of ast_statement.statements){
                    this.visit_statement(loop_ast_statement);
                }
                return;
            }

            case AST.STAT_ASSIGN_VARIABLE:{
                this.visit_assign_variable_statement(ast_statement);
                return;
            }
            case AST.STAT_ASSIGN_FUNCTION:{
                this.visit_assign_function_or_method_statement(ast_statement);
                return;
            }
            case AST.STAT_ASSIGN_ATTRIBUTE:{
                this.visit_assign_attribute_statement(ast_statement);
                return;
            }
            case AST.STAT_ASSIGN_METHOD:{
                this.visit_assign_function_or_method_statement(ast_statement);
                return;
            }

            case AST.STAT_RETURN:{
                this.visit_return_statement(ast_statement);
                return;
            }

            case AST.STAT_IF:{
                this.visit_if_statement(ast_statement);
                return;
            }
            case AST.STAT_SWITCH:{
                this.visit_switch_statement(ast_statement);
                return;
            }

            // case AST.STAT_FOR:{
            //     this.visit_for_statement(ast_statement);
            //     return;
            // }
            // case AST.STAT_LOOP:{
            //     this.visit_loop_statement(ast_statement);
            //     return;
            // }
            // case AST.STAT_WHILE:{
            //     this.visit_while_statement(ast_statement);
            //     return;
            // }
        }
    }


    /**
     * Visit AST Return statement.
     * 
     * @param ast_statement AST statement
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    visit_return_statement(ast_statement:any){
        const ast_expression = ast_statement.expression;
        const ic_var_name:ICompilerIcInstrOperand|ICompilerError = this.visit_expression(ast_expression);

        if (this.is_error(ic_var_name)){
            return this.add_error(ast_expression, 'Error in return expression:not a valid expression');
        }

        this.create_ic_ebb_instruction(CompilerIcNode.create_return, [ic_var_name]);
    }


    /**
     * Visit AST If statement.
     * 
     * @param ast_statement AST statement
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    visit_if_statement(ast_statement:any){
        // BUILD THEN LABEL
        const then_label = this.add_function_label(ic_function);
        const then_label_opd = {
            ic_type:TYPES.STRING,
            ic_source:ICOperandSource.FROM_INLINE,
            ic_name:then_label,
            ic_id_accessors:<any>[],
            ic_id_accessors_str:then_label
        };

        // BUILD ELSE LABEL
        const else_label = this.add_function_label(ic_function);
        const else_label_opd = {
            ic_type:TYPES.STRING,
            ic_source:ICOperandSource.FROM_INLINE,
            ic_name:else_label,
            ic_id_accessors:<any>[],
            ic_id_accessors_str:else_label
        };

        // BUILD END IF LABEL
        const endif_label = this.add_function_label(ic_function);
        const endif_label_opd = {
            ic_type:TYPES.STRING,
            ic_source:ICOperandSource.FROM_INLINE,
            ic_name:endif_label,
            ic_id_accessors:<any>[],
            ic_id_accessors_str:endif_label
        };

        // BUILD CONDITION IC OPERAND
        const ic_condition_opd = this.visit_expression(ast_statement.condition);
        if (this.test_if_error(ic_condition_opd)){
            return this.add_error(ast_statement.condition, 'Error in if condition:not a valid expression');
        }
        let ic_left_str:string = this.get_operand_source_str(ic_condition_opd);

        // BUILD TRUE IC OPERAND
        const ic_true_opd = this.get_true_operand();
        let ic_right_str:string = this.get_operand_source_str(ic_true_opd);

        // ADD TEST IC STATEMENT
        ic_function.statements.push({
            ic_type:TYPES.BOOLEAN,
            ic_code:IC.FUNCTION_CALL,
            ic_function:'equal',
            ic_operands:[ic_condition_opd, ic_true_opd],
            text:TYPES.BOOLEAN + ':' + IC.FUNCTION_CALL + ' ' + 'equal' + ' ' + ic_condition_opd.ic_type + ':' + ic_left_str  + ' ' + ic_true_opd.ic_type + ':' + ic_right_str
        });

        if (ast_statement.else){
            const ic_if_then_else_statement = {
                ic_type:TYPES.UNKNOW,
                ic_code:IC.IF_THEN_ELSE,
                operands:[then_label_opd, else_label_opd, endif_label_opd],
                text:TYPES.UNKNOW + ':' + IC.IF_THEN_ELSE + ' LABEL:[' + then_label + '] LABEL:[' + else_label + '] LABEL:[' + endif_label + ']'
            };
            ic_function.statements.push(ic_if_then_else_statement);
        }

        // ADD IF THEN IC STATEMENT
        else  {
            const ic_if_then_statement = {
                ic_type:TYPES.UNKNOW,
                ic_code:IC.IF_THEN,
                operands:[then_label_opd, endif_label_opd],
                text:TYPES.UNKNOW + ':' + IC.IF_THEN + ' LABEL:[' + then_label + '] LABEL:[' + endif_label + ']'
            };
            ic_function.statements.push(ic_if_then_statement);
        }
        const then_label_index = ic_function.statements.length;

        // ADD IF THEN IC STATEMENTS
        this.visit_statements(ast_statement.then);
        
        // ADD GOTO END IF IC STATEMENT
        const ic_if_then_goto_statement = {
            ic_type:TYPES.UNKNOW,
            ic_code:IC.GOTO,
            ic_label:endif_label,
            operands:<any>[],
            text:TYPES.UNKNOW + ':' + IC.GOTO + ' LABEL:[' + endif_label + ']'
        };
        ic_function.statements.push(ic_if_then_goto_statement);

        const else_label_index = ic_function.statements.length;
        
        // ADD ELSE IC STATEMENTS
        if (ast_statement.else) {
            // ADD ELSE IC STATEMENTS
            this.visit_statements(ast_statement.else);

            // ADD GOTO END IF IC STATEMENT
            const ic_if_then_goto_statement = {
                ic_type:TYPES.UNKNOW,
                ic_code:IC.GOTO,
                ic_label:endif_label,
                operands:<any>[],
                text:TYPES.UNKNOW + ':' + IC.GOTO + ' LABEL:[' + endif_label + ']'
            };
            ic_function.statements.push(ic_if_then_goto_statement);
        }
        
        const endif_label_index = ic_function.statements.length;

        this.update_function_label_index(then_label,  ic_function, then_label_index);
        this.update_function_label_index(else_label,  ic_function, else_label_index);
        this.update_function_label_index(endif_label, ic_function, endif_label_index);
    }


    /**
     * Visit AST Switch statement.
     * 
     * @param ast_statement AST statement
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    visit_switch_statement(ast_statement:any){
        // BUILD THEN LABEL
        const switch_var = ast_statement.var;
        const switch_var_type = this.get_symbol_type(ast_func_scope.module_name, switch_var);
        const switch_items = ast_statement.items;

        // CHECK TYPE
        if (! this.has_type(switch_var_type) ){
            return this.add_error(ast_statement, 'Type [' + switch_var_type + '] not found for var [' + switch_var + '].')
        }

        // EXIT SWITCH IC INSTRUCTION
        // const endswitch_label = this.add_function_label(ic_function);
        // let exit_switch_statement = {
        //     ic_type:TYPES.UNKNOW,
        //     ic_code:IC.GOTO,
        //     operands:<any>[],
        //     text:TYPES.UNKNOW + ':' + IC.GOTO + ' LABEL:[' + endswitch_label + ']'
        // };

        // LOOP ON ITEMS
        let all_endif_labels:string[] = [];
        let loop_item:any;
        let loop_item_expr;
        let loop_item_block;
        let loop_ast_if;
        let loop_ast_if_condition;
        let loop_last_index:number;
        let loop_endif_label:string;
        for(loop_item of switch_items){
            loop_item_expr = loop_item.item_expression;

            loop_item_block = loop_item.item_block;

            loop_ast_if_condition = {
                type: AST.EXPR_BINOP_COMPARE,
                ic_type: TYPES.BOOLEAN,
                lhs: {
                    type: AST.EXPR_MEMBER_ID,
                    ic_type: switch_var_type,
                    name: switch_var,
                    members:<any>[]
                },
                operator: {
                    type: AST.EXPR_BINOP,
                    value: '==',
                    ic_function: 'equal'
                },
                rhs: loop_item_expr
            };

            loop_ast_if = {
                type: AST.STAT_IF,
                condition:loop_ast_if_condition,
                then:loop_item_block,
                else:undefined
            };

            this.visit_if_statement(loop_ast_if);
            
            loop_last_index = ic_function.statements.length - 1;
            loop_endif_label = ic_function.statements[loop_last_index].ic_label;
            all_endif_labels.push(loop_endif_label);
        }

        const endswitch_index= ic_function.statements.length;
        for(loop_endif_label of all_endif_labels){
            this.update_function_label_index(loop_endif_label,  ic_function, endswitch_index);
        }
    }


    /**
     * Visit AST Assign statement.
     * 
     * @param ast_statement AST statement
     * @param ast_func_scope AST functions scopes
     * @param ic_function Intermediate Code function
     */
    visit_assign_variable_statement(ast_statement:any){
        // GET LEFT
        const ic_left = this.visit_value_id(ast_statement);
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
        const ic_right = this.visit_expression(ast_statement.expression);
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
    visit_assign_attribute_statement(ast_statement:any){
        // GET LEFT
        const ic_left = this.visit_value_id(ast_statement);
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
        const ic_right = this.visit_expression(ast_statement.expression);
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
    visit_assign_function_or_method_statement(ast_statement:any){
        // GET LEFT
        const ic_left = this.visit_value_id(ast_statement);
        const ic_left_type:ICompilerType = ast_statement.ic_type;

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
        this.declare_function(assign_function_name, ic_left_type, opds_records, []);
        const assign_function = this._ic_modules.get(ast_func_scope.module_name).module_functions.get(assign_function_name);


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
        this.leave_function_declaration(ast_func_scope.module_name, assign_function_name);
    }
}