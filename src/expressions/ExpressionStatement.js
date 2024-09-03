import Expression from '../abstract/Expression.js';

export default class ExpresionStatment extends Expression {

    constructor( exp ) {
        super();
        this.exp = exp;

    }

    accept(visitor) {
        return visitor.visitExpresionStmt(this);
    }
}