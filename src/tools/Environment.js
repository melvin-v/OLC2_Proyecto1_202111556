export default class Environment{
    constructor(previus=undefined){
        this.previus = previus;
        this.tabla = new Map();
    }

    saveVariable(id,  type, value, tree, node){
            if(this.tabla.has(id)){
                tree.addError("Variable " + id + " ya existe en el ambiente " + this.id, node.location.start.line, node.location.start.column);
                return;
            }
        this.tabla.set(id, {type, value});
    }

    getVariable(id, tree, node){
        let env = this;
        while(env != undefined){
            if(env.tabla.has(id)){
                return env.tabla.get(id).value;
            }
            env = env.previus;
        }
        tree.addError("Variable " + id + " no existe en el ambiente " + this.id, node.location.start.line, node.location.start.column);
        return undefined;
    }

    getAllVariable(id, tree, node){
        let env = this;
        while(env != undefined){
            if(env.tabla.has(id)){
                return env.tabla.get(id);
            }
            env = env.previus;
        }
        tree.addError("Variable " + id + " no existe en el ambiente " + this.id, node.location.start.line, node.location.start.column);
        return undefined;
    }

    updateVariable(id, value, tree, node){
        let env = this;
        while(env != undefined){
            if(env.tabla.has(id)){
                let contenido = env.tabla.get(id);
                contenido.value = value;
                env.tabla.set(id, contenido);
                return;
            }
            env = env.previus;
        }
        tree.addError("Variable " + id + " no existe en el ambiente " + this.id, node.location.start.line, node.location.start.column);
    }

    deleteVariable(id, tree, node){
        let env = this;
        while(env != undefined){
            if(env.tabla.has(id)){
                env.tabla.delete(id);
                return;
            }
            env = env.previus;
        }
        tree.addError("Variable " + id + " no existe en el ambiente " + this.id, node.location.start.line, node.location.start.column);
    }

};