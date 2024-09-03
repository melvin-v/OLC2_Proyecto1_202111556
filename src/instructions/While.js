import Expression from '../abstract/Expression.js';

export default class While extends Expression {
        
            constructor( condition, block ) {
                super();
                this.condition = condition;
                this.block = block;
            }
        
            accept(visitor) {
                return visitor.visitWhile(this);
            }
        
        }
