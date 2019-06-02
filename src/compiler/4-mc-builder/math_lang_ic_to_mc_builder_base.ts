import IType from '../../core/itype';
import IProgram from '../../core/iprogram';
import VMProgram from '../../engine/vm/vmprogram';
import TYPES from '../math_lang_types';
import IC from '../3-ic-builder/math_lang_ic';
import {ICLabel, ICFunction} from '../3-ic-builder/math_lang_ast_to_ic_builder_base';
import {IProgramOptions} from '../../engine/vm/vmprogramoptions';



export interface MCError {
    mc_type:string,
    mc_name:string,
    mc_index:number,
    ic_statement:any,
    message:string
};




/**
 * Typed AST Visitor base class. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default abstract class MathLangIcToMcVisitorBase {
    private _errors:MCError[] = [];

    protected _mc_program_options:IProgramOptions;
    protected _mc_program:IProgram;


    /**
     * Constructor, nothing to do.
     * 
     * @param _ast_functions AST functions scopes
     */
    constructor(program_name:string, program_options:IProgramOptions, protected _ic_functions:Map<string,ICFunction>, protected _ic_functions_labels:Map<string,ICLabel[]>) {
        this._mc_program_options = program_options ? program_options : {
            registers:20, // registers count
            stack:50, // stack max size
            instructions:100, // instructions max size
            entry_label:'main' // program entry point label
        };

        this._mc_program = new VMProgram(program_name, this._mc_program_options);
    }


    /**
     * Visit IC program.
     */
    abstract visit():any;


    /**
     * Get MC Program.
     * 
     * @returns MC Program.
     */
    get_mc_program():IProgram{
        return this._mc_program;
    }


    /**
     * Get IC builder errors.
     * 
     * @returns MCError array.
     */
    get_errors():MCError[]{
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
    // add_error(ast_expression:any, message?:string):ICError{
    //     const error:ICError = {
    //         ic_type:TYPES.ERROR,
    //         ic_source:undefined,
    //         ic_name:undefined,
    //         ic_index:undefined,
    //         ast_node:ast_expression,
    //         message:message
    //     }
    //     this._errors.push(error);
    //     return error;
    // }


    // declare_function(func_name:string, return_type:string, opds_records:[], opds_records_str:string, ic_statements:ICInstruction[]){
    //     const ic_function = {
    //         func_name:func_name,
    //         return_type:return_type,
    //         statements:ic_statements
    //     };

    //     // ADD FUNCTION IC DECLARATION
    //     ic_function.statements.push({
    //         ic_type:return_type,
    //         ic_code:IC.FUNCTION_DECLARE_ENTER,
    //         operands:opds_records,
    //         text:return_type + ':' + IC.FUNCTION_DECLARE_ENTER + ' ' + opds_records_str
    //     });

    //     this._ic_functions.set(ic_function.func_name, ic_function);
    // }

    // set_function_declaration_statements(func_name:string, instructions:any[]){
    //     const func_scope = this._ic_functions.get(func_name);
    //     func_scope.statements = instructions;
    // }

    // leave_function_declaration(func_name:string){
    //     const ic_function = this._ic_functions.get(func_name);

    //     // LEAVE FUNCTON
    //     ic_function.statements.push({
    //         ic_type:ic_function.return_type,
    //         ic_code:IC.FUNCTION_DECLARE_ENTER,
    //         operands:[],
    //         text:ic_function.return_type + ':' + IC.FUNCTION_DECLARE_LEAVE + ' ' + func_name
    //     });
    // }
}