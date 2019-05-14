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
            "type": "ASSIGN_STATEMENT",
            "ic_type": "FLOAT",
            "name": "t",
            "is_async": false,
            "expression": {
                "type": "FLOAT",
                "ic_type": "FLOAT",
                "value": "0.0",
                "members":<any>undefined
            },
            "members":<any>undefined
        },
        {
            "type": "ASSIGN_STATEMENT",
            "ic_type": "FLOAT",
            "name": "pi",
            "is_async": false,
            "expression": {
                "type": "FLOAT",
                "ic_type": "FLOAT",
                "value": "3.14",
                "members":<any>undefined
            },
            "members":<any>undefined
        },
        {
            "type": "LOOP_STATEMENT",
            "var": "i",
            "from": {
                "type": "INTEGER",
                "ic_type": "INTEGER",
                "value": "10",
                "members":<any>undefined
            },
            "to": {
                "type": "INTEGER",
                "ic_type": "INTEGER",
                "value": "100",
                "members":<any>undefined
            },
            "step": {
                "type": "INTEGER",
                "ic_type": "INTEGER",
                "value": "10",
                "members":<any>undefined
            },
            "block": [
                {
                    "type": "ASSIGN_STATEMENT",
                    "ic_type": "BIGFLOAT",
                    "name": "t",
                    "is_async": false,
                    "members":<any>undefined,
                    "expression": {
                        "type": "ADDSUB_EXPRESSION",
                        "ic_type": "BIGFLOAT",
                        "lhs": {
                            "type": "ID_MEMBER_EXPRESSION",
                            "ic_type": "FLOAT",
                            "name": "t",
                            "members":<any>undefined
                        },
                        "operator": {
                            "ic_function":"add",
                            "type": "BINOP",
                            "value": "+"
                        },
                        "rhs": {
                            "type": "ID_MEMBER_EXPRESSION",
                            "ic_type": "BIGFLOAT",
                            "name": "my_float_square_add",
                            "members": {
                                "type": "ARGS_EXPRESSION",
                                "ic_type": "ARRAY",
                                "ic_subtypes": [
                                    "FLOAT",
                                    "FLOAT"
                                ],
                                "items": [
                                    {
                                        "type": "MULTDIV_EXPRESSION",
                                        "ic_type": "FLOAT",
                                        "lhs": {
                                            "type": "ID_MEMBER_EXPRESSION",
                                            "ic_type": "INTEGER",
                                            "name": "i",
                                            "members":<any>undefined
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
                                            "members":<any>undefined
                                        }
                                    },
                                    {
                                        "type": "ID_MEMBER_EXPRESSION",
                                        "ic_type": "FLOAT",
                                        "name": "pi",
                                        "members":<any>undefined
                                    }
                                ]
                            }
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
                "members":<any>undefined
            }
        },
        {
            "type": "FUNCTION_STATEMENT",
            "ic_type": "INTEGER",
            "name": "my_int_square_add",
            "operands": {
                "type": "ARGIDS_EXPRESSION",
                "ic_type": "ARRAY",
                "ic_subtypes": [
                    "INTEGER",
                    "INTEGER"
                ],
                "items": [
                    "left",
                    "right"
                ]
            },
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
                            "members":<any>undefined
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
                            "members":<any>undefined
                        }
                    },
                    "members":<any>undefined
                },
                {
                    "type": "ASSIGN_STATEMENT",
                    "ic_type": "UNKNOW",
                    "name": "b",
                    "is_async": false,
                    "expression": {
                        "type": "ID_MEMBER_EXPRESSION",
                        "ic_type": "UNKNOW",
                        "name": "square",
                        "members": {
                            "type": "ARGS_EXPRESSION",
                            "ic_type": "ARRAY",
                            "ic_subtypes": [
                                "INTEGER"
                            ],
                            "items": [
                                {
                                    "type": "ID_MEMBER_EXPRESSION",
                                    "ic_type": "INTEGER",
                                    "name": "right",
                                    "members":<any>undefined
                                }
                            ]
                        }
                    },
                    "members":<any>undefined
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
                                "members":<any>undefined
                            },
                            "operator": {
                                "ic_function":"equal",
                                "type": "BINOP",
                                "value": "=="
                            },
                            "rhs": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "0",
                                "members":<any>undefined
                            }
                        },
                        "members":<any>undefined
                    },
                    "then": [
                        {
                            "type": "RETURN_STATEMENT",
                            "ic_type": "INTEGER",
                            "expression": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "0",
                                "members":<any>undefined
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
                                "members":<any>undefined
                            },
                            "operator": {
                                "ic_function":"equal",
                                "type": "BINOP",
                                "value": "=="
                            },
                            "rhs": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "0",
                                "members":<any>undefined
                            }
                        },
                        "members":<any>undefined
                    },
                    "then": [
                        {
                            "type": "RETURN_STATEMENT",
                            "ic_type": "INTEGER",
                            "expression": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "1",
                                "members":<any>undefined
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
                            "members":<any>undefined
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
                            "members":<any>undefined
                        }
                    }
                }
            ]
        },
        {
            "type": "FUNCTION_STATEMENT",
            "ic_type": "BIGFLOAT",
            "name": "my_float_square_add",
            "operands": {
                "type": "ARGIDS_EXPRESSION",
                "ic_type": "ARRAY",
                "ic_subtypes": [
                    "FLOAT",
                    "FLOAT"
                ],
                "items": [
                    "left",
                    "right"
                ]
            },
            "block": [
                {
                    "type": "ASSIGN_STATEMENT",
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
                                "members":<any>undefined
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
                                "members":<any>undefined
                            }
                        },
                        "operator": {
                            "ic_function":"add",
                            "type": "BINOP",
                            "value": "+"
                        },
                        "rhs": {
                            "type": "ID_MEMBER_EXPRESSION",
                            "ic_type": "INTEGER",
                            "name": "my_int_square_add",
                            "members": {
                                "type": "ARGS_EXPRESSION",
                                "ic_type": "ARRAY",
                                "ic_subtypes": [
                                    "UNKNOW",
                                    "UNKNOW"
                                ],
                                "items": [
                                    {
                                        "type": "ID_MEMBER_EXPRESSION",
                                        "ic_type": "UNKNOW",
                                        "name": "mantissa",
                                        "members": {
                                            "type": "ARGS_EXPRESSION",
                                            "ic_type": "ARRAY",
                                            "ic_subtypes": [
                                                "FLOAT"
                                            ],
                                            "items": [
                                                {
                                                    "type": "ID_MEMBER_EXPRESSION",
                                                    "ic_type": "FLOAT",
                                                    "name": "left",
                                                    "members":<any>undefined
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "type": "ID_MEMBER_EXPRESSION",
                                        "ic_type": "UNKNOW",
                                        "name": "mantissa",
                                        "members": {
                                            "type": "ARGS_EXPRESSION",
                                            "ic_type": "ARRAY",
                                            "ic_subtypes": [
                                                "FLOAT"
                                            ],
                                            "items": [
                                                {
                                                    "type": "ID_MEMBER_EXPRESSION",
                                                    "ic_type": "FLOAT",
                                                    "name": "right",
                                                    "members":<any>undefined
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    "members":<any>undefined
                },
                {
                    "type": "ASSIGN_STATEMENT",
                    "ic_type": "UNKNOW",
                    "name": "b",
                    "is_async": false,
                    "expression": {
                        "type": "ID_MEMBER_EXPRESSION",
                        "ic_type": "UNKNOW",
                        "name": "square",
                        "members": {
                            "type": "ARGS_EXPRESSION",
                            "ic_type": "ARRAY",
                            "ic_subtypes": [
                                "FLOAT"
                            ],
                            "items": [
                                {
                                    "type": "ID_MEMBER_EXPRESSION",
                                    "ic_type": "FLOAT",
                                    "name": "right",
                                    "members":<any>undefined
                                }
                            ]
                        }
                    },
                    "members":<any>undefined
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
                                "members":<any>undefined
                            },
                            "operator": {
                                "ic_function":"equal",
                                "type": "BINOP",
                                "value": "=="
                            },
                            "rhs": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "0",
                                "members":<any>undefined
                            }
                        },
                        "members":<any>undefined
                    },
                    "then": [
                        {
                            "type": "RETURN_STATEMENT",
                            "ic_type": "INTEGER",
                            "expression": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "0",
                                "members":<any>undefined
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
                                "members":<any>undefined
                            },
                            "operator": {
                                "ic_function":"equal",
                                "type": "BINOP",
                                "value": "=="
                            },
                            "rhs": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "0",
                                "members":<any>undefined
                            }
                        },
                        "members":<any>undefined
                    },
                    "then": [
                        {
                            "type": "RETURN_STATEMENT",
                            "ic_type": "INTEGER",
                            "expression": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "1",
                                "members":<any>undefined
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
                            "members":<any>undefined
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
                            "members":<any>undefined
                        }
                    }
                }
            ]
        }
    ]
};