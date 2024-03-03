const app = {
	displayGameZone: document.querySelector('#gridZone'),
	popUp: document.querySelector('#popUp'),
	scoreDisplayZone: document.querySelector('#score'),
	btnReplay: document.querySelector('#btnRejouer'),
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

	// Permet de créer la grille de jeu
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

	/**
	 * Ajoute un eventListener sur les touches pour gérer la direction
	 */
	handleKeyDown: () => {
		window.addEventListener('keydown', app.handleDirection);
	},

	/**
	 *
	 * @param {Event}
	 * @returns Ne retourne rien si la direction est déjà la même ou si c'est la direction opposée à l'actuelle. Sinon la fonction actualise la nouvelle direction
	 */
	handleDirection: (e) => {
		if (!app.directionLocked) {
			app.directionLocked = true; // Verrouillez la direction
			setTimeout(() => {
				app.directionLocked = false;
			}, app.delayMovement);
		} else {
			return;
		}
		const impossibleDir = [
			['ArrowUp', 'ArrowDown'],
			['ArrowUp', 'ArrowDown'],
		];
		if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
			if (e.key === app.snakeDirection) {
				return;
			} else if (
				(e.key === 'ArrowUp' && app.snakeDirection === 'ArrowDown') ||
				(e.key === 'ArrowDown' && app.snakeDirection === 'ArrowUp') ||
				(e.key === 'ArrowLeft' && app.snakeDirection === 'ArrowRight') ||
				(e.key === 'ArrowRight' && app.snakeDirection === 'ArrowLeft')
			) {
				return;
			}
			e.preventDefault();
			app.snakeDirection = e.key;
			console.log(app.snakeDirection);
			app.snakeAllMovement(app.snakeDirection);
		}
	},

	GameOver: () => {
		app.scoreDisplayZone.innerHTML = app.score;
		app.popUp.style.display = 'inline';
		clearInterval(app.timerId);
		window.removeEventListener('keydown', app.handleDirection);
	},

	restart: () => {
		app.btnReplay.addEventListener('click', () => {
			app.position = ['N', 13];
			app.popUp.style.display = 'none';
			app.score = 0;
			app.snakeLength = 3;
			app.direction = null;
			app.lastPosition = null;
			app.displayGameZone.innerHTML = '';
			app.init();
		});
	},

	/**
	 *
	 * @param {String} moreOrLess
	 * @returns la nouvelle ordonnée pour permettre le déplacement vertical du serpent.
	 */
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

	/**
	 * Permet de déplacer la tête du serpent
	 * @param {String} position
	 */
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

	/**
	 * Gère l'affichage du score sur l'écran de jeu.
	 */
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

	/**
	 * Fonction qui appelle toutes les fonctions qui doivent tourner à chaque mouvement du serpent.
	 */
	allVerification: () => {
		app.didYouLose();
		app.snakePosition(`${app.position[0]}${app.position[1]}`);
		app.snakeBodyMovement(app.lastPosition);
		app.isTheFruitHere();
		app.EatTheFruit();
		app.handleScore();
	},

	/**
	 * On annule le timer puis on stocke la position précédente du serpent  et on lance un nouveau timer avec la nouvelle direction donnée au serpent.
	 * @param {String} direction
	 */
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

	/**
	 * Gère le corps du serpent.
	 * @param {String} lastPosition va permettre de remplacer la tête par le premier bout du serpent (class = S1)
	 */
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
				elem.classList.add(`S1`);
			}
		});
	},

	/**
	 * A votre avis ?
	 */
	pausedGame: () => {
		window.addEventListener('keydown', (e) => {
			if (e.key === 'p') {
				if (app.timerId) {
					clearInterval(app.timerId);
				}
			}
		});
	},

	/**
	 * Vérifie si le fruit est présent
	 */
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

	/**
	 * Génère un fruit si nécessaire
	 */
	generateFruit: () => {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let rdmLetter = app.getRandomInt(characters.length);
		rdmLetter = characters[rdmLetter];
		const rdmNumber = app.getRandomInt(26);
		app.fruitLocalisation = `${rdmLetter}${rdmNumber}`;

		document.querySelector(`#${app.fruitLocalisation}`).classList.add('fruit');
	},

	/**
	 *
	 * @param {Number} max
	 * @returns un nombre aléatoire
	 */
	getRandomInt: (max) => Math.floor(Math.random() * (max - 1 + 1)) + 1,

	/**
	 * Si la tête du serpent sur une case fruit, il le "mange" et rajoute 1 à sa taille et à sa longueur.
	 */
	EatTheFruit: () => {
		if (`${app.position[0]}${app.position[1]}` === app.fruitLocalisation) {
			document
				.querySelector(`#${app.fruitLocalisation}`)
				.classList.remove('fruit');
			app.snakeLength++;
			app.score++;
		}
	},
	/**
	 * Permet de savoir si on perd en se touchant ou en percuttant le borde de la zone.
	 */
	didYouLose: () => {
		const cleanPosition = `${app.position[0]}${app.position[1]}`;
		let loseMessage = "C'est perdu";

		switch (true) {
			case app.position[0] === 'Z' && app.lastPosition[0] === 'A':
			case app.position[0] === 'A' && app.lastPosition[0] === 'Z':
			case app.position[1] === 27:
			case app.position[1] === 0:
			case document
				.querySelector(`#${cleanPosition}`)
				.classList.contains('snakeBody'):
				app.GameOver();
				break;

			default:
				// Aucune condition correspondante, aucune action.
				break;
		}
	},

	init: () => {
		app.createGrid();
		app.snakePosition(`${app.position[0]}${app.position[1]}`);
		app.initiateSnakeBody();
		app.handleKeyDown();
		app.pausedGame();
		app.restart();
	},
};

window.addEventListener('DOMContentLoaded', app.init);
