import Expression from '../abstract/Expression.js';

export default class Assignment extends Expression {

    constructor( id, exp, location ) {
        super();
        this.id = id;
        this.exp = exp;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitAssignment(this);
    }

}