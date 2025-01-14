 import { ReturnException } from "./transferencia.js";


export default class FuncionForanea extends Invocable {


    constructor(nodo, clousure) {
        super();
        this.nodo = nodo;
        this.clousure = clousure;
    }

    aridad() {
        return this.nodo.params.length;
    }

    invocar(interprete, args) {
        const entornoNuevo = new Entorno(this.clousure);

        this.nodo.params.forEach((param, i) => {
            entornoNuevo.set(param, args[i]);
        });

        const entornoAntesDeLaLlamada = interprete.entornoActual;
        interprete.entornoActual = entornoNuevo;

        try {
            this.nodo.bloque.accept(interprete);
        } catch (error) {
            interprete.entornoActual = entornoAntesDeLaLlamada;

            if (error instanceof ReturnException) {

                // if(this.nodo.tipoRetorno !== error.value.tipo){
                return error.value
            }

            // TODO: manejar el resto de sentencias de control
            throw error;
        }

        interprete.entornoActual = entornoAntesDeLaLlamada;
        return null
    }

    atar(instancia) {
        const entornoOculto = new Entorno(this.clousure);
        entornoOculto.set('this', instancia);
        return new FuncionForanea(this.nodo, entornoOculto);
    }

}