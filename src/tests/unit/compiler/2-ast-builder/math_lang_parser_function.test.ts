import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';
import AST from '../../../../compiler/2-ast-builder/math_lang_ast';

function dump_tree(label:string, tree:any) {
    const json = JSON.stringify(tree);
    console.log(label, json)
}



describe('MathLang function declaration parser', () => {

    it('Parse [function f() return boolean return true end function] statement' , () => {
        const text = 'function f() return boolean return true end function';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result);
        // dump_tree('ast', parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const result = {
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_FUNCTION,
                    ic_type: 'boolean',
                    name: 'f',
                    operands: {
                        type: AST.EXPR_ARGS_IDS,
                        ic_type: 'ARRAY',
                        ic_subtypes: [
                            'UNKNOW'
                        ],
                        items:<any>undefined
                    },
                    block: [
                        {
                            type:AST.STAT_RETURN,
                            ic_type:'KEYWORD',
                            expression:{
                                type:AST.EXPR_UNOP_PRE_TRUE,
                                ic_type:'KEYWORD'
                            }
                        }
                    ]
                }
            ]
        }
        expect(parser_result.ast).eql(result);
    });

    it('Parse [function f(x) return boolean return true end function] statement' , () => {
        const text = 'function f(x) return boolean return true end function';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result);
        // dump_tree('ast', parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const result = {
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_FUNCTION,
                    ic_type: 'boolean',
                    name: 'f',
                    operands: {
                        type: AST.EXPR_ARGS_IDS,
                        ic_type: 'ARRAY',
                        ic_subtypes: [
                            'INTEGER'
                        ],
                        items:['x']
                    },
                    block: [
                        {
                            type:AST.STAT_RETURN,
                            ic_type:'KEYWORD',
                            expression:{
                                type:AST.EXPR_UNOP_PRE_TRUE,
                                ic_type:'KEYWORD'
                            }
                        }
                    ]
                }
            ]
        }
        expect(parser_result.ast).eql(result);
    });

    it('Parse [function f(x is bigfloat) return boolean return 1+2 end function] statement' , () => {
        const text = 'function f(x is bigfloat) return boolean return 1+2 end function';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result);
        // dump_tree('ast', parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const nomembers = <any>undefined;
        const result = {
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_FUNCTION,
                    ic_type: 'boolean',
                    name: 'f',
                    operands: {
                        type: AST.EXPR_ARGS_IDS,
                        ic_type: 'ARRAY',
                        ic_subtypes: [
                            'bigfloat'
                        ],
                        items:['x']
                    },
                    block: [
                        {
                            type:AST.STAT_RETURN,
                            ic_type:'INTEGER',
                            expression:{
                                type:AST.EXPR_BINOP_ADDSUB,
                                ic_type:'INTEGER',
                                lhs:{
                                    type:'INTEGER',
                                    ic_type:'INTEGER',
                                    value:'1',
                                    members:nomembers
                                },
                                operator:{
                                    ic_function:'add',
                                    type:AST.EXPR_BINOP,
                                    value:'+'
                                },
                                rhs:{
                                    type:'INTEGER',
                                    ic_type:'INTEGER',
                                    value:'2',
                                    members:nomembers
                                }
                            }
                        }
                    ]
                }
            ]
        }
        expect(parser_result.ast).eql(result);
    });

    it('Parse [function f(x is BIGFLOAT, y is STRING) return STRING return x+y end function] statement' , () => {
        const text = 'function f(x is BIGFLOAT, y is STRING) return STRING return x+y end function';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result.ast_errors);
        // dump_tree('ast', parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const nomembers = <any>undefined;
        const result = {
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_FUNCTION,
                    ic_type: 'STRING',
                    name: 'f',
                    operands: {
                        type: AST.EXPR_ARGS_IDS,
                        ic_type: 'ARRAY',
                        ic_subtypes: [
                            'BIGFLOAT', 'STRING'
                        ],
                        items:['x', 'y']
                    },
                    block: [
                        {
                            type:AST.STAT_RETURN,
                            ic_type:'STRING',
                            expression:{
                                type:AST.EXPR_BINOP_ADDSUB,
                                ic_type:'STRING',
                                lhs:{
                                    type:AST.EXPR_MEMBER_ID,
                                    ic_type:'BIGFLOAT',
                                    name:'x',
                                    members:nomembers
                                },
                                operator:{
                                    ic_function:'add',
                                    type:AST.EXPR_BINOP,
                                    value:'+'
                                },
                                rhs:{
                                    type:AST.EXPR_MEMBER_ID,
                                    ic_type:'STRING',
                                    name:'y',
                                    members:nomembers
                                }
                            }
                        }
                    ]
                }
            ]
        }
        expect(parser_result.ast).eql(result);
    });

    it('Parse complex functions program (cross unordered references of variables and functions' , () => {
        const text = `
        begin
            b=m2(12)
        end
        function myfunc(x is BIGFLOAT, y is INTEGER) return BIGFLOAT
            if x + y > 0 then
                return x + y
            end if

            return x + m2(y) + a
        end function
        function m2(x is INTEGER) return INTEGER return x*2 end function
        a = 456
        `;
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result.ast_errors);
        // dump_tree('ast', parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const json_result = `{
            "type": "PROGRAM",
            "block": [
                {
                    "type": "BLOCK",
                    "statements":[
                        {
                            "type": "ASSIGN_STATEMENT",
                            "ic_type": "INTEGER",
                            "name": "b",
                            "is_async":false,
                            "expression": {
                                "name":"m2",
                                "type": "ID_MEMBER_EXPRESSION",
                                "ic_type": "INTEGER",
                                "members":{
                                    "ic_subtypes":["INTEGER"],
                                    "ic_type":"ARRAY",
                                    "items":[
                                        {
                                            "type": "INTEGER",
                                            "ic_type": "INTEGER",
                                            "value": "12"
                                        }
                                    ],
                                    "type":"ARGS_EXPRESSION"
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "ASSIGN_STATEMENT",
                    "ic_type": "INTEGER",
                    "name": "a",
                    "is_async":false,
                    "expression": {
                        "type": "INTEGER",
                        "ic_type": "INTEGER",
                        "value": "456"
                    }
                },
                {
                    "type": "FUNCTION_STATEMENT",
                    "ic_type": "BIGFLOAT",
                    "name": "myfunc",
                    "operands": {
                        "type": "ARGIDS_EXPRESSION",
                        "ic_type": "ARRAY",
                        "ic_subtypes": [
                            "BIGFLOAT",
                            "INTEGER"
                        ],
                        "items": [
                            "x",
                            "y"
                        ]
                    },
                    "block": [
                        {
                            "type": "IF_STATEMENT",
                            "condition": {
                                "type": "COMPARATOR_EXPRESSION",
                                "ic_type": "BOOLEAN",
                                "lhs": {
                                    "type": "ADDSUB_EXPRESSION",
                                    "ic_type": "BIGFLOAT",
                                    "lhs": {
                                        "type": "ID_MEMBER_EXPRESSION",
                                        "ic_type": "BIGFLOAT",
                                        "name": "x"
                                    },
                                    "operator": {
                                        "ic_function":"add",
                                        "type": "BINOP",
                                        "value": "+"
                                    },
                                    "rhs": {
                                        "type": "ID_MEMBER_EXPRESSION",
                                        "ic_type": "INTEGER",
                                        "name": "y"
                                    }
                                },
                                "operator": {
                                    "ic_function":"sup",
                                    "type": "BINOP",
                                    "value": ">"
                                },
                                "rhs": {
                                    "type": "INTEGER",
                                    "ic_type": "INTEGER",
                                    "value": "0"
                                }
                            },
                            "then": [
                                {
                                    "type": "RETURN_STATEMENT",
                                    "ic_type": "BIGFLOAT",
                                    "expression": {
                                        "type": "ADDSUB_EXPRESSION",
                                        "ic_type": "BIGFLOAT",
                                        "lhs": {
                                            "type": "ID_MEMBER_EXPRESSION",
                                            "ic_type": "BIGFLOAT",
                                            "name": "x"
                                        },
                                        "operator": {
                                            "ic_function":"add",
                                            "type": "BINOP",
                                            "value": "+"
                                        },
                                        "rhs": {
                                            "type": "ID_MEMBER_EXPRESSION",
                                            "ic_type": "INTEGER",
                                            "name": "y"
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            "type": "RETURN_STATEMENT",
                            "ic_type": "BIGFLOAT",
                            "expression": {
                                "type": "ADDSUB_EXPRESSION",
                                "ic_type": "BIGFLOAT",
                                "lhs": {
                                    "type": "ADDSUB_EXPRESSION",
                                    "ic_type": "BIGFLOAT",
                                    "lhs": {
                                        "type": "ID_MEMBER_EXPRESSION",
                                        "ic_type": "BIGFLOAT",
                                        "name": "x"
                                    },
                                    "operator": {
                                        "ic_function":"add",
                                        "type": "BINOP",
                                        "value": "+"
                                    },
                                    "rhs": {
                                        "type": "ID_MEMBER_EXPRESSION",
                                        "ic_type": "INTEGER",
                                        "name": "m2",
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
                                                    "name": "y"
                                                }
                                            ]
                                        }
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
                                    "name": "a"
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "FUNCTION_STATEMENT",
                    "ic_type": "INTEGER",
                    "name": "m2",
                    "operands": {
                        "type": "ARGIDS_EXPRESSION",
                        "ic_type": "ARRAY",
                        "ic_subtypes": [
                            "INTEGER"
                        ],
                        "items": [
                            "x"
                        ]
                    },
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
                                    "name": "x"
                                },
                                "operator": {
                                    "ic_function":"mul",
                                    "type": "BINOP",
                                    "value": "*"
                                },
                                "rhs": {
                                    "type": "INTEGER",
                                    "ic_type": "INTEGER",
                                    "value": "2"
                                }
                            }
                        }
                    ]
                }
            ]
        }`;
        const expected_result_ast_json = JSON.parse(json_result);
        const parser_result_ast_json = JSON.stringify(parser_result.ast);
        expect(JSON.parse(parser_result_ast_json)).eql(expected_result_ast_json);
    });
});