import Interpreter from "./controller/Interpreter.js";
import {parse}  from "./parser/parser.js";

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs' } });

require(['vs/editor/editor.main'], () => {
    const editor = monaco.editor.create(document.getElementById('container'), {
        language: 'java',
        theme: 'vs-dark' 
    });

    document.getElementById('run-button').addEventListener('click', () => {
        const code = editor.getValue();
      
            const sentencias = parse(code);
            console.log(sentencias);
            const interprete = new Interpreter();
            console.log(interprete);
            sentencias.forEach(sentencia => sentencia.accept(interprete));
            console.log(interprete);
            
            document.getElementById('output').innerText = interprete.console;
        
    });
});
