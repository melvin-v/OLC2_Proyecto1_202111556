import Statement from '../abstract/Statement';

export class ExperssionStatement extends Statement {
    
        constructor({ exp }) {
            super();
            this.exp = exp;
        }
    
        accept(visitor) {
            return visitor.visitExperssionStatement(this);
        }
    
    }

export default ExperssionStatement;