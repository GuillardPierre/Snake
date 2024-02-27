const displayGameZone = document.querySelector('#gridZone');

function createGrid(GridSize = 26, PixelsSize = 15) {
  for (let i = 0; i < GridSize * GridSize; i++) {
    const cellule = document.createElement('div');

    // Calcul des coordonnées alphabétiques (A-Z) et numériques (1-26)
    const row = String.fromCharCode(65 + Math.floor(i / GridSize)); // Convertit le code ASCII en lettre (A-Z)
    const col = (i % GridSize) + 1; // Numéro de colonne (1-26)

    cellule.id = `${row}${col}`;
    cellule.classList.add('cell');
    cellule.style.height = PixelsSize + 'px';
    cellule.style.width = PixelsSize + 'px';

    displayGameZone.appendChild(cellule);
  }

  displayGameZone.style.gridTemplateColumns = `repeat(${GridSize}, ${PixelsSize}px)`;
}

const app = {
  displayGameZone: document.querySelector('#gridZone'),

  createGrid: function (GridSize = 26, PixelsSize = 15) {
    for (let i = 0; i < GridSize * GridSize; i++) {
      const cellule = document.createElement('div');

      // Calcul des coordonnées alphabétiques (A-Z) et numériques (1-26)
      const row = String.fromCharCode(65 + Math.floor(i / GridSize)); // Convertit le code ASCII en lettre (A-Z)
      const col = (i % GridSize) + 1; // Numéro de colonne (1-26)

      cellule.id = `${row}${col}`;
      cellule.classList.add('cell');
      cellule.style.height = PixelsSize + 'px';
      cellule.style.width = PixelsSize + 'px';

      app.displayGameZone.appendChild(cellule);
    }
    app.displayGameZone.style.gridTemplateColumns = `repeat(${GridSize}, ${PixelsSize}px)`;
  },
};

app.createGrid();
