import Expression from '../abstract/Expression.js';

export default class Declaration extends Expression {

    constructor(id, exp) {
        super();
        this.id = id;
        this.exp = exp;
    }

    accept(visitor) {
        return visitor.visitDeclaration(this);
    }

}