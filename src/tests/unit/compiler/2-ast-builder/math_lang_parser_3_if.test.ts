import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../../../compiler/math_lang_types';
import AST from '../../../../compiler/2-ast-builder/math_lang_ast';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../../../features/default_types';



const EMPTY_ARRAY = <any>[];

describe('MathLang if parser', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

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
                type:TYPES.INTEGER,
                ic_type:TYPES.INTEGER,
                value:'12'
            },
            then:[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type:TYPES.INTEGER,
                    name:'a',
                    is_async:false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type:TYPES.INTEGER,
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
            "block": [
                {
                    "type": AST.STAT_IF,
                    "condition": {
                        "type": AST.EXPR_BINOP_ADDSUB,
                        "ic_type": TYPES.INTEGER,
                        "lhs": {
                            "type": TYPES.INTEGER,
                            "ic_type": TYPES.INTEGER,
                            "value": "12"
                        },
                        "operator": {
                            "ic_function":"add",
                            "type": "BINOP",
                            "value": "+"
                        },
                        "rhs": {
                            "type":TYPES.INTEGER,
                            "ic_type":TYPES.INTEGER,
                            "value": "2"
                        }
                    },
                    "then": [
                        {
                            "type":AST.STAT_ASSIGN_VARIABLE,
                            "ic_type":TYPES.INTEGER,
                            "name": "a",
                            "is_async":false,
                            "members":EMPTY_ARRAY,
                            "expression": {
                                "type":TYPES.INTEGER,
                                "ic_type": TYPES.INTEGER,
                                "value": "456"
                            }
                        },
                        {
                            "type": AST.STAT_ASSIGN_VARIABLE,
                            "ic_type": TYPES.INTEGER,
                            "name": "b",
                            "is_async":false,
                            "members": EMPTY_ARRAY,
                            "expression": {
                                "type": TYPES.INTEGER,
                                "ic_type": TYPES.INTEGER,
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
                type:TYPES.INTEGER,
                ic_type:TYPES.INTEGER,
                value:'12'
            },
            then:[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type:TYPES.INTEGER,
                    name:'a',
                    is_async:false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type:TYPES.INTEGER,
                        value:'456'
                    }
                }
            ],
            else:<any>[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type:TYPES.FLOAT,
                    name:'a',
                    is_async:false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:TYPES.FLOAT,
                        ic_type:TYPES.FLOAT,
                        value:'789.23'
                    }
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });
});