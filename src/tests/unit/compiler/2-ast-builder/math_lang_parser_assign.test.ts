import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../../../compiler/3-program-builder/math_lang_types';
import AST from '../../../../compiler/2-ast-builder/math_lang_ast';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../../../features/default_types';



describe('MathLang assign parser', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    it('Parse assign a=456 statement' , () => {
        compiler.reset();
        const text = 'a=456';
        const result = compiler.compile_ast(text, 'statement');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.STAT_ASSIGN,
            ic_type: TYPES.INTEGER,
            name:'a',
            is_async: false,
            members:nomembers,
            expression: {
                type:TYPES.INTEGER,
                ic_type: TYPES.INTEGER,
                value:'456'
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse assign [begin a=12\\na#b=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin a=12\na#b=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

        // ERRORS
        const expected_errors = 2;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.BLOCK,
            statements:[
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'a',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'12'
                    }
                },
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'a',
                    is_async: false,
                    members:[
                        {
                            type: AST.EXPR_MEMBER_ATTRIBUTE,
                            ic_type: TYPES.UNKNOW,
                            attribute_name: 'b'
                        }
                    ],
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'456'
                    }
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse assign [b=5 a=456 + (++b*8)] statement' , () => {
        compiler.reset();
        const text = 'b=5 a=456 + (++b*8)';
        const result = compiler.compile_ast(text, 'program');

        // ERRORS
        const expected_errors = 3;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'b',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'5'
                    }
                },
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.UNKNOW,
                    name:'a',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:AST.EXPR_BINOP_ADDSUB,
                        ic_type: TYPES.UNKNOW,
                        lhs:{
                            type:TYPES.INTEGER,
                            ic_type: TYPES.INTEGER,
                            value:'456'
                        },
                        operator: {
                            ic_function:'add',
                            type:AST.EXPR_BINOP,
                            value:'+'
                        },
                        rhs:{
                            type:AST.EXPR_PARENTHESIS,
                            ic_type: TYPES.UNKNOW,
                            expression: {
                                type:AST.EXPR_BINOP_MULTDIV,
                                ic_type: TYPES.UNKNOW,
                                lhs:{
                                    type:AST.EXPR_UNOP_PREUNOP,
                                    ic_type: TYPES.UNKNOW,
                                    ic_function:'add_one',
                                    operator:'++',
                                    rhs: {
                                        type:AST.EXPR_MEMBER_ID,
                                        ic_type: TYPES.UNKNOW,
                                        name:'b',
                                        members:nomembers
                                    }
                                },
                                operator:{
                                    ic_function:'mul',
                                    type:AST.EXPR_BINOP,
                                    value:'*'
                                },
                                rhs:{
                                    type:TYPES.INTEGER,
                                    ic_type: TYPES.INTEGER,
                                    value:'8'
                                }
                            }
                        }
                    }
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse assign [f(x is FLOAT)=456 + (++x*8)] statement' , () => {
        compiler.reset();
        const text = 'f(x is FLOAT)=456 + (++x*8)';
        const result = compiler.compile_ast(text, 'statement');

        // ERRORS
        const expected_errors = 1;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
        
            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('compiler_ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // compiler.dump_tree('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.STAT_ASSIGN,
            ic_type: TYPES.FLOAT,
            name:'f',
            is_async: false,
            members:<any>[],
            operands_names:['x'],
            operands_types:[TYPES.FLOAT],
            expression: {
                type:AST.EXPR_BINOP_ADDSUB,
                ic_type: TYPES.FLOAT,
                lhs:{
                    type:TYPES.INTEGER,
                    ic_type: TYPES.INTEGER,
                    value:'456'
                },
                operator: {
                    ic_function:'add',
                    type:AST.EXPR_BINOP,
                    value:'+'
                },
                rhs:{
                    type:AST.EXPR_PARENTHESIS,
                    ic_type: TYPES.FLOAT,
                    expression: {
                        type:AST.EXPR_BINOP_MULTDIV,
                        ic_type: TYPES.FLOAT,
                        lhs:{
                            type:AST.EXPR_UNOP_PREUNOP,
                            ic_type: TYPES.FLOAT,
                            ic_function:'add_one',
                            operator:'++',
                            rhs: {
                                type:AST.EXPR_MEMBER_ID,
                                ic_type: TYPES.FLOAT,
                                name:'x',
                                members:nomembers
                            }
                        },
                        operator:{
                            ic_function:'mul',
                            type:AST.EXPR_BINOP,
                            value:'*'
                        },
                        rhs:{
                            type:TYPES.INTEGER,
                            ic_type: TYPES.INTEGER,
                            value:'8'
                        }
                    }
                }
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });
/*
    it('Parse assign [fxy(x,y)=456 + (++x*8)] statement' , () => {
        compiler.reset();
        const text = 'fxy(x,y)=456 + (++x*8)';
        const result = compiler.compile_ast(text, 'statement');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        expect(result).equals(expected_errors == 0);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.STAT_ASSIGN,
            ic_type: TYPES.INTEGER,
            name:'fxy',
            is_async: false,
            members:{
                type:AST.EXPR_ARGS_IDS,
                ic_type: TYPES.ARRAY,
                ic_subtypes: [TYPES.INTEGER, TYPES.INTEGER],
                items:['x','y']
            },
            expression: {
                type:AST.EXPR_BINOP_ADDSUB,
                ic_type: TYPES.INTEGER,
                lhs:{
                    type:TYPES.INTEGER,
                    ic_type: TYPES.INTEGER,
                    value:'456',
                    members:nomembers
                },
                operator: {
                    ic_function:'add',
                    type:AST.EXPR_BINOP,
                    value:'+'
                },
                rhs:{
                    type:AST.EXPR_PARENTHESIS,
                    ic_type: TYPES.INTEGER,
                    expression: {
                        type:AST.EXPR_BINOP_MULTDIV,
                        ic_type: TYPES.INTEGER,
                        lhs:{
                            type:AST.EXPR_UNOP_PREUNOP,
                            ic_type: TYPES.INTEGER,
                            ic_function:'add_one',
                            operator:'++',
                            rhs: {
                                type:AST.EXPR_MEMBER_ID,
                                ic_type: TYPES.INTEGER,
                                name:'x',
                                members:nomembers
                            }
                        },
                        operator:{
                            ic_function:'mul',
                            type:AST.EXPR_BINOP,
                            value:'*'
                        },
                        rhs:{
                            type:TYPES.INTEGER,
                            ic_type: TYPES.INTEGER,
                            value:'8',
                            members:nomembers
                        }
                    },
                    members:nomembers
                }
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse assign [fxy(x is INTEGER,y is FLOAT)=456 + (++x*8)] statement' , () => {
        compiler.reset();
        const text = 'fxy(x is INTEGER,y is FLOAT)=456 + (++x*8)';
        const result = compiler.compile_ast(text, 'statement');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        expect(result).equals(expected_errors == 0);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.STAT_ASSIGN,
            ic_type: TYPES.INTEGER,
            name:'fxy',
            is_async: false,
            members:{
                type:AST.EXPR_ARGS_IDS,
                ic_type: TYPES.ARRAY,
                ic_subtypes: [TYPES.INTEGER, TYPES.FLOAT],
                items:['x','y']
            },
            expression: {
                type:AST.EXPR_BINOP_ADDSUB,
                ic_type: TYPES.INTEGER,
                lhs:{
                    type:TYPES.INTEGER,
                    ic_type: TYPES.INTEGER,
                    value:'456',
                    members:nomembers
                },
                operator: {
                    ic_function:'add',
                    type:AST.EXPR_BINOP,
                    value:'+'
                },
                rhs:{
                    type:AST.EXPR_PARENTHESIS,
                    ic_type: TYPES.INTEGER,
                    expression: {
                        type:AST.EXPR_BINOP_MULTDIV,
                        ic_type: TYPES.INTEGER,
                        lhs:{
                            type:AST.EXPR_UNOP_PREUNOP,
                            ic_type: TYPES.INTEGER,
                            ic_function:'add_one',
                            operator:'++',
                            rhs: {
                                type:AST.EXPR_MEMBER_ID,
                                ic_type: TYPES.INTEGER,
                                name:'x',
                                members:nomembers
                            }
                        },
                        operator:{
                            ic_function:'mul',
                            type:AST.EXPR_BINOP,
                            value:'*'
                        },
                        rhs:{
                            type:TYPES.INTEGER,
                            ic_type: TYPES.INTEGER,
                            value:'8',
                            members:nomembers
                        }
                    },
                    members:nomembers
                }
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse assign [fxy(x,y is FLOAT)=456 + (++x*8)] statement' , () => {
        compiler.reset();
        const text = 'fxy(x,y is FLOAT)=456 + (++x*8)';
        const result = compiler.compile_ast(text, 'statement');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        expect(result).equals(expected_errors == 0);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.STAT_ASSIGN,
            ic_type: TYPES.INTEGER,
            name:'fxy',
            is_async: false,
            members:{
                type:AST.EXPR_ARGS_IDS,
                ic_type: TYPES.ARRAY,
                ic_subtypes: [TYPES.INTEGER, TYPES.FLOAT],
                items:['x','y']
            },
            expression: {
                type:AST.EXPR_BINOP_ADDSUB,
                ic_type: TYPES.INTEGER,
                lhs:{
                    type:TYPES.INTEGER,
                    ic_type: TYPES.INTEGER,
                    value:'456',
                    members:nomembers
                },
                operator: {
                    ic_function:'add',
                    type:AST.EXPR_BINOP,
                    value:'+'
                },
                rhs:{
                    type:AST.EXPR_PARENTHESIS,
                    ic_type: TYPES.INTEGER,
                    expression: {
                        type:AST.EXPR_BINOP_MULTDIV,
                        ic_type: TYPES.INTEGER,
                        lhs:{
                            type:AST.EXPR_UNOP_PREUNOP,
                            ic_type: TYPES.INTEGER,
                            ic_function:'add_one',
                            operator:'++',
                            rhs: {
                                type:AST.EXPR_MEMBER_ID,
                                ic_type: TYPES.INTEGER,
                                name:'x',
                                members:nomembers
                            }
                        },
                        operator:{
                            ic_function:'mul',
                            type:AST.EXPR_BINOP,
                            value:'*'
                        },
                        rhs:{
                            type:TYPES.INTEGER,
                            ic_type: TYPES.INTEGER,
                            value:'8',
                            members:nomembers
                        }
                    },
                    members:nomembers
                }
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse assign [begin fxy=0 fxy.a=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy.a=456 end';
        const result = compiler.compile_ast(text, 'statement');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        expect(result).equals(expected_errors == 0);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.BLOCK,
            statements:[
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'0',
                        members:nomembers
                    }
                },
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:{
                        type:'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier:'a'
                    },
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'456',
                        members:nomembers
                    }
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse assign [begin fxy=0 fxy.a.b=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy.a.b=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        expect(result).equals(expected_errors == 0);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.BLOCK,
            statements:[
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'0',
                        members:nomembers
                    }
                },
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:{
                        type:'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier:'a',
                        members: {
                            type:'DOT_EXPRESSION',
                            ic_type: 'METHOD_IDENTIFIER',
                            identifier:'b'
                        }
                    },
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'456',
                        members:nomembers
                    }
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse assign [begin fxy=0 fxy.a.b(x,y)=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy.a.b(x,y)=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        expect(result).equals(expected_errors == 0);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.BLOCK,
            statements:[
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'0',
                        members:nomembers
                    }
                },
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:{
                        type:'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier:'a',
                        members:{
                            type:'DOT_EXPRESSION',
                            ic_type: 'METHOD_IDENTIFIER',
                            identifier:'b',
                            members:{
                                type:AST.EXPR_ARGS_IDS,
                                ic_type: TYPES.ARRAY,
                                ic_subtypes: [TYPES.INTEGER, TYPES.INTEGER],
                                items:['x','y']
                            }
                        }
                    },
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'456',
                        members:nomembers
                    }
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse assign [begin fxy=0 fxy.a(x,y).b=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy.a(x,y).b=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        expect(result).equals(expected_errors == 0);
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const nomembers = <any>[];
        const expected_ast = {
            type:AST.BLOCK,
            statements:[
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'0',
                        members:nomembers
                    }
                },
                {
                    type:AST.STAT_ASSIGN,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:{
                        type:'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier:'a',
                        members:{
                            type:AST.EXPR_ARGS_IDS,
                            ic_type: TYPES.ARRAY,
                            ic_subtypes: [TYPES.INTEGER, TYPES.INTEGER],
                            items:['x','y'],
                            members:{
                                type:'DOT_EXPRESSION',
                                ic_type: 'METHOD_IDENTIFIER',
                                identifier:'b'
                            }
                        }
                    },
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'456',
                        members:nomembers
                    }
                }
            ]
        }
        expect(compiler_ast).eql(expected_ast);
    });*/
});