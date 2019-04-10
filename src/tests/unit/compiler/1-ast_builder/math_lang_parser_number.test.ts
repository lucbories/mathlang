import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';



describe('MathLang number parser', () => {

    it('Parse positive simple integer' , () => {
        const text = '123';
        const parser_result = parse(text, false, 'MemberExpression');

        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        // console.log('simple integer ast expr node', ast_expr_node);

        const empty_array:any[] = [];
        const result = {
            type:'NUMBER',
            value:'123',
            options:empty_array
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse negative simple integer' , () => {
        const text = '-123';
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
        // console.log('simple integer ast expr node', ast_expr_node);

        const empty_array:any[] = [];
        const result = {
            type:'PREUNOP_EXPRESSION',
            operator:'-',
            rhs:{
                type:'NUMBER',
                value:'123',
                options:empty_array
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse simple float' , () => {
        const text = '123.456';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        // console.log('simple float ast expr node', ast_expr_node);

        const empty_array:any[] = [];
        const result = {
            type:'NUMBER',
            value:'123.456',
            options:empty_array
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse complex float' , () => {
        const text = '-123.456e-45';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        // console.log('complex float ast expr node', ast_expr_node);

        const empty_array:any[] = [];
        const result = {
            type:'PREUNOP_EXPRESSION',
            operator:'-',
            rhs:{
                type:'NUMBER',
                value:'123.456e-45',
                options:empty_array
            }
        }
        expect(ast_expr_node).eql(result);
    });
});