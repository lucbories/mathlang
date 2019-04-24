import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';


function dump_tree(label:string, tree:any) {
    const json = JSON.stringify(tree);
    console.log(label, json)
}



describe('MathLang function declaration parser', () => {

    it('Parse [function f() return boolean return true end function] statement' , () => {
        const text = 'function f() return boolean return true end function';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result);
        // dump_tree('ast', parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        // const nomembers = <any>undefined;
        const result = {
            type:'PROGRAM',
            block:[
                {
                    type:'FUNCTION_STATEMENT',
                    ic_type: 'boolean',
                    name: 'f',
                    operands: {
                        type: 'ARGIDS_EXPRESSION',
                        ic_type: 'ARRAY',
                        ic_subtypes: [
                            'UNKNOW'
                        ],
                        items:<any>undefined
                    },
                    block: [
                        {
                            type:'RETURN_STATEMENT',
                            ic_type:'KEYWORD',
                            expression:{
                                type:'TRUE',
                                ic_type:'KEYWORD'
                            }
                        }
                    ]
                }
            ]
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse [function f(x) return boolean return true end function] statement' , () => {
        const text = 'function f(x) return boolean return true end function';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result);
        // dump_tree('ast', parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        // const nomembers = <any>undefined;
        const result = {
            type:'PROGRAM',
            block:[
                {
                    type:'FUNCTION_STATEMENT',
                    ic_type: 'boolean',
                    name: 'f',
                    operands: {
                        type: 'ARGIDS_EXPRESSION',
                        ic_type: 'ARRAY',
                        ic_subtypes: [
                            'INTEGER'
                        ],
                        items:['x']
                    },
                    block: [
                        {
                            type:'RETURN_STATEMENT',
                            ic_type:'KEYWORD',
                            expression:{
                                type:'TRUE',
                                ic_type:'KEYWORD'
                            }
                        }
                    ]
                }
            ]
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse [function f(x is bigfloat) return boolean return 1+2 end function] statement' , () => {
        const text = 'function f(x is bigfloat) return boolean return 1+2 end function';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result);
        // dump_tree('ast', parser_result.ast);

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
            type:'PROGRAM',
            block:[
                {
                    type:'FUNCTION_STATEMENT',
                    ic_type: 'boolean',
                    name: 'f',
                    operands: {
                        type: 'ARGIDS_EXPRESSION',
                        ic_type: 'ARRAY',
                        ic_subtypes: [
                            'bigfloat'
                        ],
                        items:['x']
                    },
                    block: [
                        {
                            type:'RETURN_STATEMENT',
                            ic_type:'INTEGER',
                            expression:{
                                type:'ADDSUB_EXPRESSION',
                                ic_type:'INTEGER',
                                lhs:{
                                    type:'INTEGER',
                                    ic_type:'INTEGER',
                                    value:'1',
                                    members:nomembers
                                },
                                operator:{
                                    type:'BINOP',
                                    value:'+'
                                },
                                rhs:{
                                    type:'INTEGER',
                                    ic_type:'INTEGER',
                                    value:'2',
                                    members:nomembers
                                }
                            }
                        }
                    ]
                }
            ]
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse [function f(x is BIGFLOAT, y is STRING) return STRING return x+y end function] statement' , () => {
        const text = 'function f(x is BIGFLOAT, y is STRING) return STRING return x+y end function';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result);
        // dump_tree('ast', parser_result.ast);

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
            type:'PROGRAM',
            block:[
                {
                    type:'FUNCTION_STATEMENT',
                    ic_type: 'STRING',
                    name: 'f',
                    operands: {
                        type: 'ARGIDS_EXPRESSION',
                        ic_type: 'ARRAY',
                        ic_subtypes: [
                            'BIGFLOAT', 'STRING'
                        ],
                        items:['x', 'y']
                    },
                    block: [
                        {
                            type:'RETURN_STATEMENT',
                            ic_type:'STRING',
                            expression:{
                                type:'ADDSUB_EXPRESSION',
                                ic_type:'STRING',
                                lhs:{
                                    type:'ID_EXPRESSION',
                                    ic_type:'BIGFLOAT',
                                    name:'x',
                                    members:nomembers
                                },
                                operator:{
                                    type:'BINOP',
                                    value:'+'
                                },
                                rhs:{
                                    type:'ID_EXPRESSION',
                                    ic_type:'STRING',
                                    name:'y',
                                    members:nomembers
                                }
                            }
                        }
                    ]
                }
            ]
        }
        expect(ast_expr_node).eql(result);
    });
});