import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';


function dump_tree(label:string, tree:any) {
    const json = JSON.stringify(tree);
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
            ic_type: 'INTEGER',
            name:'a',
            members:empty_array,
            expression: {
                type:'INTEGER',
                ic_type: 'INTEGER',
                value:'456',
                members:empty_array
            }
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign a.b=456 statement' , () => {
        const text = 'a=12\na.b=456';
        const parser_result = parse(text, false, 'blockStatement');

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
            type:'BLOCK',
            statements:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'a',
                    members:empty_array,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'12',
                        members:empty_array
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'a',
                    members:{
                        type: 'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier: 'b'
                    },
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'456',
                        members:empty_array
                    }
                }
            ]
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
            ic_type: 'INTEGER',
            name:'a',
            members:empty_array,
            expression: {
                type:'ADDSUB_EXPRESSION',
                ic_type: 'INTEGER',
                lhs:{
                    type:'INTEGER',
                    ic_type: 'INTEGER',
                    value:'456',
                    members:empty_array
                },
                operator: {
                    type:'BINOP',
                    value:'+'
                },
                rhs:{
                    type:'PARENTHESIS_EXPRESSION',
                    ic_type: 'INTEGER',
                    expression: {
                        type:'MULTDIV_EXPRESSION',
                        ic_type: 'INTEGER',
                        lhs:{
                            type:'PREUNOP_EXPRESSION',
                            ic_type: 'INTEGER',
                            operator:'++',
                            rhs: {
                                type:'ID_EXPRESSION',
                                ic_type: 'INTEGER',
                                name:'b',
                                members:empty_array
                            }
                        },
                        operator:{
                            type:'BINOP',
                            value:'*'
                        },
                        rhs:{
                            type:'INTEGER',
                            ic_type: 'INTEGER',
                            value:'8',
                            members:empty_array
                        }
                    },
                    members:empty_array
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
            ic_type: 'INTEGER',
            name:'f',
            members:{
                type:'ARGIDS_EXPRESSION',
                ic_type: 'ARRAY',
                ic_subtypes: ['IDENTIFIER'],
                items:['x']
            },
            expression: {
                type:'ADDSUB_EXPRESSION',
                ic_type: 'INTEGER',
                lhs:{
                    type:'INTEGER',
                    ic_type: 'INTEGER',
                    value:'456',
                    members:empty_array
                },
                operator: {
                    type:'BINOP',
                    value:'+'
                },
                rhs:{
                    type:'PARENTHESIS_EXPRESSION',
                    ic_type: 'INTEGER',
                    expression: {
                        type:'MULTDIV_EXPRESSION',
                        ic_type: 'INTEGER',
                        lhs:{
                            type:'PREUNOP_EXPRESSION',
                            ic_type: 'INTEGER',
                            operator:'++',
                            rhs: {
                                type:'ID_EXPRESSION',
                                ic_type: 'INTEGER',
                                name:'x',
                                members:empty_array
                            }
                        },
                        operator:{
                            type:'BINOP',
                            value:'*'
                        },
                        rhs:{
                            type:'INTEGER',
                            ic_type: 'INTEGER',
                            value:'8',
                            members:empty_array
                        }
                    },
                    members:empty_array
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
            ic_type: 'INTEGER',
            name:'fxy',
            members:{
                type:'ARGIDS_EXPRESSION',
                ic_type: 'ARRAY',
                ic_subtypes: ['IDENTIFIER', 'IDENTIFIER'],
                items:['x','y']
            },
            expression: {
                type:'ADDSUB_EXPRESSION',
                ic_type: 'INTEGER',
                lhs:{
                    type:'INTEGER',
                    ic_type: 'INTEGER',
                    value:'456',
                    members:empty_array
                },
                operator: {
                    type:'BINOP',
                    value:'+'
                },
                rhs:{
                    type:'PARENTHESIS_EXPRESSION',
                    ic_type: 'INTEGER',
                    expression: {
                        type:'MULTDIV_EXPRESSION',
                        ic_type: 'INTEGER',
                        lhs:{
                            type:'PREUNOP_EXPRESSION',
                            ic_type: 'INTEGER',
                            operator:'++',
                            rhs: {
                                type:'ID_EXPRESSION',
                                ic_type: 'INTEGER',
                                name:'x',
                                members:empty_array
                            }
                        },
                        operator:{
                            type:'BINOP',
                            value:'*'
                        },
                        rhs:{
                            type:'INTEGER',
                            ic_type: 'INTEGER',
                            value:'8',
                            members:empty_array
                        }
                    },
                    members:empty_array
                }
            }
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign fxy.a=456 statement' , () => {
        const text = 'fxy.a=456';
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
            ic_type: 'INTEGER',
            name:'fxy',
            members:{
                type:'DOT_EXPRESSION',
                ic_type: 'METHOD_IDENTIFIER',
                identifier:'a'
            },
            expression: {
                type:'INTEGER',
                ic_type: 'INTEGER',
                value:'456',
                members:empty_array
            }
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign fxy=0 fxy.a.b=456 statement' , () => {
        const text = 'fxy=0 fxy.a.b=456';
        const parser_result = parse(text, false, 'blockStatement');

        // console.log(parser_result.cst);
        // dump_tree('cst', parser_result.cst);
        // dump_tree('ast', parser_result.ast);

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
            type:'BLOCK',
            statements:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    members:empty_array,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'0',
                        members:empty_array
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
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
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'456',
                        members:empty_array
                    }
                }
            ]
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign fxy=0 fxy.a.b(x,y)=456 statement' , () => {
        const text = 'fxy=0 fxy.a.b(x,y)=456';
        const parser_result = parse(text, false, 'blockStatement');

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
            type:'BLOCK',
            statements:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    members:empty_array,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'0',
                        members:empty_array
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    members:{
                        type:'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier:'a',
                        members:{
                            type:'DOT_EXPRESSION',
                            ic_type: 'METHOD_IDENTIFIER',
                            identifier:'b',
                            members:{
                                type:'ARGIDS_EXPRESSION',
                                ic_type: 'ARRAY',
                                ic_subtypes: ['IDENTIFIER', 'IDENTIFIER'],
                                items:['x','y']
                            }
                        }
                    },
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'456',
                        members:empty_array
                    }
                }
            ]
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign fxy=0 fxy.a(x,y).b=456 statement' , () => {
        const text = 'fxy=0 fxy.a(x,y).b=456';
        const parser_result = parse(text, false, 'blockStatement');

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
            type:'BLOCK',
            statements:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    members:empty_array,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'0',
                        members:empty_array
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    members:{
                        type:'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier:'a',
                        members:{
                            type:'ARGIDS_EXPRESSION',
                            ic_type: 'ARRAY',
                            ic_subtypes: ['IDENTIFIER', 'IDENTIFIER'],
                            items:['x','y'],
                            members:{
                                type:'DOT_EXPRESSION',
                                ic_type: 'METHOD_IDENTIFIER',
                                identifier:'b'
                            }
                        }
                    },
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'456',
                        members:empty_array
                    }
                }
            ]
        }
        expect(ast_assign_node).eql(result);
    });
});