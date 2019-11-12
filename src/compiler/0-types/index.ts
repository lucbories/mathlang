
import ICompilerType from '../../core/icompiler_type';

import CompilerInteger from './compiler_integer';
import CompilerBigInteger from './compiler_biginteger';
import CompilerFloat from './compiler_float';
import CompilerBigFloat from './compiler_bigfloat';
import CompilerString from './compiler_string';
import CompilerUnknow from './compiler_unknow';
import CompilerKeyword from './compiler_keyword';
import CompilerBoolean from './compiler_boolean';
import CompilerError from './compiler_error';
import CompilerRecord from './compiler_record';
import CompilerArray from './compiler_array';

const AVAILABLE_TYPES = new Map<string, ICompilerType>();

AVAILABLE_TYPES.set('BOOLEAN',    new CompilerBoolean() );
AVAILABLE_TYPES.set('INTEGER',    new CompilerInteger() );
AVAILABLE_TYPES.set('BIGINTEGER', new CompilerBigInteger() );
AVAILABLE_TYPES.set('FLOAT',      new CompilerFloat() );
AVAILABLE_TYPES.set('BIGFLOAT',   new CompilerBigFloat() );
AVAILABLE_TYPES.set('STRING',     new CompilerString() );
AVAILABLE_TYPES.set('UNKNOW',     new CompilerUnknow() );
AVAILABLE_TYPES.set('KEYWORD',    new CompilerKeyword() );
AVAILABLE_TYPES.set('ERROR',      new CompilerError() );
AVAILABLE_TYPES.set('RECORD',     new CompilerRecord() );
AVAILABLE_TYPES.set('ARRAY',      new CompilerArray() );

export default AVAILABLE_TYPES;