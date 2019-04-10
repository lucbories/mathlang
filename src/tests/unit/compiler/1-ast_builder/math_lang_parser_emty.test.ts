import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import parse from '../../../../compiler/math_lang_processor';


function dump_ast(label:string, ast:any) {
    const json = JSON.stringify(ast);
    console.log(label, json)
}



describe('MathLang parser', () => {

    it('Parse empty text' , () => {
        const text = '';
        const parser_result = parse(text, false);

        // console.log(parser_result);

        expect(parser_result).to.be.an('object');

        expect(parser_result.cst).to.be.undefined;
        expect(parser_result.lexErrors).to.be.an('array');
        expect(parser_result.parseErrors).to.be.an('array');

        expect(parser_result.lexErrors.length).equals(0);
        expect(parser_result.parseErrors.length).equals(1);
        expect(parser_result.parseErrors[0].name).equals('EarlyExitException');
    });
});