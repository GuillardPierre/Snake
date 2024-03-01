const app = {
  displayGameZone: document.querySelector('#gridZone'),
  // Stocke la direction du serpent
  snakeDirection: null,
  // Stocke si un timer est déjà en cours (pour pouvoir l'annuler)
  timerId: null,
  //  Rapidité du mouvement du serpent
  delayMovement: 200,
  // Permet de bloquer l'appui de pleins de touches en même temps
  directionLocked: false,
  // Stocke le score mais aussi la longueur du serpent
  score: 4,
  allCells: null,
  position: ['N', 13],
  lastPosition: null,

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

  handleKeyDown: () => {
    window.addEventListener('keydown', (e) => {
      if (!app.directionLocked) {
        app.handleDirection(e);
        app.directionLocked = true; // Verrouillez la direction
        setTimeout(() => {
          app.directionLocked = false;
        }, app.delayMovement);
      }
    });
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

  initiateSnakeBody: () => {
    for (let i = app.score; i > 0; i--) {
      app.allCells.forEach((e) => {
        if (e.id === `N${13 - i}`) {
          e.classList.add(`snakeBody`);
          e.classList.add(`S${i}`);
        }
      });
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
          app.lastPosition = `${app.position[0]}${app.position[1]}`;
          app.position[1]++;
          app.snakePosition(`${app.position[0]}${app.position[1]}`);
          app.snakeBodyMovement(app.lastPosition);
          app.isTheFruitHere();
          if (app.position[1] > 26) {
            alert("C'est perdu");
          }
        }, app.delayMovement);
        break;
      case 'ArrowLeft':
        app.timerId = setInterval(() => {
          app.lastPosition = `${app.position[0]}${app.position[1]}`;
          app.position[1]--;
          app.snakePosition(`${app.position[0]}${app.position[1]}`);
          app.snakeBodyMovement(app.lastPosition);
          app.isTheFruitHere();
          if (app.position[1] < 1) {
            alert("C'est perdu");
          }
        }, app.delayMovement);

        break;
      case 'ArrowDown':
        app.timerId = setInterval(() => {
          app.lastPosition = `${app.position[0]}${app.position[1]}`;
          app.position[0] = app.changeLetter('more');
          app.snakePosition(`${app.position[0]}${app.position[1]}`);
          app.snakeBodyMovement(app.lastPosition);
          app.isTheFruitHere();
          if (app.position[0] === 'A' && app.changeLetter('more') === 'B') {
            alert("C'est perdu");
          }
        }, app.delayMovement);

        break;
      case 'ArrowUp':
        app.timerId = setInterval(() => {
          app.lastPosition = `${app.position[0]}${app.position[1]}`;
          app.position[0] = app.changeLetter('less');
          app.snakePosition(`${app.position[0]}${app.position[1]}`);
          app.snakeBodyMovement(app.lastPosition);
          app.isTheFruitHere();
          if (app.position[0] === 'Z' && app.changeLetter('less') === 'Y') {
            alert("C'est perdu");
          }
        }, app.delayMovement);

        break;
    }
  },

  snakeBodyMovement: (lastPosition) => {
    // On commence par enlever le bout du serpent
    app.allCells.forEach((e) => {
      if (e.classList.contains(`S${app.score}`)) {
        e.classList.remove('snakeBody');
        e.classList.remove(`S${app.score}`);
      }
    });

    // Chaque partie du serpent (sauf le bout) prend +1 en classe
    for (let i = app.score - 1; i > 0; i--) {
      app.allCells.forEach((e) => {
        if (e.classList.contains(`S${i}`)) {
          e.classList.remove(`S${i}`);
          e.classList.add(`S${i + 1}`);
        }
      });
    }

    // Là où se trouvait la tête se trouve maintenant la première partie du corps
    app.allCells.forEach((elem) => {
      if (elem.id === lastPosition) {
        elem.classList.add('snakeBody');
        elem.classList.add(`S1`); // Assurez-vous d'utiliser le préfixe si nécessaire
      }
    });
  },

  pausedGame: () => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'p') {
        if (app.timerId) {
          clearInterval(app.timerId);
        }
      }
    });
  },

  isTheFruitHere: () => {
    console.log('lancé');
    let alreadyHere = false;
    app.allCells.forEach((e) => {
      if (e.classList.contains('fruit')) {
        alreadyHere = true;
        console.log('fruit is here');
      }
    });
    if (alreadyHere === false) {
      console.log('fruit is not here');
      app.generateFruit();
    }
  },

  generateFruit: () => {
    console.log('génération fruit en cours');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let rdmLetter = app.getRandomInt(characters.length);
    rdmLetter = characters[rdmLetter];
    const rdmNumber = app.getRandomInt(26);
    fruitLocalisation = `${rdmLetter}${rdmNumber}`;
    document.querySelector(`#${fruitLocalisation}`).classList.add('fruit');
  },

  getRandomInt: (max) => Math.floor(Math.random() * (max - 1 + 1)) + 1,
};

app.createGrid();
app.snakePosition(`${app.position[0]}${app.position[1]}`);
app.handleKeyDown();
app.initiateSnakeBody();
app.pausedGame();

// for (let index = 0; index < app.score; index--) {}
app.allCells.forEach((elem) => {});
