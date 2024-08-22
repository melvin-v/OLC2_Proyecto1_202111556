import Statement from '../abstract/Statement';

export class UnaryOperation extends Statement {

    constructor({ exp, op }) {
        super();
        this.exp = exp;
        this.op = op;
    }

    accept(visitor) {
        return visitor.visitUnaryOperation(this);
    }

}

export default UnaryOperation;