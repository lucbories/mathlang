import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';


function dump_ast(label:string, ast:any) {
    const json = JSON.stringify(ast);
    console.log(label, json)
}



describe('MathLang assign parser', () => {

    it('Parse assign a=456 statement' , () => {
        const text = 'a=456';
        const parser_result = parse(text, false, 'statement');

        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_assign_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'ASSIGN_STATEMENT',
            name:'a',
            members:<any>undefined,
            expression: {
                type:'NUMBER',
                value:'456',
                options:empty_array
            }
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign a.b=456 statement' , () => {
        const text = 'a.b=456';
        const parser_result = parse(text, false, 'statement');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_assign_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'ASSIGN_STATEMENT',
            name:'a',
            members:[
                {
                    type: 'DOT_EXPRESSION',
                    node: 'b'
                }
            ],
            expression: {
                type:'NUMBER',
                value:'456',
                options:empty_array
            }
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign a=456 + (++b*8) statement' , () => {
        const text = 'a=456 + (++b*8)';
        const parser_result = parse(text, false, 'statement');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_assign_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'ASSIGN_STATEMENT',
            name:'a',
            members:<any>undefined,
            expression: {
                type:'ADDSUB_EXPRESSION',
                lhs:{
                    type:'NUMBER',
                    value:'456',
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
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign f(x)=456 + (++x*8) statement' , () => {
        const text = 'f(x)=456 + (++x*8)';
        const parser_result = parse(text, false, 'statement');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_assign_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'ASSIGN_STATEMENT',
            name:'f',
            members:[
                {
                    type:'ARGIDS_EXPRESSION',
                    items:['x']
                }
            ],
            expression: {
                type:'ADDSUB_EXPRESSION',
                lhs:{
                    type:'NUMBER',
                    value:'456',
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
                                name:'x',
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
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign fxy(x,y)=456 + (++x*8) statement' , () => {
        const text = 'fxy(x,y)=456 + (++x*8)';
        const parser_result = parse(text, false, 'statement');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_assign_node = parser_result.ast;
        const empty_array:any[] = [];
        const result = {
            type:'ASSIGN_STATEMENT',
            name:'fxy',
            members:[
                {
                    type:'ARGIDS_EXPRESSION',
                    items:['x','y']
                }
            ],
            expression: {
                type:'ADDSUB_EXPRESSION',
                lhs:{
                    type:'NUMBER',
                    value:'456',
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
                                name:'x',
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
        }
        expect(ast_assign_node).eql(result);
    });
});