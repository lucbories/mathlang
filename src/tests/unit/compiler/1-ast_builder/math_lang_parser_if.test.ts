import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';


function dump_ast(label:string, ast:any) {
    const json = JSON.stringify(ast);
    console.log(label, json)
}



describe('MathLang if parser', () => {

    it('Parse if then statement' , () => {
        const text = 'if 12 then a=456 end if';
        const parser_result = parse(text, false);

        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_if_node = parser_result.ast.statements[0];
        const empty_array:any[] = [];
        const result = {
            type:'IF_STATEMENT',
            condition: {
                type:'NUMBER',
                value:'12',
                options:empty_array
            },
            then:{
                type:'ASSIGN_STATEMENT',
                name:'a',
                expression: {
                    type:'NUMBER',
                    value:'456',
                    options:empty_array
                }
            },
            else:<any>undefined
        }
        expect(ast_if_node).eql(result);
    });

    it('Parse if then else statement' , () => {
        const text = 'if 12 then a=456 else a=789 end if';
        const parser_result = parse(text, false);

        // console.log(parser_result.ast);

        expect(parser_result).to.be.an('object');
        expect(parser_result.ast).to.be.an('object');
        expect(parser_result.cst).to.be.an('object');
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');
        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(0);

        const ast_if_node = parser_result.ast.statements[0];
        const empty_array:any[] = [];
        const result = {
            type:'IF_STATEMENT',
            condition: {
                type:'NUMBER',
                value:'12',
                options:empty_array
            },
            then:{
                type:'ASSIGN_STATEMENT',
                name:'a',
                expression: {
                    type:'NUMBER',
                    value:'456',
                    options:empty_array
                }
            },
            else:<any>{
                type:'ASSIGN_STATEMENT',
                name:'a',
                expression: {
                    type:'NUMBER',
                    value:'789',
                    options:empty_array
                }
            }
        }
        expect(ast_if_node).eql(result);
    });
});