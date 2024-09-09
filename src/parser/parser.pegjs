programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = dcl:VarDcl _ { return dcl }
            / stmt:Stmt _ { return stmt }

VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, location()) }
       /  "int" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.INT, location()) }
        /  "float" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.FLOAT, location()) }
        /  "char" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.CHAR, location()) }
        /  "bool" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.BOOL, location()) }
        /  "string" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.STRING, location()) }
        /  "int" _ id:Identificador _ ";" { return new Declaration(id, null, Types.INT, location()) }
        /  "float" _ id:Identificador _ ";" { return new Declaration(id, null, Types.FLOAT, location()) }
        /  "char" _ id:Identificador _ ";" { return new Declaration(id, null, Types.CHAR, location()) }
        /  "bool" _ id:Identificador _ ";" { return new Declaration(id, null, Types.BOOL, location()) }
        /  "string" _ id:Identificador _";" { return new Declaration(id, null, Types.STRING, location()) }

Stmt = "System.out.println" _ "(" _ exp:Expresion _ ")" _ ";" { return new Print(exp, location()) }
    / exp:Expresion _ ";" { return new ExpressionStatement(exp, location()) }
    / "{" _ dcls:Declaracion* _ "}" { return new Block(dcls, location()) }
    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
      stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
      )? { return new If(cond, stmtTrue, stmtFalse) }
    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return new While(cond, stmt, location()) }

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = Asignacion

Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return new Assignment(id, asgn, location()) }
          / id:Identificador _ "+" _ "=" _ asgn:Asignacion { return new Assignment(id, new BinaryOperation(new ReferenceVariable(id, location()), asgn, "+", location()), location()) } 
          / id:Identificador _ "-" _ "=" _ asgn:Asignacion { return new Assignment(id, new BinaryOperation(new ReferenceVariable(id, location()), asgn, "-", location()), location()) }
          / Comparacion

Comparacion = izq:Suma expansion:(
  _ op:("<=") _ der:Suma { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return new BinaryOperation(izq, der, tipo, location())
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
      return new BinaryOperation(izq, der, tipo, location())
    },
    izq
  )
}

Multiplicacion = izq:Modulo expansion:(
  _ op:("*" / "/") _ der:Modulo { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return new BinaryOperation(izq, der, tipo, location())
      },
      izq
    )
}

Modulo = izq:Unaria expansion:(
  _ op:("%") _ der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return new BinaryOperation(izq, der, tipo, location())
      },
      izq
    )
}

Unaria = "-" _ num:Numero { return new UnaryOperation(num, "-", location()) }
/ Numero

// { return{ tipo: "numero", valor: parseFloat(text(), 10) } }
Numero = [0-9]+( "." [0-9]+ )? {return new Number(parseFloat(text(), 10), location())}
  / "(" _ exp:Expresion _ ")" { return new Agrupation(exp, location()) }
  / "true" { return new Bool(true, location()) }
  / "false" { return new Bool(false, location()) }
  / "\""  txt:StringTxt "\"" { return new String(txt, location()) }
  / "\'"  txt:StringTxt "\'" { return new String(txt, location()) }
  / id:Identificador { return new ReferenceVariable(id, location()) }

StringTxt = [^"]* { return text() }

_ = ([ \t\n\r] / Comentarios)* 


Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"