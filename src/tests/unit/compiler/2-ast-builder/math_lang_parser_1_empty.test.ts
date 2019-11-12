import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

// import { IAstNodeKindOf as AST } from '../../../../core/icompiler_ast_node';
import MathLangCompiler from '../../../../compiler/math_lang_compiler';



describe('MathLang parser', () => {
    const compiler = new MathLangCompiler();

    const type_unknow = compiler.get_scope().get_available_lang_type('UNKNOW');

    it('Parse empty text' , () => {
        compiler.reset();
        const text = '';
        const result = compiler.compile_ast(text, 'idLeft');

        // ERRORS
        const expected_errors = 1;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            // GET AST
            const compiler_ast = compiler.get_ast();
            compiler.dump_tree('ast', compiler_ast);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // console.log('compiler_ast', compiler_ast);

        // TEST AST
        const expected_ast:any = undefined;
        expect(compiler_ast).eql(expected_ast);
    });
});