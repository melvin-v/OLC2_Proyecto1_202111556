export default class Tree{
    constructor(){
        this.instructions = [];
        this.console = "";
        this.errors = [];
    };

    setConsole(text){
        this.console += text + "\n";
    }

    getConsole(){
        return this.console;
    }

    addInstruction(instruction){
        this.instructions.push(instruction);
    }

    getInstructions(){
        return this.instructions;
    }

    addError(error){
        this.errors.push(error);
    }

    getErrors(){
        return this.errors;
    }
    
}