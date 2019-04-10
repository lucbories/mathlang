export default class SymbolRoot { 
    constructor(private type_name: String, private type_code: Number){
    }

    get_type_name() : String { return this.type_name; }
    get_type_code() : Number { return this.type_code; }
}