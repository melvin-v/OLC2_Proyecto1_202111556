programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = dcl:VarDcl _ { return dcl }
            / stmt:Stmt _ { return stmt }

VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return new Declaration(id, exp) }

Stmt = "print(" _ exp:Expresion _ ")" _ ";" { return new Print(exp) }
    / exp:Expresion _ ";" { return new ExpresionStatement(exp) }

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = Suma

Suma = izq:Multiplicacion expansion:(
  _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return new BinaryOperation(izq, der, tipo)
    },
    izq
  )
}

Multiplicacion = izq:Unaria expansion:(
  _ op:("*" / "/") _ der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return new BinaryOperation(izq, der, tipo)
      },
      izq
    )
}

Unaria = "-" _ num:Numero { return new UnaryOperation(num, "-") }
/ Numero

// { return{ tipo: "numero", valor: parseFloat(text(), 10) } }
Numero = [0-9]+( "." [0-9]+ )? {return new Number(parseFloat(text(), 10))}
  / "(" _ exp:Expresion _ ")" { return new Agrupation(exp) }
  / id:Identificador { return new ReferenceVariable(id) }


_ = ([ \t\n\r] / Comentarios)* 


Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"