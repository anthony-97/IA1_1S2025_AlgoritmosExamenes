/*  Esta función predice la clase de un nuevo punto basado en un modelo de Naive Bayes, se usa todo el CSV.
    En el html solo se debe de jalar este mlp-classifier-completo, en vez del otro mlp-classifier.js
    que solo usa los casos 1, 4, 6, 8, 14 y 16 de la tabla
*/

async function bayes_from_csv(csvText) {
  const { GaussianNB, LabelEncoder } = await import('https://luisespino.github.io/mlearnjs/mlearn.mjs');

  // Parsear CSV simple (sin librerías)
  const lines = csvText.trim().split('\n');
  const header = lines[0].split(',');

  // Índices de columnas que queremos
  const idxDistancia = header.indexOf('DISTANCIA');
  const idxGanancia = header.indexOf('GANANCIA');
  const idxCosto = header.indexOf('COSTO');
  const idxClase = header.indexOf('CLASE');

  // Extraer datos
  const distancia = [];
  const ganancia = [];
  const costo = [];
  const clase = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    distancia.push(Number(cols[idxDistancia]));
    ganancia.push(Number(cols[idxGanancia]));
    costo.push(Number(cols[idxCosto]));
    clase.push(cols[idxClase]);
  }

  // Codificar clases
  const encoder = new (await LabelEncoder)();
  encoder.fit(clase);
  const y = encoder.transform(clase);

  // Construir matriz de características
  const X = distancia.map((_, i) => [distancia[i], ganancia[i], costo[i]]);

  // Entrenar modelo
  const model = new (await GaussianNB)();
  model.fit(X, y);

  // Nuevo punto a predecir
  const newPoint = [5, 1, 10];
  const predCod = model.predict(newPoint);
  const predClass = encoder.inverseTransform(predCod)[0];

  console.log('Clase predicha para [5,1,10]:', predClass);
  return predClass;
}

// Ejemplo con el CSV dado como string
const csvData = `CASO,ORIGEN,DESTINO,DISTANCIA,HEURISTICA,GANANCIA,COSTO,CLASE
1,A,B,3,4,5,3,N
2,A,C,4,3,4,3,P
3,A,D,3,4,5,2,P
4,B,C,2,3,6,4,P
5,B,D,5,6,3,2,N
6,C,B,2,5,2,1,P
7,C,E,4,5,4,3,N
8,E,A,3,2,2,1,P
9,E,B,2,3,2,1,P
10,E,C,4,3,5,4,P
11,E,D,6,7,6,3,N
12,E,F,7,6,7,4,P
13,E,G,2,3,3,2,N
14,F,B,1,2,8,5,P
15,F,C,5,6,2,1,P
16,G,E,2,3,9,3,P
17,G,D,2,1,4,6,N`;

bayes_from_csv(csvData);
