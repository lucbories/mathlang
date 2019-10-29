
import AST from '../../compiler/2-ast-builder/old_math_lang_ast';


export const program_1_source = `

function square(x is INTEGER) return INTEGER
    return x*x
end function

function my_int_square_add(left is INTEGER, right is INTEGER) return INTEGER
    a = left * left
    b = square(right)
    if (a == 0) then return 0 end if
    if (b == 0) then return 1 end if
    return a + b
end function

a = 12
b = 123

return my_int_square_add(a, b)
`;


export const program_1_ast = {
    "type": "PROGRAM",
    "block": [
        {
            "type": AST.STAT_ASSIGN_VARIABLE,
            "ic_type": "INTEGER",
            "name": "a",
            "is_async": false,
            "expression": {
                "type": "INTEGER",
                "ic_type": "INTEGER",
                "value": "12"
            },
            "members":<any>[]
        },
        {
            "type": AST.STAT_ASSIGN_VARIABLE,
            "ic_type": "INTEGER",
            "name": "b",
            "is_async": false,
            "expression": {
                "type": "INTEGER",
                "ic_type": "INTEGER",
                "value": "123"
            },
            "members":<any>[]
        },
        {
            "type": "RETURN_STATEMENT",
            "ic_type": "INTEGER",
            "expression": {
                "type": "FUNCTION_CALL_EXPRESSION",
                "ic_type": "INTEGER",
                "name": "my_int_square_add",
                "operands_expressions":[
                    {
                        "type": "ID_MEMBER_EXPRESSION",
                        "ic_type": "INTEGER",
                        "name": "a",
                        "members":<any>[]
                    },
                    {
                        "type": "ID_MEMBER_EXPRESSION",
                        "ic_type": "INTEGER",
                        "name": "b",
                        "members":<any>[]
                    }
                ],
                "operands_types": [
                    "INTEGER",
                    "INTEGER"
                ],
                "members":<any>[]
            }
        },
        {
            "type": "FUNCTION_STATEMENT",
            "ic_type": "INTEGER",
            "name": "square",
            "operands_types": [
                "INTEGER"
            ],
            "operands_names": [
                "x"
            ],
            "block": [
                {
                    "type": "RETURN_STATEMENT",
                    "ic_type": "INTEGER",
                    "expression": {
                        "type": "MULTDIV_EXPRESSION",
                        "ic_type": "INTEGER",
                        "lhs": {
                            "type": "ID_MEMBER_EXPRESSION",
                            "ic_type": "INTEGER",
                            "name": "x",
                            "members":<any>[]
                        },
                        "operator": {
                            "ic_function":"mul",
                            "type": "BINOP",
                            "value": "*"
                        },
                        "rhs": {
                            "type": "ID_MEMBER_EXPRESSION",
                            "ic_type": "INTEGER",
                            "name": "x",
                            "members":<any>[]
                        }
                    }
                }
            ]
        },
        {
            "type": "FUNCTION_STATEMENT",
            "ic_type": "INTEGER",
            "name": "my_int_square_add",
            "operands_types": [
                "INTEGER",
                "INTEGER"
            ],
            "operands_names": [
                "left",
                "right"
            ],
            "block": [
                {
                    "type": AST.STAT_ASSIGN_VARIABLE,
                    "ic_type": "INTEGER",
                    "name": "a",
                    "is_async": false,
                    "expression": {
                        "type": "MULTDIV_EXPRESSION",
                        "ic_type": "INTEGER",
                        "lhs": {
                            "type": "ID_MEMBER_EXPRESSION",
                            "ic_type": "INTEGER",
                            "name": "left",
                            "members":<any>[]
                        },
                        "operator": {
                            "ic_function":"mul",
                            "type": "BINOP",
                            "value": "*"
                        },
                        "rhs": {
                            "type": "ID_MEMBER_EXPRESSION",
                            "ic_type": "INTEGER",
                            "name": "left",
                            "members":<any>[]
                        }
                    },
                    "members":<any>[]
                },
                {
                    "type": AST.STAT_ASSIGN_VARIABLE,
                    "ic_type": "INTEGER",
                    "name": "b",
                    "is_async": false,
                    "expression": {
                        "type": "FUNCTION_CALL_EXPRESSION",
                        "ic_type": "INTEGER",
                        "name": "square",
                        "operands_types": ["INTEGER"],
                        "operands_expressions": [
                            {
                                "type": "ID_MEMBER_EXPRESSION",
                                "ic_type": "INTEGER",
                                "name": "right",
                                "members":<any>[]
                            }
                        ],
                        "members":<any>[]
                    },
                    "members":<any>[]
                },
                {
                    "type": "IF_STATEMENT",
                    "condition": {
                        "type": "PARENTHESIS_EXPRESSION",
                        "ic_type": "BOOLEAN",
                        "expression": {
                            "type": "COMPARATOR_EXPRESSION",
                            "ic_type": "BOOLEAN",
                            "lhs": {
                                "type": "ID_MEMBER_EXPRESSION",
                                "ic_type": "INTEGER",
                                "name": "a",
                                "members":<any>[]
                            },
                            "operator": {
                                "ic_function":"equal",
                                "type": "BINOP",
                                "value": "=="
                            },
                            "rhs": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "0"
                            }
                        }
                    },
                    "then": [
                        {
                            "type": "RETURN_STATEMENT",
                            "ic_type": "INTEGER",
                            "expression": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "0"
                            }
                        }
                    ],
                    "else":<any>undefined
                },
                {
                    "type": "IF_STATEMENT",
                    "condition": {
                        "type": "PARENTHESIS_EXPRESSION",
                        "ic_type": "BOOLEAN",
                        "expression": {
                            "type": "COMPARATOR_EXPRESSION",
                            "ic_type": "BOOLEAN",
                            "lhs": {
                                "type": "ID_MEMBER_EXPRESSION",
                                "ic_type": "INTEGER",
                                "name": "b",
                                "members":<any>[]
                            },
                            "operator": {
                                "ic_function":"equal",
                                "type": "BINOP",
                                "value": "=="
                            },
                            "rhs": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "0"
                            }
                        }
                    },
                    "then": [
                        {
                            "type": "RETURN_STATEMENT",
                            "ic_type": "INTEGER",
                            "expression": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "1"
                            }
                        }
                    ],
                    "else":<any>undefined
                },
                {
                    "type": "RETURN_STATEMENT",
                    "ic_type": "INTEGER",
                    "expression": {
                        "type": "ADDSUB_EXPRESSION",
                        "ic_type": "INTEGER",
                        "lhs": {
                            "type": "ID_MEMBER_EXPRESSION",
                            "ic_type": "INTEGER",
                            "name": "a",
                            "members":<any>[]
                        },
                        "operator": {
                            "ic_function":"add",
                            "type": "BINOP",
                            "value": "+"
                        },
                        "rhs": {
                            "type": "ID_MEMBER_EXPRESSION",
                            "ic_type": "INTEGER",
                            "name": "b",
                            "members":<any>[]
                        }
                    }
                }
            ]
        }
    ]
};


export const program_1_ic = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@main/a INTEGER:[12]
INTEGER:register-set INTEGER:@main/b INTEGER:[123]
INTEGER:function-call my_int_square_add OPERANDS_COUNT=[2]
INTEGER:function-return INTEGER:FROM_STACK
none:function-declare-leave main
INTEGER:function-declare-enter square INTEGER:x
INTEGER:function-call mul INTEGER:@square/x INTEGER:@square/x
INTEGER:function-return INTEGER:FROM_STACK
INTEGER:function-declare-leave square
INTEGER:function-declare-enter my_int_square_add INTEGER:left INTEGER:right
INTEGER:function-call mul INTEGER:@my_int_square_add/left INTEGER:@my_int_square_add/left
INTEGER:register-set INTEGER:@my_int_square_add/a INTEGER:FROM_STACK
INTEGER:function-call square OPERANDS_COUNT=[1]
INTEGER:register-set INTEGER:@my_int_square_add/b INTEGER:FROM_STACK
BOOLEAN:function-call equal INTEGER:@my_int_square_add/a INTEGER:[0]
BOOLEAN:function-call equal BOOLEAN:FROM_STACK BOOLEAN:[###TRUE]
UNKNOW:if-then LABEL:[my_int_square_add_label_0] LABEL:[my_int_square_add_label_2]
INTEGER:function-return INTEGER:[0]
UNKNOW:goto LABEL:[my_int_square_add_label_2]
BOOLEAN:function-call equal INTEGER:@my_int_square_add/b INTEGER:[0]
BOOLEAN:function-call equal BOOLEAN:FROM_STACK BOOLEAN:[###TRUE]
UNKNOW:if-then LABEL:[my_int_square_add_label_3] LABEL:[my_int_square_add_label_5]
INTEGER:function-return INTEGER:[1]
UNKNOW:goto LABEL:[my_int_square_add_label_5]
INTEGER:function-call add INTEGER:@my_int_square_add/a INTEGER:@my_int_square_add/b
INTEGER:function-return INTEGER:FROM_STACK
INTEGER:function-declare-leave my_int_square_add`;


export const program_1_ic_labels = `
ICFunction:my_int_square_add labels:
0:my_int_square_add_label_0=8
1:my_int_square_add_label_1=10
2:my_int_square_add_label_2=10
3:my_int_square_add_label_3=13
4:my_int_square_add_label_4=15
5:my_int_square_add_label_5=15
`;


export const program_1_run_result = {
    result:999 // TBD
};