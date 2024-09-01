import Statement from '../abstract/Expression';

export class Agrupation extends Statement {

    constructor({ exp }) {
        super();
        this.exp = exp;
    }

    accept(visitor) {
        return visitor.visitAgrupation(this);
    }

}

export default Agrupation;