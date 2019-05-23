
export const program_1_source = `

function my_int_square_add(left is INTEGER, right is INTEGER) return INTEGER
    a = left * left
    b = square(right)
    if (a == 0) then return 0 end if
    if (b == 0) then return 1 end if
    return a + b
end function

left = 12
right = 123

return my_int_square_add(left, right)
`;


export const program_1_ast = {
    "type": "PROGRAM",
    "block": [
        {
            "type": "ASSIGN_STATEMENT",
            "ic_type": "INTEGER",
            "name": "left",
            "is_async": false,
            "expression": {
                "type": "INTEGER",
                "ic_type": "INTEGER",
                "value": "12"
            },
            "members":<any>[]
        },
        {
            "type": "ASSIGN_STATEMENT",
            "ic_type": "INTEGER",
            "name": "right",
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
                        "name": "left",
                        "members":<any>[]
                    },
                    {
                        "type": "ID_MEMBER_EXPRESSION",
                        "ic_type": "INTEGER",
                        "name": "right",
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
                    "type": "ASSIGN_STATEMENT",
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
                    "type": "ASSIGN_STATEMENT",
                    "ic_type": "UNKNOW",
                    "name": "b",
                    "is_async": false,
                    "expression": {
                        "type": "FUNCTION_CALL_EXPRESSION",
                        "ic_type": "UNKNOW",
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
                                "ic_type": "UNKNOW",
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
                    "ic_type": "UNKNOW",
                    "expression": {
                        "type": "ADDSUB_EXPRESSION",
                        "ic_type": "UNKNOW",
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
                            "ic_type": "UNKNOW",
                            "name": "b",
                            "members":<any>[]
                        }
                    }
                }
            ]
        }
    ]
};