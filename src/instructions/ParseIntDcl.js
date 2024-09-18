import Expression from '../abstract/Expression.js';

export default class ParseIntDcl extends Expression {
    constructor( value, location ) {
        super();
        this.value = value;
        this.location = location
    }

    accept(visitor) {
        return visitor.visitparseIntDcl(this);
    }
}