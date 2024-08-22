export class Statement  {

    constructor() {
        this.location = null;

    }

    accept(visitor) {
        return visitor.visitExpresion(this);
    }

}