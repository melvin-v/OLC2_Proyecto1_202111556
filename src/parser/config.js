module.exports = {
    format: 'es',
    input: 'parser/parser.pegjs',
    dependencies: {
        'Declaration': '../expressions/Declaration.js',
        'Print': '../instruction/print.js',
        'ExpressionStatement': '../expressions/ExpressionStatement.js',
    }
};