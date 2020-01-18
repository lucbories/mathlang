
import MathLangCstToAstVisitorBase from './math_lang_cst_to_ast_visitor_base';

import { IAstNodeKindOf as AST, ICompilerAstAssignNode, ICompilerAstFunctionNode } from '../../core/icompiler_ast_node';

import CompilerScope from '../0-common/compiler_scope';
import CompilerModule from '../0-common/compiler_module';
import CompilerFunction from '../0-common/compiler_function';



export default class MathLangCstToAstVisitorStatement extends MathLangCstToAstVisitorBase {
    constructor(compiler_scope:CompilerScope) {
        super(compiler_scope);
    }



    /**
     * Visit CST Program node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    program(ctx:any) {
        // console.log('program', ctx)

        const modules = [];
        let cst_statement;
        let ast_statement;

        // LOOP ON MODULE DECLARATION STATEMENTS
        if (ctx.moduleStatement){
            for(cst_statement of ctx.moduleStatement){
                ast_statement = this.visit(cst_statement);
                modules.push(ast_statement);
            }
        }

        return {
            ast_code: AST.PROGRAM,
            modules:modules
        }
    }

    
    /**
     * Visit CST module declaraion node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    moduleStatement(ctx:any) {
        // console.log('moduleStatement', ctx)
        
        const module_name:string = ctx.ID[0].image;

        let cst_statement;
        let ast_statement;
        let functions:any[] = [];
        let constants:any[] = [];
        let uses:any[] = [];

        this._current_module = new CompilerModule(this._compiler_scope, module_name);

        // LOOP ON USE MODULE STATEMENTS
        if (ctx.useStatement){
            for(cst_statement of ctx.useStatement){

                ast_statement = this.visit(cst_statement);
                uses.push( { name:ast_statement.module_name, alias:ast_statement.module_alias, imports:ast_statement.modules_imports } );
            }
        }

        // LOOP ON TYPE DECLARATION STATEMENTS
        if (ctx.typeStatement){
            for(cst_statement of ctx.typeStatement){

                this.visit(cst_statement);
            }
        }

        // LOOP ON FUNCTIONS DECLARATIONS STATEMENTS HEADER
        let ast_function_header_nodes:any = {};
        if (ctx.functionStatement){
            for(cst_statement of ctx.functionStatement){
                cst_statement.children.visit_header = true;
                cst_statement.children.visit_body = false;

                ast_statement = this.visit(cst_statement);
                ast_function_header_nodes[ast_statement.func_name] = ast_statement;
            }
        }

        // LOOP ON CONSTANTS DECLARATIONS STATEMENTS
        if (ctx.exportedConstantStatement){
            for(cst_statement of ctx.exportedConstantStatement){
                ast_statement = this.visit(cst_statement);
                constants.push(ast_statement);
            }
        }
        if (ctx.constantStatement){
            for(cst_statement of ctx.constantStatement){
                ast_statement = this.visit(cst_statement);
                constants.push(ast_statement);
            }
        }

        // LOOP ON FUNCTIONS DECLARATIONS STATEMENTS BODY
        if (ctx.functionStatement){
            for(cst_statement of ctx.functionStatement){
                cst_statement.children.visit_header = false;
                cst_statement.children.visit_body = true;

                ast_statement = this.visit(cst_statement);
                ast_statement.operands_types = ast_function_header_nodes[ast_statement.func_name].operands_types;
                ast_statement.operands_names = ast_function_header_nodes[ast_statement.func_name].operands_names;
                functions.push(ast_statement);
            }
        }

        return {
            ast_code: AST.STAT_MODULE,
            module_name: module_name,
            uses:uses,
            functions:functions,
            variables:constants
        }
    }

    
    /**
     * Visit CST Use module node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    useStatement(ctx:any) {
        // console.log('useStatement', ctx)

        const used_module_name = ctx.ID[0].image;
        const used_module_scope = this._compiler_scope.get_module(used_module_name);
        if (! used_module_scope) {
            return {
                ast_code: AST.STAT_USE,
                module_name: used_module_name,
                module_alias: 'USED MODULE NOT FOUND',
                modules_imports: ctx.importedModuleItem ? ctx.importedModuleItem.map((x:any)=>x.image) : []
            } 
        }
        
        // MODULE ALIAS
		const module_alias = ctx.alias ? ctx.alias[0].image : ctx.ID[0].image;
        this._compiler_scope.add_module_alias(used_module_name, module_alias);
        
        // MODULE IMPORTS
        const modules_imports_array:string[] = ctx.importedModuleItem ? ctx.importedModuleItem.map((x:any)=>x.image) : [];
        const modules_imports_map = new Map<string,string>();
        modules_imports_array.map(
            (func_or_var_name:string)=>modules_imports_map.set(func_or_var_name, func_or_var_name)
        )
		this._compiler_scope.add_module_imports(used_module_name, modules_imports_map);
        
        // USED MODULES
		this._current_module.add_used_module(used_module_scope);

        return {
            ast_code: AST.STAT_USE,
            module_name: used_module_name,
            module_alias: module_alias,
            modules_imports: modules_imports_array
        }
    }

    
    /**
     * Visit CST Type declaration node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    typeStatement(ctx:any) {
        // console.log('typeStatement', ctx)

        const type_name = ctx.typeName[0].image;
        const base_type_name = ctx.baseType[0].image;

        this._current_type = this._current_module.add_module_type(type_name, base_type_name);

        let cst_statement;
        if (ctx.typeAttributeStatement){
            for(cst_statement of ctx.typeAttributeStatement){
                this.visit(cst_statement);
            }
        }
        if (ctx.typePropertyStatement){
            for(cst_statement of ctx.typePropertyStatement){
                this.visit(cst_statement);
            }
        }
        if (ctx.typeMethodStatement){
            for(cst_statement of ctx.typeMethodStatement){
                this.visit(cst_statement);
            }
        }
    }

    
    /**
     * Visit CST Type attribute declaration node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    typeAttributeStatement(ctx:any) {
        // console.log('typeAttributeStatement', ctx)
        const attribute_name = ctx.attributeName[0].image;
        const attribute_type = this.visit(ctx.attributeType[0]);
        if (attribute_type) {
            this._current_type.add_attribute(attribute_name, attribute_type);
        }
    }

    
    /**
     * Visit CST Type attribute declaration node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    typePropertyStatement(ctx:any) {
        // console.log('typePropertyStatement', ctx)
        const property_name = ctx.propertyName[0].image;
        const property_expr_ast = this.visit(ctx.propertyValue);

        this._current_type.set_property(property_name, property_expr_ast.value);
    }

    
    /**
     * Visit CST Type method declaration node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    typeMethodStatement(ctx:any) {
        // console.log('typeMethodStatement', ctx)
        const method_name = ctx.methodName[0].image;
        const method_type = this.visit(ctx.methodType[0]);
        const method_operands_ast = this.visit(ctx.ArgumentsWithIds);


        // DECLARE A NEW FUNCTION OR RECREATE AN EXISTING FUNCTION
        const operands_types = method_operands_ast.ic_subtypes;
        const operands_names = method_operands_ast.items;
        const default_type = operands_types.length > 0 ? operands_types[0]:'INTEGER';
        
        // CREATE FUNCTION
        const func = new CompilerFunction(method_name, method_type);

        // PROCESS OPERANDS
        let opd_index;
        let loop_name;
        let loop_type;
        for(opd_index=0; opd_index < operands_names.length; opd_index++){
            loop_name = operands_names[opd_index];
            loop_type = opd_index < operands_types.length ?operands_types[opd_index] : default_type;
            func.add_symbol_operand(loop_name, loop_type, undefined);
        }

        // EVALUATE RIGHT EXPRESSION
        const saved_current_func = this._current_function;
        const saved_current_module = this._current_module;
        this._scopes_stack.push(func);
        this._current_function = func
        const cst_expr_node = ctx.methodExpr;
        const ast_expr_node = this.visit(cst_expr_node);
        this._scopes_stack.pop();
        this._current_function = saved_current_func;
        this._current_module = saved_current_module;

        // CHECK LEFT TYPE == RIGHT TYPE
        if (ast_expr_node.ic_type != this._type_unknow && ast_expr_node.ic_type.get_type_name() != method_type){
            this.add_error(ctx, AST.EXPR_FUNCTION_DECL, 'Error:left type [' + method_type + '] and right type [' + ast_expr_node.ic_type + '] are different for function declaration [' + method_name + '].')
        }

        // SET INSTRUCTIONS
        const instructions = [
            {
                ast_code: AST.STAT_RETURN,
                ic_type: ast_expr_node.ic_type,
                expression: ast_expr_node
            }
        ]
        func.set_ast_statements(instructions);

        func.set_exported(false);
        func.set_module_name(this._current_module.get_module_name());

        // REGISTER METHOD
        this._current_type.add_method(func);
    }


    
    /**
     * Visit CST Block node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    blockStatement(ctx:any) {
        // console.log('blockStatement', ctx)

        let statements:any[] = [];
        let statement;

        // LOOP ON STATEMENTS
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            ast_code: AST.BLOCK,
            statements: statements
        }
    }

    
    /**
     * Visit CST Statement node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    statement(ctx:any) {
        // console.log('statement', ctx)

        if (ctx.blockStatement) {
            return this.visit(ctx.blockStatement);
        }

        if (ctx.assignStatement) {
            return this.visit(ctx.assignStatement);
        }

        if (ctx.ifStatement) {
            return this.visit(ctx.ifStatement);
        }
        
        if (ctx.switchStatement) {
            return this.visit(ctx.switchStatement);
        }

        if (ctx.whileStatement) {
            return this.visit(ctx.whileStatement);
        }

        if (ctx.forStatement) {
            return this.visit(ctx.forStatement);
        }

        if (ctx.loopStatement) {
            return this.visit(ctx.loopStatement);
        }

        if (ctx.expressionStatement) {
            return this.visit(ctx.expressionStatement);
        }

        if (ctx.returnStatement) {
            return this.visit(ctx.returnStatement);
        }

        if (ctx.disposeStatement) {
            return this.visit(ctx.disposeStatement);
        }

        if (ctx.emitStatement) {
            return this.visit(ctx.emitStatement);
        }

        if (ctx.onStatement) {
            return this.visit(ctx.onStatement);
        }

        return {
            ast_code: AST.STAT_UNKNOW,
            ctx:ctx
        }
    }
    
    
    /**
     * Visit CST IfThenElse node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    ifStatement(ctx:any) {
        // console.log('ifStatement', ctx)

        const node_1 = this.visit(ctx.Condition);

        let statement;

        const statements_then=[];
        for(statement of ctx.Then.slice(1)){
            statements_then.push( this.visit(statement) );
        }
        
        const statements_else=[];
        if (ctx.Else) {
            for(statement of ctx.Else.slice(1)){
                statements_else.push( this.visit(statement) );
            }
        }

        return {
            ast_code: AST.STAT_IF,
            condition:node_1,
            then:statements_then,
            else:ctx.Else ? statements_else : undefined
        }
    }
    

    /**
     * Visit CST While node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    whileStatement(ctx:any) {
        // console.log('whileStatement', ctx)

        const node_1 = this.visit(ctx.expression);
        
        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            ast_code: AST.STAT_WHILE,
            condition:node_1,
            block:statements
        }
    }
    

    /**
     * Visit CST For node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    forStatement(ctx:any) {
        // console.log('forStatement', ctx)

        const node_var = ctx.ForVar[0].image;
        const node_in = this.visit(ctx.ForIn);
        
        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            ast_code: AST.STAT_FOR,
            var:node_var,
            in:node_in,
            block:statements
        }
    }
    

    /**
     * Visit CST Loop node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    loopStatement(ctx:any) {
        // console.log('loopStatement', ctx)

        const node_var = ctx.LoopVar[0].image;
        const node_type = ctx.LoopType ? ctx.LoopType[0].image : this._type_integer;
        const node_from = this.visit(ctx.LoopFrom);
        const node_to = this.visit(ctx.LoopTo);
        const node_step = this.visit(ctx.LoopStep);

        this.register_symbol_declaration(node_var, node_type, false, undefined, ctx, AST.STAT_LOOP);
        
        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            ast_code: AST.STAT_LOOP,
            var:node_var,
            from:node_from,
            to:node_to,
            step:node_step,
            block:statements
        }
    }
    

    /**
     * Visit CST Switch node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    switchStatement(ctx:any) {
        // console.log('switchStatement', ctx)

        const ast_var = ctx.switchVariable[0].image;
        const ast_var_type = this.get_symbol_type(ast_var);

        const ast_items=[];
        let cst_item;
        let ast_item;
        for(cst_item of ctx.switchStatementItem){
            ast_item = this.visit(cst_item);
            ast_items.push(ast_item);
        }

        return {
            ast_code: AST.STAT_SWITCH,
            ic_type:ast_var_type,
            var:ast_var,
            items:ast_items
        }
    }
    

    /**
     * Visit CST Switch Item node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    switchStatementItem(ctx:any) {
        // console.log('switchStatementItem', ctx)
        
        const node_expr = this.visit(ctx.caseExpression);

        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            item_expression:node_expr,
            item_block:statements
        }
    }
    

    /**
     * Visit CST Exported constant node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    exportedConstantStatement(ctx:any) {
        // console.log('exportedConstantStatement', ctx)

        const constant_name = ctx.ID[0].image;
        const constant_value = this.visit(ctx.PrimaryExpression);
        const constant_ast = {
            ast_code: AST.STAT_ASSIGN_VARIABLE,
            ic_type: constant_value.ic_type,
            name: constant_name,
            is_async:ctx.Async ? true : false,
            members:<any>[],
            expression:constant_value.value,
            is_exported: true
        };

        // DECLARE A NEW VARIABLE OR UPDATE AN EXISTING VARIABLE
        this.register_exported_module_constant_declaration(constant_name, constant_ast.ic_type, true, constant_value.value, ctx, AST.STAT_ASSIGN_VARIABLE);
        return constant_ast;
    }


    /**
     * Visit CST Constant node.
     * 
     * @param ctx CST nodes
     * @param ctx is exported
     * 
     * @returns AST node
     */
    constantStatement(ctx:any) {
        // console.log('constantStatement', ctx)

        const constant_name = ctx.ID[0].image;
        const constant_value = this.visit(ctx.PrimaryExpression);
        const constant_ast = {
            ast_code: AST.STAT_ASSIGN_VARIABLE,
            ic_type: constant_value.ic_type,
            name: constant_name,
            is_async:ctx.Async ? true : false,
            members:<any>[],
            expression:constant_value.value,
            is_exported: false
        };

        // DECLARE A NEW VARIABLE OR UPDATE AN EXISTING VARIABLE
        this.register_module_constant_declaration(constant_name, constant_ast.ic_type, true, constant_value.value, ctx, AST.STAT_ASSIGN_VARIABLE);
        return constant_ast;
    }

    
    /**
     * Visit CST Assign node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    assignStatement(ctx:any):ICompilerAstAssignNode {
        // console.log('assignStatement', ctx)

        const cst_id_left_node = ctx.idLeft[0];
        const ast_id_left_node = this.visit(cst_id_left_node);
        const assign_name = ast_id_left_node.name;

        
        // *** ASSIGN A VARIABLE: NO ACCESSORS, NOT A FUNCTION DECLARATION ***
        if (ast_id_left_node.members.length == 0 && ast_id_left_node.ast_code == AST.EXPR_FUNCTION_LOCAL){
            // EVALUATE RIGHT EXPRESSION
            const cst_expr_node = ctx.AssignExpr;
            const ast_expr_node = this.visit(cst_expr_node);

            const assign_ast = {
                ast_code: AST.STAT_ASSIGN_VARIABLE,
                ic_type: ast_expr_node.ic_type,
                name:assign_name,
                is_async:ctx.Async ? true : false,
                members:ast_id_left_node.members,
                expression:ast_expr_node
            };

            // DECLARE A NEW VARIABLE OR UPDATE AN EXISTING VARIABLE
            this.register_symbol_declaration(assign_name, assign_ast.ic_type, true, '', ctx, AST.STAT_ASSIGN_VARIABLE);

            return assign_ast;
        }


        // *** ASSIGN A FUNCTION DECLARATION: NO ACCESSORS ***
        if (ast_id_left_node.members.length == 0 && ast_id_left_node.ast_code == AST.EXPR_FUNCTION_DECL){
            let assign_ast = {
                ast_code: AST.STAT_ASSIGN_FUNCTION,
                ic_type: this._type_unknow,
                name:assign_name,
                is_async:ctx.Async ? true : false,
                members:ast_id_left_node.members,
                expression:<any>undefined,
                operands_types:ast_id_left_node.operands_types,
                operands_names:ast_id_left_node.operands_names
            };
    
            // DECLARE A NEW FUNCTION OR RECREATE AN EXISTING FUNCTION
            const operands_types = ast_id_left_node.operands_types;
            const operands_names = ast_id_left_node.operands_names;
            const default_type = operands_types.length > 0 ? operands_types[0]:'INTEGER';
            const operands = [];
    
            let opd_index;
            let loop_name;
            let loop_type;
            for(opd_index=0; opd_index < operands_names.length; opd_index++){
                loop_name = operands_names[opd_index];
                loop_type = opd_index < operands_types.length ?operands_types[opd_index] : default_type;
                operands.push( { opd_name:loop_name, opd_type:loop_type } )
            }
            
            this.register_local_function_declaration(assign_name, this.get_unknow_type(ctx, ast_id_left_node), operands, [], ctx, AST.STAT_ASSIGN_FUNCTION);
            
            // EVALUATE RIGHT EXPRESSION
            this.enter_local_function_declaration(assign_name);
            const cst_expr_node = ctx.AssignExpr;
            const ast_expr_node = this.visit(cst_expr_node);
            this.leave_local_function_declaration();
    
            // UPDATE RIGHT TYPE
            assign_ast.ic_type = ast_expr_node.ic_type;
            assign_ast.expression = ast_expr_node;
    
            // UPDATE FUNCTION DECLARATION
            this.set_local_function_declaration_statements(assign_name, ast_expr_node);
            this.set_local_function_declaration_type(assign_name, ast_expr_node.ic_type);
                
            // CHECK LEFT TYPE == RIGHT TYPE
            if (ast_id_left_node.ic_type != this._type_unknow && assign_ast.ic_type != ast_id_left_node.ic_type){
                this.add_error(ctx.ArgumentsWithIds, AST.EXPR_FUNCTION_DECL, 'Error:left type [' + assign_ast.ic_type + '] and right type [' + ast_id_left_node.ic_type + '] are different for function declaration.')
            }

            return assign_ast;
        }


        // *** ASSIGN AN ATTRIBUTE ***
        if (ast_id_left_node.members.length > 0 && ast_id_left_node.ast_code == AST.EXPR_ID_OPTION_ATTRIBUTE){
            // EVALUATE RIGHT EXPRESSION
            const cst_expr_node = ctx.AssignExpr;
            const ast_expr_node = this.visit(cst_expr_node);

            if (ast_id_left_node.members[0].ic_type == this._type_unknow){
                ast_id_left_node.members[0].ic_type = ast_expr_node.ic_type;
            }

            const assign_ast = {
                ast_code: AST.STAT_ASSIGN_ATTRIBUTE,
                ic_type: ast_expr_node.ic_type,
                name:assign_name,
                is_async:ctx.Async ? true : false,
                members:ast_id_left_node.members,
                expression:ast_expr_node
            };

            return assign_ast;
        }


        // *** METHOD DECLARATION ***
        if (ast_id_left_node.members.length > 0 && ast_id_left_node.ast_code == AST.EXPR_ID_OPTION_METHOD_DECL){
            const last_member = ast_id_left_node.members[ast_id_left_node.members.length - 1];
            const operands_types = last_member.operands_types;
            const operands_names = last_member.operands_names;
            const default_type = operands_types.length > 0 ? operands_types[0]:'INTEGER';
            const method_decl_member_index = ast_id_left_node.members.length  > 1 ? ast_id_left_node.members.length - 2 : 0;
            const method_value_type = ast_id_left_node.members.length  > 1 ? ast_id_left_node.members[ast_id_left_node.members.length - 2].ic_type : ast_id_left_node.ic_type;
            const method_name = method_value_type + '.' + last_member.func_name;
            const operands = [];
    
            // UPDATE METHODE DECLARATION MEMBER TYPE
            ast_id_left_node.members[method_decl_member_index].ic_type = method_value_type;
            
            // REGISTER OPERANDS
            let opd_index;
            let loop_name;
            let loop_type;
            for(opd_index=0; opd_index < operands_names.length; opd_index++){
                loop_name = operands_names[opd_index];
                loop_type = opd_index < operands_types.length ?operands_types[opd_index] : default_type;
                operands.push( { opd_name:loop_name, opd_type:loop_type } );
            }
            
            this.register_function_declaration(method_name, this.get_integer_type(ctx, ast_id_left_node), ctx.is_exported, operands, [], ctx, AST.STAT_ASSIGN_METHOD);
            
            // EVALUATE RIGHT EXPRESSION
            this.enter_function_declaration(method_name);
            const cst_expr_node = ctx.AssignExpr;
            const ast_expr_node = this.visit(cst_expr_node);
            this.leave_function_declaration();
            
            this.unregister_function_declaration(method_name);

            const assign_ast = {
                ast_code: AST.STAT_ASSIGN_METHOD,
                ic_type: ast_expr_node.ic_type,
                name:assign_name,
                is_async:ctx.Async ? true : false,
                members:ast_id_left_node.members,
                expression:ast_expr_node
            };

            // if (ast_expr_node.ic_type != this._type_integer){
            //     this._scopes_map.delete(method_name);
            //     const method_new_name = ast_expr_node.ic_type + '.' + last_member.func_name;
            //     assign_ast.name = method_new_name;
            //     this.register_function_declaration(method_new_name, ast_expr_node.ic_type, operands, [ast_expr_node], ctx, AST.STAT_ASSIGN_METHOD);
            // }

            // CHECK LEFT TYPE == RIGHT TYPE
            if (ast_id_left_node.ic_type != this._type_unknow && assign_ast.ic_type != ast_id_left_node.ic_type){
                ast_id_left_node.ic_type = assign_ast.ic_type;
                // this.add_error(ctx, AST.EXPR_MEMBER_METHOD_DECL, 'Error:left type [' + assign_ast.ic_type + '] and right type [' + ast_id_left_node.ic_type + '] are different for method [' + method_name + '] declaration.')
            }

            return assign_ast;
            // return undefined;
        }

        // NOTHING
        return undefined;
    }
    

    /**
     * Visit CST Function declaration node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    functionStatement(ctx:any):ICompilerAstFunctionNode {
        // console.log('functionStatement', ctx)

        const function_name = ctx.functionName[0].image ? ctx.functionName[0].image : this._type_unknow;
        const returned_type = this.visit(ctx.returnedType[0]);
        const function_is_exported:boolean = ctx.Export && ctx.Export[0] ? true : false;

        let operands_decl;
        if (ctx.visit_header){
            operands_decl = this.visit(ctx.ArgumentsWithIds);
            const operands = [];
            if (operands_decl.items) {
                let loop_index;
                for(loop_index=0; loop_index < operands_decl.items.length; loop_index++) {
                    operands.push( { opd_name:operands_decl.items[loop_index], opd_type:operands_decl.ic_subtypes[loop_index] } );
                }
            }

            this.register_function_declaration(function_name, returned_type, function_is_exported, operands, [], ctx, AST.STAT_FUNCTION);
        }

        const statements = [];
        if (ctx.visit_body){
            // CHANGE SCOPE FOR FUNCTION STATEMENTS
            this.enter_function_declaration(function_name);

            let statement;
            for(statement of ctx.blockStatement){
                statements.push( this.visit(statement) );
            }

            this.leave_function_declaration();

            this.set_function_declaration_statements(function_name, statements);
        }

        return {
            ast_code: AST.STAT_FUNCTION,
            ic_type:returned_type,
            func_name:function_name,
            is_exported: function_is_exported,
            operands_types:operands_decl && operands_decl.ic_subtypes ? operands_decl.ic_subtypes : [],
            operands_names:operands_decl && operands_decl.items ? operands_decl.items : [],
            statements:statements
        }
    }
    

    /**
     * Visit CST Function Return node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    returnStatement(ctx:any) {
        // console.log('returnStatement', ctx)

        const node_expr = this.visit(ctx.expression);

        return {
            ast_code: AST.STAT_RETURN,
            ic_type:node_expr.ic_type,
            expression:node_expr
        }
    }
    

    /**
     * Visit CST Dispose.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    disposeStatement(ctx:any) {
        // console.log('DisposeStatement', ctx)

        const name = ctx.ID[0].image;

        return {
            ast_code: AST.STAT_DISPOSE,
            name:name
        }
    }
    

    /**
     * Visit CST Emit.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    emitStatement(ctx:any) {
        // console.log('emitStatement', ctx)

        const node_record = this.visit(ctx.Record);

        return {
            ast_code: AST.STAT_EMIT,
            event:ctx.ID[0].image,
            operands:node_record
        }
    }
    

    /**
     * Visit CST On.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    onStatement(ctx:any) {
        // console.log('onStatement', ctx)

        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            ast_code: AST.STAT_ON,
            event:ctx.eventName[0].image,
            record:ctx.recordName[0].image,
            block:statements
        }
    }
    

    /**
     * Visit CST Wait.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    waitStatement(ctx:any) {
        // console.log('waitStatement', ctx)

        const vars = [];
        let name;
        for(name of ctx.asyncVariables){
            vars.push(name.image);
        }

        const statements = [];
        let statement;
        for(statement of ctx.blockStatement){
            statements.push( this.visit(statement) );
        }

        return {
            ast_code: AST.STAT_WAIT,
            asyncVariables: vars,
            block:statements
        }
    }
}

