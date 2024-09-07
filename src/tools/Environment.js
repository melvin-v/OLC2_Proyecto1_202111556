import Tree  from "../tools/Tree.js";

export default class Environment{
    constructor(previus=undefined){
        this.previus = previus;
        this.tabla = new Map();
    }

    saveVariable(id,  type, value, tree){
        let env = this;
        while(env != undefined){
            if(env.tabla.has(id)){
                tree.addError("Variable " + id + " ya existe en el ambiente " + this.id);
                return;
            }
            env = env.previus;
        }
        this.tabla.set(id, {type, value});
    }

    getVariable(id, tree){
        let env = this;
        while(env != undefined){
            if(env.tabla.has(id)){
                return env.tabla.get(id);
            }
            env = env.previus;
        }
        tree.addError("Variable " + id + " no existe en el ambiente " + this.id);
        return undefined;
    }

    updateVariable(id, value, tree){
        let env = this;
        while(env != undefined){
            if(env.tabla.has(id)){
                env.tabla.set(id, value);
                return;
            }
            env = env.previus;
        }
        tree.addError("Variable " + id + " no existe en el ambiente " + this.id);
    }

};