
import ICompilerType from '../0-api/icompiler_type';
import ICompilerFunction from '../0-api/icompiler_function';

import CompilerFunction from '../0-common/compiler_function';
import CompilerType from '../0-common/compiler_type';

const TYPE_NAME = 'STRING';

const attributes = new Map<string,ICompilerType>();
const methods = new Map<string, ICompilerFunction>();


export default class CompilerString extends CompilerType {
    constructor(alt_name:string=undefined) {
        super(alt_name ? alt_name : TYPE_NAME, undefined, attributes, methods);

        const method_add = new CompilerFunction('add', this, ['lhs', 'rhs'], [this, this], ['', '']);
        const method_concat = new CompilerFunction('concat', this, ['lhs', 'rhs'], [this, this], ['', '']);
        // const method_length = new CompilerFunction('length', 'INTEGER', ['lhs', 'rhs'], [], []);
        
        methods.set(method_add.get_func_name(), method_add);
        methods.set(method_concat.get_func_name(), method_concat);
        // methods.set(method_length.get_func_name(), method_length);
    }
}
