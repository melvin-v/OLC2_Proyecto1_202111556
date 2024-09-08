import Expression from '../abstract/Expression.js';

export default class While extends Expression {
        
            constructor( condition, block, location ) {
                super();
                this.condition = condition;
                this.block = block;
                this.location = location
            }
        
            accept(visitor) {
                return visitor.visitWhile(this);
            }
        
        }
