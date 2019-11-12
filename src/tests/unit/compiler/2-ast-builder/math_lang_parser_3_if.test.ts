import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { IAstNodeKindOf as AST } from '../../../../core/icompiler_ast_node';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';



const EMPTY_ARRAY = <any>[];

describe('MathLang if parser', () => {
    const compiler = new MathLangCompiler();

    it('Parse [if 12 then a=456 end if] statement' , () => {
        compiler.reset();
        const text = 'if 12 then a=456 end if';
        const result = compiler.compile_ast(text, 'statement');

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
            type:AST.STAT_IF,
            condition: {
                type:AST.EXPR_PRIMARY_INTEGER,
                ic_type:compiler.TYPE_INTEGER,
                value:'12'
            },
            then:[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type:compiler.TYPE_INTEGER,
                    name:'a',
                    is_async:false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:AST.EXPR_PRIMARY_INTEGER,
                        ic_type:compiler.TYPE_INTEGER,
                        value:'456'
                    }
                }
            ],
            else:<any>undefined
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse [if 12+2 then a=456 b=89 end if] statement' , () => {
        compiler.reset();
        const text = 'if 12+2 then a=456 b=89 end if';
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
            "type":AST.PROGRAM,
            modules:EMPTY_ARRAY,
            "block": [
                {
                    "type": AST.STAT_IF,
                    "condition": {
                        "type": AST.EXPR_BINOP_ADDSUB,
                        "ic_type": compiler.TYPE_INTEGER,
                        "lhs": {
                            type:AST.EXPR_PRIMARY_INTEGER,
                            "ic_type": compiler.TYPE_INTEGER,
                            "value": "12"
                        },
                        "operator": {
                            "ic_function":"add",
                            "type": "BINOP",
                            "value": "+"
                        },
                        "rhs": {
                            type:AST.EXPR_PRIMARY_INTEGER,
                            "ic_type":compiler.TYPE_INTEGER,
                            "value": "2"
                        }
                    },
                    "then": [
                        {
                            "type":AST.STAT_ASSIGN_VARIABLE,
                            "ic_type":compiler.TYPE_INTEGER,
                            "name": "a",
                            "is_async":false,
                            "members":EMPTY_ARRAY,
                            "expression": {
                                type:AST.EXPR_PRIMARY_INTEGER,
                                "ic_type": compiler.TYPE_INTEGER,
                                "value": "456"
                            }
                        },
                        {
                            "type": AST.STAT_ASSIGN_VARIABLE,
                            "ic_type": compiler.TYPE_INTEGER,
                            "name": "b",
                            "is_async":false,
                            "members": EMPTY_ARRAY,
                            "expression": {
                                type:AST.EXPR_PRIMARY_INTEGER,
                                "ic_type": compiler.TYPE_INTEGER,
                                "value": "89"
                            }
                        }
                    ],
                    else:<any>undefined
                }
            ]
        };
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse if then else statement' , () => {
        compiler.reset();
        const text = 'if 12 then a=456 else a=789.23 end if';
        const result = compiler.compile_ast(text, 'statement');

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
            type:AST.STAT_IF,
            condition: {
                type:AST.EXPR_PRIMARY_INTEGER,
                ic_type:compiler.TYPE_INTEGER,
                value:'12'
            },
            then:[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type:compiler.TYPE_INTEGER,
                    name:'a',
                    is_async:false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:AST.EXPR_PRIMARY_INTEGER,
                        ic_type:compiler.TYPE_INTEGER,
                        value:'456'
                    }
                }
            ],
            else:<any>[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type:compiler.TYPE_FLOAT,
                    name:'a',
                    is_async:false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:AST.EXPR_PRIMARY_FLOAT,
                        ic_type:compiler.TYPE_FLOAT,
                        value:'789.23'
                    }
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
});