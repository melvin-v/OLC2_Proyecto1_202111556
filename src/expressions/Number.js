import Expression from '../abstract/Expression.js';

export default class Number extends Expression {
    
        constructor(value) {
            super();
            this.value = value;
        }
    
        accept(visitor) {
            return visitor.visitNumber(this);
        }
    
    }
