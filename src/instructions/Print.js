import Statement from '../abstract/Statement';

export class Print extends Statement {
        
            constructor({ exp }) {
                super();
                this.exp = exp;
            }
        
            accept(visitor) {
                return visitor.visitPrint(this);
            }
        
        }

export default Print;