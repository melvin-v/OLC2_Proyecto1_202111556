import Expression from '../abstract/Expression.js';

export default class ToLowerCaseDcl extends Expression {
    constructor( value, location ) {
        super();
        this.value = value;
        this.location = location
    }

    accept(visitor) {
        return visitor.visittoLowerCaseDcl(this);
    }
}
