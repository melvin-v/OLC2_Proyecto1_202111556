export default class Instancia {

    constructor(clase) {
        this.clase = clase;
        this.propiedades = {};
    }

    set(nombre, valor) {
        this.propiedades[nombre] = valor;
    }

    get(nombre) {
        if (this.propiedades.hasOwnProperty(nombre)) {
            return this.propiedades[nombre];
        }

        const metodo = this.clase.buscarMetodo(nombre);
        if (metodo) {
            return metodo.atar(this);
        }

        throw new Error(`Propiedad no encontrada: ${nombre}`);
    }
}