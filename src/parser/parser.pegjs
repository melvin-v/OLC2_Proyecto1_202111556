programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = dcl:VarDcl _ { return dcl }
            / stmt:Stmt _ { return stmt }

VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, undefined, location()) }
       /  "int" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.INT, location()) }
        /  "float" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.FLOAT, location()) }
        /  "char" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.CHAR, location()) }
        /  "boolean" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.BOOLEAN, location()) }
        /  "string" _ id:Identificador _  "=" _ exp:Expresion _ ";" { return new Declaration(id, exp, Types.STRING, location()) }
        /  "int" _ id:Identificador _ ";" { return new Declaration(id, null, Types.INT, location()) }
        /  "float" _ id:Identificador _ ";" { return new Declaration(id, null, Types.FLOAT, location()) }
        /  "char" _ id:Identificador _ ";" { return new Declaration(id, null, Types.CHAR, location()) }
        /  "boolean" _ id:Identificador _ ";" { return new Declaration(id, null, Types.BOOLEAN, location()) }
        /  "string" _ id:Identificador _";" { return new Declaration(id, null, Types.STRING, location()) }

Stmt = "System.out.println" _ "(" _ exp:VariasExpresiones _ ")" _ ";" { return new Print(exp, location()) }
    / exp:Expresion _ ";" { return new ExpressionStatement(exp, location()) }
    / "{" _ dcls:Declaracion* _ "}" { return new Block(dcls, location()) }
    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
      stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
      )? { return new If(cond, stmtTrue, stmtFalse) }
    / "switch" _ "(" _ exp:Expresion _ ")" _ "{" _ cases:(_ "case" _ exp1:Expresion _ ":" _ stmt:Stmt _ "break" _ ";"{ return new Case(exp1, stmt, location()) })+
      stmt:( _ "default" _ ":" _ stmt:Stmt{return stmt})? _ "}" { return new Switch(exp, cases, stmt, location()) }
    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return new While(cond, stmt, location()) }

VariasExpresiones
  = head:Expresion tail:(_ "," _ Expresion)* {
      console.log(head, tail);
      return [head, ...tail.map(([_, __,___, exp]) => exp)];
  }

Identificador = [a-zA-Z_][a-zA-Z0-9_]* { return text(); }

Expresion = Asignacion

Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return new Assignment(id, asgn, location()) }
          / id:Identificador _ "+" _ "=" _ asgn:Asignacion { return new Assignment(id, new BinaryOperation(new ReferenceVariable(id, location()), asgn, "+", location()), location()) } 
          / id:Identificador _ "-" _ "=" _ asgn:Asignacion { return new Assignment(id, new BinaryOperation(new ReferenceVariable(id, location()), asgn, "-", location()), location()) }
          / exp1:AndOr _ "?" _ exp2:AndOr _ ":" _ exp3:AndOr { return new TernaryOperation(exp1, exp2, exp3, location()) }
          / AndOr

AndOr = izq:Comparacion expansion:(
  _ op:("&&" / "||") _ der:Comparacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return new BinaryOperation(operacionAnterior, der, tipo, location());
    },
    izq
  );
}

Comparacion = izq:MayorMenor expansion:(
  _ op:("<=" / ">=") _ der:MayorMenor { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return new BinaryOperation(operacionAnterior, der, tipo, location());
    },
    izq
  );
}

MayorMenor = izq:IgualQue expansion:(
  _ op:("<" / ">") _ der:IgualQue { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return new BinaryOperation(operacionAnterior, der, tipo, location());
    },
    izq
  );
}

IgualQue = izq:Suma expansion:(
  _ op:("==" / "!=") _ der:Suma { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return new BinaryOperation(operacionAnterior, der, tipo, location());
    },
    izq
  );
}

Suma = izq:Multiplicacion expansion:(
  _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return new BinaryOperation(operacionAnterior, der, tipo, location());
    },
    izq
  );
}

Multiplicacion = izq:Modulo expansion:(
  _ op:("*" / "/") _ der:Modulo { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual;
        return new BinaryOperation(operacionAnterior, der, tipo, location());
      },
      izq
    );
}

Modulo = izq:Unaria expansion:(
  _ op:("%") _ der:Unaria { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual;
        return new BinaryOperation(operacionAnterior, der, tipo, location());
      },
      izq
    );
}

Unaria = "-" _ num:Numero { return new UnaryOperation(num, "-", location()) }
  / "!" _ num:Numero { return new UnaryOperation(num, "!", location()) }
  / Numero

Numero = "(" _ exp:AndOr _ ")" { return new Agrupation(exp, location()) } 
  / "[" _ exp:Expresion _ "]" { return new Agrupation(exp, location()) }
  / [0-9]+( "." [0-9]+ )? { return new Number(parseFloat(text(), 10), location()) } 
  / "true" { return new Boolean(true, location()) }
  / "false" { return new Boolean(false, location()) }
  / "\""  txt:StringTxt "\"" { return new String(txt, location()) }
  / "'"  txt:normalChar "'" { return new String(txt, location()) }
  / id:Identificador { return new ReferenceVariable(id, location()) }

StringTxt = [^"]* { return text() }
normalChar = [^'] { return text() }
_ = ([ \t\n\r] / Comentarios)*

Comentarios = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"
