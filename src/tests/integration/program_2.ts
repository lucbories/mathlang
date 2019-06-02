
import AST from '../../compiler/2-ast-builder/math_lang_ast';


export const program_2_source = `

function my_int_square_add(left is INTEGER, right is INTEGER) return INTEGER
    a = left * left
    b = square(right)
    if (a == 0) then return 0 end if
    if (b == 0) then return 1 end if
    return a + b
end function

function my_float_square_add(left is FLOAT, right is FLOAT) return BIGFLOAT
    a = left * left + my_int_square_add(mantissa(left), mantissa(right))
    b = square(right)
    if (a == 0) then return 0 end if
    if (b == 0) then return 1 end if
    return a + b
end function

t = 0.0

pi = 3.14
loop i from 10 to 100 step 10 do
    t = t + my_float_square_add(i*pi, pi)
end loop

return t
`;


export const program_2_ast = {
    "type": "PROGRAM",
    "block": [
        {
            "type": AST.STAT_ASSIGN_VARIABLE,
            "ic_type": "FLOAT",
            "name": "t",
            "is_async": false,
            "expression": {
                "type": "FLOAT",
                "ic_type": "FLOAT",
                "value": "0.0"
            },
            "members":<any>[]
        },
        {
            "type": AST.STAT_ASSIGN_VARIABLE,
            "ic_type": "FLOAT",
            "name": "pi",
            "is_async": false,
            "expression": {
                "type": "FLOAT",
                "ic_type": "FLOAT",
                "value": "3.14"
            },
            "members":<any>[]
        },
        {
            "type": "LOOP_STATEMENT",
            "var": "i",
            "from": {
                "type": "INTEGER",
                "ic_type": "INTEGER",
                "value": "10"
            },
            "to": {
                "type": "INTEGER",
                "ic_type": "INTEGER",
                "value": "100"
            },
            "step": {
                "type": "INTEGER",
                "ic_type": "INTEGER",
                "value": "10"
            },
            "block": [
                {
                    "type": AST.STAT_ASSIGN_VARIABLE,
                    "ic_type": "BIGFLOAT",
                    "name": "t",
                    "is_async": false,
                    "members":<any>[],
                    "expression": {
                        "type": "ADDSUB_EXPRESSION",
                        "ic_type": "BIGFLOAT",
                        "lhs": {
                            "type": "ID_MEMBER_EXPRESSION",
                            "ic_type": "FLOAT",
                            "name": "t",
                            "members":<any>[]
                        },
                        "operator": {
                            "ic_function":"add",
                            "type": "BINOP",
                            "value": "+"
                        },
                        "rhs": {
                            "type": "FUNCTION_CALL_EXPRESSION",
                            "ic_type": "BIGFLOAT",
                            "name": "my_float_square_add",
                            "members":<any>[],
                            "operands_types": [
                                "FLOAT",
                                "FLOAT"
                            ],
                            "operands_expressions": [
                                {
                                    "type": "MULTDIV_EXPRESSION",
                                    "ic_type": "FLOAT",
                                    "lhs": {
                                        "type": "ID_MEMBER_EXPRESSION",
                                        "ic_type": "INTEGER",
                                        "name": "i",
                                        "members":<any>[]
                                    },
                                    "operator": {
                                        "ic_function":"mul",
                                        "type": "BINOP",
                                        "value": "*"
                                    },
                                    "rhs": {
                                        "type": "ID_MEMBER_EXPRESSION",
                                        "ic_type": "FLOAT",
                                        "name": "pi",
                                        "members":<any>[]
                                    }
                                },
                                {
                                    "type": "ID_MEMBER_EXPRESSION",
                                    "ic_type": "FLOAT",
                                    "name": "pi",
                                    "members":<any>[]
                                }
                            ]
                        }
                    }
                }
            ]
        },
        {
            "type": "RETURN_STATEMENT",
            "ic_type": "FLOAT",
            "expression": {
                "type": "ID_MEMBER_EXPRESSION",
                "ic_type": "FLOAT",
                "name": "t",
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
                    "ic_type": "UNKNOW",
                    "name": "b",
                    "is_async": false,
                    "expression": {
                        "type": "FUNCTION_CALL_EXPRESSION",
                        "ic_type": "UNKNOW",
                        "name": "square",
                        "members":<any>[],
                        "operands_types": [
                            "INTEGER"
                        ],
                        "operands_expressions": [
                            {
                                "type": "ID_MEMBER_EXPRESSION",
                                "ic_type": "INTEGER",
                                "name": "right",
                                "members":<any>[]
                            }
                        ]
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
        },
        {
            "type": "FUNCTION_STATEMENT",
            "ic_type": "BIGFLOAT",
            "name": "my_float_square_add",
            "operands_types": [
                "FLOAT",
                "FLOAT"
            ],
            "operands_names": [
                "left",
                "right"
            ],
            "block": [
                {
                    "type": AST.STAT_ASSIGN_VARIABLE,
                    "ic_type": "FLOAT",
                    "name": "a",
                    "is_async": false,
                    "expression": {
                        "type": "ADDSUB_EXPRESSION",
                        "ic_type": "FLOAT",
                        "lhs": {
                            "type": "MULTDIV_EXPRESSION",
                            "ic_type": "FLOAT",
                            "lhs": {
                                "type": "ID_MEMBER_EXPRESSION",
                                "ic_type": "FLOAT",
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
                                "ic_type": "FLOAT",
                                "name": "left",
                                "members":<any>[]
                            }
                        },
                        "operator": {
                            "ic_function":"add",
                            "type": "BINOP",
                            "value": "+"
                        },
                        "rhs": {
                            "type": "FUNCTION_CALL_EXPRESSION",
                            "ic_type": "INTEGER",
                            "name": "my_int_square_add",
                            "members":<any>[],
                            "operands_types": [
                                "UNKNOW",
                                "UNKNOW"
                            ],
                            "operands_expressions": [
                                {
                                    "type": "FUNCTION_CALL_EXPRESSION",
                                    "ic_type": "UNKNOW",
                                    "name": "mantissa",
                                    "members":<any>[],
                                    "operands_types": [
                                        "FLOAT"
                                    ],
                                    "operands_expressions": [
                                        {
                                            "type": "ID_MEMBER_EXPRESSION",
                                            "ic_type": "FLOAT",
                                            "name": "left",
                                            "members":<any>[]
                                        }
                                    ]
                                },
                                {
                                    "type": "FUNCTION_CALL_EXPRESSION",
                                    "ic_type": "UNKNOW",
                                    "name": "mantissa",
                                    "members":<any>[],
                                    "operands_types": [
                                        "FLOAT"
                                    ],
                                    "operands_expressions": [
                                        {
                                            "type": "ID_MEMBER_EXPRESSION",
                                            "ic_type": "FLOAT",
                                            "name": "right",
                                            "members":<any>[]
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    "members":<any>[]
                },
                {
                    "type": AST.STAT_ASSIGN_VARIABLE,
                    "ic_type": "UNKNOW",
                    "name": "b",
                    "is_async": false,
                    "expression": {
                        "type": "FUNCTION_CALL_EXPRESSION",
                        "ic_type": "UNKNOW",
                        "name": "square",
                        "members":<any>[],
                        "operands_types": [
                            "FLOAT"
                        ],
                        "operands_expressions": [
                            {
                                "type": "ID_MEMBER_EXPRESSION",
                                "ic_type": "FLOAT",
                                "name": "right",
                                "members":<any>[]
                            }
                        ]
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