import Expression from '../abstract/Expression.js';

export default class Case extends Expression {
    constructor( expr, cases, location ) {
        super();
        this.expr = expr;
        this.cases = cases;
        this.location = location;
        }
    accept(visitor) {
        return visitor.visitCase(this);
    }
    }