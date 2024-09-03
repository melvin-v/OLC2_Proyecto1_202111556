import Expression from '../abstract/Expression.js';

export default class If extends Expression {
    
        constructor( condition, thenBlock, elseBlock ) {
            super();
            this.condition = condition;
            this.thenBlock = thenBlock;
            this.elseBlock = elseBlock;
        }
    
        accept(visitor) {
            return visitor.visitIf(this);
        }
    
    }
