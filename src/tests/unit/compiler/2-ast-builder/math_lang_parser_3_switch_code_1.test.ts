
import MathLangCompiler from '../../../../compiler/math_lang_compiler';

export const AST_SWITCH_SRC_1 = `
begin
    a=12 b=0
    switch a
        12 begin b=1 end
        2*3+1 begin b=2 end
    end switch
end
`;

export const AST_SWITCH_JSON_1 = function (compiler:MathLangCompiler) {
    const EMPTY_ARRAY = <any>[];
    return {
        "type": "BLOCK",
        "statements": [
            {
                "type": "ASSIGN_STATEMENT_VARIABLE",
                "ic_type": compiler.TYPE_INTEGER,
                "name": "a",
                "is_async": false,
                "members":EMPTY_ARRAY,
                "expression": {
                    "type": "INTEGER",
                    "ic_type": compiler.TYPE_INTEGER,
                    "value": "12"
                }
            },
            {
                "type": "ASSIGN_STATEMENT_VARIABLE",
                "ic_type": compiler.TYPE_INTEGER,
                "name": "b",
                "is_async": false,
                "members":EMPTY_ARRAY,
                "expression": {
                    "type": "INTEGER",
                    "ic_type": compiler.TYPE_INTEGER,
                    "value": "0"
                }
            },
            {
                "type": "SWITCH_STATEMENT",
                "var": "a",
                "ic_type": compiler.TYPE_INTEGER,
                "items": [
                    {
                        "item_expression": {
                            "type": "INTEGER",
                            "ic_type": compiler.TYPE_INTEGER,
                            "value": "12"
                        },
                        "item_block": [
                            {
                                "type": "BLOCK",
                                "statements": [
                                    {
                                        "type": "ASSIGN_STATEMENT_VARIABLE",
                                        "ic_type": compiler.TYPE_INTEGER,
                                        "name": "b",
                                        "is_async": false,
                                        "members":EMPTY_ARRAY,
                                        "expression": {
                                            "type": "INTEGER",
                                            "ic_type": compiler.TYPE_INTEGER,
                                            "value": "1"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "item_expression": {
                            "type": "ADDSUB_EXPRESSION",
                            "ic_type": compiler.TYPE_INTEGER,
                            "lhs": {
                                "type": "MULTDIV_EXPRESSION",
                                "ic_type": compiler.TYPE_INTEGER,
                                "lhs": {
                                    "type": "INTEGER",
                                    "ic_type": compiler.TYPE_INTEGER,
                                    "value": "2"
                                },
                                "operator": {
                                    "type": "BINOP",
                                    "value": "*",
                                    "ic_function": "mul"
                                },
                                "rhs": {
                                    "type": "INTEGER",
                                    "ic_type": compiler.TYPE_INTEGER,
                                    "value": "3"
                                }
                            },
                            "operator": {
                                "type": "BINOP",
                                "value": "+",
                                "ic_function": "add"
                            },
                            "rhs": {
                                "type": "INTEGER",
                                "ic_type": compiler.TYPE_INTEGER,
                                "value": "1"
                            }
                        },
                        "item_block": [
                            {
                                "type": "BLOCK",
                                "statements": [
                                    {
                                        "type": "ASSIGN_STATEMENT_VARIABLE",
                                        "ic_type": compiler.TYPE_INTEGER,
                                        "name": "b",
                                        "is_async": false,
                                        "members":EMPTY_ARRAY,
                                        "expression": {
                                            "type": "INTEGER",
                                            "ic_type": compiler.TYPE_INTEGER,
                                            "value": "2"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
}