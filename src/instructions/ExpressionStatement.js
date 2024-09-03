import Expression from '../abstract/Expression.js';

export default class ExperssionStatement extends Expression {
    
        constructor( exp ) {
            super();
            this.exp = exp;
        }
    
        accept(visitor) {
            return visitor.visitExperssionStatement(this);
        }
    
    }