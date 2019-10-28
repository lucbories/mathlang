
import ICompilerModule from '../../core/icompiler_module';
// import CompilerWASM from './compiler_wasm_runtime';
// import CompilerJS from './compiler_js_runtime';

const AVAILABLE_MODULES = new Map<string, ICompilerModule>();

// AVAILABLE_RUNTIMES.set('WASM', new CompilerWASM() );
// AVAILABLE_RUNTIMES.set('JS', new CompilerJS() );

export default AVAILABLE_MODULES;