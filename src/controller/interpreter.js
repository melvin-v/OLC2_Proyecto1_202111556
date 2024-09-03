import Environment from '../tools/Environment.js';
import Visitor from '../abstract/Visitor.js';

export default class Interpreter extends Visitor {
    constructor() {
        super();
        this.environment = new Environment();
        this.console = "";
        this.errors = [];
    }

    setConsole(text){
        this.console += text + "\n";
    }

    addError(error){
        this.errors.push(error);
    }

    interpretar(nodo) {
        return nodo.accept(this);
    }

    visitBinaryOperation(node) {
        const izq = node.izq.accept(this);
        const der = node.der.accept(this);

        switch (node.op) {
            case '+':
                return izq + der;
            case '-':
                return izq - der;
            case '*':
                return izq * der;
            case '/':
                return izq / der;
            case '<=':
                return izq <= der;
            case '==':
                return izq === der;
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
        }
    }

    visitUnaryOperation(node) {
        const exp = node.exp.accept(this);

        switch (node.op) {
            case '-':
                return -exp;
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
        }
    }

    visitAgrupation(node) {
        return node.exp.accept(this);
    }

    visitNumber(node) {
        return node.value;
    }

    visitDeclaration(node) {
        const nombreVariable = node.id;
        const valorVariable = node.exp.accept(this);

        this.environment.saveVariable(nombreVariable, valorVariable, this);
    }


    visitReferenceVariable(node) {
        const nombreVariable = node.id;
        return this.environment.getVariable(nombreVariable);
    }


    visitPrint(node) {
        const valor = node.exp.accept(this);
        this.setConsole(valor);
    }


    visitExperssionStatement(node) {
        node.exp.accept(this);
    }

    visitAsignacion(node) {
        // const valor = this.interpretar(node.asgn);
        const valor = node.asgn.accept(this);
        this.environment.assignVariable(node.id, valor);

        return valor;
    }

};