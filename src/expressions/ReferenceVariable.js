import Statement from '../abstract/Statement';

export class ReferenceVariable extends Statement {
    
        constructor({ id }) {
            super();
            this.id = id;
        }
    
        accept(visitor) {
            return visitor.visitReferenceVariable(this);
        }
    
    }

export default ReferenceVariable;