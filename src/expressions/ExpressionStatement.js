import Expression from '../abstract/Expression';

export class ExpresionStmt extends Expression {

    constructor({ exp }) {
        super();
        this.exp = exp;

    }

    accept(visitor) {
        return visitor.visitExpresionStmt(this);
    }
}