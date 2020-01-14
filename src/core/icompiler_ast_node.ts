
import ICompilerType from './icompiler_type';

export enum IAstNodeKindOf {
    PROGRAM                 ='PROGRAM',
    BLOCK                   ='BLOCK',

    STAT_USE                ='USE_STATEMENT',
    STAT_MODULE             ='MODULE_STATEMENT',
    STAT_UNKNOW             ='UNKNOW_STATEMENT',
    STAT_IF                 ='IF_STATEMENT',
    STAT_WHILE              ='WHILE_STATEMENT',
    STAT_FOR                ='FOR_STATEMENT',
    STAT_LOOP               ='LOOP_STATEMENT',
    STAT_SWITCH             ='SWITCH_STATEMENT',
    STAT_ASSIGN_VARIABLE    ='ASSIGN_STATEMENT_VARIABLE',
    STAT_ASSIGN_FUNCTION    ='ASSIGN_STATEMENT_FUNCTION',
    STAT_ASSIGN_ATTRIBUTE   ='ASSIGN_STATEMENT_ATTRIBUTE',
    STAT_ASSIGN_METHOD      ='ASSIGN_STATEMENT_METHOD',
    STAT_UNKNOW_ID          ='UNDECLARED IDENTIFIER WITH MEMBERS',
    STAT_FUNCTION           ='FUNCTION_STATEMENT',
    STAT_RETURN             ='RETURN_STATEMENT',
    STAT_DISPOSE            ='DISPOSE_STATEMENT',
    STAT_EMIT               ='EMIT_STATEMENT',
    STAT_ON                 ='ON_STATEMENT',
    STAT_WAIT               ='WAIT_STATEMENT',

    EXPR_BINOP_COMPARE      ='COMPARATOR_EXPRESSION',
    EXPR_BINOP_ADDSUB       ='ADDSUB_EXPRESSION',
    EXPR_BINOP_MULTDIV      ='MULTDIV_EXPRESSION',

    EXPR_UNOP_PREUNOP       ='PREUNOP_EXPRESSION',
    EXPR_UNOP_PRE_UNKNOW    ='UNKNOW_UNARY_EXPRESSION',
    EXPR_UNOP_POST          ='POSTUNOP_EXPRESSION',
    EXPR_UNOP_POST_UNKNOW   ='UNKNOW_POSTFIX_EXPRESSION',

    // EXPR_MEMBER_ID          ='ID_MEMBER_EXPRESSION',
    // EXPR_MEMBER_UNKNOW      ='UNKNOW_MEMBER_EXPRESSION',
    // EXPR_MEMBER_METHOD_CALL ='METHOD_CALL_EXPRESSION',
    // EXPR_MEMBER_FUNC_DECL   ='FUNCTION_DECLARATION_EXPRESSION',

    EXPR_ID_OPTION_UNKNOW      ='ID OPTION UNKNOW',
    EXPR_ID_OPTION_INDICES     ='ID OPTION INDICES',
    EXPR_ID_OPTION_METHOD_CALL ='ID OPTION METHOD CALL',
    EXPR_ID_OPTION_METHOD_DECL ='ID OPTION METHOD DECLARATION',
    EXPR_ID_OPTION_ATTRIBUTE   ='ID OPTION ATTRIBUTE',

    EXPR_FUNCTION_DECL        ='FUNCTION DECLARATION',
    EXPR_FUNCTION_LOCAL       ='FUNCTION LOCAL',
    EXPR_FUNCTION_CALL        ='FUNCTION CALL',

    EXPR_MODULE_CONSTANT      ='MODULE CONSTANT',
    EXPR_MODULE_FUNCTION_CALL ='MODULE FUNCTION CALL',

    EXPR_PRIMARY_NULL       ='NULL',
    EXPR_PRIMARY_TRUE       ='TRUE',
    EXPR_PRIMARY_FALSE      ='FALSE',
    EXPR_PRIMARY_STRING     ='STRING',
    EXPR_PRIMARY_INTEGER    ='INTEGER',
    EXPR_PRIMARY_FLOAT      ='FLOAT',
    EXPR_PRIMARY_BIGINTEGER ='BIGINTEGER',
    EXPR_PRIMARY_BIGFLOAT   ='BIGFLOAT',
    EXPR_PRIMARY_UNKNOW     ='UNKNOW_EXPRESSION',

    EXPR_PARENTHESIS        ='PARENTHESIS_EXPRESSION',

    EXPR_TYPE_ID            ='TYPE_ID_EXPRESSION',
    EXPR_RECORD             ='RECORD_EXPRESSION',
    EXPR_ARGS               ='ARGS_EXPRESSION',
    EXPR_ARGS_IDS           ='ARGIDS_EXPRESSION',
    EXPR_ARRAY              ='ARRAY_EXPRESSION',
    EXPR_BINOP              ='BINOP'
}

export default ICompilerAstNode;
export interface ICompilerAstNode {
	ast_code:IAstNodeKindOf;
}

export interface ICompilerAstTypedNode extends ICompilerAstNode {
	ic_type:ICompilerType;
}

export interface ICompilerAstExpressionNode extends ICompilerAstTypedNode {
    expression:ICompilerAstTypedNode
}

export interface ICompilerAstIndexedMemberNode extends ICompilerAstTypedNode {
    indices_expressions:[]
}

export interface ICompilerAstAttributeMemberNode extends ICompilerAstTypedNode {
    attribute_name:string
}

export interface ICompilerAstAssignNode extends ICompilerAstExpressionNode {
    is_async:boolean,
    name:string,
    members:ICompilerAstIndexedMemberNode|ICompilerAstAttributeMemberNode[]
}

export interface ICompilerAstBlockNode extends ICompilerAstTypedNode {
    statements:ICompilerAstNode[]
}
/*
{
    type: AST.STAT_FUNCTION,
    ic_type:returned_type,
    func_name:function_name,
    is_exported: function_is_exported,
    operands_types:operands_decl && operands_decl.ic_subtypes ? operands_decl.ic_subtypes : [],
    operands_names:operands_decl && operands_decl.items ? operands_decl.items : [],
    statements:statements
}
*/
export interface ICompilerAstFunctionNode extends ICompilerAstBlockNode {
    func_name:string;
    is_exported:boolean;
    operands_types:string[],
    operands_names:string[]
}