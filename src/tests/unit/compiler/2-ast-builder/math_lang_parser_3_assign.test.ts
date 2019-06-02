import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../../../compiler/math_lang_types';
import AST from '../../../../compiler/2-ast-builder/math_lang_ast';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../../../features/default_types';



const EMPTY_ARRAY = <any>[];

describe('MathLang assign parser', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    it('Parse assign a=456 statement' , () => {
        compiler.reset();
        const text = 'a=456';
        const result = compiler.compile_ast(text, 'statement');
        const errors = compiler.get_errors();

        // ERRORS
        const expected_errors = 0;
        if (errors.length != expected_errors){
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
            type:AST.STAT_ASSIGN_VARIABLE,
            ic_type: TYPES.INTEGER,
            name:'a',
            is_async: false,
            members:EMPTY_ARRAY,
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
            type:AST.BLOCK,
            statements:[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type: TYPES.INTEGER,
                    name:'a',
                    is_async: false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'12'
                    }
                },
                {
                    type:AST.STAT_ASSIGN_ATTRIBUTE,
                    ic_type: TYPES.INTEGER,
                    name:'a',
                    is_async: false,
                    members:[
                        {
                            type: AST.EXPR_MEMBER_ATTRIBUTE,
                            ic_type: TYPES.INTEGER,
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
        const expected_ast = {
            type:AST.PROGRAM,
            block:[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type: TYPES.INTEGER,
                    name:'b',
                    is_async: false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'5'
                    }
                },
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type: TYPES.INTEGER,
                    name:'a',
                    is_async: false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:AST.EXPR_BINOP_ADDSUB,
                        ic_type: TYPES.INTEGER,
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
                                        name:'b',
                                        members:EMPTY_ARRAY
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
        const expected_ast = {
            type:AST.STAT_ASSIGN_FUNCTION,
            ic_type: TYPES.FLOAT,
            name:'f',
            is_async: false,
            members:EMPTY_ARRAY,
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
                                members:EMPTY_ARRAY
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

    it('Parse assign [fxy(x,y)=456 + (++x*8)] statement' , () => {
        compiler.reset();
        const text = 'fxy(x,y)=456 + (++x*8)';
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
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.STAT_ASSIGN_FUNCTION,
            ic_type: TYPES.INTEGER,
            name:'fxy',
            is_async: false,
            operands_types: [TYPES.INTEGER, TYPES.INTEGER],
            operands_names:['x','y'],
            members:EMPTY_ARRAY,
            expression: {
                type:AST.EXPR_BINOP_ADDSUB,
                ic_type: TYPES.INTEGER,
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
                                members:EMPTY_ARRAY
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

    it('Parse assign [fxy(x is INTEGER,y is FLOAT)=456 + (++x*8)] statement' , () => {
        compiler.reset();
        const text = 'fxy(x is INTEGER,y is FLOAT)=456 + (++x*8)';
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
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.STAT_ASSIGN_FUNCTION,
            ic_type: TYPES.INTEGER,
            name:'fxy',
            is_async: false,
            operands_types: [TYPES.INTEGER, TYPES.FLOAT],
            operands_names:['x','y'],
            members:EMPTY_ARRAY,
            expression: {
                type:AST.EXPR_BINOP_ADDSUB,
                ic_type: TYPES.INTEGER,
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
                                members:EMPTY_ARRAY
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

    it('Parse assign [fxy(x,y is FLOAT)=456 + (++x*8)] statement' , () => {
        compiler.reset();
        const text = 'fxy(x,y is FLOAT)=456 + (++x*8)';
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
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.STAT_ASSIGN_FUNCTION,
            ic_type: TYPES.INTEGER,
            name:'fxy',
            is_async: false,
            operands_types: [TYPES.INTEGER, TYPES.FLOAT],
            operands_names:['x','y'],
            members:EMPTY_ARRAY,
            expression: {
                type:AST.EXPR_BINOP_ADDSUB,
                ic_type: TYPES.INTEGER,
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
                                members:EMPTY_ARRAY
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

    it('Parse assign [begin fxy=0 fxy.a()=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy.a()=456 end';
        const result = compiler.compile_ast(text, 'statement');

        // ERRORS
        const expected_errors = 0;
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
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.BLOCK,
            statements:[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'0'
                    }
                },
                {
                    type:AST.STAT_ASSIGN_METHOD,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:[
                        {
                            type:AST.EXPR_MEMBER_METHOD_DECL,
                            ic_type: TYPES.UNKNOW,
                            func_name:'a',
                            operands_types:EMPTY_ARRAY,
                            operands_expressions:EMPTY_ARRAY
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

    it('Parse assign [begin fxy=0 fxy#a.b(x)=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy#a.b()=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

        // ERRORS
        const expected_errors = 0;
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
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.BLOCK,
            statements:[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'0'
                    }
                },
                {
                    type:AST.STAT_ASSIGN_METHOD,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:[
                        {
                            type:AST.EXPR_MEMBER_ATTRIBUTE,
                            ic_type:TYPES.INTEGER,
                            attribute_name:'a'
                        },
                        {
                            type:AST.EXPR_MEMBER_METHOD_DECL,
                            ic_type: TYPES.UNKNOW,
                            func_name:'b',
                            operands_types:EMPTY_ARRAY,
                            operands_expressions:EMPTY_ARRAY
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

    it('Parse assign [begin fxy=0 fxy#a.b(x,y)=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy#a.b(x,y)=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

        // ERRORS
        const expected_errors = 0;
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
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast = {
            type:AST.BLOCK,
            statements:[
                {
                    type:AST.STAT_ASSIGN_VARIABLE,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,
                    members:EMPTY_ARRAY,
                    expression: {
                        type:TYPES.INTEGER,
                        ic_type: TYPES.INTEGER,
                        value:'0'
                    }
                },
                {
                    type:AST.STAT_ASSIGN_METHOD,
                    ic_type: TYPES.INTEGER,
                    name:'fxy',
                    is_async: false,

                    members:[
                        {
                            type:AST.EXPR_MEMBER_ATTRIBUTE,
                            ic_type:TYPES.INTEGER,
                            attribute_name:'a'
                        },
                        {
                            type:AST.EXPR_MEMBER_METHOD_DECL,
                            ic_type: TYPES.UNKNOW,
                            func_name:'b',
                            operands_types:<any>[TYPES.INTEGER, TYPES.INTEGER],
                            operands_expressions:<any>['x', 'y']
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

    it('Parse assign error [begin fxy=0 fxy.a(x,y)#b=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy.a(x,y)#b=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

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
        expect(errors.length).equals(expected_errors);
    });

    it('Parse assign error [begin fxy=0 fxy.a(x,y).b=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy.a(x,y).b=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

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
        expect(errors.length).equals(expected_errors);
    });

    it('Parse assign error [begin fxy=0 fxy.a=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy.a=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

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
        expect(errors.length).equals(expected_errors);
    });

    it('Parse assign error [begin fxy=0 fxy.a.b=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy=0 fxy.a.b=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

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
        expect(errors.length).equals(expected_errors);
    });

    it('Parse assign error [begin fxy#a=456 end] statement' , () => {
        compiler.reset();
        const text = 'begin fxy#a=456 end';
        const result = compiler.compile_ast(text, 'blockStatement');

        // ERRORS
        const expected_errors = 2;
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
        expect(errors.length).equals(expected_errors);
    });
});