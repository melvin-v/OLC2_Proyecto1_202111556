import Environment from '../tools/Environment.js';
import Visitor from '../abstract/Visitor.js';
import Types from '../tools/Types.js'

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
        const tipo = node.tipo;
        const valorVariable = node.exp.accept(this);
        if(tipo === undefined){
            if (typeof valorVariable === "number" && Number.isInteger(valorVariable)) {
                this.environment.saveVariable(nombreVariable, Types.INT, valorVariable, this);
            }
            else if (typeof valorVariable === "number" && !Number.isInteger(valorVariable)) {
                this.environment.saveVariable(nombreVariable, Types.FLOAT, valorVariable, this);
            }
            else if (typeof valorVariable === "string") {
                this.environment.saveVariable(nombreVariable, Types.STRING, valorVariable, this);
            }
            else if (typeof valorVariable === "string" && valorVariable.length === 1) {
                this.environment.saveVariable(nombreVariable, Types.CHAR, valorVariable, this);
            }
            else if (typeof valorVariable === "bool") {
                this.environment.saveVariable(nombreVariable, Types.BOOL, valorVariable, this);
            }
        }
        else{
            if(typeof valorVariable === "number" && Number.isInteger(valorVariable && !(tipo === Types.INT))){
                this.addError("Error de tipo, se esperaba un entero");
                return;
            }
            else if(typeof valorVariable === "number" && !(Number.isInteger(valorVariable) && !(tipo === Types.FLOAT))){
                this.addError("Error de tipo, se esperaba un flotante");
                return;
            }
            else if(typeof valorVariable === "string" && !(tipo === Types.STRING)){
                this.addError("Error de tipo, se esperaba un string");
                return;
            }
            else if(typeof valorVariable === "string" && valorVariable.length === 1 && !(tipo === Types.CHAR)){
                this.addError("Error de tipo, se esperaba un char");
                return;
            }
            else if(typeof valorVariable === "bool" && !(tipo === Types.BOOL)){
                this.addError("Error de tipo, se esperaba un bool");
                return;
        }

        this.environment.saveVariable(nombreVariable, tipo, valorVariable, this);
    }
}
    visitBool(node) {
        if (node.value === "true") {
            return true;
        }
        return false;
    }
    visitString(node) {
        return node.value;
    }

    visitReferenceVariable(node) {
        const nombreVariable = node.id;
        return this.environment.getVariable(nombreVariable, this);
    }


    visitPrint(node) {
        const valor = node.exp.accept(this);
        this.setConsole(valor);
    }


    visitExpresionStatment(node) {
        node.exp.accept(this);
    }

    visitAssignment(node) {
        const valor = node.exp.accept(this);
        this.environment.updateVariable(node.id, valor, this);

        return valor;
    }

    visitBlock(node) {
        const entornoAnterior = this.environment;
        this.environment = new Environment(entornoAnterior);

        node.statements.forEach(statement => statement.accept(this));

        this.environment = entornoAnterior;
    }

    visitIf(node) {
        const cond = node.cond.accept(this);
        console.log(cond)
        if (cond) {
            node.stmtTrue.accept(this);
            return;
        }

        if (node.stmtFalse) {
            node.stmtFalse.accept(this);
        }

    }

    visitWhile(node) {
        while (node.condition.accept(this)) {
            node.block.accept(this);
        }
    }

};