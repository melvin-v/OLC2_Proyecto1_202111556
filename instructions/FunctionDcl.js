import Expression from '../abstract/Expression.js';

export default class FunctionDcl extends Expression {
    
        constructor(name, params, body, location) {
            super();
            this.name = name;
            this.params = params;
            this.body = body;
            this.location = location
        }
    
        accept(visitor) {
            return visitor.visitFunctionDcl(this);
        }
    }