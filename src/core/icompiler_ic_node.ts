export enum IIcNodeKindOf {
    CONSTANT_TRUE            ='constant-true',
    CONSTANT_FALSE           ='constant-false',
    CONSTANT_NULL            ='constant-null',
    // VARIABLE            ='variable',
	
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
    IF_THEN_ELSE                = 'if-then-else'//,

    // TEST_EQUAL                  = 'test-equal',
    // TEST_NOT_EQUAL              = 'test-not-equal',
    // TEST_POSITIVE               = 'test-positive',
    // TEST_NEGATIVE               = 'test-negative',
    // TEST_POSITIVE_ZERO          = 'test-positive-zero',
    // TEST_NEGATIVE_ZERO          = 'test-negative-zero',
	
	ERROR = 'error'
}


export enum ICOperandSource {
    FROM_STACK       = 'FROM_STACK',
    FROM_REGISTER    = 'FROM_REGISTER',
    FROM_ID          = 'FROM_ID',
    FROM_INLINE      = 'FROM_INLINE'
}

export type ICIdAccessor = {
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

export interface ICOperand {
    ic_type:string,
    ic_source:ICOperandSource,
    ic_name:string,
    ic_id_accessors:ICIdAccessor[],
    ic_id_accessors_str:string
}

export interface ICError {
    ic_type:string,
    ic_source:ICOperandSource,
    ic_name:string,
    ic_index:number,
    ast_node:any,
    message:string
}

export type ICInstruction = {
    ic_type:string,
    ic_code:string,
    operands:ICOperand[],
    text:string
}

export interface ICompilerIcNode {
	// get_node_kindof():IIcNodeKindOf
	// get_node_type():string
	
	ic_code:IIcNodeKindOf;
	ic_type:ICompilerType;
}
