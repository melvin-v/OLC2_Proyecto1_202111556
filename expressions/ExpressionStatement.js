import Expression from '../abstract/Expression.js';

export default class ExpresionStatment extends Expression {

    constructor( exp, location ) {
        super();
        this.exp = exp;
        this.location = location;

    }

    accept(visitor) {
        return visitor.visitExpresionStatment(this);
    }
}