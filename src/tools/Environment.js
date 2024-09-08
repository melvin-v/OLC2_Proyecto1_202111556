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
                return env.tabla.get(id).value;
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
                let contenido = env.tabla.get(id);
                contenido.value = value;
                env.tabla.set(id, contenido);
                return;
            }
            env = env.previus;
        }
        tree.addError("Variable " + id + " no existe en el ambiente " + this.id);
    }

};