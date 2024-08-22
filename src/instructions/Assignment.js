import Statement from '../abstract/Statement';

export class Assignment extends Statement {

    constructor({ id, exp }) {
        super();
        this.id = id;
        this.exp = exp;
    }

    accept(visitor) {
        return visitor.visitAssignment(this);
    }

}

export default Assignment;