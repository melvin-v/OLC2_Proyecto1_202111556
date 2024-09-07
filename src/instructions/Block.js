import Expression from '../abstract/Expression.js';

export default class Block extends Expression {

    constructor( statements ) {
        super();
        this.statements = statements;
    }

    accept(visitor) {
        return visitor.visitBlock(this);
    }

}
