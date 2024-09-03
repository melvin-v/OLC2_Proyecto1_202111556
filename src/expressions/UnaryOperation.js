import Expression from '../abstract/Expression.js';

export default class UnaryOperation extends Expression {

    constructor( exp, op ) {
        super();
        this.exp = exp;
        this.op = op;
    }

    accept(visitor) {
        return visitor.visitUnaryOperation(this);
    }

}
