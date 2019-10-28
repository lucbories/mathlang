
import ICompilerRuntime from '../../core/icompiler_runtime';
// import CompilerWASM from './compiler_wasm_runtime';
// import CompilerJS from './compiler_js_runtime';

const AVAILABLE_RUNTIMES = new Map<string, ICompilerRuntime>();

// AVAILABLE_RUNTIMES.set('WASM', new CompilerWASM() );
// AVAILABLE_RUNTIMES.set('JS', new CompilerJS() );

export default AVAILABLE_RUNTIMES;