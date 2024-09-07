programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = dcl:VarDcl _ { return dcl }
            / stmt:Stmt _ { return stmt }

VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return new Declaration(id, exp) }
       /  "int" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.INT) }
        /  "float" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.FLOAT) }
        /  "char" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.CHAR) }
        /  "bool" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.BOOL) }
        /  "string" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.STRING) }

Stmt = "System.out.println" _ "(" _ exp:Expresion _ ")" _ ";" { return new Print(exp) }
    / exp:Expresion _ ";" { return new ExpresionStatement(exp) }
    / "{" _ dcls:Declaracion* _ "}" { return new Block(dcls) }
    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
      stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
      )? { return new If(cond, stmtTrue, stmtFalse) }
    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return new While(cond, stmt) }

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = Asignacion

Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return new Assignment(id, asgn) }
          / Comparacion

Comparacion = izq:Suma expansion:(
  _ op:("<=") _ der:Suma { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return new BinaryOperation(izq, der, tipo)
    },
    izq
  )
}

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
  / "true" { return new Boolean(true) }
  / "false" { return new Boolean(false) }
  / "\""  txt:StringTxt "\"" { return new String(txt) }
  / id:Identificador { return new ReferenceVariable(id) }

StringTxt = [^"]* { return text() }

_ = ([ \t\n\r] / Comentarios)* 


Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"