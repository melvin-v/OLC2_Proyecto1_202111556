import Statement from '../abstract/Statement';

export class Declaration extends Statement {

    constructor({ id, exp }) {
        super();
        this.id = id;
        this.exp = exp;
    }

    accept(visitor) {
        return visitor.visitDeclaration(this);
    }

}

export default Declaration;