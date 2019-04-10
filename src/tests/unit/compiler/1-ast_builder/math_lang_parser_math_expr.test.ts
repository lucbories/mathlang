import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';


function dump_tree(label:string, tree:any) {
    const json = JSON.stringify(tree);
    console.log(label, json)
}



describe('MathLang math expression parser', () => {

    it('Parse 12+(++b*8) then statement' , () => {
        const text = '12+(++b*8)';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'ADDSUB_EXPRESSION',
            lhs:{
                type:'NUMBER',
                value:'12',
                options:empty_array
            },
            operator: {
                type:'BINOP',
                value:'+'
            },
            rhs:{
                type:'PARENTHESIS_EXPRESSION',
                expression: {
                    type:'MULTDIV_EXPRESSION',
                    lhs:{
                        type:'PREUNOP_EXPRESSION',
                        operator:'++',
                        rhs: {
                            type:'ID_EXPRESSION',
                            name:'b',
                            options:empty_array
                        }
                    },
                    operator:{
                        type:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        type:'NUMBER',
                        value:'8',
                        options:empty_array
                    }
                },
                options:empty_array
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse (--b/8)*56 then statement' , () => {
        const text = '(--b/8)*56';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'MULTDIV_EXPRESSION',
            lhs:{
                type:'PARENTHESIS_EXPRESSION',
                expression: {
                    type:'MULTDIV_EXPRESSION',
                    lhs:{
                        type:'PREUNOP_EXPRESSION',
                        operator:'--',
                        rhs: {
                            type:'ID_EXPRESSION',
                            name:'b',
                            options:empty_array
                        }
                    },
                    operator:{
                        type:'BINOP',
                        value:'/'
                    },
                    rhs:{
                        type:'NUMBER',
                        value:'8',
                        options:empty_array
                    }
                },
                options:empty_array
            },
            operator: {
                type:'BINOP',
                value:'*'
            },
            rhs:{
                type:'NUMBER',
                value:'56',
                options:empty_array
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse 12/!b/78e-12 then statement' , () => {
        const text = '12/!b/78e-12';
        const parser_result = parse(text, false, 'expression');

        // dump_tree('CST of ' + text, parser_result.cst);
        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'MULTDIV_EXPRESSION',
            lhs:{
                type:'NUMBER',
                value:'12',
                options:empty_array
            },
            operator: {
                type:'BINOP',
                value:'/'
            },
            rhs:{
                type:'MULTDIV_EXPRESSION',
                lhs:{
                    type:'PREUNOP_EXPRESSION',
                    operator:'!',
                    rhs: {
                        type:'ID_EXPRESSION',
                        name:'b',
                        options:empty_array
                    }
                },
                operator:{
                    type:'BINOP',
                    value:'/'
                },
                rhs:{
                    type:'NUMBER',
                    value:'78e-12',
                    options:empty_array
                }
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse 12*56+78 then statement' , () => {
        const text = '12*56+78';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'ADDSUB_EXPRESSION',
            lhs:{
                type:'MULTDIV_EXPRESSION',
                lhs:{
                    type:'NUMBER',
                    value:'12',
                    options:empty_array
                },
                operator:{
                    type:'BINOP',
                    value:'*'
                },
                rhs:{
                    type:'NUMBER',
                    value:'56',
                    options:empty_array
                }
            },
            operator: {
                type:'BINOP',
                value:'+'
            },
            rhs:{
                type:'NUMBER',
                value:'78',
                options:empty_array
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse abc_UI_23 < 12*56+78 then statement' , () => {
        const text = 'abc_UI_23 < 12*56+78';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'COMPARATOR_EXPRESSION',
            lhs:{
                type:'ID_EXPRESSION',
                name:'abc_UI_23',
                options:empty_array
            },
            operator:{
                type:'BINOP',
                value:'<'
            },
            rhs:{
                type:'ADDSUB_EXPRESSION',
                lhs:{
                    type:'MULTDIV_EXPRESSION',
                    lhs:{
                        type:'NUMBER',
                        value:'12',
                        options:empty_array
                    },
                    operator:{
                        type:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        type:'NUMBER',
                        value:'56',
                        options:empty_array
                    }
                },
                operator: {
                    type:'BINOP',
                    value:'+'
                },
                rhs:{
                    type:'NUMBER',
                    value:'78',
                    options:empty_array
                }
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse 12*56+78 > a45Bc then statement' , () => {
        const text = '12*56+78 > a45Bc';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'COMPARATOR_EXPRESSION',
            rhs:{
                type:'ID_EXPRESSION',
                name:'a45Bc',
                options:empty_array
            },
            operator:{
                type:'BINOP',
                value:'>'
            },
            lhs:{
                type:'ADDSUB_EXPRESSION',
                lhs:{
                    type:'MULTDIV_EXPRESSION',
                    lhs:{
                        type:'NUMBER',
                        value:'12',
                        options:empty_array
                    },
                    operator:{
                        type:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        type:'NUMBER',
                        value:'56',
                        options:empty_array
                    }
                },
                operator: {
                    type:'BINOP',
                    value:'+'
                },
                rhs:{
                    type:'NUMBER',
                    value:'78',
                    options:empty_array
                }
            }
        }
        expect(ast_expr_node).eql(result);
    });
});