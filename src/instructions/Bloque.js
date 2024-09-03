import Expression from '../abstract/Expression.js';

export default class Bloque extends Expression {

    constructor( statements ) {
        super();
        this.statements = statements;
    }

    accept(visitor) {
        return visitor.visitBloque(this);
    }

}
