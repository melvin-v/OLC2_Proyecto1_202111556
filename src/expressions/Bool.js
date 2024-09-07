import Expression from '../abstract/Expression.js';

export default class Bool extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitBool(this);
    }
}