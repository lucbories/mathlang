// const util = require('util');

// if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
// 	module.exports = require('./browser.js');
// } else {
// 	module.exports = require('./node.js');
// }


// USE npm i debug ???

// What for Typescript and WenAssembly ?

// export function debug(...args) {
// 	return process.stderr.write(util.format(...args) + '\n');
// }

export const debug = (prefix_path:string)=>(debug_path:string, ...args:any)=>{ console.log('MathLang:' + (prefix_path ? (prefix_path + ':') : '') + debug_path + '=>', ...args); };
export const debug_fn = (prefix_path:string)=>(debug_path:string, fn:Function)=>{ console.log('MathLang:' + (prefix_path ? (prefix_path + ':') : '') + debug_path + '=>', fn()); };
export const dummy = (...args:any)=>{};
export const dummy_fn = (fn:any)=>{};
