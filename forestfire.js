// Récupération du canvas HTML et de son contexte 2D pour dessiner
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Récupération des éléments de contrôle HTML (inputs et boutons)
const density = document.getElementById("density"); // Densité initiale d’arbres
const speed = document.getElementById("speed");     // Vitesse de simulation

const startBtn = document.getElementById("start");   // Bouton pour démarrer
const stopBtn = document.getElementById("stop");     // Bouton pour arrêter
const resetBtn = document.getElementById("reset");   // Bouton pour tout effacer
const randomBtn = document.getElementById("random"); // Bouton pour générer une forêt aléatoire

// Taille de la grille (grille carrée : gridSize x gridSize)
const gridSize = 100;

// Taille d'une cellule (en pixels), calculée en fonction de la taille du canvas
const cellSize = canvas.width / gridSize;

// Variables pour contrôler l’état de la simulation
let interval;     // Pour stocker l’intervalle de mise à jour
let running = false; // Indique si la simulation est en cours

// Deux grilles : une pour l'état actuel, une pour le prochain état
// 0 = vide, 1 = arbre, 2 = feu
let gridCell = [];
let gridNext = [];

/**
 * Initialise les deux grilles avec des cellules vides (0)
 */
function initGrid(){
    gridCell = Array.from({length: gridSize}, () => Array(gridSize).fill(0));
    gridNext = Array.from({length: gridSize}, () => Array(gridSize).fill(0));
}

/**
 * Affiche la grille actuelle sur le canvas
 */
function readGrid(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoie l'affichage
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // Choix de la couleur selon l'état de la cellule
            if (gridCell[i][j] === 1){
                ctx.fillStyle = "green"; // Arbre
            }
            else if (gridCell[i][j] === 2){
                ctx.fillStyle = "red"; // Feu
            }
            else {
                ctx.fillStyle = "black"; // Vide
            }
            // Dessine le rectangle correspondant à la cellule
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}

/**
 * Met à jour la grille selon les règles de propagation du feu
 */
function updateGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = gridCell[i][j];
            if (cell === 2) {
                gridNext[i][j] = 0; // Le feu devient une cellule vide
            } else if (cell === 1) {
                // Si au moins un voisin est en feu, l’arbre prend feu
                gridNext[i][j] = hasBurningNeighbor(i, j) ? 2 : 1;
            } else {
                // Cellule vide : petite probabilité qu’un arbre repousse
                gridNext[i][j] = Math.random() < 0.01 ? 1 : 0;
            }
        }
    }

    // On échange les deux grilles pour éviter de modifier la grille en cours de lecture
    [gridCell, gridNext] = [gridNext, gridCell];
}

/**
 * Vérifie si un voisin (dans un carré 3x3) est en feu
 */
function hasBurningNeighbor(x, y) {
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx !== 0 || dy !== 0) { // On ignore la cellule elle-même
                // Calcul en torus : la grille "boucle" sur elle-même
                const i = (x + dx + gridSize) % gridSize;
                const j = (y + dy + gridSize) % gridSize;
                if (gridCell[i][j] === 2) {
                    return true; // Voisin en feu trouvé
                }
            }
        }
    }
    return false;
}

/**
 * Retourne une cellule aléatoire selon la densité choisie :
 * - arbre si densité > aléatoire
 * - vide sinon
 */
function randomDensity(){
    const r = Math.random();
    return (r < density.value / 10) ? 1 : 0;
}

/**
 * Remplit la grille de manière aléatoire selon la densité, puis ajoute du feu
 */
function randomise(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = randomDensity();
        }
    }

    // Ajoute 10 feux aléatoires dans la grille
    for (let k = 0; k < 10; k++) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        gridCell[x][y] = 2;
    }

    readGrid(); // Rafraîchit l’affichage
}

/**
 * Vide complètement la grille
 */
function resetGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = 0;
        }
    }
    readGrid();
}

/**
 * Lance la simulation avec la vitesse choisie
 */
function gameStart(){
    if (!running) {
        running = true;
        interval = setInterval(() => {
            updateGrid();
            readGrid();
        }, 1000 / speed.value); // fréquence selon la vitesse
    }
}

/**
 * Arrête la simulation
 */
function gameStop(){
    running = false;
    clearInterval(interval);
}

/**
 * Quand on change la vitesse, la simulation s’adapte en temps réel
 */
speed.addEventListener("input", () => {
    if (running) {
        clearInterval(interval);
        interval = setInterval(() => {
            updateGrid();
            readGrid();
        }, 1000 / speed.value);
    }
});

/**
 * Ajout d’un feu manuel en cliquant sur une cellule
 */
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;
    const pX = Math.floor(posX / cellSize);
    const pY = Math.floor(posY / cellSize);

    gridCell[pX][pY] = 2; // Met le feu à la cellule cliquée
    readGrid();
});

// Lien entre boutons et fonctions de contrôle
startBtn.addEventListener("click", gameStart);
stopBtn.addEventListener("click", gameStop);
resetBtn.addEventListener("click", () => {
    gameStop();
    resetGrid();
});
randomBtn.addEventListener("click", () => {
    gameStop();
    randomise();
});

// Initialisation au chargement
initGrid();
readGrid();
