'use strict';

var viewCounter = 0;

function createGraphView(setObj, setIndex) {
  var viewsContainer = document.getElementById('views-container');
  var navList = document.getElementById('views-nav-list');

  if (!viewsContainer || !navList) {
    console.error('No se encontraron contenedores para vistas o navegación.');
    return null;
  }

  viewCounter += 1;
  var viewId = 'view-' + viewCounter;
  var viewTitleText =
    'Vista ' + viewCounter + ' · N=' + setObj.N + ' (nodos: ' + setObj.N * setObj.N + ')';

  // ---- Navegación lateral ----
  var navBtn = document.createElement('button');
  navBtn.className = 'view-nav-item';
  navBtn.textContent = viewTitleText;
  navBtn.dataset.viewId = viewId;
  navBtn.addEventListener('click', function () {
    document.getElementById(viewId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveNavItem(viewId);
  });
  navList.appendChild(navBtn);

  // ---- Card de la vista ----
  var card = document.createElement('section');
  card.className = 'graph-view';
  card.id = viewId;

  card.innerHTML =
    '<div class="graph-view-header">' +
    '  <h3 class="graph-view-title"></h3>' +
    '  <span class="graph-view-subtitle"></span>' +
    '</div>' +
    '<div class="graph-view-body">' +
    '  <div class="graph-canvas" id="' +
    viewId +
    '-cy"></div>' +
    '  <div class="graph-side-panel">' +
    '    <div class="graph-controls">' +
    '      <label>Grafo</label>' +
    '      <select class="graph-select"></select>' +
    '      <label>Layout</label>' +
    '      <select class="layout-select">' +
    '        <option value="sudoku-grid">Sudoku grid</option>' +
    '        <option value="grid">grid</option>' +
    '        <option value="cose">cose (fuerzas)</option>' +
    '        <option value="circle">circle</option>' +
    '        <option value="concentric">concentric</option>' +
    '      </select>' +
    '      <button class="btn-apply-layout">Aplicar layout</button>' +
    '    </div>' +
    '    <div class="graph-node-info">' +
    '      <h3>Nodo seleccionado</h3>' +
    '      <pre class="node-details">Haz click en un nodo.</pre>' +
    '    </div>' +
    '  </div>' +
    '</div>';

  viewsContainer.appendChild(card);

  var titleEl = card.querySelector('.graph-view-title');
  var subtitleEl = card.querySelector('.graph-view-subtitle');
  var graphSelectEl = card.querySelector('.graph-select');
  var layoutSelectEl = card.querySelector('.layout-select');
  var btnApplyLayout = card.querySelector('.btn-apply-layout');
  var nodeDetailsEl = card.querySelector('.node-details');

  if (titleEl) {
    titleEl.textContent = viewTitleText;
  }
  if (subtitleEl) {
    subtitleEl.textContent =
      'Set índice ' + setIndex + ' · ' + (setObj.graphs.length || 0) + ' grafos disponibles';
  }

  // Rellenar select de grafos
  if (graphSelectEl) {
    setObj.graphs.forEach(function (g, idx) {
      var opt = document.createElement('option');
      opt.value = String(idx);
      opt.textContent = 'Grafo ' + idx;
      graphSelectEl.appendChild(opt);
    });
  }

  // Crear instancia de Cytoscape para este lienzo
  var cy = cytoscape({
    container: document.getElementById(viewId + '-cy'),
    elements: [],
    style: [
      {
        selector: 'node',
        style: {
            'background-color': '#3d6df2',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#ffffff',
            'text-outline-color': '#1a254a',
            'text-outline-width': 2,
            'font-size': 11,
            'width': 30,
            'height': 30
        }
     },
{
  selector: 'edge',
  style: {
    //'curve-style': 'bezier',          // curva suave
    // o:
    'curve-style': 'unbundled-bezier',
    'control-point-step-size': 50,    // qué tanto se curva (para algunos estilos)
    'line-color': '#888fbf',
    'width': 2
  }
},
      {
        selector: 'node:selected',
        style: {
          'background-color': '#ffb020',
          'border-color': '#ffffff',
          'border-width': 3
        }
      },
      {
  selector: 'edge:selected',
  style: {
    'line-color': '#ffb020',
    'width': 3,
    'opacity': 1
  }
}
    ],
    layout: {
      name: 'grid',
    avoidOverlap: true,
    fit: true,
    padding: 20
    }
  });

  // Función para renderizar un grafo concreto por índice
  function renderGraph(graphIndex) {
  var g = setObj.graphs[graphIndex];
  if (!g) return;

  var elements = buildElementsFromAdjacency(
    setObj.labels,
    g.adjacency   // ya no pasamos directed
  );

  cy.elements().remove();
  cy.add(elements);

var layoutName = layoutSelectEl ? layoutSelectEl.value : 'sudoku-grid';
applyLayout(cy, layoutName, setObj.N);



    if (subtitleEl) {
      subtitleEl.textContent =
        'Set índice ' +
        setIndex +
        ' · Grafo ' +
        graphIndex +
        ' · N=' +
        setObj.N;
    }
  }

  // Eventos Cytoscape: click en nodo
  cy.on('tap', 'node', function (evt) {
    var node = evt.target;
    var data = node.data();

    var info =
      'index: ' +
      data.index +
      '\n' +
      'id: ' +
      data.id +
      '\n' +
      'label: ' +
      data.label +
      '\n' +
      'degree (Cytoscape): ' +
      node.degree();

    if (nodeDetailsEl) {
      nodeDetailsEl.textContent = info;
    }

    cy.elements().unselect();
    node.select();
    node.neighborhood().select();
  });

  cy.on('tap', function (evt) {
    if (evt.target === cy && nodeDetailsEl) {
      cy.elements().unselect();
      nodeDetailsEl.textContent = 'Haz click en un nodo.';
    }
  });

  // Cambio de grafo
  if (graphSelectEl) {
    graphSelectEl.addEventListener('change', function () {
      var idx = parseInt(graphSelectEl.value || '0', 10) || 0;
      renderGraph(idx);
    });
  }

  // Aplicar layout
  if (btnApplyLayout && layoutSelectEl) {
  btnApplyLayout.addEventListener('click', function () {
    var layoutName = layoutSelectEl.value || 'sudoku-grid';
    applyLayout(cy, layoutName, setObj.N);
  });

  }

  // Render inicial: grafo 0
  renderGraph(0);

  setActiveNavItem(viewId);

  return {
    id: viewId,
    cy: cy,
    setIndex: setIndex
  };
}

function setActiveNavItem(viewId) {
  var navList = document.getElementById('views-nav-list');
  if (!navList) return;
  var buttons = navList.querySelectorAll('.view-nav-item');
  buttons.forEach(function (btn) {
    if (btn.dataset.viewId === viewId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function applyLayout(cy, layoutName, N) {
  if (layoutName === 'sudoku-grid') {
    var side = N; // N x N grid

    cy.layout({
      name: 'grid',
      fit: true,
      padding: 20,
      avoidOverlap: true,
      position: function (node) {
        var idx = node.data('index'); // 0 .. N^2-1
        var row = Math.floor(idx / side);
        var col = idx % side;
        return { row: row, col: col };
      }
    }).run();
  } else {
    cy.layout({
      name: layoutName || 'grid',
      animate: true,
      avoidOverlap: true,
      fit: true,
      padding: 20
    }).run();
  }
}
