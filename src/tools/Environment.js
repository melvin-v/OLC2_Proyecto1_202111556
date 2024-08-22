import Tree  from "../tools/Tree.js";

export class Environment{
    /**
    * @param {Environment} previus ambiente previo
    * @param {string} id nombre del ambiente
    */
    constructor(previus, id){
        this.previus = previus;
        this.id = id;
        this.tabla = new Map();
    }

    /**
     * @param {string} id
     * @param {any} value
     * @param {Tree} tree
     */
    saveVariable(id, value, tree){
        if(this.tabla.has(id)){
            tree.addError("Variable " + id + " ya existe en el ambiente " + this.id);
            return;
        }
        this.tabla.set(id, value);
    }

    /**
     * @param {string} id
     * @param {Tree} tree
     */
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

    /**
     * @param {string} id
     * @param {any} value
     * @param {Tree} tree
     */
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