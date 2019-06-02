import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import TYPES from '../../../../compiler/math_lang_types';
import AST from '../../../../compiler/2-ast-builder/math_lang_ast';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import DEFAULT_TYPES from '../../../../features/default_types';



const EMPTY_ARRAY = <any>[];

describe('MathLang math expression parser', () => {
    const compiler = new MathLangCompiler(DEFAULT_TYPES);

    it('Parse 12+(++b*8) then statement' , () => {
        compiler.reset();
        const text = '12+(++b*8)';
        const result = compiler.compile_ast(text, 'expression');

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
            type:AST.EXPR_BINOP_ADDSUB,
            ic_type:TYPES.UNKNOW,
            lhs:{
                type:TYPES.INTEGER,
                ic_type:TYPES.INTEGER,
                value:'12'
            },
            operator: {
                ic_function:'add',
                type:'BINOP',
                value:'+'
            },
            rhs:{
                type:'PARENTHESIS_EXPRESSION',
                ic_type:TYPES.UNKNOW,
                expression: {
                    type:AST.EXPR_BINOP_MULTDIV,
                    ic_type:TYPES.UNKNOW,
                    lhs:{
                        type:'PREUNOP_EXPRESSION',
                        ic_type:TYPES.UNKNOW,
                        ic_function:'add_one',
                        operator:'++',
                        rhs: {
                            type:AST.EXPR_MEMBER_ID,
                            ic_type:TYPES.UNKNOW,
                            name:'b',
                            members:EMPTY_ARRAY
                        }
                    },
                    operator:{
                        ic_function:'mul',
                        type:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        type:TYPES.INTEGER,
                        ic_type:TYPES.INTEGER,
                        value:'8'
                    }
                }
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse (--b/8)*56 then statement' , () => {
        compiler.reset();
        const text = '(--b/8)*56';
        const result = compiler.compile_ast(text, 'expression');

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
            type:AST.EXPR_BINOP_MULTDIV,
            ic_type:TYPES.UNKNOW,
            lhs:{
                type:'PARENTHESIS_EXPRESSION',
                ic_type:TYPES.UNKNOW,
                expression: {
                    type:AST.EXPR_BINOP_MULTDIV,
                    ic_type:TYPES.UNKNOW,
                    lhs:{
                        type:'PREUNOP_EXPRESSION',
                        ic_type:TYPES.UNKNOW,
                        ic_function:'sub_one',
                        operator:'--',
                        rhs: {
                            type:AST.EXPR_MEMBER_ID,
                            ic_type:TYPES.UNKNOW,
                            name:'b',
                            members:EMPTY_ARRAY
                        }
                    },
                    operator:{
                        ic_function:'div',
                        type:'BINOP',
                        value:'/'
                    },
                    rhs:{
                        type:TYPES.INTEGER,
                        ic_type:TYPES.INTEGER,
                        value:'8'
                    }
                }
            },
            operator: {
                ic_function:'mul',
                type:'BINOP',
                value:'*'
            },
            rhs:{
                type:TYPES.INTEGER,
                ic_type:TYPES.INTEGER,
                value:'56'
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse 12/!b/78e-12 then statement' , () => {
        compiler.reset();
        const text = '12/!b/78e-12';
        const result = compiler.compile_ast(text, 'expression');

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
            type:AST.EXPR_BINOP_MULTDIV,
            ic_type:TYPES.UNKNOW,
            lhs:{
                type:TYPES.INTEGER,
                ic_type:TYPES.INTEGER,
                value:'12'
            },
            operator: {
                ic_function:'div',
                type:'BINOP',
                value:'/'
            },
            rhs:{
                type:AST.EXPR_BINOP_MULTDIV,
                ic_type:TYPES.UNKNOW,
                lhs:{
                    type:'PREUNOP_EXPRESSION',
                    ic_type:TYPES.UNKNOW,
                    ic_function:'factorial',
                    operator:'!',
                    rhs: {
                        type:AST.EXPR_MEMBER_ID,
                        ic_type:TYPES.UNKNOW,
                        name:'b',
                        members:EMPTY_ARRAY
                    }
                },
                operator:{
                    ic_function:'div',
                    type:'BINOP',
                    value:'/'
                },
                rhs:{
                    type:TYPES.INTEGER,
                    ic_type:TYPES.INTEGER,
                    value:'78e-12'
                }
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse 12*56+78++ then statement' , () => {
        compiler.reset();
        const text = '12*56+78++';
        const result = compiler.compile_ast(text, 'expression');

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
            type:AST.EXPR_BINOP_ADDSUB,
            ic_type:TYPES.INTEGER,
            lhs:{
                type:AST.EXPR_BINOP_MULTDIV,
                ic_type:TYPES.INTEGER,
                lhs:{
                    type:TYPES.INTEGER,
                    ic_type:TYPES.INTEGER,
                    value:'12'
                },
                operator:{
                    ic_function:'mul',
                    type:'BINOP',
                    value:'*'
                },
                rhs:{
                    type:TYPES.INTEGER,
                    ic_type:TYPES.INTEGER,
                    value:'56'
                }
            },
            operator: {
                ic_function:'add',
                type:'BINOP',
                value:'+'
            },
            rhs:{
                type:AST.EXPR_UNOP_POST,
                ic_type:TYPES.INTEGER,
                lhs:{
                    type:TYPES.INTEGER,
                    ic_type:TYPES.INTEGER,
                    value:'78'
                },
                ic_function:'add_one',
                operator:'++'
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse abc_UI_23 < 12*56+78 then statement' , () => {
        compiler.reset();
        const text = 'abc_UI_23 < 12*56+78';
        const result = compiler.compile_ast(text, 'expression');

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
            type:AST.EXPR_BINOP_COMPARE,
            ic_type:TYPES.BOOLEAN,
            lhs:{
                type:AST.EXPR_MEMBER_ID,
                ic_type:TYPES.UNKNOW,
                name:'abc_UI_23',
                members:EMPTY_ARRAY
            },
            operator:{
                ic_function:'inf',
                type:'BINOP',
                value:'<'
            },
            rhs:{
                type:AST.EXPR_BINOP_ADDSUB,
                ic_type:TYPES.INTEGER,
                lhs:{
                    type:AST.EXPR_BINOP_MULTDIV,
                    ic_type:TYPES.INTEGER,
                    lhs:{
                        type:TYPES.INTEGER,
                        ic_type:TYPES.INTEGER,
                        value:'12'
                    },
                    operator:{
                        ic_function:'mul',
                        type:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        type:TYPES.INTEGER,
                        ic_type:TYPES.INTEGER,
                        value:'56'
                    }
                },
                operator: {
                    ic_function:'add',
                    type:'BINOP',
                    value:'+'
                },
                rhs:{
                    type:TYPES.INTEGER,
                    ic_type:TYPES.INTEGER,
                    value:'78'
                }
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });

    it('Parse 12*56+78 > a45Bc then statement' , () => {
        compiler.reset();
        const text = '12*56+78 > a45Bc';
        const result = compiler.compile_ast(text, 'expression');

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
            type:AST.EXPR_BINOP_COMPARE,
            ic_type:TYPES.BOOLEAN,
            rhs:{
                type:AST.EXPR_MEMBER_ID,
                ic_type:TYPES.UNKNOW,
                name:'a45Bc',
                members:EMPTY_ARRAY
            },
            operator:{
                ic_function:'sup',
                type:'BINOP',
                value:'>'
            },
            lhs:{
                type:AST.EXPR_BINOP_ADDSUB,
                ic_type:TYPES.INTEGER,
                lhs:{
                    type:AST.EXPR_BINOP_MULTDIV,
                    ic_type:TYPES.INTEGER,
                    lhs:{
                        type:TYPES.INTEGER,
                        ic_type:TYPES.INTEGER,
                        value:'12'
                    },
                    operator:{
                        ic_function:'mul',
                        type:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        type:TYPES.INTEGER,
                        ic_type:TYPES.INTEGER,
                        value:'56'
                    }
                },
                operator: {
                    ic_function:'add',
                    type:'BINOP',
                    value:'+'
                },
                rhs:{
                    type:TYPES.INTEGER,
                    ic_type:TYPES.INTEGER,
                    value:'78'
                }
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });
});