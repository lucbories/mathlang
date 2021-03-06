import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import { IAstNodeKindOf as AST } from '../../../../core/icompiler_ast_node';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';


const EMPTY_ARRAY = <any>[];

describe('MathLang math expression parser', () => {
    const compiler = new MathLangCompiler();

    it('Parse 12+(++b*8) then statement' , () => {
        compiler.reset();
        const text = '12+(++b*8)';
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
            ast_code:AST.EXPR_BINOP_ADDSUB,
            ic_type:compiler.TYPE_UNKNOW,
            lhs:{
                ast_code:AST.EXPR_PRIMARY_INTEGER,
                ic_type:compiler.TYPE_INTEGER,
                value:'12'
            },
            operator: {
                ic_function:'add',
                ast_code:'BINOP',
                value:'+'
            },
            rhs:{
                ast_code:'PARENTHESIS_EXPRESSION',
                ic_type:compiler.TYPE_UNKNOW,
                expression: {
                    ast_code:AST.EXPR_BINOP_MULTDIV,
                    ic_type:compiler.TYPE_UNKNOW,
                    lhs:{
                        ast_code:'PREUNOP_EXPRESSION',
                        ic_type:compiler.TYPE_UNKNOW,
                        ic_function:'add_one',
                        operator:'++',
                        rhs: {
                            ast_code:AST.EXPR_MEMBER_ID,
                            ic_type:compiler.TYPE_UNKNOW,
                            name:'b',
                            members:EMPTY_ARRAY
                        }
                    },
                    operator:{
                        ic_function:'mul',
                        ast_code:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        ast_code:AST.EXPR_PRIMARY_INTEGER,
                        ic_type:compiler.TYPE_INTEGER,
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
            ast_code:AST.EXPR_BINOP_MULTDIV,
            ic_type:compiler.TYPE_UNKNOW,
            lhs:{
                ast_code:'PARENTHESIS_EXPRESSION',
                ic_type:compiler.TYPE_UNKNOW,
                expression: {
                    ast_code:AST.EXPR_BINOP_MULTDIV,
                    ic_type:compiler.TYPE_UNKNOW,
                    lhs:{
                        ast_code:'PREUNOP_EXPRESSION',
                        ic_type:compiler.TYPE_UNKNOW,
                        ic_function:'sub_one',
                        operator:'--',
                        rhs: {
                            ast_code:AST.EXPR_MEMBER_ID,
                            ic_type:compiler.TYPE_UNKNOW,
                            name:'b',
                            members:EMPTY_ARRAY
                        }
                    },
                    operator:{
                        ic_function:'div',
                        ast_code:'BINOP',
                        value:'/'
                    },
                    rhs:{
                        ast_code:AST.EXPR_PRIMARY_INTEGER,
                        ic_type:compiler.TYPE_INTEGER,
                        value:'8'
                    }
                }
            },
            operator: {
                ic_function:'mul',
                ast_code:'BINOP',
                value:'*'
            },
            rhs:{
                ast_code:AST.EXPR_PRIMARY_INTEGER,
                ic_type:compiler.TYPE_INTEGER,
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
            ast_code:AST.EXPR_BINOP_MULTDIV,
            ic_type:compiler.TYPE_UNKNOW,
            lhs:{
                ast_code:AST.EXPR_PRIMARY_INTEGER,
                ic_type:compiler.TYPE_INTEGER,
                value:'12'
            },
            operator: {
                ic_function:'div',
                ast_code:'BINOP',
                value:'/'
            },
            rhs:{
                ast_code:AST.EXPR_BINOP_MULTDIV,
                ic_type:compiler.TYPE_UNKNOW,
                lhs:{
                    ast_code:'PREUNOP_EXPRESSION',
                    ic_type:compiler.TYPE_UNKNOW,
                    ic_function:'factorial',
                    operator:'!',
                    rhs: {
                        ast_code:AST.EXPR_MEMBER_ID,
                        ic_type:compiler.TYPE_UNKNOW,
                        name:'b',
                        members:EMPTY_ARRAY
                    }
                },
                operator:{
                    ic_function:'div',
                    ast_code:'BINOP',
                    value:'/'
                },
                rhs:{
                    ast_code:AST.EXPR_PRIMARY_INTEGER,
                    ic_type:compiler.TYPE_INTEGER,
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
            ast_code:AST.EXPR_BINOP_ADDSUB,
            ic_type:compiler.TYPE_INTEGER,
            lhs:{
                ast_code:AST.EXPR_BINOP_MULTDIV,
                ic_type:compiler.TYPE_INTEGER,
                lhs:{
                    ast_code:AST.EXPR_PRIMARY_INTEGER,
                    ic_type:compiler.TYPE_INTEGER,
                    value:'12'
                },
                operator:{
                    ic_function:'mul',
                    ast_code:'BINOP',
                    value:'*'
                },
                rhs:{
                    ast_code:AST.EXPR_PRIMARY_INTEGER,
                    ic_type:compiler.TYPE_INTEGER,
                    value:'56'
                }
            },
            operator: {
                ic_function:'add',
                ast_code:'BINOP',
                value:'+'
            },
            rhs:{
                ast_code:AST.EXPR_UNOP_POST,
                ic_type:compiler.TYPE_INTEGER,
                lhs:{
                    ast_code:AST.EXPR_PRIMARY_INTEGER,
                    ic_type:compiler.TYPE_INTEGER,
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
            ast_code:AST.EXPR_BINOP_COMPARE,
            ic_type:compiler.TYPE_BOOLEAN,
            lhs:{
                ast_code:AST.EXPR_MEMBER_ID,
                ic_type:compiler.TYPE_UNKNOW,
                name:'abc_UI_23',
                members:EMPTY_ARRAY
            },
            operator:{
                ic_function:'inf',
                ast_code:'BINOP',
                value:'<'
            },
            rhs:{
                ast_code:AST.EXPR_BINOP_ADDSUB,
                ic_type:compiler.TYPE_INTEGER,
                lhs:{
                    ast_code:AST.EXPR_BINOP_MULTDIV,
                    ic_type:compiler.TYPE_INTEGER,
                    lhs:{
                        ast_code:AST.EXPR_PRIMARY_INTEGER,
                        ic_type:compiler.TYPE_INTEGER,
                        value:'12'
                    },
                    operator:{
                        ic_function:'mul',
                        ast_code:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        ast_code:AST.EXPR_PRIMARY_INTEGER,
                        ic_type:compiler.TYPE_INTEGER,
                        value:'56'
                    }
                },
                operator: {
                    ic_function:'add',
                    ast_code:'BINOP',
                    value:'+'
                },
                rhs:{
                    ast_code:AST.EXPR_PRIMARY_INTEGER,
                    ic_type:compiler.TYPE_INTEGER,
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
            ast_code:AST.EXPR_BINOP_COMPARE,
            ic_type:compiler.TYPE_BOOLEAN,
            rhs:{
                ast_code:AST.EXPR_MEMBER_ID,
                ic_type:compiler.TYPE_UNKNOW,
                name:'a45Bc',
                members:EMPTY_ARRAY
            },
            operator:{
                ic_function:'sup',
                ast_code:'BINOP',
                value:'>'
            },
            lhs:{
                ast_code:AST.EXPR_BINOP_ADDSUB,
                ic_type:compiler.TYPE_INTEGER,
                lhs:{
                    ast_code:AST.EXPR_BINOP_MULTDIV,
                    ic_type:compiler.TYPE_INTEGER,
                    lhs:{
                        ast_code:AST.EXPR_PRIMARY_INTEGER,
                        ic_type:compiler.TYPE_INTEGER,
                        value:'12'
                    },
                    operator:{
                        ic_function:'mul',
                        ast_code:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        ast_code:AST.EXPR_PRIMARY_INTEGER,
                        ic_type:compiler.TYPE_INTEGER,
                        value:'56'
                    }
                },
                operator: {
                    ic_function:'add',
                    ast_code:'BINOP',
                    value:'+'
                },
                rhs:{
                    ast_code:AST.EXPR_PRIMARY_INTEGER,
                    ic_type:compiler.TYPE_INTEGER,
                    value:'78'
                }
            }
        }
        expect(compiler_ast).eql(expected_ast);
    });
});