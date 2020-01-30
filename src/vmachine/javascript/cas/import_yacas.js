
const Module = require('./yacas.js');
Module.onRuntimeInitialized = function() {

    var yacas = Module;
    var yacas_evaluate = yacas.cwrap('yacas_evaluate', null, ['string']);
    var yacas_is_error = yacas.cwrap('yacas_is_error', 'number', []);
    var yacas_result = yacas.cwrap('yacas_result', 'string', []);
    var yacas_side_effects = yacas.cwrap('yacas_side_effects', 'string', []);
    var yacas_complete = yacas.cwrap('yacas_complete', 'string', ['string']);

    var v1 = yacas_evaluate('D(x)Sin(x);');
    console.log('v1', yacas_result().trim());
    var v2 = yacas_evaluate('Simplify(2*x+2*x*(x-5)*(x+2)+5*x*x);');
    console.log('v2', yacas_result().trim());
    var v3 = yacas_evaluate('123456^59*789.25/789E10');
    console.log('v3', yacas_result().trim());

    var y = {
        eval: function (idx, expr) {

            var evaluationResult = {
                idx: idx,
                input: expr,
            };

            yacas_evaluate(expr);

            var side_effects = yacas_side_effects();
            
            if (side_effects !== '')
                evaluationResult['side_effects'] = side_effects;
            
            var result = yacas_result().trim();

            var is_error = yacas_is_error();

            if (!is_error)
                return result = result.substr(0, result.length - 1);
            return 'Error'
        }
    };
    console.log('v', y.eval(1, '2+3'));
    // console.log('v2', y.eval(1, '2+3'));
};
