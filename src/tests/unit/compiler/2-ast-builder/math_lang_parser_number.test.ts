import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';


function dump_ast(label:string, ast:any) {
    const json = JSON.stringify(ast);
    console.log(label, json)
}


describe('MathLang number parser', () => {

    it('Parse positive simple integer' , () => {
        const text = '123';
        const parser_result = parse(text, false, 'MemberExpression');

        // console.log(parser_result.ast);
        // dump_ast('cst', parser_result.cst);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        // console.log('simple integer ast expr node', ast_expr_node);

        const nomembers = <any>undefined;
        const result = {
            type:'INTEGER',
            ic_type:'INTEGER',
            value:text,
            members:nomembers
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse positive big integer' , () => {
        const text = '1234567890145';
        const parser_result = parse(text, false, 'MemberExpression');

        // console.log(parser_result);
        // dump_ast('cst', parser_result.cst);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        // console.log('simple integer ast expr node', ast_expr_node);

        const nomembers = <any>undefined;
        const result = {
            type:'BIGINTEGER',
            ic_type:'BIGINTEGER',
            value:text,
            members:nomembers
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

        const nomembers = <any>undefined;
        const result = {
            type:'PREUNOP_EXPRESSION',
            ic_type:'INTEGER',
            ic_function:'negate',
            operator:'-',
            rhs:{
                type:'INTEGER',
                ic_type:'INTEGER',
                value:text.substr(1),
                members:nomembers
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse negative simple integer' , () => {
        const text = '-123e77';
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

        const nomembers = <any>undefined;
        const result = {
            type:'PREUNOP_EXPRESSION',
            ic_type:'INTEGER',
            ic_function:'negate',
            operator:'-',
            rhs:{
                type:'INTEGER',
                ic_type:'INTEGER',
                value:text.substr(1),
                members:nomembers
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse simple float' , () => {
        const text = '123.456';
        const parser_result = parse(text, false, 'expression');

        // console.log(parser_result);
        // dump_ast('cst', parser_result.cst.children);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_expr_node = parser_result.ast;
        // console.log('simple float ast expr node', ast_expr_node);

        const nomembers = <any>undefined;
        const result = {
            type:'FLOAT',
            ic_type:'FLOAT',
            value:text,
            members:nomembers
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse simple big float' , () => {
        const text = '123.45678901234';
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

        const nomembers = <any>undefined;
        const result = {
            type:'BIGFLOAT',
            ic_type:'BIGFLOAT',
            value:text,
            members:nomembers
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse simple big float' , () => {
        const text = '12345678901.1234';
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

        const nomembers = <any>undefined;
        const result = {
            type:'BIGFLOAT',
            ic_type:'BIGFLOAT',
            value:text,
            members:nomembers
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

        const nomembers = <any>undefined;
        const result = {
            type:'PREUNOP_EXPRESSION',
            ic_type:'FLOAT',
            ic_function:'negate',
            operator:'-',
            rhs:{
                type:'FLOAT',
                ic_type:'FLOAT',
                value:text.substr(1),
                members:nomembers
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse complex big float' , () => {
        const text = '-123.456e-456';
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

        const nomembers = <any>undefined;
        const result = {
            type:'PREUNOP_EXPRESSION',
            ic_type:'BIGFLOAT',
            ic_function:'negate',
            operator:'-',
            rhs:{
                type:'BIGFLOAT',
                ic_type:'BIGFLOAT',
                value:text.substr(1),
                members:nomembers
            }
        }
        expect(ast_expr_node).eql(result);
    });

    it('Parse complex big float' , () => {
        const text = '-123.4567890101e-45';
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

        const nomembers = <any>undefined;
        const result = {
            type:'PREUNOP_EXPRESSION',
            ic_type:'BIGFLOAT',
            ic_function:'negate',
            operator:'-',
            rhs:{
                type:'BIGFLOAT',
                ic_type:'BIGFLOAT',
                value:text.substr(1),
                members:nomembers
            }
        }
        expect(ast_expr_node).eql(result);
    });
});