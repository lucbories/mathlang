
import ICompilerType from '../../core/icompiler_type';
import CompilerInteger from './compiler_integer';
import CompilerFloat from './compiler_float';

const AVAILABLE_TYPES = new Map<string, ICompilerType>();

AVAILABLE_TYPES.set('INTEGER', new CompilerInteger() );
AVAILABLE_TYPES.set('FLOAT', new CompilerFloat() );

export default AVAILABLE_TYPES;