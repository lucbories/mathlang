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
        const nomembers = <any>undefined;
        const result = {
            type:'ID_EXPRESSION',
            ic_type:'INTEGER',
            name:'f',
            members:{
                type:'ARGS_EXPRESSION',
                ic_type:'ARRAY',
                ic_subtypes:['UNKNOW'],
                items:<any>undefined
            }
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
        const nomembers = <any>undefined;
        const result = {
            type:'ID_EXPRESSION',
            ic_type:'INTEGER',
            name:'fx',
            members:{
                type:'ARGS_EXPRESSION',
                ic_type:'ARRAY',
                ic_subtypes:['INTEGER'],
                items:[
                    {
                        type:'INTEGER',
                        ic_type:'INTEGER',
                        value:'23',
                        members:nomembers
                    }
                ]
            }
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
        const nomembers = <any>undefined;
        const result = {
            type:'ID_EXPRESSION',
            ic_type:'INTEGER',
            name:'fx',
            members:{
                type:'ARGS_EXPRESSION',
                ic_type:'ARRAY',
                ic_subtypes:['INTEGER', 'INTEGER'],
                items:[
                    {
                        type:'INTEGER',
                        ic_type:'INTEGER',
                        value:'23',
                        members:nomembers
                    },
                    {
                        type:'ID_EXPRESSION',
                        ic_type:'INTEGER',
                        name:'efg',
                        members:nomembers
                    }
                ]
            }
            
        }
        expect(ast_expr_node).eql(result);
    });
});