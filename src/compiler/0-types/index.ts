
import ICompilerType from '../../core/icompiler_type';

import CompilerInteger from './compiler_integer';
import CompilerFloat from './compiler_float';
import CompilerBigFloat from './compiler_bigfloat';
import CompilerString from './compiler_string';
import CompilerUnknow from './compiler_unknow';

const AVAILABLE_TYPES = new Map<string, ICompilerType>();

AVAILABLE_TYPES.set('INTEGER',  new CompilerInteger() );
AVAILABLE_TYPES.set('FLOAT',    new CompilerFloat() );
AVAILABLE_TYPES.set('BIGFLOAT', new CompilerBigFloat() );
AVAILABLE_TYPES.set('STRING',   new CompilerString() );
AVAILABLE_TYPES.set('UNKNOW',   new CompilerUnknow() );

export default AVAILABLE_TYPES;