
import ICompilerScope from '../0-api/icompiler_scope';
import Scope from '../../vmachine/assemblyscript/assembly/runtime/scope';
import { Value, Error } from '../../vmachine/assemblyscript/assembly/runtime/value';



/**
 * Typed IC Visitor base class. Converts IC to VM code.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default abstract class MathLangIcToVmVisitorBase {
    private _errors:Error[] = [];

    protected _scope:Scope;

    protected _vm_functions_map:Map<string,Uint8Array> = new Map();
    protected _vm_in_values_map:Map<string,Value> = new Map();

    // protected _functions:Map<string, MCFunction> = new Map();
    // protected _symbols_registers:Map<string, number> = new Map();


    /**
     * Constructor, nothing to do.
     * 
     * @param _engine_types        VM engine types map.
     * @param _ast_functions AST functions scopes
     */
    constructor(private _compiler_scope:ICompilerScope, instructions_size:number, values_in_size:number, values_out_size:number) {
        this._scope = new Scope(new Uint8Array(instructions_size), new ArrayBuffer(values_in_size), new ArrayBuffer(values_out_size));
    }


    /**
     * Visit IC program.
     */
    abstract visit():void;


    /**
     * Get MC Program.
     * 
     * @returns MC Program.
     */
    get_scope():Scope{
        return this._scope;
    }


    /**
     * Get IC builder errors.
     * 
     * @returns MCError array.
     */
    get_errors():Error[]{
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
}