import Expression from '../abstract/Expression.js';

export default class CallDcl extends Expression {
    
        constructor(name, params, location) {
            super();
            this.name = name;
            this.params = params;
            this.location = location;
        }
    accept(visitor) {
        return visitor.visitCallDcl(this);
    }
}