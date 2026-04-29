'use strict';

'use strict';

// Siempre GRAFO NO DIRIGIDO
function buildElementsFromAdjacency(labels, adjacency) {
  var elements = [];
  var n = labels.length;

  // Nodos
  for (var i = 0; i < n; i++) {
    elements.push({
      data: {
        id: 'n' + i,
        label: labels[i],
        index: i
      }
    });
  }

  // Aristas (no dirigidas: solo i < j)
  for (var r = 0; r < n; r++) {
    for (var c = r + 1; c < n; c++) {
      var value = adjacency[r][c];
      if (!value) continue; // 0 → sin arista

      var edgeId = 'e_' + r + '_' + c;
      var edgeData = {
        id: edgeId,
        source: 'n' + r,
        target: 'n' + c
      };

      if (value !== 1) {
        edgeData.weight = value;
      }

      elements.push({ data: edgeData });
    }
  }

  return elements;
}
