
import ICompilerType from './icompiler_type';



export const IC_OPCODES = {
    FUNCTION        : 190,
    EBB             : 191,
    RETURN          : 192,
    CALL            : 193,
    JUMP            : 194,

    ATTRIBUTE_GET   : 181,
    ATTRIBUTE_SET   : 182,

    METHOD_CALL     : 183,
    METHOD_SET      : 184,

    MESSAGE_EMIT    : 185,
    MESSAGE_ON      : 186,
    
    ERROR_EMIT      : 187,
    ERROR_ON        : 188,

    HEAP_NEW        : 100,
    HEAP_GET        : 101,
    HEAP_SET        : 102,

    REGISTER_NEW    : 110,
    REGISTER_GET    : 111,
    REGISTER_SET    : 112,

    VSTACK_NEW      : 120,
    VSTACK_POP      : 121,
    VSTACK_PUSH     : 122,

    ARRAY_NEW       : 130,
    ARRAY_GET_AT    : 131,
    ARRAY_SET_AT    : 132,

    IF_ZERO         : 201,
    IF_POSITIVE     : 202,
    IF_NEGATIVE     : 203,
    IF_TRUE         : 204,
    IF_FALSE        : 205,
    IF_GE           : 206,
    IF_GT           : 207,
    IF_LE           : 208,
    IF_LT           : 209,
    IF_EQ           : 210,
    IF_NEQ          : 211,
}


export const IC_LABELS = {
    [IC_OPCODES.REGISTER_GET]: 'register_get',
    [IC_OPCODES.REGISTER_SET]: 'register_set'
}


export const IC_TEXTS = {
    [IC_OPCODES.REGISTER_GET]: 'register_get %1 %2',
    [IC_OPCODES.REGISTER_SET]: 'register_set %1 %2'
}

export type ICompilerIcOpCode = number;
export type ICompilerIcInstrOperand = string; // r1,v12, pop...
export type ICompilerIcEbbOperand = {
    opd_name:string,
    opd_type:ICompilerType
}

export interface ICompilerIcEbb {
	ic_ebb_index:number;
	ic_ebb_name:string;
    ic_opderands:ICompilerIcEbbOperand[],
    ic_opderands_map:Map<string,string>,
    ic_instructions:ICompilerIcInstr[];
}

export default ICompilerIcInstr;
export interface ICompilerIcInstr {
	ic_code:ICompilerIcOpCode;
	ic_type:ICompilerType;
    ic_opds:ICompilerIcInstrOperand[];
    ic_var_name:string;
}

/*
export enum IIcNodeKindOf {
    CONSTANT_TRUE            ='constant-true',
    CONSTANT_FALSE           ='constant-false',
    CONSTANT_NULL            ='constant-null',
    CONSTANT_VALUE           ='constant-value',
    
    OPERAND_FROM_STACK          ='operand-from-stack',
    OPERAND_FROM_ID             ='operand-from-id',
    OPERAND_FROM_ATTRIBUTE      ='operand-from-attribute',
    OPERAND_FROM_INDEX          ='operand-from-index',
	
    FUNCTION_DECLARE            ='function-declare',
    FUNCTION_DECLARE_ENTER      ='function-declare-enter',
    FUNCTION_DECLARE_LEAVE      ='function-declare-leave',
    FUNCTION_CALL               ='function-call',
    FUNCTION_RETURN             ='function-return',

    METHOD_DECLARE              ='method-declare',
    METHOD_CALL                 ='method-call',

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


export interface ICompilerIcMethod extends ICompilerIcFunction {
    object_name:string,
    object_type:ICompilerType,
}


// CONSTANTS
export interface ICompilerIcOperand extends ICompilerIcNode {
}

export interface ICompilerIcConstant extends ICompilerIcOperand {
}

export interface ICompilerIcVariable extends ICompilerIcOperand {
    ic_name:string
}

export interface ICompilerIcOperandAtIndex extends ICompilerIcOperand {
    ic_operands:ICompilerIcOperand[]
}


export interface ICompilerIcConstantValue extends ICompilerIcConstant {
    ic_value:string
}


export interface ICompilerIcOtherOperand extends ICompilerIcOperand {
    ic_name:string,
    ic_id_accessors:ICompilerIcIdAccessor[],
    ic_id_accessors_str:string
}*/