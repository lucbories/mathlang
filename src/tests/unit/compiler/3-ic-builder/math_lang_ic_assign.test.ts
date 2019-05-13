import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';
import MathLangAstToIrVisitor from '../../../../compiler/3-program-builder/math_lang_ast_to_ir_builder';


function dump_tree(label:string, tree:any) {
    const json = JSON.stringify(tree);
    console.log(label, json)
}


function dump_ic_functions_source(ic_functions_map:Map<string,any>, dump_functions:boolean):string{
    let ic_source:string='';
    ic_functions_map.forEach(
        (value:any, key)=>{
            if (dump_functions){
                console.log('ic' + '-' + key + '(instr): returns ' + value.return_type);
            }
            value.statements.forEach(
                (value:any, index:number)=>{
                    if (dump_functions){
                        dump_tree('ic-' + key + ':' + index, value);
                    }
                    ic_source = ic_source.concat('\n', value.text);
                }
            );
            if (dump_functions){
                console.log('\nic-' + key + '(text):', ic_source);
            }
        }
    );
    return ic_source;
}


describe('MathLang assign parser', () => {
    const compiler = new MathLangCompiler([]);

    it('Parse assign a=456 statement' , () => {
        compiler.reset();
        const text = 'a=456';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // dump_tree('ast', compiler_ast);

        const ast_functions_map = compiler.get_ast_builder().get_scopes_map();
        const ir_builder = new MathLangAstToIrVisitor(ast_functions_map);

        ir_builder.visit();

        const ic_functions_map = ir_builder.get_ic_functions_map();

        // DUMP IC
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@a INTEGER:[456]
none:function-declare-leave main`;
        expect(ic_source).equals(expected_ic_source);
    });


    it('Parse assign a=456+789 statement' , () => {
        compiler.reset();
        const text = 'a=456+789';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // dump_tree('ast', compiler_ast);

        const ast_functions_map = compiler.get_ast_builder().get_scopes_map();
        const ir_builder = new MathLangAstToIrVisitor(ast_functions_map);

        ir_builder.visit();

        const ic_functions_map = ir_builder.get_ic_functions_map();

        // DUMP IC
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:function-call add INTEGER:[456] INTEGER:[789]
INTEGER:register-set INTEGER:@a INTEGER:FROM_STACK
none:function-declare-leave main`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Parse assign begin a=12\na.b=456 end statement' , () => {
        compiler.reset();
        const text = 'begin a=12\na.b=456 end';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // dump_tree('ast', compiler_ast);

        const ast_functions_map = compiler.get_ast_builder().get_scopes_map();
        const ir_builder = new MathLangAstToIrVisitor(ast_functions_map);

        ir_builder.visit();
        if ( ir_builder.has_error() ){
            console.log('errors', ir_builder.get_errors());
            expect('has error').equals(false);
        }

        const ic_functions_map = ir_builder.get_ic_functions_map();

        // DUMP IC
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@a INTEGER:[12]
INTEGER:register-set INTEGER:@a.b INTEGER:[456]
none:function-declare-leave main`;
        expect(ic_source).equals(expected_ic_source);
    });
    

    it('Parse assign [b=5 a=456 + (++b*8)] statement' , () => {
        compiler.reset();
        const text = 'b=5 a=456 + (++b*8)';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);
            expect(errors.length).equals(0);
            return;
        }
        
        // GET AST
        const compiler_ast = compiler.get_ast();
        // dump_tree('ast', compiler_ast);

        const ast_functions_map = compiler.get_ast_builder().get_scopes_map();
        const ir_builder = new MathLangAstToIrVisitor(ast_functions_map);

        ir_builder.visit();
        if ( ir_builder.has_error() ){
            console.log('errors', ir_builder.get_errors());
            expect('has error').equals(false);
        }

        const ic_functions_map = ir_builder.get_ic_functions_map();

        // DUMP IC
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = dump_ic_functions_source(ic_functions_map, false);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@b INTEGER:[5]
INTEGER:function-call add_one INTEGER:@b
INTEGER:function-call mul INTEGER:FROM_STACK INTEGER:[8]
INTEGER:function-call add INTEGER:[456] INTEGER:FROM_STACK
INTEGER:register-set INTEGER:@a INTEGER:FROM_STACK
none:function-declare-leave main`;
        expect(ic_source).equals(expected_ic_source);
    });
});