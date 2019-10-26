
import VMMethod from '../../../../engine/vm/vmmethod';
import VMFeature from '../../../../engine/vm/vmfeature';

import {
    string_const_method,
    
    string_method,
    string_string_method,
    string_string_string_method,
    string_string_string_string_method,

    string_string_number_method,
    string_string_number_string_method,

    number_string_method,
    number_string_number_method,
    number_string_string_number_method,
    number_string_string_string_method,

    boolean_string_string_number_method,
    boolean_string_string_string_method
} from './vmstring_helpers';

import TYPE_CONVERTERS from './vmstring_converters';

/*
charAt(pos):string
charCodeAt(pos):number
concat(a):string
endsWith(str, pos):bool
indexOf(str, pos):number
lastIndexOf(str, pos):number
localeCompare(str):bool
                                                match(str|regexp):[]
padEnd(maxlength, fillstr):string
padStart(maxlength, fillstr):string
repeat(count):str
replace(str|regexp, str):str
search(str|regexp):number
slice(number, number):str
split(str|regexp, number):string
startsWith(str, number):bool
substr(number, number):str
substring(number, number):str
toLocaleLowerCase():str
toLocaleUpperCase():str
toLowerCase():str
toUpperCase():str
trim():str
trimLeft():str
trimRight():str
*/

// RETURNS NUMBER
const string_length         = number_string_method("StringLength",                      (a:string)                      :number=>a.length);
const string_char_code_at   = number_string_number_method("StringCharCodeAt",           (a:string, b:number)            :number=>a.charCodeAt(b) );
const string_index_of       = number_string_string_number_method("StringIndexOf",       (a:string, b:string, c:number)  :number=>a.indexOf(b, c) );
const string_last_index_of  = number_string_string_number_method("StringLastIndexOf",   (a:string, b:string, c:number)  :number=>a.lastIndexOf(b, c) );
const string_locale_compare = number_string_string_string_method("StringLocaleCompare", (a:string,b:string,c:string)    :number=>a.localeCompare(b, c) );

// RETURNS STRING
const string_concat         = string_string_string_method("StringConcat",               (a:string, b:string)            :string=>a + b);
const string_char_at        = string_string_number_method("StringCharAt",               (a:string, b:number)            :string=>a.charAt(b) );
const string_padEnd         = string_string_number_string_method("StringPadEnd",        (a:string, b:number, c:string)  :string=>a.padEnd(b, c) );
const string_padStart       = string_string_number_string_method("StringPadStart",      (a:string, b:number, c:string)  :string=>a.padStart(b, c) );
const string_repeat         = string_string_number_method("StringRepeat",               (a:string, b:number)            :string=>a.repeat(b) );
const string_replace        = string_string_string_string_method("StringReplace",       (a:string, b:string, c:string)  :string=>a.replace(b, c));

// RETURNS BOOLEAN
const string_ends_with      = boolean_string_string_number_method("StringEndsWith",     (a:string,b:string,c:number)    :boolean=>a.endsWith(b, c) );


const TYPE_LOGIC_METHODS:VMMethod[]=[
    // RETURNS NUMBER
    string_length, string_char_code_at, string_index_of, string_last_index_of, string_locale_compare,

    // RETURNS STRING
    string_concat, string_char_at, string_padEnd, string_padStart, string_repeat,

    // RETURNS BOOLEAN
    string_ends_with
];


class StringPropsFeature extends VMFeature {
    constructor(){
        super("StringProperties", TYPE_LOGIC_METHODS, TYPE_CONVERTERS);
    }
}

const TYPE_FEATURE_SINGLETON = new StringPropsFeature();

export default TYPE_FEATURE_SINGLETON;