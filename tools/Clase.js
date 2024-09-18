import  Instancia  from "./Instancia.js";
import  Invocable  from "./Invocable.js";


export default class Clase extends Invocable {

    constructor(nombre, propiedades, metodos) {
        super();
        this.nombre = nombre;
        this.propiedades = propiedades;
        this.metodos = metodos;
    }

    buscarMetodo(nombre) {
        if (this.metodos.hasOwnProperty(nombre)) {
            return this.metodos[nombre];
        }
        return null;
    }

    aridad() {
        const constructor = this.buscarMetodo('constructor');

        if (constructor) {
            return constructor.aridad();
        }

        return 0;
    }

    invocar(interprete, args) {
        const nuevaIntancia = new Instancia(this);

        /*
        class asdasd {
            var a = 2;

            constructor(a) {
                this.a = 4;
                this.b = 4;
            }   
        }
    */
        // valores por defecto
        Object.entries(this.propiedades).forEach(([nombre, valor]) => {
            nuevaIntancia.set(nombre, valor.accept(interprete));
        });

        const constructor = this.buscarMetodo('constructor');
        if (constructor) {
            constructor.atar(nuevaIntancia).invocar(interprete, args);
        }

        return nuevaIntancia;
    }

}