import Expression from '../abstract/Expression.js';

export default class Agrupation extends Expression {

    constructor( exp ) {
        super();
        this.exp = exp;
    }

    accept(visitor) {
        return visitor.visitAgrupation(this);
    }

}
