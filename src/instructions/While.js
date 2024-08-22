import Statement from '../abstract/Statement';

export class While extends Statement {
        
            constructor({ condition, block }) {
                super();
                this.condition = condition;
                this.block = block;
            }
        
            accept(visitor) {
                return visitor.visitWhile(this);
            }
        
        }

export default While;