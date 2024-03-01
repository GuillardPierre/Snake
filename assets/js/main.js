const app = {
  displayGameZone: document.querySelector('#gridZone'),
  // Stocke la direction du serpent
  snakeDirection: null,
  // Stocke si un timer est déjà en cours (pour pouvoir l'annuler)
  timerId: null,
  //  Rapidité du mouvement du serpent
  delayMovement: 150,
  // Permet de bloquer l'appui de pleins de touches en même temps
  directionLocked: false,
  // Stocke le score mais aussi la longueur du serpent
  snakeLength: 4,
  score: 0,
  allCells: null,
  position: ['N', 13],
  lastPosition: null,
  fruitLocalisation: null,

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
    const impossibleDir = [["ArrowUp","ArrowDown"], ["ArrowUp", "ArrowDown"]]
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (e.key === app.snakeDirection) {
        return;
      } else if (e.key === "ArrowUp" && app.snakeDirection === "ArrowDown" || e.key === "ArrowDown" && app.snakeDirection === "ArrowUp"
      || e.key === "ArrowLeft" && app.snakeDirection === "ArrowRight" || e.key === "ArrowRight" && app.snakeDirection === "ArrowLeft") {
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
      if (element.classList.contains('snakeHead')) {
        element.classList.remove('snakeHead');
      } else if (element.id === `${position}`) {
        element.classList.add('snake');
        element.classList.add('snakeHead');
      }
    });
  },

  handleScore: () => {
    const zoneScore = document.querySelector('#scoreZone');
    zoneScore.innerHTML = `Ton score : ${app.score} `;
  },

  initiateSnakeBody: () => {
    for (let i = app.snakeLength; i > 0; i--) {
      app.allCells.forEach((e) => {
        if (e.id === `N${13 - i}`) {
          e.classList.add(`snakeBody`);
          e.classList.add(`S${i}`);
        }
      });
    }
  },

  allVerification: () => {
    app.snakePosition(`${app.position[0]}${app.position[1]}`);
    app.snakeBodyMovement(app.lastPosition);
    app.isTheFruitHere();
    app.EatTheFruit();
    app.handleScore();
    app.didYouLose();
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
          app.allVerification();
        }, app.delayMovement);
        break;
      case 'ArrowLeft':
        app.timerId = setInterval(() => {
          app.lastPosition = `${app.position[0]}${app.position[1]}`;
          app.position[1]--;
          app.allVerification();
        }, app.delayMovement);

        break;
      case 'ArrowDown':
        app.timerId = setInterval(() => {
          app.lastPosition = `${app.position[0]}${app.position[1]}`;
          app.position[0] = app.changeLetter('more');
          app.allVerification();
        }, app.delayMovement);

        break;
      case 'ArrowUp':
        app.timerId = setInterval(() => {
          app.lastPosition = `${app.position[0]}${app.position[1]}`;
          app.position[0] = app.changeLetter('less');
          app.allVerification();
        }, app.delayMovement);

        break;
    }
  },

  snakeBodyMovement: (lastPosition) => {
    // On commence par enlever le bout du serpent
    app.allCells.forEach((e) => {
      if (e.classList.contains(`S${app.snakeLength}`)) {
        e.classList.remove('snakeBody');
        e.classList.remove(`S${app.snakeLength}`);
      }
    });

    // Chaque partie du serpent (sauf le bout) prend +1 en classe
    for (let i = app.snakeLength - 1; i > 0; i--) {
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
    let alreadyHere = false;
    app.allCells.forEach((e) => {
      if (e.classList.contains('fruit')) {
        alreadyHere = true;
      }
    });
    if (alreadyHere === false) {
      app.generateFruit();
    }
  },

  generateFruit: () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let rdmLetter = app.getRandomInt(characters.length);
    rdmLetter = characters[rdmLetter];
    const rdmNumber = app.getRandomInt(26);
    app.fruitLocalisation = `${rdmLetter}${rdmNumber}`;

    document.querySelector(`#${app.fruitLocalisation}`).classList.add('fruit');
  },

  getRandomInt: (max) => Math.floor(Math.random() * (max - 1 + 1)) + 1,

  EatTheFruit: () => {
    if (`${app.position[0]}${app.position[1]}` === app.fruitLocalisation) {
      document
        .querySelector(`#${app.fruitLocalisation}`)
        .classList.remove('fruit');
      app.snakeLength++;
      app.score++;
    }
  },

  didYouLose: () => {
    console.log(app.position[0]);
    const cleanPosition = `${app.position[0]}${app.position[1]}`;
    if (
      document
        .querySelector(`#${cleanPosition}`)
        .classList.contains('snakeBody')
    ) {
      alert("C'est perdu");
    }
     if (app.position[0] === 'Z' && app.lastPosition[0] === 'A') {
      console.log('cas A');
       alert("C'est perdu");
     }
    if (app.position[0] === 'A' && app.lastPosition[0] === "Z") {
      console.log('cas B');
      alert("C'est perdu");
    }
    if (app.position[1] > 26) {
      alert("C'est perdu");
    }
    if (app.position[1] < 1) {
      alert("C'est perdu");
    }
  },
};

app.createGrid();
app.snakePosition(`${app.position[0]}${app.position[1]}`);
app.handleKeyDown();
app.initiateSnakeBody();
app.pausedGame();
