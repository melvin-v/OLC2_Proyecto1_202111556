import Expression from '../abstract/Expression.js';

export default class TernaryOperation extends Expression {
            
                constructor( condition, trueExpr, falseExpr, location ) {
                    super();
                    this.condition = condition;
                    this.trueExpr = trueExpr;
                    this.falseExpr = falseExpr;
                    this.location = location
                }
            
                accept(visitor) {
                    return visitor.visitTernaryOperation(this);
                }
            
            }