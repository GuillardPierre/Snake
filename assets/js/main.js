const app = {
  displayGameZone: document.querySelector('#gridZone'),
  snakeDirection: null,
  allCells: null,
  position: ['N', 13],
  timerId: null,

  createGrid: (GridSize = 26, PixelsSize = 15) => {
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

  snakePosition: (position) => {
    app.allCells = document.querySelectorAll('.cell');
    app.allCells.forEach((element) => {
      if (element.classList.contains('snake')) {
        element.classList.remove('snake');
      } else if (element.id === `${position}`) {
        element.classList.add('snake');
      }
    });
  },

  handleKeyDown: () => {
    window.addEventListener('keydown', app.handleDirection);
  },

  handleDirection: (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (e.key === app.snakeDirection) {
        return;
      }
      e.preventDefault();
      app.snakeDirection = e.key;
      console.log(app.snakeDirection);
      app.snakeAllMovement(app.snakeDirection);
    }
  },

  snakeAllMovement: (direction) => {
    // permet d'annuler un mouvement déjà en cours
    if (app.timerId) {
      clearInterval(app.timerId);
    }
    switch (direction) {
      case 'ArrowRight':
        app.timerId = setInterval(() => {
          app.position[1]++;
          app.snakePosition(`${app.position[0]}${app.position[1]}`);
        }, 500);
        break;
      case 'ArrowLeft':
        app.timerId = setInterval(() => {
          app.position[1]--;
          app.snakePosition(`${app.position[0]}${app.position[1]}`);
        }, 500);
        break;
      case 'ArrowDown':
        app.timerId = setInterval(() => {
          app.position[0] = app.changeLetter('more');
          app.snakePosition(`${app.position[0]}${app.position[1]}`);
        }, 500);
        break;
      case 'ArrowUp':
        app.timerId = setInterval(() => {
          app.position[0] = app.changeLetter('less');
          app.snakePosition(`${app.position[0]}${app.position[1]}`);
        }, 500);
        break;
    }
  },

  changeLetter: (moreOrLess) => {
    switch (moreOrLess) {
      case 'more':
        const code = app.position[0].charCodeAt(0);
        return String.fromCharCode(((code - 65 + 1) % 26) + 65);
      case 'less':
        const code2 = app.position[0].charCodeAt(0);
        return String.fromCharCode(((code2 - 65 - 1 + 26) % 26) + 65);
    }
  },

  move: (dir) => {
    app.allCells.forEach((elem) => {});
  },
};

app.createGrid();
app.snakePosition(`${app.position[0]}${app.position[1]}`);
app.handleKeyDown();
