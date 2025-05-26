async function fit_predict() {
    const { KMeans } = await import('https://luisespino.github.io/mlearnjs/mlearn.mjs');

    //Casos 1, 4, 6, 8, 14, 16: usar DISTANCIA (X) y COSTO (Y)
    const X = [
      [3, 3],  //caso 1
      [2, 4],  //caso 4
      [2, 1],  //caso 6
      [3, 1],  //caso 8
      [1, 5],  //caso 14
      [2, 3]   //caso 16
    ];

    showTable(X);

    const myKMeans = await KMeans();
    const model = new myKMeans(3, 300, 1e-4, 0); //3 clusters, tolerancia de 1e-4, distancia euclidiana

    model.fit(X);

    const yPredict = model.predict(X);

    const centroids = model.getCentroids();

    const log = document.getElementById('log');
    log.innerHTML += '<br><br><strong>Predicciones:</strong><br>' + JSON.stringify(yPredict, null, 2);
    log.innerHTML += '<br><br><strong>Centroides:</strong><br>' + JSON.stringify(centroids, null, 2);
    const cantidadCluster1 = yPredict.filter(x => x === 0).length;
    log.innerHTML += '<br><br><strong>Puntos en clúster 0:</strong> ' + cantidadCluster1;
    centroids.forEach((c, i) => {
        log.innerHTML += `<br>Clúster ${i} → X: ${c[0].toFixed(1)}, Y: ${c[1].toFixed(1)}`;
      });

    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Y');
      data.addColumn({ type: 'string', role: 'style' });

      const colores = ['red', 'green', 'yellow']; //3 clusters, agregar más colores si se usan más clusters

      const datosGraficados = X.map((p, i) => [p[0], p[1], `point { fill-color: ${colores[yPredict[i]]}; }`]);

      centroids.forEach(c => datosGraficados.push([c[0], c[1], 'point { fill-color: black; }']));

      data.addRows(datosGraficados);

      const options = {
        title: 'KMeans con 3 Clústeres (DISTANCIA vs COSTO)',
        hAxis: { title: 'DISTANCIA (X)' },
        vAxis: { title: 'COSTO (Y)' },
        legend: 'none',
        pointSize: 10
      };

      const chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }
  }

  function showTable(table) {
    let container = document.getElementById('table-container');
    let tableElement = document.createElement('table');
    tableElement.border = '1';
    let header = tableElement.createTHead();
    let headerRow = header.insertRow();
    ['DISTANCIA', 'COSTO'].forEach(headerText => {
      let cell = headerRow.insertCell();
      cell.textContent = headerText;
    });
    let body = tableElement.createTBody();
    table.forEach(rowData => {
      let row = body.insertRow();
      rowData.forEach(cellData => {
        let cell = row.insertCell();
        cell.textContent = cellData;
      });
    });
    container.appendChild(tableElement);
  }

  fit_predict();