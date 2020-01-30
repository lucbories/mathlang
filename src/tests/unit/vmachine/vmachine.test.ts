import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import MathLangCompiler from '../../../compiler/math_lang_compiler';
import CompilerIcBuilder from '../../../compiler/0-common/compiler_ic_builder'
import Scope from '../../../vmachine/assemblyscript/assembly/runtime/scope'
import OPCODES from '../../../vmachine/assemblyscript/assembly/runtime/opcodes'


describe('MathLang VM test: programs 1', () => {
    const compiler = new MathLangCompiler();

    it('module mA export fA() return 20 module mB use mA fB()=>return mA.fA() * 2' , () => {
        compiler.reset();
        const text = 'module mA export function fA() as INTEGER return 20 end function module mB use mA function fB() as INTEGER return mA@fA() * 2 end function';
        const result = compiler.compile(text, 'program');

        // ERRORS
        if (! result){
            const errors = compiler.get_errors();
            console.log('errors', errors);

            expect(errors.length).equals(0);
            return;
        }

        // GET IC CODE
        const compiler_scope = compiler.get_scope();
        const modules = compiler_scope.get_new_modules();
        expect(modules.size).equals(4);
        const ic_source:string = CompilerIcBuilder.build_modules_ic_source(modules, false);

        // TEST IC TEXT
        const expected_ic_source = `exported function fA():INTEGER
ebb0()
return i_inline(20)
local function fB():INTEGER
ebb0()
v0:INTEGER = call mA@fA
v1:INTEGER = call mul v0 i_inline(2)
return v1
`;
        expect(ic_source).equals(expected_ic_source);

        // BUILD VM scope
        const vm_instructions = new ArrayBuffer(100);
        const vm_values = new ArrayBuffer(100);

    });
});