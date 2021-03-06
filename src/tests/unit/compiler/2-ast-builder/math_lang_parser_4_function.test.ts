import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { IAstNodeKindOf as AST } from '../../../../core/icompiler_ast_node';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';



const EMPTY_ARRAY = <any>[];

describe('MathLang function declaration parser', () => {
    const compiler = new MathLangCompiler();

    it('Parse [function f() as BOOLEAN return true end function] statement' , () => {
        compiler.reset();
        const text = 'function f() as BOOLEAN return true end function';
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 0;
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
            ast_code:AST.PROGRAM,
            modules:[
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:EMPTY_ARRAY,
                    variables:EMPTY_ARRAY,
                    functions:[
                        {
                            ast_code:AST.STAT_FUNCTION,
                            ic_type: compiler.TYPE_BOOLEAN,
                            func_name: 'f',
                            is_exported:false,
                            operands_types:EMPTY_ARRAY,
                            operands_names:EMPTY_ARRAY,
                            statements: [
                                {
                                    ast_code:AST.STAT_RETURN,
                                    ic_type:compiler.TYPE_BOOLEAN,
                                    expression:{
                                        ast_code:AST.EXPR_PRIMARY_TRUE,
                                        ic_type:compiler.TYPE_BOOLEAN,
                                        value:'TRUE'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse [function f(x) as BOOLEAN return true end function] statement' , () => {
        compiler.reset();
        const text = 'function f(x) as BOOLEAN return true end function';
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 0;
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
            ast_code:AST.PROGRAM,
            modules:[
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:EMPTY_ARRAY,
                    variables:EMPTY_ARRAY,
                    functions:[
                        {
                            ast_code:AST.STAT_FUNCTION,
                            ic_type: compiler.TYPE_BOOLEAN,
                            func_name: 'f',
                            is_exported:false,
                            operands_types:[compiler.TYPE_INTEGER],
                            operands_names:['x'],
                            statements: [
                                {
                                    ast_code:AST.STAT_RETURN,
                                    ic_type:compiler.TYPE_BOOLEAN,
                                    expression:{
                                        ast_code:AST.EXPR_PRIMARY_TRUE,
                                        ic_type:compiler.TYPE_BOOLEAN,
                                        value:'TRUE'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [function f(x is BIGFLOAT) as BOOLEAN return 1+2 end function] statement' , () => {
        compiler.reset();
        const text = 'function f(x is BIGFLOAT) as BOOLEAN return 1+2 end function';
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 0;
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
            ast_code:AST.PROGRAM,
            modules:[
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:EMPTY_ARRAY,
                    variables:EMPTY_ARRAY,
                    functions:[
                        {
                            ast_code:AST.STAT_FUNCTION,
                            ic_type: compiler.TYPE_BOOLEAN,
                            func_name: 'f',
                            is_exported:false,
                            operands_types:[compiler.TYPE_BIGFLOAT],
                            operands_names:['x'],
                            statements: [
                                {
                                    ast_code:AST.STAT_RETURN,
                                    ic_type:compiler.TYPE_INTEGER,
                                    expression:{
                                        ast_code:AST.EXPR_BINOP_ADDSUB,
                                        ic_type:compiler.TYPE_INTEGER,
                                        lhs:{
                                            ast_code:AST.EXPR_PRIMARY_INTEGER,
                                            ic_type:compiler.TYPE_INTEGER,
                                            value:'1'
                                        },
                                        operator:{
                                            ic_function:'add',
                                            ast_code:AST.EXPR_BINOP,
                                            value:'+'
                                        },
                                        rhs:{
                                            ast_code:AST.EXPR_PRIMARY_INTEGER,
                                            ic_type:compiler.TYPE_INTEGER,
                                            value:'2'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [a=456 function f(x is BIGFLOAT) as BOOLEAN return a+2 end function] statement' , () => {
        compiler.reset();
        const text = 'a=456 function f(x is BIGFLOAT) as BOOLEAN return a+2 end function';
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 0;
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
            ast_code:AST.PROGRAM,
            modules:[
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:EMPTY_ARRAY,
                    variables:[
                        {
                            ast_code: AST.STAT_ASSIGN_VARIABLE,
                            "ic_type": compiler.TYPE_INTEGER,
                            "name": "a",
                            "is_async":false,
                            "is_exported":false,
                            "members":EMPTY_ARRAY,
                            "expression": "456"
                        }
                    ],
                    functions:[
                        {
                            ast_code:AST.STAT_FUNCTION,
                            ic_type: compiler.TYPE_BOOLEAN,
                            func_name: 'f',
                            is_exported:false,
                            operands_types:[compiler.TYPE_BIGFLOAT],
                            operands_names:['x'],
                            statements: [
                                {
                                    ast_code:AST.STAT_RETURN,
                                    ic_type:compiler.TYPE_INTEGER,
                                    expression:{
                                        ast_code:AST.EXPR_BINOP_ADDSUB,
                                        ic_type:compiler.TYPE_INTEGER,
                                        lhs:{
                                            ast_code:AST.EXPR_MEMBER_ID,
                                            ic_type:compiler.TYPE_INTEGER,
                                            name:'a',
                                            members:EMPTY_ARRAY
                                        },
                                        operator:{
                                            ic_function:'add',
                                            ast_code:AST.EXPR_BINOP,
                                            value:'+'
                                        },
                                        rhs:{
                                            ast_code:AST.EXPR_PRIMARY_INTEGER,
                                            ic_type:compiler.TYPE_INTEGER,
                                            value:'2'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });


    it('Parse [function f(x is BIGFLOAT, y is STRING) as STRING return x+y end function] statement' , () => {
        compiler.reset();
        const text = 'function f(x is BIGFLOAT, y is STRING) as STRING return x+y end function';
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 0;
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
            ast_code:AST.PROGRAM,
            modules:[
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:EMPTY_ARRAY,
                    variables:EMPTY_ARRAY,
                    functions:[
                        {
                            ast_code:AST.STAT_FUNCTION,
                            ic_type: compiler.TYPE_STRING,
                            func_name: 'f',
                            is_exported:false,
                            operands_types:[compiler.TYPE_BIGFLOAT, compiler.TYPE_STRING],
                            operands_names:['x', 'y'],
                            statements: [
                                {
                                    ast_code:AST.STAT_RETURN,
                                    ic_type:compiler.TYPE_STRING,
                                    expression:{
                                        ast_code:AST.EXPR_BINOP_ADDSUB,
                                        ic_type:compiler.TYPE_STRING,
                                        lhs:{
                                            ast_code:AST.EXPR_MEMBER_ID,
                                            ic_type:compiler.TYPE_BIGFLOAT,
                                            name:'x',
                                            members:EMPTY_ARRAY
                                        },
                                        operator:{
                                            ic_function:'add',
                                            ast_code:AST.EXPR_BINOP,
                                            value:'+'
                                        },
                                        rhs:{
                                            ast_code:AST.EXPR_MEMBER_ID,
                                            ic_type:compiler.TYPE_STRING,
                                            name:'y',
                                            members:EMPTY_ARRAY
                                        }
                                    }
                                }
                            ]
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
        function main() as UNKNOW
            b=m2(12)
        end function
        function myfunc(x is BIGFLOAT, y is INTEGER) as BIGFLOAT
            if x + y > 0 then
                return x + y
            end if

            return x + m2(y) + a
        end function
        function m2(x is INTEGER) as INTEGER return x*2 end function
        a = 456
        `;
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 0;
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
            ast_code: AST.PROGRAM,
            modules:[
                {
                    ast_code:AST.STAT_MODULE,
                    module_name:'default',
                    uses:EMPTY_ARRAY,
                    variables:[
                        {
                            ast_code: AST.STAT_ASSIGN_VARIABLE,
                            "ic_type": compiler.TYPE_INTEGER,
                            "name": "a",
                            "is_async":false,
                            "is_exported":false,
                            "members":EMPTY_ARRAY,
                            "expression": "456"
                        }
                    ],
                    functions:[
                        {
                            ast_code: "FUNCTION_STATEMENT",
                            "ic_type": compiler.TYPE_UNKNOW,
                            "func_name": "main",
                            "is_exported":false,
                            "operands_types": EMPTY_ARRAY,
                            "operands_names": EMPTY_ARRAY,
                            "statements": [
                                {
                                    ast_code: AST.STAT_ASSIGN_VARIABLE,
                                    "ic_type": compiler.TYPE_INTEGER,
                                    "name": "b",
                                    "is_async":false,
                                    "members":EMPTY_ARRAY,
                                    "expression": {
                                        "name":"m2",
                                        ast_code: AST.EXPR_MEMBER_FUNC_CALL,
                                        "ic_type": compiler.TYPE_INTEGER,
                                        "members":EMPTY_ARRAY,
                                        "operands_types":[compiler.TYPE_INTEGER],
                                        "operands_expressions":[
                                            {
                                                ast_code: AST.EXPR_PRIMARY_INTEGER,
                                                "ic_type": compiler.TYPE_INTEGER,
                                                "value": "12"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            ast_code: "FUNCTION_STATEMENT",
                            "ic_type": compiler.TYPE_BIGFLOAT,
                            "func_name": "myfunc",
                            "is_exported":false,
                            "operands_types": [compiler.TYPE_BIGFLOAT,compiler.TYPE_INTEGER],
                            "operands_names": ["x", "y"],
                            "statements": [
                                {
                                    ast_code: "IF_STATEMENT",
                                    "condition": {
                                        ast_code: "COMPARATOR_EXPRESSION",
                                        "ic_type": compiler.TYPE_BOOLEAN,
                                        "lhs": {
                                            ast_code: "ADDSUB_EXPRESSION",
                                            "ic_type": compiler.TYPE_BIGFLOAT,
                                            "lhs": {
                                                ast_code: "ID_MEMBER_EXPRESSION",
                                                "ic_type": compiler.TYPE_BIGFLOAT,
                                                "name": "x",
                                                "members":EMPTY_ARRAY
                                            },
                                            "operator": {
                                                "ic_function":"add",
                                                ast_code: "BINOP",
                                                "value": "+"
                                            },
                                            "rhs": {
                                                ast_code: "ID_MEMBER_EXPRESSION",
                                                "ic_type": compiler.TYPE_INTEGER,
                                                "name": "y",
                                                "members":EMPTY_ARRAY
                                            }
                                        },
                                        "operator": {
                                            "ic_function":"sup",
                                            ast_code: "BINOP",
                                            "value": ">"
                                        },
                                        "rhs": {
                                            ast_code: AST.EXPR_PRIMARY_INTEGER,
                                            "ic_type": compiler.TYPE_INTEGER,
                                            "value": "0"
                                        }
                                    },
                                    "then": [
                                        {
                                            ast_code: "RETURN_STATEMENT",
                                            "ic_type": compiler.TYPE_BIGFLOAT,
                                            "expression": {
                                                ast_code: "ADDSUB_EXPRESSION",
                                                "ic_type": compiler.TYPE_BIGFLOAT,
                                                "lhs": {
                                                    ast_code: "ID_MEMBER_EXPRESSION",
                                                    "ic_type": compiler.TYPE_BIGFLOAT,
                                                    "name": "x",
                                                    "members":EMPTY_ARRAY
                                                },
                                                "operator": {
                                                    "ic_function":"add",
                                                    ast_code: "BINOP",
                                                    "value": "+"
                                                },
                                                "rhs": {
                                                    ast_code: "ID_MEMBER_EXPRESSION",
                                                    "ic_type": compiler.TYPE_INTEGER,
                                                    "name": "y",
                                                    "members":EMPTY_ARRAY
                                                }
                                            }
                                        }
                                    ],
                                    else:<any>undefined
                                },
                                {
                                    ast_code: "RETURN_STATEMENT",
                                    "ic_type": compiler.TYPE_BIGFLOAT,
                                    "expression": {
                                        ast_code: "ADDSUB_EXPRESSION",
                                        "ic_type": compiler.TYPE_BIGFLOAT,
                                        "lhs": {
                                            ast_code: "ADDSUB_EXPRESSION",
                                            "ic_type": compiler.TYPE_BIGFLOAT,
                                            "lhs": {
                                                ast_code: "ID_MEMBER_EXPRESSION",
                                                "ic_type": compiler.TYPE_BIGFLOAT,
                                                "name": "x",
                                                "members":EMPTY_ARRAY
                                            },
                                            "operator": {
                                                "ic_function":"add",
                                                ast_code: "BINOP",
                                                "value": "+"
                                            },
                                            "rhs": {
                                                ast_code: "FUNCTION_CALL_EXPRESSION",
                                                "ic_type": compiler.TYPE_INTEGER,
                                                "name": "m2",
                                                "members":EMPTY_ARRAY,
                                                "operands_types": [compiler.TYPE_INTEGER],
                                                "operands_expressions": [
                                                    {
                                                        ast_code: "ID_MEMBER_EXPRESSION",
                                                        "ic_type": compiler.TYPE_INTEGER,
                                                        "name": "y",
                                                        "members":EMPTY_ARRAY
                                                    }
                                                ]
                                            }
                                        },
                                        "operator": {
                                            "ic_function":"add",
                                            ast_code: "BINOP",
                                            "value": "+"
                                        },
                                        "rhs": {
                                            ast_code: "ID_MEMBER_EXPRESSION",
                                            "ic_type": compiler.TYPE_INTEGER,
                                            "name": "a",
                                            "members":EMPTY_ARRAY
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            ast_code: "FUNCTION_STATEMENT",
                            "ic_type": compiler.TYPE_INTEGER,
                            "func_name": "m2",
                            "is_exported":false,
                            "operands_types": [compiler.TYPE_INTEGER],
                            "operands_names": ["x"],
                            "statements": [
                                {
                                    ast_code: "RETURN_STATEMENT",
                                    "ic_type": compiler.TYPE_INTEGER,
                                    "expression": {
                                        ast_code: "MULTDIV_EXPRESSION",
                                        "ic_type": compiler.TYPE_INTEGER,
                                        "lhs": {
                                            ast_code: "ID_MEMBER_EXPRESSION",
                                            "ic_type": compiler.TYPE_INTEGER,
                                            "name": "x",
                                            "members":EMPTY_ARRAY
                                        },
                                        "operator": {
                                            "ic_function":"mul",
                                            ast_code: "BINOP",
                                            "value": "*"
                                        },
                                        "rhs": {
                                            ast_code: AST.EXPR_PRIMARY_INTEGER,
                                            "ic_type": compiler.TYPE_INTEGER,
                                            "value": "2"
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        expect(compiler_ast).eql(expected_ast);
    });
});