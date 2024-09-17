import Expression from '../abstract/Expression.js';

export default class Continue extends Expression {
            
                constructor( location ) {
                    super();
}
                accept(visitor) {
                    return visitor.visitContinue(this);
                }

            }