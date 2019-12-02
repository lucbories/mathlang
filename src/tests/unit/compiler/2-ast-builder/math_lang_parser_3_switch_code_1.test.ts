
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
        ast_code: "BLOCK",
        "statements": [
            {
                ast_code: "ASSIGN_STATEMENT_VARIABLE",
                "ic_type": compiler.TYPE_INTEGER,
                "name": "a",
                "is_async": false,
                "members":EMPTY_ARRAY,
                "expression": {
                    ast_code: "INTEGER",
                    "ic_type": compiler.TYPE_INTEGER,
                    "value": "12"
                }
            },
            {
                ast_code: "ASSIGN_STATEMENT_VARIABLE",
                "ic_type": compiler.TYPE_INTEGER,
                "name": "b",
                "is_async": false,
                "members":EMPTY_ARRAY,
                "expression": {
                    ast_code: "INTEGER",
                    "ic_type": compiler.TYPE_INTEGER,
                    "value": "0"
                }
            },
            {
                ast_code: "SWITCH_STATEMENT",
                "var": "a",
                "ic_type": compiler.TYPE_INTEGER,
                "items": [
                    {
                        "item_expression": {
                            ast_code: "INTEGER",
                            "ic_type": compiler.TYPE_INTEGER,
                            "value": "12"
                        },
                        "item_block": [
                            {
                                ast_code: "BLOCK",
                                "statements": [
                                    {
                                        ast_code: "ASSIGN_STATEMENT_VARIABLE",
                                        "ic_type": compiler.TYPE_INTEGER,
                                        "name": "b",
                                        "is_async": false,
                                        "members":EMPTY_ARRAY,
                                        "expression": {
                                            ast_code: "INTEGER",
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
                            ast_code: "ADDSUB_EXPRESSION",
                            "ic_type": compiler.TYPE_INTEGER,
                            "lhs": {
                                ast_code: "MULTDIV_EXPRESSION",
                                "ic_type": compiler.TYPE_INTEGER,
                                "lhs": {
                                    ast_code: "INTEGER",
                                    "ic_type": compiler.TYPE_INTEGER,
                                    "value": "2"
                                },
                                "operator": {
                                    ast_code: "BINOP",
                                    "value": "*",
                                    "ic_function": "mul"
                                },
                                "rhs": {
                                    ast_code: "INTEGER",
                                    "ic_type": compiler.TYPE_INTEGER,
                                    "value": "3"
                                }
                            },
                            "operator": {
                                ast_code: "BINOP",
                                "value": "+",
                                "ic_function": "add"
                            },
                            "rhs": {
                                ast_code: "INTEGER",
                                "ic_type": compiler.TYPE_INTEGER,
                                "value": "1"
                            }
                        },
                        "item_block": [
                            {
                                ast_code: "BLOCK",
                                "statements": [
                                    {
                                        ast_code: "ASSIGN_STATEMENT_VARIABLE",
                                        "ic_type": compiler.TYPE_INTEGER,
                                        "name": "b",
                                        "is_async": false,
                                        "members":EMPTY_ARRAY,
                                        "expression": {
                                            ast_code: "INTEGER",
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