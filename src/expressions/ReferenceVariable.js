import Expression from '../abstract/Expression.js';

export default class ReferenceVariable extends Expression {
    
        constructor( id ) {
            super();
            this.id = id;
        }
    
        accept(visitor) {
            return visitor.visitReferenceVariable(this);
        }
    
    }
