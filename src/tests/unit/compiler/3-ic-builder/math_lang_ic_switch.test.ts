import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../../compiler/math_lang_compiler';



describe('MathLang Switch IC builder', () => {
    const compiler = new MathLangCompiler();

    const src_code_1 = `
    begin
        a=12 b=0
        switch a
            12 begin b=1 end
            2*3+1 begin b=2 end
        end switch
    end
    `;
    it('Parse [' + src_code_1 + '] statement' , () => {
        compiler.reset();
        const result = compiler.compile(src_code_1, 'program');

        // ERRORS
        const expected_errors = 0;
        const errors = compiler.get_errors();
        if (errors.length != expected_errors){
            console.log('errors', errors);

            expect(errors.length).equals(expected_errors);
            return;
        }
        
        // GET AST
        // const compiler_ast = compiler.get_ast();
        // compiler.dump_tree('ast', compiler_ast);

        // GET IC CODE
        const DEBUG_IC = false;
        const ic_modules_map = compiler.get_ic_modules_map();
        
        const ic_functions_map = compiler.get_ic_modules_map();
        // console.log('ic_functions_map', ic_functions_map);
        const ic_source:string = compiler.dump_ic_functions_source(ic_functions_map, DEBUG_IC);
        const labels_str = compiler.dump_ic_functions_labels(DEBUG_IC);

        // TEST IC TEXT
        const expected_ic_source = `
none:function-declare-enter main
INTEGER:register-set INTEGER:@main/a INTEGER:[12]
INTEGER:register-set INTEGER:@main/b INTEGER:[0]
BOOLEAN:function-call equal INTEGER:@main/a INTEGER:[12]
BOOLEAN:function-call equal BOOLEAN:FROM_STACK BOOLEAN:[###TRUE]
UNKNOW:if-then LABEL:[main_label_0] LABEL:[main_label_2]
INTEGER:register-set INTEGER:@main/b INTEGER:[1]
UNKNOW:goto LABEL:[main_label_2]
INTEGER:function-call mul INTEGER:[2] INTEGER:[3]
INTEGER:function-call add INTEGER:FROM_STACK INTEGER:[1]
BOOLEAN:function-call equal INTEGER:@main/a INTEGER:FROM_STACK
BOOLEAN:function-call equal BOOLEAN:FROM_STACK BOOLEAN:[###TRUE]
UNKNOW:if-then LABEL:[main_label_3] LABEL:[main_label_5]
INTEGER:register-set INTEGER:@main/b INTEGER:[2]
UNKNOW:goto LABEL:[main_label_5]
none:function-declare-leave main`;

        const expected_labels_str = `
ICFunction:main labels:
0:main_label_0=6
1:main_label_1=8
2:main_label_2=15
3:main_label_3=13
4:main_label_4=15
5:main_label_5=15
`;

        expect(ic_source).equals(expected_ic_source);
        expect(labels_str).equals(expected_labels_str);
    });
});