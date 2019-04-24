import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';


function dump_tree(label:string, tree:any) {
    const json = JSON.stringify(tree);
    console.log(label, json)
}



describe('MathLang if parser', () => {

    it('Parse [if 12 then a=456 end if] statement' , () => {
        const text = 'if 12 then a=456 end if';
        const parser_result = parse(text, false);

        // console.log(parser_result.ast.block);
        // dump_tree('cst', parser_result.cst);
        // dump_tree('ast', parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        expect(parser_result.ast.block).to.be.an('array');
        expect(parser_result.ast.block.length).equals(1);
        const ast_if_node = parser_result.ast.block[0];
        const nomembers = <any>undefined;
        const result = {
            type:'IF_STATEMENT',
            condition: {
                type:'INTEGER',
                ic_type:'INTEGER',
                value:'12',
                members:nomembers
            },
            then:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type:'INTEGER',
                    name:'a',
                    members:nomembers,
                    expression: {
                        type:'INTEGER',
                        ic_type:'INTEGER',
                        value:'456',
                        members:nomembers
                    }
                }
            ],
            else:<any>undefined
        }
        expect(ast_if_node).eql(result);
    });

    it('Parse [if 12+2 then a=456 b=89 end if] statement' , () => {
        const text = 'if 12+2 then a=456 b=89 end if';
        const parser_result = parse(text, false);

        // console.log(parser_result.ast.block);
        // dump_tree('cst', parser_result.cst);
        // dump_tree('ast', parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        expect(parser_result.ast.block).to.be.an('array');
        expect(parser_result.ast.block.length).equals(1);
        const ast_if_node = parser_result.ast;
        const nomembers = <any>undefined;
        const result = {
            "type": "PROGRAM",
            "block": [
                {
                    "type": "IF_STATEMENT",
                    "condition": {
                        "type": "ADDSUB_EXPRESSION",
                        "ic_type": "INTEGER",
                        "lhs": {
                            "type": "INTEGER",
                            "ic_type": "INTEGER",
                            "value": "12",
                            "members": nomembers
                        },
                        "operator": {
                            "type": "BINOP",
                            "value": "+"
                        },
                        "rhs": {
                            "type": "INTEGER",
                            "ic_type": "INTEGER",
                            "value": "2",
                            "members": nomembers
                        }
                    },
                    "then": [
                        {
                            "type": "ASSIGN_STATEMENT",
                            "ic_type": "INTEGER",
                            "name": "a",
                            "members": nomembers,
                            "expression": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "456",
                                "members": nomembers
                            }
                        },
                        {
                            "type": "ASSIGN_STATEMENT",
                            "ic_type": "INTEGER",
                            "name": "b",
                            "members": nomembers,
                            "expression": {
                                "type": "INTEGER",
                                "ic_type": "INTEGER",
                                "value": "89",
                                "members": nomembers
                            }
                        }
                    ],
                    else:<any>undefined
                }
            ]
        };
        expect(ast_if_node).eql(result);
    });

    it('Parse if then else statement' , () => {
        const text = 'if 12 then a=456 else a=789.23 end if';
        const parser_result = parse(text, false);

        // console.log(parser_result.ast);
        // dump_tree('ast', parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_if_node = parser_result.ast.block[0];
        const nomembers = <any>undefined;
        const result = {
            type:'IF_STATEMENT',
            condition: {
                type:'INTEGER',
                ic_type:'INTEGER',
                value:'12',
                members:nomembers
            },
            then:[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type:'INTEGER',
                    name:'a',
                    members:nomembers,
                    expression: {
                        type:'INTEGER',
                        ic_type:'INTEGER',
                        value:'456',
                        members:nomembers
                    }
                }
            ],
            else:<any>[
                {
                    type:'ASSIGN_STATEMENT',
                    ic_type:'FLOAT',
                    name:'a',
                    members:nomembers,
                    expression: {
                        type:'FLOAT',
                        ic_type:'FLOAT',
                        value:'789.23',
                        members:nomembers
                    }
                }
            ]
        }
        expect(ast_if_node).eql(result);
    });
});