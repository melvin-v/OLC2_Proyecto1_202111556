import Expression from '../abstract/Expression.js';

export default class ToStringDcl extends Expression {
    constructor( value, location ) {
        super();
        this.value = value;
        this.location = location
    }

    accept(visitor) {
        return visitor.visittoStringDcl(this);
    }
}