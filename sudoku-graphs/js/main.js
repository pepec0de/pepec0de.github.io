'use strict';

var allSudokuSets = [];

document.addEventListener('DOMContentLoaded', function () {
  var datasetSelect = document.getElementById('dataset-select');
  var btnNewView = document.getElementById('btn-new-view');

  loadJsonFile('data/sudoku_graphs.json')
    .then(function (json) {
      allSudokuSets = json;
      populateDatasetSelect(datasetSelect, allSudokuSets);

      // Crear una vista inicial si hay datos
      if (allSudokuSets.length > 0) {
        datasetSelect.value = '0';
        createGraphView(allSudokuSets[0], 0);
      }
    })
    .catch(function (err) {
      console.error(err);
      alert('Error cargando el archivo JSON de grafos. Mira la consola para más detalles.');
    });

  if (btnNewView) {
    btnNewView.addEventListener('click', function () {
      if (!allSudokuSets || allSudokuSets.length === 0) {
        alert('No hay datasets cargados.');
        return;
      }
      var idx = parseInt(datasetSelect.value || '0', 10) || 0;
      if (idx < 0 || idx >= allSudokuSets.length) {
        alert('Índice de dataset inválido.');
        return;
      }
      createGraphView(allSudokuSets[idx], idx);
    });
  }
});

function loadJsonFile(url) {
  return fetch(url).then(function (response) {
    if (!response.ok) {
      throw new Error('Error HTTP ' + response.status + ' al cargar ' + url);
    }
    return response.json();
  }).then(function (json) {
    validateAllSudokuSets(json);
    return json;
  });
}

function populateDatasetSelect(selectEl, sets) {
  if (!selectEl) return;
  selectEl.innerHTML = '';

  sets.forEach(function (setObj, idx) {
    var expectedNodes = setObj.N * setObj.N;
    var opt = document.createElement('option');
    opt.value = String(idx);
    opt.textContent =
      'N=' + setObj.N + ' · nodos: ' + expectedNodes + ' · grafos: ' + setObj.graphs.length;
    selectEl.appendChild(opt);
  });
}
