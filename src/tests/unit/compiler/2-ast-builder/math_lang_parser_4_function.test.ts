import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../../../compiler/3-program-builder/math_lang_types';
import AST from '../../../../compiler/2-ast-builder/math_lang_ast';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../../../features/default_types';



const EMPTY_ARRAY = <any>[];

describe('MathLang function declaration parser', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    it('Parse [function f() return boolean return true end function] statement' , () => {
        compiler.reset();
        const text = 'function f() return boolean return true end function';
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 3;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_FUNCTION,
                    ic_type: 'boolean',
                    name: 'f',
                    operands_types:EMPTY_ARRAY,
                    operands_names:EMPTY_ARRAY,
                    block: [
                        {
                            type:AST.STAT_RETURN,
                            ic_type:TYPES.KEYWORD,
                            expression:{
                                type:AST.EXPR_UNOP_PRE_TRUE,
                                ic_type:TYPES.KEYWORD
                            }
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse [function f(x) return boolean return true end function] statement' , () => {
        compiler.reset();
        const text = 'function f(x) return boolean return true end function';
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 3;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_FUNCTION,
                    ic_type: 'boolean',
                    name: 'f',
                    operands_types:[TYPES.INTEGER],
                    operands_names:['x'],
                    block: [
                        {
                            type:AST.STAT_RETURN,
                            ic_type:TYPES.KEYWORD,
                            expression:{
                                type:AST.EXPR_UNOP_PRE_TRUE,
                                ic_type:TYPES.KEYWORD
                            }
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse [function f(x is bigfloat) return boolean return 1+2 end function] statement' , () => {
        compiler.reset();
        const text = 'function f(x is bigfloat) return boolean return 1+2 end function';
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 5;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_FUNCTION,
                    ic_type: 'boolean',
                    name: 'f',
                    operands_types:['bigfloat'],
                    operands_names:['x'],
                    block: [
                        {
                            type:AST.STAT_RETURN,
                            ic_type:TYPES.INTEGER,
                            expression:{
                                type:AST.EXPR_BINOP_ADDSUB,
                                ic_type:TYPES.INTEGER,
                                lhs:{
                                    type:TYPES.INTEGER,
                                    ic_type:TYPES.INTEGER,
                                    value:'1'
                                },
                                operator:{
                                    ic_function:'add',
                                    type:AST.EXPR_BINOP,
                                    value:'+'
                                },
                                rhs:{
                                    type:TYPES.INTEGER,
                                    ic_type:TYPES.INTEGER,
                                    value:'2'
                                }
                            }
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse [function f(x is BIGFLOAT, y is STRING) return STRING return x+y end function] statement' , () => {
        compiler.reset();
        const text = 'function f(x is BIGFLOAT, y is STRING) return STRING return x+y end function';
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 2;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_FUNCTION,
                    ic_type: TYPES.STRING,
                    name: 'f',
                    operands_types:[TYPES.BIGFLOAT, TYPES.STRING],
                    operands_names:['x', 'y'],
                    block: [
                        {
                            type:AST.STAT_RETURN,
                            ic_type:TYPES.STRING,
                            expression:{
                                type:AST.EXPR_BINOP_ADDSUB,
                                ic_type:TYPES.STRING,
                                lhs:{
                                    type:AST.EXPR_MEMBER_ID,
                                    ic_type:TYPES.BIGFLOAT,
                                    name:'x',
                                    members:EMPTY_ARRAY
                                },
                                operator:{
                                    ic_function:'add',
                                    type:AST.EXPR_BINOP,
                                    value:'+'
                                },
                                rhs:{
                                    type:AST.EXPR_MEMBER_ID,
                                    ic_type:TYPES.STRING,
                                    name:'y',
                                    members:EMPTY_ARRAY
                                }
                            }
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse complex functions program (cross unordered references of variables and functions' , () => {
        compiler.reset();
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
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 9;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const json_result = `{
            "type": "PROGRAM",
            "block": [
                {
                    "type": "BLOCK",
                    "statements":[
                        {
                            "type": "ASSIGN_STATEMENT_VARIABLE",
                            "ic_type": "INTEGER",
                            "name": "b",
                            "is_async":false,
                            "members":[],
                            "expression": {
                                "name":"m2",
                                "type": "FUNCTION_CALL_EXPRESSION",
                                "ic_type": "INTEGER",
                                "members":[],
                                "operands_types":["INTEGER"],
                                "operands_expressions":[
                                    {
                                        "type": "INTEGER",
                                        "ic_type": "INTEGER",
                                        "value": "12"
                                    }
                                ]
                            }
                        }
                    ]
                },
                {
                    "type": "ASSIGN_STATEMENT_VARIABLE",
                    "ic_type": "INTEGER",
                    "name": "a",
                    "is_async":false,
                    "members":[],
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
                    "operands_types": ["BIGFLOAT","INTEGER"],
                    "operands_names": ["x", "y"],
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
                                        "name": "x",
                                        "members":[]
                                    },
                                    "operator": {
                                        "ic_function":"add",
                                        "type": "BINOP",
                                        "value": "+"
                                    },
                                    "rhs": {
                                        "type": "ID_MEMBER_EXPRESSION",
                                        "ic_type": "INTEGER",
                                        "name": "y",
                                        "members":[]
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
                                            "name": "x",
                                            "members":[]
                                        },
                                        "operator": {
                                            "ic_function":"add",
                                            "type": "BINOP",
                                            "value": "+"
                                        },
                                        "rhs": {
                                            "type": "ID_MEMBER_EXPRESSION",
                                            "ic_type": "INTEGER",
                                            "name": "y",
                                            "members":[]
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
                                        "name": "x",
                                        "members":[]
                                    },
                                    "operator": {
                                        "ic_function":"add",
                                        "type": "BINOP",
                                        "value": "+"
                                    },
                                    "rhs": {
                                        "type": "FUNCTION_CALL_EXPRESSION",
                                        "ic_type": "INTEGER",
                                        "name": "m2",
                                        "members":[],
                                        "operands_types": ["INTEGER"],
                                        "operands_expressions": [
                                            {
                                                "type": "ID_MEMBER_EXPRESSION",
                                                "ic_type": "INTEGER",
                                                "name": "y",
                                                "members":[]
                                            }
                                        ]
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
                                    "name": "a",
                                    "members":[]
                                }
                            }
                        }
                    ]
                },
                {
                    "type": "FUNCTION_STATEMENT",
                    "ic_type": "INTEGER",
                    "name": "m2",
                    "operands_types": ["INTEGER"],
                    "operands_names": ["x"],
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
                                    "members":[]
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
        const parser_result_ast_json = JSON.stringify(compiler_ast);
        expect(JSON.parse(parser_result_ast_json)).eql(expected_result_ast_json);
    });
});