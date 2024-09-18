import Expression from '../abstract/Expression.js';

export default class Agrupation extends Expression {

    constructor( exp, location ) {
        super();
        this.exp = exp;
        this.location = location;
    }

    accept(visitor) {
        return visitor.visitAgrupation(this);
    }

}
