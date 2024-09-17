import Environment from '../tools/Environment.js';
import Visitor from '../abstract/Visitor.js';
import Types from '../tools/Types.js'
import Break from '../instructions/Break.js'
import Continue from '../instructions/Continue.js'

export default class Interpreter extends Visitor {
    constructor() {
        super();
        this.environment = new Environment();
        this.console = "";
        this.errors = [];
        this.Break = false;
    }

    setConsole(text){
        this.console += text + "\n";
    }

    addError(error, line, column){
        this.errors.push({error, line, column});
    }

    interpretar(nodo) {
        return nodo.accept(this);
    }

    visitBinaryOperation(node) {
        const izq = node.izq.accept(this);
        const der = node.der.accept(this);
        if (izq === null || der === null) {
            this.addError("Null no puede ser operado", node.location.start.line, node.location.start.column);
            return null;
        }
        switch (node.op) {
            case '+':
                if ( (typeof izq === "number" && !Number.isInteger(izq)) || (typeof der === "number" && !Number.isInteger(der))) {
                    const numero = izq + der;
                    return numero.toFixed(9);
                }
                return izq + der;
            case '-':
                if ((typeof izq === "number" && !Number.isInteger(izq)) || (typeof der === "number" && !Number.isInteger(der))) {
                    const numero = izq - der;
                    return numero.toFixed(9);
                }
                return izq - der;
            case '*':
                if ((typeof izq === "number" && !Number.isInteger(izq)) || (typeof der === "number" && !Number.isInteger(der))) {
                    const numero = izq * der;
                    return numero.toFixed(9);
                }
                return izq * der;
            case '/':
                if (der === 0) {
                    this.addError("Error de division por cero", node.location.start.line, node.location.start.column);
                    return;
                }
                if ((typeof izq === "number" && !Number.isInteger(izq)) || (typeof der === "number" && !Number.isInteger(der))) {
                    const numero = izq / der;
                    return numero.toFixed(9);
                }
                return izq / der;
            case '%':
                return izq % der;
            case '<=':
                return izq <= der;
            case '==':
                return izq === der;
            case '!=':
                return izq !== der;
            case '>=':
                return izq >= der;
            case '<':
                return izq < der;
            case '>':
                return izq > der;
            case '&&':
                return izq && der;
            case '||':
                return izq || der;
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
        }
    }

    visitUnaryOperation(node) {
        const exp = node.exp.accept(this);

        switch (node.op) {
            case '-':
                return -exp;
            case '!':
                return !exp;
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
        
        if(node.exp === null){
            this.environment.saveVariable(nombreVariable, tipo, null, this, node);
            return null;
        }
        const valorVariable = node.exp.accept(this);
        if(tipo === undefined){
            if (typeof valorVariable === "number" && Number.isInteger(valorVariable)) {
                this.environment.saveVariable(nombreVariable, Types.INT, valorVariable, this, node);
            }
            else if (typeof valorVariable === "number" && !Number.isInteger(valorVariable)) {
                this.environment.saveVariable(nombreVariable, Types.FLOAT, valorVariable, this, node);
            }
            else if (typeof valorVariable === "string") {
                this.environment.saveVariable(nombreVariable, Types.STRING, valorVariable, this, node);
            }
            else if (typeof valorVariable === "string" && valorVariable.length === 1) {
                console.log(typeof valorVariable);
                this.environment.saveVariable(nombreVariable, Types.CHAR, valorVariable, this, node);
            }
            else if (typeof valorVariable === "boolean") {
                this.environment.saveVariable(nombreVariable, Types.BOOLEAN, valorVariable, this, node);
            }
        }
        else{
            if(valorVariable === 0){
                this.environment.saveVariable(nombreVariable, tipo, valorVariable, this, node);
                return;
            }
            
            if(typeof valorVariable === "number" && Number.isInteger(valorVariable && !(tipo === Types.INT))){
                this.addError("Error de tipo, se esperaba un entero", node.location.start.line, node.location.start.column);
                this.environment.saveVariable(nombreVariable, tipo, null, this, node);
                return;
            }
            else if(typeof valorVariable === "number" && !(Number.isInteger(valorVariable)) && !(tipo === Types.FLOAT)){
                console.log(node);
                this.addError("Error de tipo, se esperaba un flotante", node.location.start.line, node.location.start.column);
                this.environment.saveVariable(nombreVariable, tipo, null, this, node);
                return;
            }
            else if(typeof valorVariable === "string" && !(tipo === Types.STRING) && !(tipo === Types.CHAR)){
                this.addError("Error de tipo, se esperaba un string", node.location.start.line, node.location.start.column);
                this.environment.saveVariable(nombreVariable, tipo, null, this, node);
                return;
            }
            else if(typeof valorVariable === "string" && valorVariable.length === 1 && !(tipo === Types.CHAR && !(tipo === Types.STRING))){
                this.addError("Error de tipo, se esperaba un char", node.location.start.line, node.location.start.column);
                this.environment.saveVariable(nombreVariable, tipo, null, this, node);
                return;
            }
            else if(typeof valorVariable === "boolean" && !(tipo === Types.BOOLEAN)){
                this.addError("Error de tipo, se esperaba un boolean", node.location.start.line, node.location.start.column);
                this.environment.saveVariable(nombreVariable, tipo, null, this, node);
                return;
        }

        this.environment.saveVariable(nombreVariable, tipo, valorVariable, this, node);
    }
}
    visitBoolean(node) {
        if (node.value == true) {
            return true;
        }
        return false;
    }
    visitString(node) {
        return node.value;
    }

    visitReferenceVariable(node) {
        const nombreVariable = node.id;
        return this.environment.getVariable(nombreVariable, this, node);
    }


    visitPrint(node) {
        for (const exp of node.exp) {
            const valor = exp.accept(this);
            this.setConsole(valor);
        }
    }


    visitExpresionStatment(node) {
        node.exp.accept(this);
    }

    visitAssignment(node) {
        //Tengo que asignar el valor de la variable siempre y cuando el tipo de dato sea el correcto caso contrario lanzar un error
        const variable = this.environment.getAllVariable(node.id, this);
        const valor = node.exp.accept(this);
        if(variable.type === Types.INT && typeof valor === "number" && Number.isInteger(valor)){
            this.environment.updateVariable(node.id, valor, this, node);
        }
        else if(variable.type === Types.FLOAT && typeof valor === "number" && !Number.isInteger(valor)){
            this.environment.updateVariable(node.id, valor, this, node);
        }
        else if(variable.type === Types.STRING && typeof valor === "string"){
            this.environment.updateVariable(node.id, valor, this, node);
        }
        else if(variable.type === Types.CHAR && typeof valor === "string" && valor.length === 1){
            this.environment.updateVariable(node.id, valor, this, node);
        }
        else if(variable.type === Types.BOOLEAN && typeof valor === "boolean"){
            this.environment.updateVariable(node.id, valor, this, node);
        }
        else{
            this.environment.updateVariable(node.id, null, this, node);
            this.addError("Error de tipo, se esperaba un " + variable.type, node.location.start.line, node.location.start.column);
        }

        return valor;
    }

    visitBlock(node) {
        const entornoAnterior = this.environment;
        this.environment = new Environment(entornoAnterior);
        node.statements.forEach(statement => { 
            if (statement instanceof Continue){
                return;
            }
            if (statement instanceof Break){
                this.Break = true;
                return;
            }
            statement.accept(this);
        
        });
        this.environment = entornoAnterior;
    }

    visitIf(node) {
        const cond = node.cond.accept(this);
        if (cond) {
            node.stmtTrue.accept(this);
            return;
        }
        if (node.stmtFalse) {
            node.stmtFalse.accept(this);
        }

    }

    visitCase(node) {
        const casesArray = node.cases;
        for (const caso of casesArray) {
            if (caso.expr.accept(this) === node.expr.accept(this)) {
                caso.cases.accept(this);
                return;
            }
        } 
    }

    visitSwitch(node) {
        console.log("Switch node");
        const expr = node.expr.accept(this);
        let flag = false;
        for (const caso of node.cases) {
            if (caso.expr.accept(this) === expr) {
                flag = true;
            }
            if(flag){
                if(caso.cases.length > 0){
                    for(const stmt of caso.cases){
                        stmt.accept(this);
                    }
                }
                if(caso.stmtBreak.length > 0){
                    return;
                }
            }
        }
        console.log("Default action");
        console.log(node.defaultAction);
        if (node.defaultAction) {
            node.defaultAction.accept(this);
        }
        
    }

    visitTernaryOperation(node) {
        const cond = node.condition.accept(this);
        if (cond) {
            return node.trueExpr.accept(this);
        }
        return node.falseExpr.accept(this);
    }

    visitWhile(node) {
        
        while (node.condition.accept(this)) {
            if(this.Break){
                this.Break = false;
                break;
            }
            node.block.accept(this);
        }
    }

    visitFor(node) {
        const id = node.init.id;
        node.init.accept(this);
        while (node.condition.accept(this)) {
            if(this.Break){
                this.Break = false;
                break;
            }
            node.block.accept(this);
            if (node.increment == '++') {
                const valor = this.environment.getVariable(id, this);
                this.environment.updateVariable(id, valor + 1, this);
            } else if (node.increment == '--') {
                const valor = this.environment.getVariable(id, this);
                this.environment.updateVariable(id, valor - 1, this);
            }
            else {
                node.increment.accept(this);
            }
    }
    this.environment.deleteVariable(id, this);
}

    visitBreak(node) {
        return node;
    }

    visitContinue(node) {
        return node;
    }

    visitReturn(node) {
        if (node.exp) {
            return node.exp.accept(this);
        }
        return null;
    }



};