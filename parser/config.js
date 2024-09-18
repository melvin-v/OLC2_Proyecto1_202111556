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
        'If': '../instructions/If.js',
        'Block': '../instructions/Block.js',
        'While': '../instructions/While.js',
        'Boolean': '../expressions/Boolean.js',
        'String': '../expressions/String.js',
        'Types': '../tools/Types.js',
        'TernaryOperation': '../instructions/TernaryOperation.js',
        'Switch': '../instructions/Switch.js',
        'Case': '../instructions/Case.js',
        'For': '../instructions/For.js',
        'Break': '../instructions/Break.js',
        'Continue': '../instructions/Continue.js',
        'FunctionDcl': '../instructions/FunctionDcl.js',
        'ReturnDcl': '../expressions/ReturnDcl.js',
        'CallDcl': '../expressions/CallDcl.js',
        'ParseFloatDcl': '../instructions/ParseFloatDcl.js',
        'ParseIntDcl': '../instructions/ParseIntDcl.js',
        'ToLowerCaseDcl': '../instructions/ToLowerCaseDcl.js',
        'ToUpperCaseDcl': '../instructions/ToUpperCaseDcl.js',
        'ToStringDcl': '../instructions/ToStringDcl.js',
        'TypeOfDcl': '../instructions/TypeOfDcl.js',
    }
};