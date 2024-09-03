module.exports = {
    format: 'es',
    input: './parser.pegjs',
    dependencies: {
        'Declaration': '../expressions/Declaration.js',
        'Print': '../instructions/Print.js',
        'ExpressionStatement': '../expressions/ExpressionStatement.js',
        'Assignment': '../expressions/Assignment.js',
        'BinaryOperation': '../expressions/BinaryOperation.js',
        'UnaryOperation': '../expressions/UnaryOperation.js',
        'Number': '../expressions/Number.js',
        'Agrupation': '../expressions/Agrupation.js',
        'ReferenceVariable': '../expressions/ReferenceVariable.js',
    }
};