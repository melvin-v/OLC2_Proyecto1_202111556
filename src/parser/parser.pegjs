programa = _ dcl:Declaracion* _ { return dcl }

Declaracion = dcl:ClassDcl _ { return dcl }
            / dcl:VarDcl _ { return dcl }
            / dcl:FuncDcl _ { return dcl }
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

FuncDcl = "void" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return new FunctionDcl(id, params || [], bloque, location()) }
        

ClassDcl = "class" _ id:Identificador _ "{" _ dcls:ClassBody* _ "}" { return crearNodo('dclClase', { id, dcls }) }

ClassBody = dcl:VarDcl _ { return dcl }
          / dcl:FuncDcl _ { return dcl }

Parametros = id:Identificador _ params:("," _ ids:Identificador { return ids })* { return [id, ...params] }

Stmt = "System.out.println" _ "(" _ exp:VariasExpresiones _ ")" _ ";" { return new Print(exp, location()) }
    / "switch" _ "(" _ exp:Expresion _ ")" _ "{" _ cases:(_ "case" _ exp1:Expresion _ ":" _ stmt:(Stmt)* _ breakForSwitch:("break" _ ";" {return new Break(location())})* { return new Case(exp1, stmt, breakForSwitch, location()) })+
      stmt:( _ "default" _ ":" _ stmt:Stmt{return stmt})? _ "}" { return new Switch(exp, cases, stmt, location()) }
    / Bloque:Bloque { return Bloque }
    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
      stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
      )? { return new If(cond, stmtTrue, stmtFalse) }
    
    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return new While(cond, stmt, location()) }
        / "for" _ "(" _ init:ForInit _ cond:Expresion _ ";" _ inc:Incremento _ ")" _ stmt:Stmt {
      return new For(init, cond, inc, stmt, location())
    }
    / "break" _ ";" { return new Break(location()) }
    / "continue" _ ";" { return new Continue(location()) }
    / "return" _ exp:Expresion? _ ";" { return new ReturnDcl(exp, location()) }
    / exp:Expresion _ ";" { return new ExpressionStatement(exp, location()) }


Bloque = "{" _ dcls:Declaracion* _ "}" { return new Block(dcls, location()) }

Incremento = id:Identificador _ signo:"++" { return signo }
           / id:Identificador _ signo:"--" { return signo }
           / id:Identificador _ "=" _ exp:Expresion { return new Assignment(id, exp, location()) }

ForInit = dcl:VarDcl { return dcl }
        / exp:Expresion _ ";" { return exp }
        / ";" { return null }

VariasExpresiones
  = head:Expresion tail:(_ "," _ Expresion)* {
      return [head, ...tail.map(([_, __,___, exp]) => exp)];
  }

Identificador = [a-zA-Z_][a-zA-Z0-9_]* { return text(); }

Expresion = Asignacion

Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return new Assignment(id, asgn, location()) }
          / id:Identificador _ "+" _ "=" _ asgn:Asignacion { return new Assignment(id, new BinaryOperation(new ReferenceVariable(id, location()), asgn, "+", location()), location()) } 
          / id:Identificador _ "-" _ "=" _ asgn:Asignacion { return new Assignment(id, new BinaryOperation(new ReferenceVariable(id, location()), asgn, "-", location()), location()) }
          / exp1:AndOr _ "?" _ exp2:AndOr _ ":" _ exp3:AndOr { return new TernaryOperation(exp1, exp2, exp3, location()) }
          / "parseInt" _ "(" _ exp:Expresion _ ")" { return new ParseIntDcl(exp, location()) }
        / "parseFloat" _ "(" _ exp:Expresion _ ")" { return new ParseFloatDcl(exp, location()) }
        / "toString" _ "(" _ exp:Expresion _ ")" { return new ToStringDcl(exp, location()) }
        / "toLowerCase" _ "(" _ exp:Expresion _ ")"  { return new ToLowerCaseDcl(exp, location()) }
        / "toUpperCase" _ "(" _ exp:Expresion _ ")"  { return new ToUpperCaseDcl(exp, location()) }
        / "typeof" _ "(" _ exp:Expresion _ ")"  { return new TypeOfDcl(exp, location()) }
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
  / Llamada

  Llamada = objetivoInicial:Numero operaciones:(
    ("(" _ args:Argumentos? _ ")" { return {args, tipo: 'funcCall' } })
    / ("." _ id:Identificador _ { return { id, tipo: 'get' } })
  )* 
  {
  const op =  operaciones.reduce(
    (objetivo, args) => {
      // return crearNodo('llamada', { callee, args: args || [] })
      const { tipo, id, args:argumentos } = args

      if (tipo === 'funcCall') {
        return new CallDcl(objetivo, argumentos || [], location())
      }else if (tipo === 'get') {
        return crearNodo('get', { objetivo, propiedad: id })
      }
    },
    objetivoInicial
  )

  console.log('llamada', {op}, {text: text()});

return op
}

Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp })* { return [arg, ...args] }

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
