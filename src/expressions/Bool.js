import Expression from '../abstract/Expression.js';

export default class Bool extends Expression {
    constructor(value, location) {
        super();
        this.value = value;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitBool(this);
    }
}