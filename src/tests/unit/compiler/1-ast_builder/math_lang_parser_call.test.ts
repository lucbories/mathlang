import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';


function dump_ast(label:string, ast:any) {
    const json = JSON.stringify(ast);
    console.log(label, json)
}



describe('MathLang call parser', () => {

    it('Parse f() statement' , () => {
        const text = 'f()';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result.cst);
        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        const result = {
            type:'ID_EXPRESSION',
            name:'f',
            options:[
                {
                    type:'ARGS_EXPRESSION',
                    items:<any>undefined
                }
            ]
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse fx(23) statement' , () => {
        const text = 'fx(23)';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');

        const ast_expr_node = parser_result.ast;
        // console.log('fx(23) expr node', ast_expr_node);
        const empty_array:any[] = [];
        const result = {
            type:'ID_EXPRESSION',
            name:'fx',
            options:[
                {
                    type:'ARGS_EXPRESSION',
                    items:<any>[
                        {
                            type:'INTEGER',
                            value:'23',
                            options:empty_array
                        }
                    ]
                }
            ]
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse fx(,) statement' , () => {
        const text = 'fx(23,)';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(1);
        expect(parser_result.ast).is.undefined;
        expect(parser_result.cst).is.undefined;
    });

    it('Parse fx(,23) statement' , () => {
        const text = 'fx(23,)';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(1);
        expect(parser_result.ast).is.undefined;
        expect(parser_result.cst).is.undefined;
    });

    it('Parse fx(23,) statement' , () => {
        const text = 'fx(23,)';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(1);
        expect(parser_result.ast).is.undefined;
        expect(parser_result.cst).is.undefined;
    });

    it('Parse fx(23, efg) statement' , () => {
        const text = 'fx(23, efg)';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result.ast.args.items);

        expect(parser_result).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');

        const ast_expr_node = parser_result.ast;
        // console.log('fx(23) expr node', ast_expr_node);
        const empty_array:any[] = [];
        const result = {
            type:'ID_EXPRESSION',
            name:'fx',
            options:[
                {
                    type:'ARGS_EXPRESSION',
                    items:<any>[
                        {
                            type:'INTEGER',
                            value:'23',
                            options:empty_array
                        },
                        {
                            type:'ID_EXPRESSION',
                            name:'efg',
                            options:empty_array
                        }
                    ]
                }
            ]
        }
        expect(ast_expr_node).eql(result);
    });
});