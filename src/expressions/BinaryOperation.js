import Statement from '../abstract/Statement';

export class BinaryOperation extends Statement {
    constructor({ izq, der, op }) {
        super(); 
        this.izq = izq;
        this.der = der;
        this.op = op;
    }
    accept(visitor) {
        return visitor.visitBinaryOperation(this);
    }
}

export default BinaryOperation;