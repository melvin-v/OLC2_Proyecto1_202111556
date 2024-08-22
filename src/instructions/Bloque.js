import Statement from '../abstract/Statement';

export class Bloque extends Statement {

    constructor({ statements }) {
        super();
        this.statements = statements;
    }

    accept(visitor) {
        return visitor.visitBloque(this);
    }

}

export default Bloque;