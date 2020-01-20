std module

export function New(type_name:STRING):GENERIC

export TYPE, GENERIC, UNKNOW, BOOLEAN, INTEGER, FLOAT, BIGINTEGER, BIGFLOAT, STRING, LIST


TU:
    a=New('INTEGER')
    a=123 -> OK
    a = 'abcd' ->ERROR
    a = 456.789 -> ERROR