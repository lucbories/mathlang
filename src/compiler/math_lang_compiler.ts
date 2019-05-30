import { IToken, LexerDefinitionErrorType } from 'chevrotain';

import IProgram from '../core/iprogram';
import IType from '../core/itype';

import { math_lang_lexer, math_lang_parser } from './1-cst-builder/math_lang_parser';
import MathLangCstToAstVisitor from './2-ast-builder/math_lang_cst_to_ast_visitor';
import {FunctionScope} from './3-program-builder/math_lang_function_scope';
import { ICFunction } from './3-program-builder/math_lang_ast_to_ic_builder_base';
import MathLangAstToIcVisitor from './3-program-builder/math_lang_ast_to_ic_builder';
import {ICLabel} from './3-program-builder/math_lang_ast_to_ic_builder_base';



/**
 * Get a lexer error string with a lexer error code.
 * 
 * @param code lexer error code.
 * 
 * @returns error message.
 */
function lexer_get_def_error(code:LexerDefinitionErrorType):string {
    switch(code) {
        case LexerDefinitionErrorType.MISSING_PATTERN: return 'MISSING_PATTERN';
        case LexerDefinitionErrorType.INVALID_PATTERN: return 'INVALID_PATTERN';
        case LexerDefinitionErrorType.EOI_ANCHOR_FOUND: return 'EOI_ANCHOR_FOUND';
        case LexerDefinitionErrorType.UNSUPPORTED_FLAGS_FOUND: return 'UNSUPPORTED_FLAGS_FOUND';
        case LexerDefinitionErrorType.DUPLICATE_PATTERNS_FOUND: return 'DUPLICATE_PATTERNS_FOUND';
        case LexerDefinitionErrorType.INVALID_GROUP_TYPE_FOUND: return 'INVALID_GROUP_TYPE_FOUND';
        case LexerDefinitionErrorType.PUSH_MODE_DOES_NOT_EXIST: return 'PUSH_MODE_DOES_NOT_EXIST';
        case LexerDefinitionErrorType. MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE: return 'MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE';
        case LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY: return 'MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY';
        case LexerDefinitionErrorType.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST: return 'MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST';
        case LexerDefinitionErrorType.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED: return 'LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED';
        case LexerDefinitionErrorType.SOI_ANCHOR_FOUND: return 'SOI_ANCHOR_FOUND';
        case LexerDefinitionErrorType.EMPTY_MATCH_PATTERN: return 'EMPTY_MATCH_PATTERN';
        case LexerDefinitionErrorType.NO_LINE_BREAKS_FLAGS: return 'NO_LINE_BREAKS_FLAGS';
        case LexerDefinitionErrorType.UNREACHABLE_PATTERN: return 'UNREACHABLE_PATTERN';
        case LexerDefinitionErrorType.IDENTIFY_TERMINATOR: return 'IDENTIFY_TERMINATOR';
        case LexerDefinitionErrorType.CUSTOM_LINE_BREAK: return 'CUSTOM_LINE_BREAK';
    }
};


/**
 * Compiler step enum.
 */
enum CompilerStep {
    LEXEMES,
    CST,
    AST,
    IC,
    IC_OPTIMIZER,
    MC
};


/**
 * Compiler error record type.
 */
type CompilerError = {
    source:string,
    step:CompilerStep,
    line:number,
    column:number,
    src_extract:string,
    message:string,
    solution:string
};


/**
 * MathLang compiler class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MathLangCompiler {
    private _max_errors:number = 10; // TODO

    private _types_map:Map<string,IType>;

    private _symbols:Map<string,FunctionScope>;

    private _errors:CompilerError[];

    private _text:string;
    private _lexemes:IToken[];
    private _cst:any;
    private _ast:any;
    private _ic_functions:Map<string,ICFunction>;
    private _ic_functions_labels:Map<string,ICLabel[]>;
    private _program:IProgram;

    private _ast_builder:MathLangCstToAstVisitor;

    
    /**
     * Compiler instance constructor.
     * 
     * @param features Language features.
     */
    constructor(private _types:IType[]=[]) {
        // INIT TYPES MAP
        this._types_map = new Map<string,IType>();

        this._types.forEach(
            (loop_type)=>this._types_map.set(loop_type.get_name(), loop_type)
        );

        if (this._types_map.has('BIGNUMBER')){
            this._types_map.set('BIGINTEGER', this._types_map.get('BIGNUMBER'));
            this._types_map.set('BIGFLOAT', this._types_map.get('BIGNUMBER'));
        }

        this._ast_builder = new MathLangCstToAstVisitor(this._types_map);
    }


    /**
     * Reset compiler state.
     */
    reset() {
        this._symbols = undefined;
        this._errors = [];
        this._text = undefined;
        this._lexemes = undefined;
        this._cst = undefined;
        this._ast = undefined;
        this._ic_functions = undefined;
        this._program = undefined;
    }


    /**
     * Get source text.
     * 
     * @return string text.
     */
    get_text() { return this._text; }


    /**
     * Get symbols map.
     * 
     * @return Map<string,FunctionScope>.
     */
    get_symbols() { return this._symbols; }


    /**
     * Get compiled lexemes.
     * 
     * @return IToken[].
     */
    get_lexemes() { return this._lexemes; }


    /**
     * Get compiled CST.
     * 
     * @return CST tree.
     */
    get_cst() { return this._cst; }


    /**
     * Get compiled AST.
     * 
     * @return AST tree.
     */
    get_ast() { return this._ast; }


    /**
     * Get AST Builder.
     * 
     * @return MathLangCstToAstVisitor.
     */
    get_ast_builder() { return this._ast_builder; }


    /**
     * Get compiled IC functions.
     * 
     * @return Map<string,ICFunction>.
     */
    get_ic_functions_map() { return this._ic_functions; }


    /**
     * Get compiled program.
     * 
     * @return IProgram.
     */
    get_program() { return this._program; }


    /**
     * Get compiler errors.
     * 
     * @return CompilerError[].
     */
    get_errors() { return this._errors; }


    /**
     * Test if the named type exists in features.
     * 
     * @returns boolean, true if type exists.
     */
    has_type(type_name:string){
        return this._types_map.has(type_name);
    }


    /**
     * Compiler to AST method.
     * @param text source to compile.
     * 
     * @returns boolean: true if no error else false.
     */
    compile_ast(text:string, parser_rule:string=undefined):boolean {
        this._text = text;
        this._errors = [];

        // BUID LEXEMES
        if (! this.build_lexemes()){
            return false;
        }
        
        // BUILD CST
        if (! this.build_cst(parser_rule)){
            return false;
        }
        
        // BUILD AST
        if (! this.build_ast()){
            return false;
        }

        return this._errors.length == 0;
    }


    /**
     * Compiler main method.
     * @param text source to compile.
     * 
     * @returns boolean: true if no error else false.
     */
    compile(text:string, parser_rule:string=undefined):boolean {
        this._text = text;
        this._errors = [];

        // BUID LEXEMES
        if (! this.build_lexemes()){
            return false;
        }
        
        // BUILD CST
        if (! this.build_cst(parser_rule)){
            return false;
        }
        
        // BUILD AST
        if (! this.build_ast()){
            return false;
        }

        // BUILD IC
        if (! this.build_ic()){
            return false;
        }

        return this._errors.length == 0;
    }
    

    /**
     * Build lexemes from source text with tokens definitions.
     * 
     * @returns boolean (true:success, false:error occures).
     */
    build_lexemes():boolean{
        // CHECK LEXER DEFINITION
        if (math_lang_lexer.lexerDefinitionErrors.length > 0){
            let lexer_def_error;
            for(lexer_def_error of math_lang_lexer.lexerDefinitionErrors){
                const error:CompilerError = {
                    source:this._text,
                    step:CompilerStep.LEXEMES,
                    line:0,
                    column:0,
                    src_extract:'',
                    message:lexer_get_def_error(lexer_def_error.type),
                    solution:'correct lexer definition (tokens) [' + lexer_def_error.message + ']'
                };
                this._errors.push(error);
            }
            return false;
        }

        // BUILD LEXEMES
        const lexer_result = math_lang_lexer.tokenize(this._text);
        this._lexemes = lexer_result.tokens;

        // LEXER BUILD ERRORS
        if (lexer_result.errors.length > 0){
            let lexer_build_error;
            for(lexer_build_error of lexer_result.errors){
                const error:CompilerError = {
                    source:this._text,
                    step:CompilerStep.LEXEMES,
                    line:lexer_build_error.line,
                    column:lexer_build_error.column,
                    src_extract:this._text.substr(lexer_build_error.offset, lexer_build_error.length),
                    message:lexer_build_error.message,
                    solution:'lexer build error'
                };
                this._errors.push(error);
            }
            return false;
        }

        return true;
    }
    

    /**
     * Build Concret Syntaxical Tree (CST) from lexemes and parser rules.
     * 
     * @param parser_rule   optional start rule name to use.
     * 
     * @returns boolean (true:success, false:error occures).
     */
    build_cst(parser_rule:string=undefined):boolean{
        math_lang_parser.reset();
        math_lang_parser.input = this._lexemes;
        const parser:any = math_lang_parser;
        const fn = parser[parser_rule];
        if (! fn){
            const error:CompilerError = {
                source:this._text,
                step:CompilerStep.CST,
                line:0,
                column:0,
                src_extract:'',
                message:'Parser rule [' + parser_rule + '] doesn t exist on this compiler.',
                solution:'Compiler use error, bad parser rule name [' + parser_rule + ']'
            };
            this._errors.push(error);
            return false;
        }
        this._cst = parser[parser_rule]();

        if (math_lang_parser.errors.length > 0) {
            let cst_build_error;
            for(cst_build_error of math_lang_parser.errors){
                const rule_name = cst_build_error.name;
                const rule_token = cst_build_error.token;
                const rule_message = cst_build_error.message;
                const rule_stack = 'rules stack:[' + cst_build_error.context.ruleStack.join(',') + ']\nrules occurences stack:[' + cst_build_error.context.ruleOccurrenceStack.join(',') + ']\n';
                
                const error:CompilerError = {
                    source:this._text,
                    step:CompilerStep.CST,
                    line:rule_token.startLine,
                    column:rule_token.startColumn,
                    src_extract:this._text.substring(rule_token.startOffset, rule_token.endOffset + 1),
                    message:'Rule [' + rule_name + '] encounts an error with the token [' + rule_token.image + '] at ' + rule_stack,
                    solution:'CST build error [' + rule_message + ']'
                };
                this._errors.push(error);
            }
            return false;
        }
        return true;
    }

    
    /**
     * Build Abstract Syntaxical Tree from CST and language rules and types.
     * 
     * @returns boolean (true:success, false:error occures).
     */
    build_ast():boolean{
        this._ast_builder.reset();
        this._ast = this._ast_builder.visit(this._cst);

        if (this._ast_builder.has_errors()) {
            const errors = this._ast_builder.get_errors();
            let ast_build_error;
            for(ast_build_error of errors){                
                const error:CompilerError = {
                    source:this._text,
                    step:CompilerStep.AST,
                    line:0,
                    column:0, // TODO
                    src_extract:'',//this._text.substring(rule_token.startOffset, rule_token.endOffset),
                    message:ast_build_error.message,
                    solution:'AST build error [' + ast_build_error.message + ']'
                };
                this._errors.push(error);
            }
            return false;
        }
        
        return true;
    }


    /**
     * Build intermediate code (IC) functions from AST and language rules and types.
     * 
     * @returns boolean (true:success, false:error occures).
     */
    build_ic():boolean{
        const functions_map = this._ast_builder.get_scopes_map();

        const ic_builder = new MathLangAstToIcVisitor(functions_map, this._types_map);
        ic_builder.visit();
        this._ic_functions = ic_builder.get_ic_functions_map();
        this._ic_functions_labels = ic_builder.get_ic_functions_labels_map();

        if (ic_builder.has_error()){
            const errors = ic_builder.get_errors();
            let ic_build_error;
            for(ic_build_error of errors){                
                const error:CompilerError = {
                    source:this._text,
                    step:CompilerStep.IC,
                    line:0,
                    column:0,
                    src_extract:'',
                    message:ic_build_error.message + ' with [ic_type=' + ic_build_error.ic_type + ', ic_source=' + ic_build_error.ic_source + ', ic_name=' + ic_build_error.ic_name + ', ic_index=' + ic_build_error.ic_index + ']',
                    solution:'IC build error [' + ic_build_error.message + ']'
                };
                this._errors.push(error);
            }
            return false;
        }


        return true;
    }


    /**
     * Optimize IC functions.
     * 
     * @returns boolean (true:success, false:error occures).
     */
    optimize_ic():boolean{
        return true;
    }


    /**
     * Build machine code from IC functions.
     * 
     * @returns boolean (true:success, false:error occures).
     */
    build_mc():boolean{
        return true;
    }



    /**
     * Dump CST or AST tree.
     * 
     * @param label tree label
     * @param tree tree object
     */
    dump_tree(label:string, tree:any) {
        const json = JSON.stringify(tree);
        console.log(label, json)
    }


    /**
     * Dump IC functions to a string and optionaly to console.
     * 
     * @param ic_functions_map IC functions map
     * @param dump_functions should dump to console ? (boolean)
     * 
     * @returns dumped string.
     */
    dump_ic_functions_source(ic_functions_map:Map<string,any>, dump_functions:boolean):string{
        let ic_source:string='';
        ic_functions_map.forEach(
            (value:any, key)=>{
                if (dump_functions){
                    console.log('ic' + '-' + key + '(instr): returns ' + value.return_type);
                }
                value.statements.forEach(
                    (value:any, index:number)=>{
                        if (dump_functions){
                            this.dump_tree('ic-' + key + ':' + index, value);
                        }
                        ic_source = ic_source.concat('\n', value.text);
                    }
                );
                if (dump_functions){
                    console.log('\nic-' + key + '(text):', ic_source);
                }
            }
        );
        return ic_source;
    }


    /**
     * Dump IC functions labels to a string and optionaly to console.
     * 
     * @param ic_functions_map IC functions map
     * @param dump_functions should dump to console ? (boolean)
     * 
     * @returns dumped string.
     */
    dump_ic_functions_labels(dump_functions:boolean):string{
        let labels_str:string='';
        this._ic_functions_labels.forEach(
            (function_labels:ICLabel[], func_name)=>{
                labels_str += 'ICFunction:' + func_name + ' labels:\n';

                function_labels.forEach(
                    (label_record:ICLabel, index:number)=>{
                        labels_str += index + ':' + label_record.label_name + '=' + label_record.label_index + '\n';
                    }
                );
            }
        );

        if (dump_functions){
            console.log(labels_str);
        }

        return labels_str;
    }
}