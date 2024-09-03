import Expression from '../abstract/Expression.js';

export default class BinaryOperation extends Expression {
    constructor(izq, der, op) {
        super(); 
        this.izq = izq;
        this.der = der;
        this.op = op;
    }
    accept(visitor) {
        return visitor.visitBinaryOperation(this);
    }
}
