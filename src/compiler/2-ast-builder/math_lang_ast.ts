enum AST {
    PROGRAM                 ='PROGRAM',
    BLOCK                   ='BLOCK',

    STAT_UNKNOW             ='UNKNOW_STATEMENT',
    STAT_IF                 ='IF_STATEMENT',
    STAT_WHILE              ='WHILE_STATEMENT',
    STAT_FOR                ='FOR_STATEMENT',
    STAT_LOOP               ='LOOP_STATEMENT',
    STAT_ASSIGN             ='ASSIGN_STATEMENT',
    STAT_UNKNOW_ID          ='UNDECLARED IDENTIFIER WITH MEMBERS',
    STAT_FUNCTION           ='FUNCTION_STATEMENT',
    STAT_RETURN             ='RETURN_STATEMENT',

    EXPR_BINOP_COMPARE      ='COMPARATOR_EXPRESSION',
    EXPR_BINOP_ADDSUB       ='ADDSUB_EXPRESSION',
    EXPR_BINOP_MULTDIV      ='MULTDIV_EXPRESSION',

    EXPR_UNOP_PREUNOP       ='PREUNOP_EXPRESSION',
    EXPR_UNOP_PRE_TRUE      ='TRUE',
    EXPR_UNOP_PRE_FALSE     ='FALSE',
    EXPR_UNOP_PRE_NULL      ='NULL',
    EXPR_UNOP_PRE_UNKNOW    ='UNKNOW_UNARY_EXPRESSION',
    EXPR_UNOP_POST          ='POSTUNOP_EXPRESSION',
    EXPR_UNOP_POST_UNKNOW   ='UNKNOW_POSTFIX_EXPRESSION',

    EXPR_MEMBER_ID          ='ID_EXPRESSION',
    EXPR_MEMBER_UNKNOW      ='UNKNOW_MEMBER_EXPRESSION',
    EXPR_MEMBER_BOX         ='BOX_EXPRESSION',
    EXPR_MEMBER_DOT         ='DOT_EXPRESSION',
    EXPR_MEMBER_DASH        ='DASH_EXPRESSION',
    EXPR_MEMBER_UNKNOW_ITEM ='UNKNOW_MEMBER_ITEM_EXPRESSION',

    EXPR_PRIMARY_STRING     ='STRING',
    EXPR_PRIMARY_INTEGER    ='INTEGER',
    EXPR_PRIMARY_FLOAT      ='FLOAT',
    EXPR_PRIMARY_BIGINTEGER ='BIGINTEGER',
    EXPR_PRIMARY_BIGFLOAT   ='BIGFLOAT',
    EXPR_PRIMARY_UNKNOW     ='UNKNOW_EXPRESSION',

    EXPR_PARENTHESIS        ='PARENTHESIS_EXPRESSION',

    EXPR_ARGS               ='ARGS_EXPRESSION',
    EXPR_ARGS_IDS           ='ARGIDS_EXPRESSION',
    EXPR_ARRAY              ='ARRAY_EXPRESSION',
    EXPR_BINOP              ='BINOP'
}

export default AST;