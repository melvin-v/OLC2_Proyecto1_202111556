import Expression from '../abstract/Expression.js';

export default class String extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }

    accept(visitor) {
        return visitor.visitString(this);
    }
}