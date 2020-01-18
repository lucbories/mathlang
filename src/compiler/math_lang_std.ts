
import CompilerFunction from './0-common/compiler_function';
import CompilerModule from './0-common/compiler_module';
import CompilerScope from './0-common/compiler_scope';



export default function register_std_signatures(scope:CompilerScope):void {
    // const TYPE = scope.get_available_lang_type('TYPE');
    // const BOOLEAN = scope.get_available_lang_type('BOOLEAN');
    const STRING = scope.get_available_lang_type('STRING');
    const GENERIC = scope.get_available_lang_type('GENERIC');
    // const TYPE = scope.get_available_lang_type('TYPE');

    const std_module:CompilerModule = new CompilerModule(scope, 'std');

    // const fn_new_type:CompilerFunction = new CompilerFunction('NewType', TYPE,
    //     ['name', 'base_type', 'is_scalar', 'is_textual', 'is_collection'],
    //     [STRING, TYPE, BOOLEAN, BOOLEAN, BOOLEAN]);
    // fn_new_type.set_is_internal(true);

    const fn_new:CompilerFunction = new CompilerFunction('New', GENERIC,
        ['type_name'],
        [STRING]);
    fn_new.set_is_internal(true);
    
    // std_module.add_exported_function(fn_new_type);
    std_module.add_exported_function(fn_new);
    scope.add_available_module(std_module);
}