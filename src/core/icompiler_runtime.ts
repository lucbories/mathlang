
import ICompilerType from './icompiler_type';
import ICompilerFunction from './icompiler_function';


export default interface ICompilerRuntime {
    get_type_name():string;

	// METHODS
    has_method_with_types_names(method_name:string, operands:string[]):boolean;
    has_method(method_name:string, operands:ICompilerType[]):boolean;
	
    get_method_with_types_names(method_name:string, operands:string[]):ICompilerFunction
    get_method(method_name:string, operands:ICompilerType[]):ICompilerFunction;
	
    add_method(method:ICompilerFunction):void
	
	// INSTRUCTIONS
	declare_function()
	enter_function_declaration()
	leave_function_declaration()
	
	// INSTRUCTIONS
	function_return()
	function_call()
	set_memory_value()
	get_memory_value()
	message_send(msg:string, data_memory_position:integer, data_memory_type:ICompilerType);
	message_receive(function_name:string);
	goto_
	if_then
}