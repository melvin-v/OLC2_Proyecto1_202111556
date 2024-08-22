import Statement from '../abstract/Statement';

export class If extends Statement {
    
        constructor({ condition, thenBlock, elseBlock }) {
            super();
            this.condition = condition;
            this.thenBlock = thenBlock;
            this.elseBlock = elseBlock;
        }
    
        accept(visitor) {
            return visitor.visitIf(this);
        }
    
    }

export default If;