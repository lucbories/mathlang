import {
    Lexer
} from 'chevrotain';
import { MathLangParserExpressions } from './math_lang_parser_expressions';
import * as t from './math_lang_parser_tokens';


// ----------------- lexer -----------------
export const math_lang_lexer = new Lexer(t.math_lang_tokens);



// ----------------- parser -----------------

export const math_lang_parser = new MathLangParserExpressions();
