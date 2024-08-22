import Statement from '../abstract/Statement';

export class Number extends Statement {
    
        constructor({ value }) {
            super();
            this.value = value;
        }
    
        accept(visitor) {
            return visitor.visitNumber(this);
        }
    
    }

export default Number;