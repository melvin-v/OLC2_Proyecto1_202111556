import Expression from '../abstract/Expression.js';

export default class Assignment extends Expression {

    constructor( id, exp ) {
        super();
        this.id = id;
        this.exp = exp;
    }

    accept(visitor) {
        return visitor.visitAssignment(this);
    }

}