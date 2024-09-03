import Expression from '../abstract/Expression.js';

export  default class Print extends Expression {
        
            constructor(exp) {
                super();
                this.exp = exp;
            }
        
            accept(visitor) {
                return visitor.visitPrint(this);
            }
        
        }