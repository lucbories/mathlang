
import ICompilerType from '../../core/icompiler_type';
import ICompilerFunction from '../../core/icompiler_function';

import CompilerFunction from '../0-common/compiler_function';
import CompilerType from '../0-common/compiler_type';

const TYPE_NAME = 'FLOAT';

const attributes = new Map<string,ICompilerType>();
const methods = new Map<string, ICompilerFunction>();

export default class CompilerFloat extends CompilerType {
    constructor(alt_name:string=undefined) {
        super(alt_name ? alt_name : TYPE_NAME, undefined, attributes, methods);

        const method_add = new CompilerFunction('add', this, ['lhs', 'rhs'], [this, this], ['0.0', '0.0']);
        const method_addone = new CompilerFunction('add_one', this, ['lhs', 'rhs'], [this, this], ['0.0', '0.0']);
        const method_sub = new CompilerFunction('sub', this, ['lhs', 'rhs'], [this, this], ['0.0', '0.0']);
        const method_mul = new CompilerFunction('mul', this, ['lhs', 'rhs'], [this, this], ['0.0', '0.0']);
        const method_div = new CompilerFunction('div', this, ['lhs', 'rhs'], [this, this], ['0.0', '1.0']);
        methods.set(method_add.get_func_name(), method_add);
        methods.set(method_addone.get_func_name(), method_addone);
        methods.set(method_sub.get_func_name(), method_sub);
        methods.set(method_mul.get_func_name(), method_mul);
        methods.set(method_div.get_func_name(), method_div);
        
    }
}
