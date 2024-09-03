import Tree  from "../tools/Tree.js";

export default class Environment{
    constructor(previus, id){
        this.previus = previus;
        this.id = id;
        this.tabla = new Map();
    }

    saveVariable(id, value, tree){
        if(this.tabla.has(id)){
            console.log("error")
            tree.addError("Variable " + id + " ya existe en el ambiente " + this.id);
            return;
        }
        this.tabla.set(id, value);
    }

    getVariable(id, tree){
        let env = this;
        while(env != null){
            if(env.tabla.has(id)){
                return env.tabla.get(id);
            }
            env = env.previus;
        }
        tree.addError("Variable " + id + " no existe en el ambiente " + this.id);
        return null;
    }

    updateVariable(id, value, tree){
        let env = this;
        while(env != null){
            if(env.tabla.has(id)){
                env.tabla.set(id, value);
                return;
            }
            env = env.previus;
        }
        tree.addError("Variable " + id + " no existe en el ambiente " + this.id);
    }

};