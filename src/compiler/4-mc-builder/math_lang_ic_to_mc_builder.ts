
import {ICLabel, ICFunction} from '../3-ic-builder/math_lang_ast_to_ic_builder_base';
import {IProgramOptions} from '../../engine/vm/vmprogramoptions';
import MathLangIcToMcVisitorStatements from './math_lang_ic_to_mc_builder_statements';




/**
 * Typed IC Visitor class. Converts Typed IC to MC.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangIcToMcVisitor extends MathLangIcToMcVisitorStatements {

    /**
     * Constructor.
     * 
     * @param program_name        MC program name.
     * @param program_options     MC program options.
     * @param ic_functions        IC functions.
     * @param ic_functions_labels IC functions labels.
     */
    constructor(program_name:string, program_options:IProgramOptions, ic_functions:Map<string,ICFunction>, ic_functions_labels:Map<string,ICLabel[]>) {
        super(program_name, program_options, ic_functions, ic_functions_labels);
    }
}