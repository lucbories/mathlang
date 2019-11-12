
import ICompilerType from './icompiler_type';



export enum IIcNodeKindOf {
    CONSTANT_TRUE            ='constant-true',
    CONSTANT_FALSE           ='constant-false',
    CONSTANT_NULL            ='constant-null',
    CONSTANT_VALUE           ='constant-value',
    
    OPERAND_FROM_STACK          ='operand-from-stack',
    OPERAND_FROM_FUNC_LOCAL     ='operand-from-function-local',
    OPERAND_FROM_MODULE_CONST   ='operand-from-module-const',
    OPERAND_FROM_MODULE_FUNC    ='operand-from-module-func',
	
    FUNCTION_DECLARE            ='function-declare',
    FUNCTION_DECLARE_ENTER      ='function-declare-enter',
    FUNCTION_DECLARE_LEAVE      ='function-declare-leave',
    FUNCTION_CALL               ='function-call',
    FUNCTION_RETURN             ='function-return',

    REGISTER_GET                ='register-get',
    REGISTER_SET                ='register-set',

    // STACK_PUSH                  ='stack-push',
    // STACK_PUSH_FROM_REGISTER    ='stack-push-from-register',
    // STACK_POP                   ='stack-pop',
    // STACK_POP_TO_REGISTER       ='stack-pop-to-register',

    MESSAGE_SEND                ='message-send',
    MESSAGE_RECEIVE             ='message-receive',

    GOTO                        = 'goto',

    IF_THEN                     = 'if-then',
    IF_THEN_ELSE                = 'if-then-else',

    // TEST_EQUAL                  = 'test-equal',
    // TEST_NOT_EQUAL              = 'test-not-equal',
    // TEST_POSITIVE               = 'test-positive',
    // TEST_NEGATIVE               = 'test-negative',
    // TEST_POSITIVE_ZERO          = 'test-positive-zero',
    // TEST_NEGATIVE_ZERO          = 'test-negative-zero',
	
	ERROR = 'error'
}


export enum ICompilerIcOperandSource {
    FROM_STACK       = 'FROM_STACK',
    FROM_REGISTER    = 'FROM_REGISTER',
    FROM_ID          = 'FROM_ID',
    FROM_INLINE      = 'FROM_INLINE'
}


export type ICompilerIcIdAccessor = {
    id:string,
    ic_type:string,
    operands_types:[],
    operands_names:[],
    operands_expressions:[],
    is_attribute:boolean,
    is_method_call:boolean,
    is_method_decl:boolean,
    is_indexed:boolean,
    indexed_args_count:number
}



export default interface ICompilerIcNode {
	// get_node_kindof():IIcNodeKindOf
	// get_node_type():string
	
	ic_code:IIcNodeKindOf;
	ic_type:ICompilerType;
}


// INSTRUCTIONS
export interface ICompilerIcInstruction extends ICompilerIcNode {
    ic_operands:ICompilerIcOperand[]
}

export interface ICompilerIcInstrCall extends ICompilerIcInstruction {
    ic_func_name:string
}


 // DECLARE FUNCTION
export interface ICompilerIcFunction extends ICompilerIcNode {
    module_name:string,
    function_name:string,
    
    ic_operands:ICompilerIcOperand[],
    ic_statements:ICompilerIcInstruction[],
    ic_labels:Map<string,number>
}


export interface ICompilerIcFunctionEnter extends ICompilerIcNode {
    module_name:string,
    function_name:string,
}


export interface ICompilerIcFunctionLeave extends ICompilerIcNode {
    module_name:string,
    function_name:string,
}


// OPERANDS
export interface ICompilerIcOperand extends ICompilerIcNode {
}


// OPERANDS FROM STACK
export interface ICompilerIcStackOperand extends ICompilerIcOperand {
}


export interface ICompilerIcConstantValue extends ICompilerIcStackOperand {
    ic_value:string
}


// OPERANDS FROM CURRENT FUNCTION
export interface ICompilerIcFunctionLocalOperand extends ICompilerIcOperand {
    ic_name:string,
}


// OPERANDS FROM A MODULE
export interface ICompilerIcModuleConstOperand extends ICompilerIcOperand {
    ic_module:string,
    ic_name:string
}

export interface ICompilerIcModuleFunctionOperand extends ICompilerIcOperand {
    ic_module:string,
    ic_name:string
}


// export interface ICompilerIcOtherOperand extends ICompilerIcOperand {
    // ic_name:string,
    // ic_id_accessors:ICompilerIcIdAccessor[],
    // ic_id_accessors_str:string
// }