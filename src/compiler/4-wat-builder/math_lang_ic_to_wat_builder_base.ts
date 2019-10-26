import IType from '../../core/itype';
import IValue from '../../core/ivalue';
import IProgram from '../../core/iprogram';
import VMProgram from '../../engine/vm/vmprogram';
import TYPES from '../math_lang_types';
// import IC from '../3-ic-builder/math_lang_ic';
import {ICLabel, ICFunction, ICOperand} from '../3-ic-builder/math_lang_ast_to_ic_builder_base';
import {IProgramOptions} from '../../engine/vm/vmprogramoptions';



export type MCError = {
    mc_type:string,
    mc_name:string,
    mc_index:number,
    ic_statement:any,
    message:string
};


export type MCFunction = {
    func_name:string,
    cursor_begin:number,
    cursor_end:number,
    labels:Map<string,number>
};



/**
 * Typed AST Visitor base class. Converts Typed AST to IC code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default abstract class MathLangIcToWatVisitorBase {
    private _errors:MCError[] = [];

    protected _mc_program_options:IProgramOptions;
    protected _mc_program:IProgram;

    protected _functions:Map<string, MCFunction> = new Map();
    protected _symbols_registers:Map<string, number> = new Map();


    /**
     * Constructor, nothing to do.
     * 
     * @param _engine_types        VM engine types map.
     * @param _ast_functions AST functions scopes
     */
    constructor(protected _engine_types:Map<string,IType>, program_name:string, program_options:IProgramOptions, protected _ic_functions:Map<string,ICFunction>, protected _ic_functions_labels:Map<string,ICLabel[]>) {
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
     * Get symbol register.
     * 
     * @param symbol_full_name symbol full name.
     * 
     * @returns number.
     */
    get_symbol_register(symbol_full_name:string, ic_statement:any):number{
        const register_index = this._symbols_registers.get(symbol_full_name);

        if (register_index == undefined || register_index < 0) {
            return -1;
        }

        return register_index;
    }


    /**
     * Set symbol register.
     * 
     * @param symbol_full_name symbol full name.
     * 
     * @returns number.
     */
    set_symbol_register_value(symbol_full_name:string, ic_statement:any){
        let register_index = this._symbols_registers.get(symbol_full_name);

        if (register_index == undefined || register_index < 0) {
            register_index = this.new_symbol_register(symbol_full_name, ic_statement);
        }
        if (register_index == undefined || register_index < 0) {
            this.symbol_register_not_found_error(symbol_full_name, ic_statement);
            return -1;
        }

        return register_index;
    }


    /**
     * New symbol register.
     * 
     * @param symbol_full_name symbol full name.
     * 
     * @returns number.
     */
    new_symbol_register(symbol_full_name:string, ic_statement:any):number{
        if (this._symbols_registers.size == this._mc_program_options.registers){
            this.too_less_registers_error(symbol_full_name, this._mc_program_options.registers, ic_statement)
            return -1;
        }
        return this._symbols_registers.get(symbol_full_name);
    }


    get_operand_inline_value(opd:ICOperand):IValue {
        const vmtype = this._engine_types.get(opd.ic_type);
        if (! vmtype){
            return undefined;
        }

        const vmvalue = vmtype.from_string(opd.ic_name);
        return vmvalue;
    }


    /**
     * Register an error.
     * 
     * @returns Error ICOperand node.
     */
    add_error(mc_type:string, mc_name:string, mc_index:number, ic_statement:any, message?:string):MCError{
        const error:MCError = {
            mc_type:mc_type,
            mc_name:mc_name,
            mc_index:mc_index,
            ic_statement:ic_statement,
            message:message
        };
        this._errors.push(error);
        return error;
    }


    /**
     * Symbolregister not found error.
     */
    symbol_register_not_found_error(symbol_full_name:string, ic_statement:any){
        this.add_error('', symbol_full_name, 0, ic_statement, 'Symbol register not found');
    }


    /**
     * Too less registers error.
     */
    too_less_registers_error(symbol_full_name:string, regiters_size:number, ic_statement:any){
        this.add_error('', symbol_full_name, regiters_size, ic_statement, 'Too less registers');
    }


    /**
     * The name of the left operand is undefined.
     */
    left_operand_name_is_undefined_error(ic_statement:any){
        this.add_error('', '', 0, ic_statement, 'Left operand name is undefined.');
    }


    /**
     * The name of the right operand is undefined.
     */
    right_operand_name_is_undefined_error(ic_statement:any){
        this.add_error('', '', 0, ic_statement, 'Right operand name is undefined.');
    }

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