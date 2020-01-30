
import { ICompilerIcEbb, ICompilerIcEbbOperand } from '../0-api/icompiler_ic_instruction';
import ICompilerScope from '../0-api/icompiler_scope';
import ICompilerModule from '../0-api/icompiler_module';
import ICompilerFunction, { SymbolsTable } from '../0-api/icompiler_function';
import MathLangIcToVmVisitorBase from './math_lang_ic_to_vm_builder_base';
import OPCODES from '../../vmachine/assemblyscript/assembly/runtime/opcodes';




/**
 * IC Visitor.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangIcToVmVisitor extends MathLangIcToVmVisitorBase {

    /**
     * Constructor.
     * 
     * @param engine_types        source.
     * @param instructions_size   VM program instructions size.
     * @param values_in_size      VM input values memory size.
     * @param values_out_size     VM output values memory size.
     */
    constructor(compiler_scope:ICompilerScope, instructions_size:number, values_in_size:number, values_out_size:number) {
        super(compiler_scope, instructions_size, values_in_size, values_out_size);
    }


    /**
     * Visit IC program.
     */
    visit():void{
        const new_modules:Map<string,ICompilerModule> = this.get_scope().get_new_modules();

        const ic_main_function = this._ic_functions.get(main_name);
        this.visit_function(ic_main_function);
    }


    /**
     * Visit IC Module.
     * 
     * @param ic_function IC function.
     */
    visit_module(new_module:ICompilerModule):void{
        const funcs:Map<string,ICompilerFunction> = new_module.get_exported_functions();

        funcs.forEach(
            (ic_function, func_name)=>{
                this.visit_function(ic_function);
            }
        );
    }


    /**
     * Visit IC function.
     * 
     * @param ic_function IC function.
     */
    visit_function(ic_function:ICompilerFunction):void{
        // REGISTER FUNCTION INDEX IN VM PROGRAM
        // TODO

        
        const locals_register_indices_map:Map<string,number> = new Map();

        // PROCESS EBB
        const ebbs_map:Map<string, ICompilerIcEbb> = ic_function.get_ic_ebb_map();
        const ebb_entry_name:string = 'ebb0';
        const ebb_entry:ICompilerIcEbb = ebbs_map.get(ebb_entry_name);
       this.visit_ebb(ebb_entry, locals_register_indices_map);
    }


    /**
     * 
     * @param value_type 
     * @param register_index 
     */
    visit_ebb(ebb:ICompilerIcEbb, locals_register_indices_map:Map<string,number>) {
        // PROCESS OPERANDS
        const operands:ICompilerIcEbbOperand[] = ebb.ic_operands;

        let loop_opd_symbol:ICompilerIcEbbOperand;
        let loop_opd_register_index:number

        for(loop_opd_symbol of operands){
            loop_opd_register_index = locals_register_indices_map.size;
            this.add_instruction_set_register_stack_value(loop_opd_symbol.opd_type.get_type_name(), loop_opd_register_index);
            locals_register_indices_map.set(loop_opd_symbol.opd_name, loop_opd_register_index);
        }

        // PROCESS INSTRUCTIONS
    }


    /**
     * Add instruction to set a register value from the stack.
     * 
     * @param value_type  value type name.
     * @param register_index value register index. 
     */
    add_instruction_set_register_stack_value(value_type:string, register_index:number):void {
        const op_code:number = OPCODES.REG_VALUE_SET;
        const type_code:number = this.get_type_code(value_type);
        const opd_1_code:number = register_index < OPCODES.LIMIT_OPD_INLINE ? register_index : OPCODES.LIMIT_OPD_INLINE;
        const opd_2_code:number = 0; // Unused
        this.add_instruction(op_code, type_code, opd_1_code, opd_2_code);
        if (opd_1_code == OPCODES.LIMIT_OPD_INLINE) {
            this.add_instruction_index(register_index);
        }
    }


    /**
     * Get type code from type name.
     * 
     * @param type_name
     * @returns type code
     */
    get_type_code(type_name:string):number {
        return 123; // TODO
    }


    /**
     * Add one instruction to program.
     * 
     * @param opcode (8 bits)
     * @param type_code (8 bits)
     * @param opd_1_code (8 bits)
     * @param opd_2_code (8 bits)
     */
    add_instruction(op_code:number, type_code:number, opd_1_code:number, opd_2_code:number):void {
        //
    }


    /**
     * Add one instruction to program.
     * 
     * @param index (32 bits)
     */
    add_instruction_index(index:number):void {
        //
    }
}