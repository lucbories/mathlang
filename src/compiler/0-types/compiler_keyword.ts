
import ICompilerType from '../0-api/icompiler_type';
import ICompilerFunction from '../0-api/icompiler_function';

import CompilerType from '../0-common/compiler_type';

const TYPE_NAME = 'KEYWORD';

const attributes = new Map<string,ICompilerType>();
const methods = new Map<string, ICompilerFunction>();

export default class CompilerKeyword extends CompilerType {
    constructor(alt_name:string=undefined) {
        super(alt_name ? alt_name : TYPE_NAME, undefined, attributes, methods);
    }
}
