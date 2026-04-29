'use strict';

function validateSudokuGraphSet(setObj) {
  if (typeof setObj.N !== 'number' || !Number.isInteger(setObj.N) || setObj.N <= 0) {
    throw new Error('N inválido: ' + setObj.N);
  }

  const expectedNodes = setObj.N * setObj.N;

  if (!Array.isArray(setObj.labels)) {
    throw new Error('El campo "labels" debe ser un array.');
  }

  if (setObj.labels.length !== expectedNodes) {
    throw new Error(
      'Número de etiquetas incorrecto: labels.length = ' +
        setObj.labels.length +
        ', se esperaban N² = ' +
        expectedNodes
    );
  }

  if (!Array.isArray(setObj.graphs) || setObj.graphs.length === 0) {
    throw new Error('El campo "graphs" debe ser un array no vacío.');
  }

  setObj.graphs.forEach(function (g, gi) {
    if (!g || typeof g !== 'object') {
      throw new Error('graphs[' + gi + '] no es un objeto.');
    }

    if (!Array.isArray(g.adjacency)) {
      throw new Error('graphs[' + gi + '].adjacency debe ser una matriz (array de arrays).');
    }

    if (g.adjacency.length !== expectedNodes) {
      throw new Error(
        'graphs[' +
          gi +
          '].adjacency tiene ' +
          g.adjacency.length +
          ' filas, se esperaban ' +
          expectedNodes +
          ' (N²).'
      );
    }

    g.adjacency.forEach(function (row, ri) {
      if (!Array.isArray(row)) {
        throw new Error('graphs[' + gi + '].adjacency[' + ri + '] no es un array.');
      }

      if (row.length !== expectedNodes) {
        throw new Error(
          'graphs[' +
            gi +
            '].adjacency[' +
            ri +
            '] tiene longitud ' +
            row.length +
            ', se esperaban ' +
            expectedNodes +
            ' columnas (N²).'
        );
      }

      row.forEach(function (val, ci) {
        if (typeof val !== 'number') {
          throw new Error(
            'graphs[' +
              gi +
              '].adjacency[' +
              ri +
              '][' +
              ci +
              '] no es numérico: ' +
              val
          );
        }
      });
    });


    for (var i = 0; i < expectedNodes; i++) {
        for (var j = i + 1; j < expectedNodes; j++) {
            var a = g.adjacency[i][j];
            var b = g.adjacency[j][i];
            if (a !== b) {
            throw new Error(
                'graphs[' +
                gi +
                '] no es simétrico (no dirigido) en (' +
                i +
                ',' +
                j +
                ') y (' +
                j +
                ',' +
                i +
                '): ' +
                a +
                ' != ' +
                b
            );
            }
        }
    }

  });
}

function validateAllSudokuSets(json) {
  if (!Array.isArray(json)) {
    throw new Error('El JSON raíz debe ser un array de sets de grafos.');
  }

  json.forEach(function (setObj, idx) {
    validateSudokuGraphSet(setObj);
  });
}
