import Expression from '../abstract/Expression.js';

export default class For extends Expression {
    
        constructor( init, condition, increment, block, location ) {
            super();
            this.init = init;
            this.condition = condition;
            this.increment = increment;
            this.block = block;
            this.location = location;
        }
    
        accept(visitor) {
            return visitor.visitFor(this);
        }
    
    }