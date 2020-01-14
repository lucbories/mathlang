
import MathLangCstToAstVisitorStatement from './math_lang_cst_to_ast_visitor_statement';

import ICompilerType from '../../core/icompiler_type';
import ICompilerFunction from '../../core/icompiler_function';
import ICompilerSymbol from '../../core/icompiler_symbol';

import { IAstNodeKindOf as AST } from '../../core/icompiler_ast_node';
import CompilerScope from '../0-common/compiler_scope';



export default abstract class MathLangCstToAstVisitorExpression extends MathLangCstToAstVisitorStatement {
    constructor(compiler_scope:CompilerScope) {
        super(compiler_scope);
    }

    abstract get_prefix_operator_function(node_op:any):string;
    abstract get_postfix_operator_function(node_op:any):string;
    
    expression(ctx:any) {
        // this.dump_ctx('expression', ctx)

         return this.visit(ctx.BinaryExpression);
    }

    BinaryExpression(ctx:any) {
        // this.dump_ctx('BinaryExpression', ctx);

        let loop_ast_lhs = this.visit(ctx.lhs);

        // SIMPLE LHS EXPRESSION
        if (! ctx.operator || ! ctx.rhs) {
            return loop_ast_lhs;
        }

        // LOOP ON BINOP CHAIN
        let loop_index;
        let loop_ast_op;
        let loop_ast_rhs;
        let loop_ast;
        for(loop_index=0; loop_index < ctx.operator.length; loop_index++) {
            loop_ast_op  = this.visit(ctx.operator[loop_index]);
            loop_ast_rhs = this.visit(ctx.rhs[loop_index]);
            loop_ast = {
                ast_code:     AST.EXPR_BINOP_COMPARE,
                ic_type:  this.get_boolean_type(loop_ast_op, AST.EXPR_BINOP_COMPARE),
                lhs:      loop_ast_lhs,
                operator: loop_ast_op,
                rhs:      loop_ast_rhs
            };
            loop_ast_lhs = loop_ast;
        }

        return loop_ast;
    }

    BinaryMultDivExpression(ctx:any) {
        // this.dump_ctx('BinaryMultDivExpression', ctx);

        let loop_ast_lhs = this.visit(ctx.lhs);

        // SIMPLE LHS EXPRESSION
        if (! ctx.operator || ! ctx.rhs) {
            return loop_ast_lhs;
        }

        // LOOP ON BINOP CHAIN
        let loop_index;
        let loop_ast_op;
        let loop_ast_rhs;
        let loop_ast;
        for(loop_index=0; loop_index < ctx.operator.length; loop_index++) {
            loop_ast_op  = this.visit(ctx.operator[loop_index]);
            loop_ast_rhs = this.visit(ctx.rhs[loop_index]);
            loop_ast = {
                ast_code:     AST.EXPR_BINOP_MULTDIV,
                ic_type:  this.compute_binop_type(loop_ast_op.value, loop_ast_lhs.ic_type, loop_ast_rhs.ic_type, ctx, AST.EXPR_BINOP_MULTDIV),
                lhs:      loop_ast_lhs,
                operator: loop_ast_op,
                rhs:      loop_ast_rhs
            };
            loop_ast_lhs = loop_ast;
        }

        return loop_ast;
    }

    BinaryAddSubExpression(ctx:any) {
        // this.dump_ctx('BinaryAddSubExpression', ctx);

        let loop_ast_lhs = this.visit(ctx.lhs);

        // SIMPLE LHS EXPRESSION
        if (! ctx.operator || ! ctx.rhs) {
            return loop_ast_lhs;
        }

        // LOOP ON BINOP CHAIN
        let loop_index;
        let loop_ast_op;
        let loop_ast_rhs;
        let loop_ast;
        for(loop_index=0; loop_index < ctx.operator.length; loop_index++) {
            loop_ast_op  = this.visit(ctx.operator[loop_index]);
            loop_ast_rhs = this.visit(ctx.rhs[loop_index]);
            loop_ast = {
                ast_code:     AST.EXPR_BINOP_ADDSUB,
                ic_type:  this.compute_binop_type(loop_ast_op.value, loop_ast_lhs.ic_type, loop_ast_rhs.ic_type, ctx, AST.EXPR_BINOP_ADDSUB),
                lhs:      loop_ast_lhs,
                operator: loop_ast_op,
                rhs:      loop_ast_rhs
            };
            loop_ast_lhs = loop_ast;
        }

        return loop_ast;
    }

    UnaryExpression(ctx:any) {
        // this.dump_ctx('UnaryExpression', ctx);

        const node_lhs  = ctx.lhs       ? this.visit(ctx.lhs)       : undefined;
        const node_op   = ctx.operator  ? ctx.operator[0].image     : undefined;
        const node_rhs  = ctx.rhs       ? this.visit(ctx.rhs)       : undefined;

        if (node_lhs) {
            return node_lhs;
        }

        if (node_rhs && node_op) {
            return {
                ast_code: AST.EXPR_UNOP_PREUNOP,
                ic_type:this.compute_preunop_type(node_op, node_rhs.ic_type, ctx, AST.EXPR_UNOP_PREUNOP),
                rhs: node_rhs,
                operator: node_op,
                ic_function: this.get_prefix_operator_function(node_op)
            }
        }
        
        return this.add_error(ctx, AST.EXPR_UNOP_PRE_UNKNOW, 'Unknow prefix unary operator node');
    }


    PostfixExpression(ctx:any) {
        // this.dump_ctx('PostfixExpression', ctx);

        const node_lhs  = ctx.lhs       ? this.visit(ctx.lhs)    : undefined;
        const node_op   = ctx.operator  ? ctx.operator[0].image  : undefined;
        
        if (node_lhs && node_op) {
            return {
                ast_code: AST.EXPR_UNOP_POST,
                ic_type:this.compute_postunop_type(node_op, node_lhs.ic_type, ctx, AST.EXPR_UNOP_POST),
                lhs: node_lhs,
                operator: node_op,
                ic_function: this.get_postfix_operator_function(node_op)
            }
        }

        if (node_lhs && ! node_op) {
            return node_lhs
        }
        
        return this.add_error(ctx, AST.EXPR_UNOP_POST_UNKNOW, 'Unknow postfix unary operator node');
    }


    /**
     * Parse an indexed bracket expression [expr,expr...].
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    indexedBracketsExpression(ctx:any){
        const ast_expressions:any[] = [];
        
        ctx.BinaryExpression.forEach(
            (cst_expr:any) => ast_expressions.push( this.visit(cst_expr) )
        );

        return ast_expressions;
    }


    /**
     * Parse an id node to be a left or right part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idLeftRight(ctx:any){
        const id = ctx.ID[0].image;
        const symbol_type = this.get_symbol_type(id);

        const ast_node = {
            ast_code: AST.EXPR_ID_OPTION_UNKNOW,
            ic_type: symbol_type,
            name: id,
            members:<any>[]
        };

        // PROCESS ID ATTRIBUTE OR INDEXED IN ORDER
        let member_previous_ic_type:ICompilerType = ast_node.ic_type;
        let member_ast_node:any;
        const attributeOrIndexeds = ctx.attributeOrIndexed ? ctx.attributeOrIndexed : [];
        attributeOrIndexeds.forEach((cst_node:any, cst_node_index:number) => {

            // NODE IS AN INDEXED ACCESSOR (LIST OF EXPRESSIONS)
            if (cst_node.name == 'indexedBracketsExpression'){
                const ast_indexed_expressions = this.visit(cst_node);

                // LOOP ON BinaryExpression array
                let loop_ast_node:any;
                let indexes:any[] = [];
                ast_indexed_expressions.forEach((loop_ast_node:any, ast_index_index:number) => {
                    // CHECK INDEX TYPE
                    const type_integer = this.get_integer_type(cst_node, loop_ast_node);
                    const type_biginteger = this.get_biginteger_type(cst_node, loop_ast_node);
                    if (loop_ast_node.ic_type != type_integer && loop_ast_node.ic_type != type_biginteger){
                        this.add_error(cst_node, AST.EXPR_ID_OPTION_INDICES, 'Error:bad index type [' + loop_ast_node.ic_type + '] at [' + ast_index_index + ']');
                    }

                    indexes.push(loop_ast_node);
                });

                // APPEND AST NODE
                member_ast_node = {
                    ast_code: AST.EXPR_ID_OPTION_INDICES,
                    ic_type: this.get_indexed_type(member_previous_ic_type, cst_node, AST.EXPR_ID_OPTION_INDICES),
                    member_index: cst_node_index,
                    indexes_expressions:indexes
                }

                ast_node.ast_code = AST.EXPR_ID_OPTION_INDICES;
                ast_node.members.push(member_ast_node);
            }
            
            // NODE IS AN ATTRIBUTE ACCESSOR
            else {
                // CHECK ATTRIBUTE
                const attribute_id = this.visit(cst_node);
                this.check_attribute(member_previous_ic_type, attribute_id, this.get_unknow_type(ctx, ast_node), ctx, ast_node.ast_code);

                // APPEND AST NODE
                member_ast_node = {
                    ast_code: AST.EXPR_ID_OPTION_ATTRIBUTE,
                    ic_type: this.get_attribute_type(member_previous_ic_type, attribute_id, ctx, ast_node.ast_code),
                    attribute_name:attribute_id
                }

                ast_node.ast_code = AST.EXPR_ID_OPTION_ATTRIBUTE;
                ast_node.members.push(member_ast_node)
            }

            member_previous_ic_type = member_ast_node.ic_type;
        });

        // if (member_previous_ic_type != ) // TODO
        return ast_node;
    }


    /**
     * Parse an id node to be a left part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idLeft(ctx:any){
        const ast_node:any = this.idLeftRight(ctx);

        // FUNCTION DECLARATION
        if (ctx.ArgumentsWithIds){
            if (ctx.ArgumentsWithIds.length != 1){
                this.add_error(ctx.ArgumentsWithIds, AST.EXPR_FUNCTION_DECL, 'Error:only one function declaration at end of an id expression but [' + ctx.ArgumentsWithIds.length + '] found.')
            }

            const cst_func_decl_node:any = ctx.ArgumentsWithIds[0];
            const ast_func_decl_node:any = this.visit(cst_func_decl_node);

            // NO TEST OF EXISTING FUNCTION/METHOD TO BE ABLE TO DECLARE NEW ONE

            ast_node.ast_code = AST.EXPR_FUNCTION_DECL;
            ast_node.operands_names = ast_func_decl_node.items;
            ast_node.operands_types = ast_func_decl_node.ic_subtypes;
        }

        // METHOD DECLARATION
        else if (ctx.dotIdArgsDeclarationExpression){
            if (ctx.dotIdArgsDeclarationExpression.length != 1){
                this.add_error(ctx.dotIdArgsDeclarationExpression, AST.EXPR_ID_OPTION_METHOD_DECL, 'Error:only one method declaration at end of an id expression but [' + ctx.dotIdArgsDeclarationExpression.length + '] found.')
            }

            const cst_func_decl_node:any = ctx.dotIdArgsDeclarationExpression[0];
            const ast_func_decl_node:any = this.visit(cst_func_decl_node);

            // NO TEST OF EXISTING FUNCTION/METHOD TO BE ABLE TO DECLARE NEW ONE

            ast_node.ast_code = AST.EXPR_ID_OPTION_METHOD_DECL;
            ast_func_decl_node.ast_code = AST.EXPR_ID_OPTION_METHOD_DECL;
            ast_node.members.push(ast_func_decl_node);
        }

        // VAR ASSIGN (begin b = 12 + x end)
        else {
			// NOTHING TO DO, NO ERROR
        }

        // ERROR
        // else {
            // this.add_error(ctx, AST.EXPR_MEMBER_UNKNOW, 'Error:unknow left part.');
        // }

        return ast_node;
    }


    /**
     * Parse an id node to be a right part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idModuleRight(ctx:any):any{
        if(ctx.Arguments) {
            return this.moduleFunctionCall(ctx);
        }
        return this.moduleConstant(ctx);
    }


    /**
     * Parse an id node to be a right part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    moduleConstant(ctx:any):any{
        const module_name = ctx.moduleName[0].image;
        const constant_name = ctx.constantOrFunctionName[0].image;
        const symbol_type:ICompilerType = undefined;

        const ast_node = {
            ast_code: AST.EXPR_MODULE_CONSTANT,
            ic_type: symbol_type,
            module_name:module_name,
            module_constant:constant_name,
            options:<any>[]
        };

        // TEST IF MODULE FUNCTION EXISTS
        if ( ! this._compiler_scope.has_module(module_name)) {
            return this.add_error(ctx, AST.EXPR_MODULE_CONSTANT, 'Error:unknow module [' + module_name + '] constant [' + constant_name + ']');
        }

        // GET MODULE CONSTANT TYPE
        const module_const:ICompilerSymbol = this._compiler_scope.get_module(module_name).get_exported_constant(constant_name);
        ast_node.ic_type = module_const.type;

        // PROCESS ID RIGHT OPTIONS
        if (ctx.idRightOptions && ctx.idRightOptions.length > 0 && ctx.idRightOptions[0].idRightOptions) {
            ctx.idRightOptions.forEach(
                (idRightOption:any)=>{
                    ast_node.options.push( this.visit(idRightOption) );
                }
            )
        }

        return ast_node;
    }


    /**
     * Parse a function call id expression.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    moduleFunctionCall(ctx:any){
        const module_name = ctx.moduleName[0].image;
        const function_name = ctx.constantOrFunctionName[0].image;
        const symbol_type:ICompilerType = undefined;

        const ast_node = {
            ast_code:AST.EXPR_MODULE_FUNCTION_CALL,
            ic_type: symbol_type,
            module_name:module_name,
            func_name:function_name,
            operands_expressions:<any>[],
            operands_types:<any>[],
            options:<any>[]
        };

        // TEST IF MODULE FUNCTION EXISTS
        if ( ! this._compiler_scope.has_module(module_name) ) {
            return this.add_error(ctx, AST.EXPR_MODULE_FUNCTION_CALL, 'Error:unknow [' + module_name + '] for function [' + function_name + ']');
        }
        if ( ! this._compiler_scope.get_module(module_name).has_exported_function(function_name)) {
            return this.add_error(ctx, AST.EXPR_MODULE_FUNCTION_CALL, 'Error:unknow exported function [' + function_name + '] in module [' + module_name + '] ');
        }

        // GET MODULE FUNCTION TYPE
        const module_function = this._compiler_scope.get_module(module_name).get_exported_function(function_name);
        ast_node.ic_type = module_function.get_returned_type();

        // PROCESS OPERANDS
        const cst_operands_node:any = ctx.Arguments[0];
        const ast_operands_node:any = this.visit(cst_operands_node);
        ast_node.operands_expressions = ast_operands_node.items;
        ast_node.operands_types = ast_operands_node.ic_subtypes;

        // PROCESS ID RIGHT OPTIONS
        if (ctx.idRightOptions && ctx.idRightOptions.length > 0 && ctx.idRightOptions[0].idRightOptions) {
            ctx.idRightOptions.forEach(
                (idRightOption:any)=>{
                    ast_node.options.push( this.visit(idRightOption) );
                }
            )
        }

        return ast_node;
    }


    /**
     * Parse an id node to be a right part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idLocalOrFunctionCallRight(ctx:any):any {
        if(ctx.Arguments) {
            return this.idFunctionCall(ctx);
        }
        return this.idFunctionLocal(ctx);
    }


    /**
     * Parse an id node to be a right part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idFunctionLocal(ctx:any):any{
        const id = ctx.localOrFunctionName[0].image;
        const symbol_type:ICompilerType = undefined;
        const ast_node = {
            ast_code: AST.EXPR_FUNCTION_LOCAL,
            ic_type: symbol_type,
            local_name: id,
            options:<any>[]
        };

        // TEST IF FUNCTION LOCAL TYPE EXISTS
        if (! this.has_declared_var_symbol(id) ) {
            return this.add_error(ctx, AST.EXPR_FUNCTION_LOCAL, 'Error:unknow function [' + (this._current_function ? this._current_function.get_func_name() : 'no current function') + '] local [' + id + ']');
        }

        // GET FUNCTION LOCAL TYPE
        // const obj = this.get_declared_var_symbol(id);
        // const obj_type = obj ? obj.type : this.get_unknow_type(ctx, ast_node);
        ast_node.ic_type = this.get_symbol_type(id);

        // PROCESS ID RIGHT OPTIONS
        if (ctx.idRightOptions && ctx.idRightOptions.length > 0 && ctx.idRightOptions[0].idRightOptions) {
            ctx.idRightOptions.forEach(
                (idRightOption:any)=>{
                    ast_node.options.push( this.visit(idRightOption) );
                }
            )
        }

        return ast_node;
    }


    /**
     * Parse an id node to be a right part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idFunctionCall(ctx:any):any{
        const id = ctx.localOrFunctionName[0].image;
        const symbol_type:ICompilerType = undefined;
        const ast_node = {
            ast_code: AST.EXPR_FUNCTION_CALL,
            ic_type: symbol_type,
            module_name:this._current_module ? this._current_module.get_module_name() : undefined,
            func_name: id,
            options:<any>[],
            operands_expressions:<any>[],
            operands_types:<any>[]
        };

        // TEST IF CALLED FUNCTION EXISTS
        if ( ! this.has_declared_func_symbol(id) ) {
            return this.add_error(ctx, AST.EXPR_FUNCTION_CALL, 'Error:unknow called function [' + id + ']');
        }

        // GET FUNCTION TYPE
        ast_node.ic_type = this.get_function_type(this._current_module, id);

        // PROCESS OPERANDS
        const cst_operands_node:any = ctx.Arguments[0];
        const ast_operands_node:any = this.visit(cst_operands_node);
        ast_node.operands_expressions = ast_operands_node.items;
        ast_node.operands_types = ast_operands_node.ic_subtypes;

        // PROCESS ID RIGHT OPTIONS
        if (ctx.idRightOptions && ctx.idRightOptions.length > 0 && ctx.idRightOptions[0].idRightOptions > 0) {
            ctx.idRightOptions.forEach(
                (idRightOption:any)=>{
                    ast_node.options.push( this.visit(idRightOption) );
                }
            )
        }

        return ast_node;
    }


    /**
     * Parse an id node to be a right part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idRightOptions(ctx:any):any{
        return this.add_error(ctx, AST.EXPR_ID_OPTION_UNKNOW, 'Error:idRightOptions not implemented');
    }


    /**
     * Parse an id node to be a right part of a statement.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idRight(ctx:any){
        if (ctx.idModuleRight) {
            if (ctx.idModuleRight.length != 1){
                return this.add_error(ctx.idModuleRight, AST.PROGRAM, 'Error:only one module item / expression.')
            }
            return this.visit(ctx.idModuleRight[0]);
        }

        if (ctx.idLocalOrFunctionCallRight) {
            if (ctx.idLocalOrFunctionCallRight.length != 1){
                return this.add_error(ctx.idLocalOrFunctionCallRight, AST.PROGRAM, 'Error:only one local or function call / expression.')
            }
            return this.visit(ctx.idLocalOrFunctionCallRight[0]);
        }

        return this.add_error(ctx.idFunctionCall, AST.EXPR_ID_OPTION_UNKNOW, 'Error:unknow id right expression.')

/*
        // FUNCTION CALL
        if (ctx.Arguments){
            if (ctx.Arguments.length != 1){
                this.add_error(ctx.Arguments, AST.EXPR_MEMBER_FUNC_CALL, 'Error:only one function call at end of an id expression but [' + ctx.Arguments.length + '] found.')
            }

            const cst_func_call_node:any = ctx.Arguments[0];
            const ast_func_call_node:any = this.visit(cst_func_call_node);

            // TEST IF CALLED FUNCTION/METHOD EXISTS
            if (ast_node.members.length == 0 && ! this.has_declared_func_symbol(id)){
                this.add_error(ctx, AST.EXPR_MEMBER_FUNC_CALL, 'Error:unknow called function [' + id + ']');
            }
            if (ast_node.members.length > 0){
                const last_member = ast_node.members[ast_node.members.length - 1];
                const last_member_type = last_member ? last_member.ic_type : this.get_unknow_type(ctx, ast_node);
                this.check_method(last_member_type, id, ast_func_call_node.ic_subtypes, cst_func_call_node, AST.EXPR_MEMBER_FUNC_CALL);
            }

            ast_node.ast_code = AST.EXPR_MEMBER_FUNC_CALL;
            ast_node.ic_type = this.get_function_type(this._current_module, ast_node.name);
            ast_node.operands_expressions = ast_func_call_node.items;
            ast_node.operands_types = ast_func_call_node.ic_subtypes;
        }

        // MODULE@FUNCTION
        else if (ctx.atIdArgsCallExpression){
            if (ctx.atIdArgsCallExpression.length != 1){
                this.add_error(ctx.atIdArgsCallExpression, AST.EXPR_MEMBER_METHOD_CALL, 'Error:only one function call at end of an id expression but [' + ctx.atIdArgsCallExpression.length + '] found.')
            }

            const object_or_module_name = ast_node.name;
            const cst_func_call_node:any = ctx.atIdArgsCallExpression[0];
            const ast_func_call_node:any = this.visit(cst_func_call_node);
            const id = ast_func_call_node.func_name;

            // PROCESS A MODULE.FUNCTION OR MODULE.CONST
            if (this._compiler_scope.has_module(object_or_module_name)) {
                const module_function = this._compiler_scope.get_module(object_or_module_name).get_exported_function(id);
                const module_const = this._compiler_scope.get_module(object_or_module_name).get_exported_constant(id);
               
                if (module_function) {
                    ast_func_call_node.ic_type = module_function.get_returned_type();
            
                    ast_node.ast_code = AST.EXPR_MEMBER_FUNC_CALL;
                    ast_node.ic_type = ast_func_call_node.ic_type;
                    ast_node.members.push(ast_func_call_node);
                } else if (module_const) {
                    ast_func_call_node.ic_type = module_function.get_returned_type();
            
                    ast_node.ast_code = AST.EXPR_ID_OPTION_ATTRIBUTE;
                    ast_node.ic_type = ast_func_call_node.ic_type;
                    ast_node.members.push(ast_func_call_node);
                } else {
                    this.add_error(ctx, AST.EXPR_MEMBER_FUNC_CALL, 'Error:unknow exported function or constant [' + id + '] of module [' + object_or_module_name + ']');
                    
                    ast_func_call_node.ic_type = this.get_unknow_type(ctx, ast_node);
                    
                    ast_node.ast_code = AST.EXPR_MEMBER_UNKNOW;
                    ast_node.ic_type = ast_func_call_node.ic_type;
                    ast_node.members.push(ast_func_call_node);
                }
            }
        }

        // MODULE.FUNCTION or OBJECT.METHOD CALL
        else if (ctx.dotIdArgsCallExpression){
            if (ctx.atIdArgsCallExpression.length != 1){
                this.add_error(ctx.dotIdArgsCallExpression, AST.EXPR_MEMBER_METHOD_CALL, 'Error:only one function call at end of an id expression but [' + ctx.dotIdArgsCallExpression.length + '] found.')
            }

            const object_or_module_name = ast_node.name;
            const cst_func_call_node:any = ctx.dotIdArgsCallExpression[0];
            const ast_func_call_node:any = this.visit(cst_func_call_node);
            const id = ast_func_call_node.func_name;

            // PROCESS A MODULE.FUNCTION OR MODULE.CONST
            // if (this._compiler_scope.has_module(object_or_module_name)) {
            //     const module_function = this._compiler_scope.get_module(object_or_module_name).get_exported_function(id);
            //     const module_const = this._compiler_scope.get_module(object_or_module_name).get_exported_constant(id);
               
            //     if (module_function) {
            //         ast_func_call_node.ic_type = module_function.get_returned_type();
            
            //         ast_node.ast_code = AST.EXPR_MEMBER_FUNC_CALL;
            //         ast_node.ic_type = ast_func_call_node.ic_type;
            //         ast_node.members.push(ast_func_call_node);
            //     } else if (module_const) {
            //         ast_func_call_node.ic_type = module_function.get_returned_type();
            
            //         ast_node.ast_code = AST.EXPR_ID_OPTION_ATTRIBUTE;
            //         ast_node.ic_type = ast_func_call_node.ic_type;
            //         ast_node.members.push(ast_func_call_node);
            //     } else {
            //         this.add_error(ctx, AST.EXPR_MEMBER_FUNC_CALL, 'Error:unknow exported function or constant [' + id + '] of module [' + object_or_module_name + ']');
                    
            //         ast_func_call_node.ic_type = this.get_unknow_type(ctx, ast_node);
                    
            //         ast_node.ast_code = AST.EXPR_MEMBER_UNKNOW;
            //         ast_node.ic_type = ast_func_call_node.ic_type;
            //         ast_node.members.push(ast_func_call_node);
            //     }
            // }

            // PROCESS A VAR METHOD
            // else
             if ( this.has_declared_var_symbol(object_or_module_name) ) {
                const obj = this.get_declared_var_symbol(object_or_module_name);
                const obj_type = obj ? obj.type : this.get_unknow_type(ctx, ast_node);

                // VAR METHOD EXISTS?
                if ( ast_node.members.length == 0 && obj.type.has_method_with_types_names(id, ast_func_call_node.operands_types) ) {
                    const method:ICompilerFunction = obj.type.get_method_with_types_names(id, ast_func_call_node.operands_types);
                    ast_func_call_node.ic_type = method.get_returned_type();
                } else if (ast_node.members.length > 0){
                    const last_member = ast_node.members[ast_node.members.length - 1];
                    const last_member_type = last_member ? last_member.ic_type : this.get_unknow_type(ctx, ast_node);
                    this.check_method(last_member_type, id, ast_func_call_node.operands_types, cst_func_call_node, AST.EXPR_MEMBER_METHOD_CALL);
                } else {
                    this.add_error(ctx, AST.EXPR_MEMBER_METHOD_CALL, 'Error:unknow called function [' + id + '] of module [' + object_or_module_name + ']');
                }
            
                ast_node.ast_code = AST.EXPR_MEMBER_METHOD_CALL;
                ast_node.ic_type = ast_func_call_node.ic_type;
                ast_node.members.push(ast_func_call_node);
            }

            else {
                this.add_error(ctx, AST.EXPR_MEMBER_UNKNOW, 'Error:unknow module or var [' + object_or_module_name + '] for called function/method [' + id + ']');

                ast_node.ast_code = AST.EXPR_MEMBER_UNKNOW;
                ast_node.ic_type = ast_func_call_node.ic_type;
                ast_node.members.push(ast_func_call_node);
            }
        }

        return ast_node;*/
    }



    /**
     * Parse an id node to be a value type.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    idType(ctx:any){
        const id = ctx.ID[0].image;
        this.check_type(id, ctx, AST.EXPR_TYPE_ID);
        return this.get_type(id, ctx, 'idType');
    }


    /**
     * Parse a function declaration id expression.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    dotIdArgsDeclarationExpression(ctx:any){
        const id = ctx.ID[0].image;
        const cst_args_node:any = ctx.ArgumentsWithIds[0];
        const ast_args_node:any = this.visit(cst_args_node);

        const ast_function_declaration = {
            ast_code: AST.EXPR_ID_OPTION_METHOD_DECL,
            ic_type: this.get_unknow_type(ctx, ast_args_node),
            func_name:id,
            operands_types:ast_args_node.ic_subtypes,
            operands_names:ast_args_node.items
        };

        return ast_function_declaration;
    }


    /**
     * Parse a function call id expression.
     * @param ctx CST node to parse.
     * @returns AST node.
     */
    dotIdArgsCallExpression(ctx:any){
        const id = ctx.ID[0].image;
        const cst_args_node = ctx.Arguments[0];
        const ast_args_node = this.visit(cst_args_node);
        // const func_scope = this.get_scopes_map().get(id);

        const ast_func_call_node = {
            ast_code:AST.EXPR_ID_OPTION_METHOD_CALL,
            ic_type: this.get_unknow_type(ctx, ast_args_node),
            func_name:id,
            operands_types:ast_args_node.ic_subtypes ? ast_args_node.ic_subtypes : [],
            operands_expressions:ast_args_node.items ? ast_args_node.items : []
        };

        return ast_func_call_node;
    }


    PrimaryExpression(ctx:any) {
        // this.dump_ctx('PrimaryExpression', ctx)

        if (ctx.StringLiteral) {
            return {
                ast_code: AST.EXPR_PRIMARY_STRING,
                ic_type:this.get_string_type(ctx, AST.EXPR_PRIMARY_STRING),
                value:ctx.StringLiteral[0].image
            }
        }

        if (ctx.Integer1Literal) {
            return {
                ast_code: AST.EXPR_PRIMARY_INTEGER,
                ic_type:this.get_integer_type(ctx, AST.EXPR_PRIMARY_INTEGER),
                value:ctx.Integer1Literal[0].image
            }
        }

        if (ctx.Integer2Literal) {
            return {
                ast_code: AST.EXPR_PRIMARY_INTEGER,
                ic_type:this.get_integer_type(ctx, AST.EXPR_PRIMARY_INTEGER),
                value:ctx.Integer2Literal[0].image
            }
        }

        if (ctx.FloatLiteral) {
            return {
                ast_code: AST.EXPR_PRIMARY_FLOAT,
                ic_type:this.get_float_type(ctx, AST.EXPR_PRIMARY_FLOAT),
                value:ctx.FloatLiteral[0].image
            }
        }

        if (ctx.BigInteger1Literal) {
            return {
                ast_code: AST.EXPR_PRIMARY_BIGINTEGER,
                ic_type:this.get_biginteger_type(ctx, AST.EXPR_PRIMARY_BIGINTEGER),
                value:ctx.BigInteger1Literal[0].image
            }
        }

        if (ctx.BigInteger2Literal) {
            return {
                ast_code: AST.EXPR_PRIMARY_BIGINTEGER,
                ic_type:this.get_biginteger_type(ctx, AST.EXPR_PRIMARY_BIGINTEGER),
                value:ctx.BigInteger2Literal[0].image
            }
        }

        if (ctx.BigFloat1Literal) {
            return {
                ast_code: AST.EXPR_PRIMARY_BIGFLOAT,
                ic_type:this.get_bigfloat_type(ctx, AST.EXPR_PRIMARY_BIGFLOAT),
                value:ctx.BigFloat1Literal[0].image
            }
        }

        if (ctx.BigFloat2Literal) {
            return {
                ast_code: AST.EXPR_PRIMARY_BIGFLOAT,
                ic_type:this.get_bigfloat_type(ctx, AST.EXPR_PRIMARY_BIGFLOAT),
                value:ctx.BigFloat2Literal[0].image
            }
        }

        if (ctx.BigFloat3Literal) {
            return {
                ast_code: AST.EXPR_PRIMARY_BIGFLOAT,
                ic_type:this.get_bigfloat_type(ctx, AST.EXPR_PRIMARY_BIGFLOAT),
                value:ctx.BigFloat3Literal[0].image
            }
        }


        if (ctx.ArrayLiteral) {
            return this.visit(ctx.ArrayLiteral);
        }

        if (ctx.NumberLiteral) {
            return this.visit(ctx.NumberLiteral);
        }

        if (ctx.True) {
            return {
                ast_code: AST.EXPR_PRIMARY_TRUE,
                ic_type:this.get_boolean_type('BOOLEAN', AST.EXPR_PRIMARY_TRUE),
                value:'TRUE'
            }
        }

        if (ctx.False) {
            return {
                ast_code: AST.EXPR_PRIMARY_FALSE,
                ic_type:this.get_boolean_type('BOOLEAN', AST.EXPR_PRIMARY_FALSE),
                value:'FALSE'
            }
        }

        if (ctx.Null) {
            return {
                ast_code: AST.EXPR_PRIMARY_NULL,
                ic_type:this.get_keyword_type('NULL', AST.EXPR_PRIMARY_NULL),
                value:'NULL'
            }
        }

        // if (ctx.ParenthesisExpression) {
        //     return this.visit(ctx.ParenthesisExpression);
        // }

        return {
            ast_code: AST.EXPR_PRIMARY_UNKNOW,
            ctx:ctx
        }
    }

    ParenthesisExpression(ctx:any) {
        // this.dump_ctx('ParenthesisExpression', ctx);

        const node_expr = this.visit(ctx.BinaryExpression);
        return {
            ast_code: AST.EXPR_PARENTHESIS,
            ic_type:node_expr.ic_type,
            expression: node_expr
        }
    }


    /**
     * Visit CST Id member (id#id) node.
     * 
     * @param ctx CST nodes
     * 
     * @returns AST node
     */
    dashIdExpression(ctx:any) {
        return ctx.ID[0].image;
    }
}
