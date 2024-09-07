import Expression from '../abstract/Expression.js';

export default class Declaration extends Expression {

    constructor(id, exp, tipo=undefined) {
        super();
        this.id = id;
        this.exp = exp;
        this.tipo = tipo;
    }

    accept(visitor) {
        return visitor.visitDeclaration(this);
    }

}