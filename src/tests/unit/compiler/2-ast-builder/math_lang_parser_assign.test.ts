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
        const nomembers = <any>undefined;
        const result = {
            type:'ASSIGN_STATEMENT',
            ic_type: 'INTEGER',
            name:'a',
            is_async: false,
            members:nomembers,
            expression: {
                type:'INTEGER',
                ic_type: 'INTEGER',
                value:'456',
                members:nomembers
            }
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign [begin a=12\\na.b=456 end] statement' , () => {
        const text = 'begin a=12\na.b=456 end';
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
        const nomembers = <any>undefined;
        const result = {
            type:'BLOCK',
            statements:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'a',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'12',
                        members:nomembers
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'a',
                    is_async: false,
                    members:{
                        type: 'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier: 'b'
                    },
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'456',
                        members:nomembers
                    }
                }
            ]
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign [b=5 a=456 + (++b*8)] statement' , () => {
        const text = 'b=5 a=456 + (++b*8)';
        const parser_result = parse(text, false, 'program');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_assign_node = parser_result.ast;
        const nomembers = <any>undefined;
        const result = {
            type:'PROGRAM',
            block:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'b',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'5',
                        members:nomembers
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'a',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:'ADDSUB_EXPRESSION',
                        ic_type: 'INTEGER',
                        lhs:{
                            type:'INTEGER',
                            ic_type: 'INTEGER',
                            value:'456',
                            members:nomembers
                        },
                        operator: {
                            ic_function:'add',
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
                                    ic_function:'add_one',
                                    operator:'++',
                                    rhs: {
                                        type:'ID_MEMBER_EXPRESSION',
                                        ic_type: 'INTEGER',
                                        name:'b',
                                        members:nomembers
                                    }
                                },
                                operator:{
                                    ic_function:'mul',
                                    type:'BINOP',
                                    value:'*'
                                },
                                rhs:{
                                    type:'INTEGER',
                                    ic_type: 'INTEGER',
                                    value:'8',
                                    members:nomembers
                                }
                            },
                            members:nomembers
                        }
                    }
                }
            ]
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign [f(x is FLOAT)=456 + (++x*8)] statement' , () => {
        const text = 'f(x is FLOAT)=456 + (++x*8)';
        const parser_result = parse(text, false, 'statement');

        // console.log(parser_result);
        // dump_tree('ast errors', parser_result.ast_errors);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_assign_node = parser_result.ast;
        const nomembers = <any>undefined;
        const result = {
            type:'ASSIGN_STATEMENT',
            ic_type: 'FLOAT',
            name:'f',
            is_async: false,
            members:{
                type:'ARGIDS_EXPRESSION',
                ic_type: 'ARRAY',
                ic_subtypes: ['FLOAT'],
                items:['x']
            },
            expression: {
                type:'ADDSUB_EXPRESSION',
                ic_type: 'FLOAT',
                lhs:{
                    type:'INTEGER',
                    ic_type: 'INTEGER',
                    value:'456',
                    members:nomembers
                },
                operator: {
                    ic_function:'add',
                    type:'BINOP',
                    value:'+'
                },
                rhs:{
                    type:'PARENTHESIS_EXPRESSION',
                    ic_type: 'FLOAT',
                    expression: {
                        type:'MULTDIV_EXPRESSION',
                        ic_type: 'FLOAT',
                        lhs:{
                            type:'PREUNOP_EXPRESSION',
                            ic_type: 'FLOAT',
                            ic_function:'add_one',
                            operator:'++',
                            rhs: {
                                type:'ID_MEMBER_EXPRESSION',
                                ic_type: 'FLOAT',
                                name:'x',
                                members:nomembers
                            }
                        },
                        operator:{
                            ic_function:'mul',
                            type:'BINOP',
                            value:'*'
                        },
                        rhs:{
                            type:'INTEGER',
                            ic_type: 'INTEGER',
                            value:'8',
                            members:nomembers
                        }
                    },
                    members:nomembers
                }
            }
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign [fxy(x,y)=456 + (++x*8)] statement' , () => {
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
        const nomembers = <any>undefined;
        const result = {
            type:'ASSIGN_STATEMENT',
            ic_type: 'INTEGER',
            name:'fxy',
            is_async: false,
            members:{
                type:'ARGIDS_EXPRESSION',
                ic_type: 'ARRAY',
                ic_subtypes: ['INTEGER', 'INTEGER'],
                items:['x','y']
            },
            expression: {
                type:'ADDSUB_EXPRESSION',
                ic_type: 'INTEGER',
                lhs:{
                    type:'INTEGER',
                    ic_type: 'INTEGER',
                    value:'456',
                    members:nomembers
                },
                operator: {
                    ic_function:'add',
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
                            ic_function:'add_one',
                            operator:'++',
                            rhs: {
                                type:'ID_MEMBER_EXPRESSION',
                                ic_type: 'INTEGER',
                                name:'x',
                                members:nomembers
                            }
                        },
                        operator:{
                            ic_function:'mul',
                            type:'BINOP',
                            value:'*'
                        },
                        rhs:{
                            type:'INTEGER',
                            ic_type: 'INTEGER',
                            value:'8',
                            members:nomembers
                        }
                    },
                    members:nomembers
                }
            }
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign [fxy(x is INTEGER,y is FLOAT)=456 + (++x*8)] statement' , () => {
        const text = 'fxy(x is INTEGER,y is FLOAT)=456 + (++x*8)';
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
        const nomembers = <any>undefined;
        const result = {
            type:'ASSIGN_STATEMENT',
            ic_type: 'INTEGER',
            name:'fxy',
            is_async: false,
            members:{
                type:'ARGIDS_EXPRESSION',
                ic_type: 'ARRAY',
                ic_subtypes: ['INTEGER', 'FLOAT'],
                items:['x','y']
            },
            expression: {
                type:'ADDSUB_EXPRESSION',
                ic_type: 'INTEGER',
                lhs:{
                    type:'INTEGER',
                    ic_type: 'INTEGER',
                    value:'456',
                    members:nomembers
                },
                operator: {
                    ic_function:'add',
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
                            ic_function:'add_one',
                            operator:'++',
                            rhs: {
                                type:'ID_MEMBER_EXPRESSION',
                                ic_type: 'INTEGER',
                                name:'x',
                                members:nomembers
                            }
                        },
                        operator:{
                            ic_function:'mul',
                            type:'BINOP',
                            value:'*'
                        },
                        rhs:{
                            type:'INTEGER',
                            ic_type: 'INTEGER',
                            value:'8',
                            members:nomembers
                        }
                    },
                    members:nomembers
                }
            }
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign [fxy(x,y is FLOAT)=456 + (++x*8)] statement' , () => {
        const text = 'fxy(x,y is FLOAT)=456 + (++x*8)';
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
        const nomembers = <any>undefined;
        const result = {
            type:'ASSIGN_STATEMENT',
            ic_type: 'INTEGER',
            name:'fxy',
            is_async: false,
            members:{
                type:'ARGIDS_EXPRESSION',
                ic_type: 'ARRAY',
                ic_subtypes: ['INTEGER', 'FLOAT'],
                items:['x','y']
            },
            expression: {
                type:'ADDSUB_EXPRESSION',
                ic_type: 'INTEGER',
                lhs:{
                    type:'INTEGER',
                    ic_type: 'INTEGER',
                    value:'456',
                    members:nomembers
                },
                operator: {
                    ic_function:'add',
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
                            ic_function:'add_one',
                            operator:'++',
                            rhs: {
                                type:'ID_MEMBER_EXPRESSION',
                                ic_type: 'INTEGER',
                                name:'x',
                                members:nomembers
                            }
                        },
                        operator:{
                            ic_function:'mul',
                            type:'BINOP',
                            value:'*'
                        },
                        rhs:{
                            type:'INTEGER',
                            ic_type: 'INTEGER',
                            value:'8',
                            members:nomembers
                        }
                    },
                    members:nomembers
                }
            }
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign [begin fxy=0 fxy.a=456 end] statement' , () => {
        const text = 'begin fxy=0 fxy.a=456 end';
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
        const nomembers = <any>undefined;
        const result = {
            type:'BLOCK',
            statements:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'0',
                        members:nomembers
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    is_async: false,
                    members:{
                        type:'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier:'a'
                    },
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'456',
                        members:nomembers
                    }
                }
            ]
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign [begin fxy=0 fxy.a.b=456 end] statement' , () => {
        const text = 'begin fxy=0 fxy.a.b=456 end';
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
        const nomembers = <any>undefined;
        const result = {
            type:'BLOCK',
            statements:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'0',
                        members:nomembers
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
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
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'456',
                        members:nomembers
                    }
                }
            ]
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign [begin fxy=0 fxy.a.b(x,y)=456 end] statement' , () => {
        const text = 'begin fxy=0 fxy.a.b(x,y)=456 end';
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
        const nomembers = <any>undefined;
        const result = {
            type:'BLOCK',
            statements:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'0',
                        members:nomembers
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
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
                                type:'ARGIDS_EXPRESSION',
                                ic_type: 'ARRAY',
                                ic_subtypes: ['INTEGER', 'INTEGER'],
                                items:['x','y']
                            }
                        }
                    },
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'456',
                        members:nomembers
                    }
                }
            ]
        }
        expect(ast_assign_node).eql(result);
    });

    it('Parse assign [begin fxy=0 fxy.a(x,y).b=456 end] statement' , () => {
        const text = 'begin fxy=0 fxy.a(x,y).b=456 end';
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
        const nomembers = <any>undefined;
        const result = {
            type:'BLOCK',
            statements:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    is_async: false,
                    members:nomembers,
                    expression: {
                        type:'INTEGER',
                        ic_type: 'INTEGER',
                        value:'0',
                        members:nomembers
                    }
                },
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type: 'INTEGER',
                    name:'fxy',
                    is_async: false,
                    members:{
                        type:'DOT_EXPRESSION',
                        ic_type: 'METHOD_IDENTIFIER',
                        identifier:'a',
                        members:{
                            type:'ARGIDS_EXPRESSION',
                            ic_type: 'ARRAY',
                            ic_subtypes: ['INTEGER', 'INTEGER'],
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
                        members:nomembers
                    }
                }
            ]
        }
        expect(ast_assign_node).eql(result);
    });
});