import IValue from './ivalue';
import IInstruction from './iinstruction';


export default interface IProgram {
    has_error():boolean;
    get_error_message():string;
    get_error_cursor():number;

    // Stack
    push_value(value:IValue):void;
    pop_value(): IValue;
    pop_value_available():boolean;
    pop_values(count:number):IValue[];


    // Registers
    unregister_value(index:number):void;
    register_value(index:number, value:IValue):void;
    push_register_value(index:number):void;


    // Values
    free_value(value:IValue):void;


    // Instructions
    set_instruction(index:number, instruction:IInstruction, label?:string):void;
    add_instruction(instruction:IInstruction, label?:string):void;
    free_instruction(instruction:IInstruction):void;
    get_entry_point() : number;
    set_cursor(index:number):void;
    get_cursor():number;
    move_cursor(index:number):void;
    get_cursor_instruction(): IInstruction;


    // Run
    start():void;
    stop():void;
    is_running():boolean;
}