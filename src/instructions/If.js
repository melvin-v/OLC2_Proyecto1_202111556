import Expression from '../abstract/Expression.js';

export default class If extends Expression {
    constructor( cond, stmtTrue, stmtFalse ) {
        super();
        this.cond = cond;
        this.stmtTrue = stmtTrue;
        this.stmtFalse = stmtFalse;

    }

    accept(visitor) {
        return visitor.visitIf(this);
    }
}
