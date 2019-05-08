import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';
import TYPES from '../../../../compiler/3-program_builder/math_lang_types'


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
        const nomembers = <any>undefined;
        const result = {
            type:'ADDSUB_EXPRESSION',
            ic_type:TYPES.INTEGER,
            lhs:{
                type:'INTEGER',
                ic_type:TYPES.INTEGER,
                value:'12',
                members:nomembers
            },
            operator: {
                type:'BINOP',
                value:'+'
            },
            rhs:{
                type:'PARENTHESIS_EXPRESSION',
                ic_type:TYPES.INTEGER,
                expression: {
                    type:'MULTDIV_EXPRESSION',
                    ic_type:TYPES.INTEGER,
                    lhs:{
                        type:'PREUNOP_EXPRESSION',
                        ic_type:TYPES.INTEGER,
                        operator:'++',
                        rhs: {
                            type:'ID_EXPRESSION',
                            ic_type:TYPES.INTEGER,
                            name:'b',
                            members:nomembers
                        }
                    },
                    operator:{
                        type:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        type:'INTEGER',
                        ic_type:TYPES.INTEGER,
                        value:'8',
                        members:nomembers
                    }
                },
                members:nomembers
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
        const nomembers = <any>undefined;
        const result = {
            type:'MULTDIV_EXPRESSION',
            ic_type:TYPES.FLOAT,
            lhs:{
                type:'PARENTHESIS_EXPRESSION',
                ic_type:TYPES.FLOAT,
                expression: {
                    type:'MULTDIV_EXPRESSION',
                    ic_type:TYPES.FLOAT,
                    lhs:{
                        type:'PREUNOP_EXPRESSION',
                        ic_type:TYPES.INTEGER,
                        operator:'--',
                        rhs: {
                            type:'ID_EXPRESSION',
                            ic_type:TYPES.INTEGER,
                            name:'b',
                            members:nomembers
                        }
                    },
                    operator:{
                        type:'BINOP',
                        value:'/'
                    },
                    rhs:{
                        type:'INTEGER',
                        ic_type:TYPES.INTEGER,
                        value:'8',
                        members:nomembers
                    }
                },
                members:nomembers
            },
            operator: {
                type:'BINOP',
                value:'*'
            },
            rhs:{
                type:'INTEGER',
                ic_type:TYPES.INTEGER,
                value:'56',
                members:nomembers
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse 12/!b/78e-12 then statement' , () => {
        const text = '12/!b/78e-12';
        const parser_result = parse(text, false, 'expression');

        // dump_tree('CST of ' + text, parser_result.cst);
        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        const nomembers = <any>undefined;
        const result = {
            type:'MULTDIV_EXPRESSION',
            ic_type:TYPES.FLOAT,
            lhs:{
                type:'INTEGER',
                ic_type:TYPES.INTEGER,
                value:'12',
                members:nomembers
            },
            operator: {
                type:'BINOP',
                value:'/'
            },
            rhs:{
                type:'MULTDIV_EXPRESSION',
                ic_type:TYPES.FLOAT,
                lhs:{
                    type:'PREUNOP_EXPRESSION',
                    ic_type:TYPES.INTEGER,
                    operator:'!',
                    rhs: {
                        type:'ID_EXPRESSION',
                        ic_type:TYPES.INTEGER,
                        name:'b',
                        members:nomembers
                    }
                },
                operator:{
                    type:'BINOP',
                    value:'/'
                },
                rhs:{
                    type:'INTEGER',
                    ic_type:TYPES.INTEGER,
                    value:'78e-12',
                    members:nomembers
                }
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse 12*56+78++ then statement' , () => {
        const text = '12*56+78++';
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
        const nomembers = <any>undefined;
        const result = {
            type:'ADDSUB_EXPRESSION',
            ic_type:TYPES.INTEGER,
            lhs:{
                type:'MULTDIV_EXPRESSION',
                ic_type:TYPES.INTEGER,
                lhs:{
                    type:'INTEGER',
                    ic_type:TYPES.INTEGER,
                    value:'12',
                    members:nomembers
                },
                operator:{
                    type:'BINOP',
                    value:'*'
                },
                rhs:{
                    type:'INTEGER',
                    ic_type:TYPES.INTEGER,
                    value:'56',
                    members:nomembers
                }
            },
            operator: {
                type:'BINOP',
                value:'+'
            },
            rhs:{
                type:'POSTUNOP_EXPRESSION',
                ic_type:TYPES.INTEGER,
                lhs:{
                    type:'INTEGER',
                    ic_type:TYPES.INTEGER,
                    value:'78',
                    members:nomembers
                },
                operator:'++'
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
        const nomembers = <any>undefined;
        const result = {
            type:'COMPARATOR_EXPRESSION',
            ic_type:TYPES.BOOLEAN,
            lhs:{
                type:'ID_EXPRESSION',
                ic_type:TYPES.INTEGER,
                name:'abc_UI_23',
                members:nomembers
            },
            operator:{
                type:'BINOP',
                value:'<'
            },
            rhs:{
                type:'ADDSUB_EXPRESSION',
                ic_type:TYPES.INTEGER,
                lhs:{
                    type:'MULTDIV_EXPRESSION',
                    ic_type:TYPES.INTEGER,
                    lhs:{
                        type:'INTEGER',
                        ic_type:TYPES.INTEGER,
                        value:'12',
                        members:nomembers
                    },
                    operator:{
                        type:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        type:'INTEGER',
                        ic_type:TYPES.INTEGER,
                        value:'56',
                        members:nomembers
                    }
                },
                operator: {
                    type:'BINOP',
                    value:'+'
                },
                rhs:{
                    type:'INTEGER',
                    ic_type:TYPES.INTEGER,
                    value:'78',
                    members:nomembers
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
        const nomembers = <any>undefined;
        const result = {
            type:'COMPARATOR_EXPRESSION',
            ic_type:TYPES.BOOLEAN,
            rhs:{
                type:'ID_EXPRESSION',
                ic_type:TYPES.INTEGER,
                name:'a45Bc',
                members:nomembers
            },
            operator:{
                type:'BINOP',
                value:'>'
            },
            lhs:{
                type:'ADDSUB_EXPRESSION',
                ic_type:TYPES.INTEGER,
                lhs:{
                    type:'MULTDIV_EXPRESSION',
                    ic_type:TYPES.INTEGER,
                    lhs:{
                        type:'INTEGER',
                        ic_type:TYPES.INTEGER,
                        value:'12',
                        members:nomembers
                    },
                    operator:{
                        type:'BINOP',
                        value:'*'
                    },
                    rhs:{
                        type:'INTEGER',
                        ic_type:TYPES.INTEGER,
                        value:'56',
                        members:nomembers
                    }
                },
                operator: {
                    type:'BINOP',
                    value:'+'
                },
                rhs:{
                    type:'INTEGER',
                    ic_type:TYPES.INTEGER,
                    value:'78',
                    members:nomembers
                }
            }
        }
        expect(ast_expr_node).eql(result);
    });
});