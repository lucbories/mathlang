
import ICompilerType from '../../core/icompiler_type';
import ICompilerFunction from '../../core/icompiler_function';

import CompilerType from '../0-common/compiler_type';

const TYPE_NAME = 'ARRAY';

const attributes = new Map<string,ICompilerType>();
const methods = new Map<string, ICompilerFunction>();

export default class CompilerArray extends CompilerType {
    constructor(alt_name:string=undefined) {
        super(alt_name ? alt_name : TYPE_NAME, undefined, attributes, methods);
    }
}
