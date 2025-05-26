/*  Esta función predice la clase de un nuevo punto basado en un modelo de Naive Bayes, se usan solo los casos 1, 4, 6, 8, 14 y 16 de la tabla.
    En el html solo se debe de jalar este mlp-classifier.js, en vez del otro mlp-classifier-completo.js
    que usa todos los casos del CSV.
*/

async function predict_point() {
    const { GaussianNB, LabelEncoder } = await import('https://luisespino.github.io/mlearnjs/mlearn.mjs');

    //Datos de entrenamiento
    const distancia = [3, 2, 2, 3, 1, 2];
    const ganancia = [5, 6, 2, 2, 8, 9];
    const costo    = [3, 4, 1, 1, 5, 3];
    const clase    = ['N', 'P', 'P', 'P', 'P', 'P'];

    const myLabelEncoder = await LabelEncoder();
    const encoder = new myLabelEncoder();
    encoder.fit(clase);
    const y = encoder.transform(clase);

    const X = distancia.map((_, i) => [distancia[i], ganancia[i], costo[i]]);

    const myGaussianNB = await GaussianNB();
    const model = new myGaussianNB();
    model.fit(X, y);

    const punto = [5, 1, 10];
    const predCod = model.predict(punto); //<- devuelve [1] o [0]
    const pred = encoder.inverseTransform(predCod)[0];

    document.getElementById('log').innerHTML = 
        `Nuevo punto [5, 1, 10] pertenece a la clase: <b>${pred}</b>`;
}

predict_point();