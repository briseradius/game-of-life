// 🎨 Initialisation du canvas HTML5 et du contexte 2D pour dessiner dessus
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 🔧 Récupération des sliders de densité et de vitesse dans le DOM
const density = document.getElementById("density");
const speed = document.getElementById("speed");

// 🕹️ Récupération des boutons de contrôle
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const randomBtn = document.getElementById("random");

// 📐 Paramètres de la grille : taille et taille des cellules
const gridSize = 100; // 100x100 cellules
const cellSize = canvas.width / gridSize; // Chaque cellule fait 10x10 px si le canvas fait 1000x1000

// ⏱️ Contrôle de la boucle du jeu
let interval; // stocke l'identifiant de setInterval
let running = false; // indique si la simulation est en cours

// 🧠 Définition des deux grilles : l'actuelle et la suivante
let gridCell = []; // grille courante
let gridNext = []; // grille future (calculée à chaque tick)

// 🔁 Fonction d'initialisation : remplit les deux grilles avec des zéros
function initGrid(){
    gridCell = Array.from({length: gridSize}, () => Array(gridSize).fill(0));
    gridNext = Array.from({length: gridSize}, () => Array(gridSize).fill(0));
}

// 🖼️ Fonction d'affichage : dessine chaque cellule avec une échelle de gris
function readGrid(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const brightness = Math.floor(gridCell[i][j] * 255); // Convertit [0-1] en [0-255]
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`; // Gris selon intensité
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize); // Dessine la cellule
        }
    }
}

// 🔄 Fonction principale : met à jour chaque cellule en fonction de ses voisins
function updateGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const sum = countNeighbors(i, j); // Somme des voisins
            const current = gridCell[i][j];   // Valeur actuelle de la cellule

            // Règle floue : croissance si conditions idéales, sinon décroissance
            if (sum > 2.0 && sum < 3.3) {
                gridNext[i][j] = Math.min(1, current + 0.1); // Augmente l'état jusqu'à 1 max
            } else {
                gridNext[i][j] = Math.max(0, current - 0.1); // Diminue l'état jusqu'à 0 min
            }
        }
    }

    // 🔁 Échange les grilles : celle calculée devient la nouvelle grille active
    [gridCell, gridNext] = [gridNext, gridCell];
}

// 👀 Fonction auxiliaire : calcule la somme des voisins autour d'une cellule
function countNeighbors(x, y){
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const col = (x + i + gridSize) % gridSize; // reboucle au bord horizontal
            const row = (y + j + gridSize) % gridSize; // reboucle au bord vertical
            if (!(i === 0 && j === 0)) {
                sum += gridCell[col][row]; // ajoute la valeur du voisin (exclut la cellule elle-même)
            }
        }
    }
    return sum; // retourne la somme des 8 voisins
}

// 🎲 Fonction qui génère un 1 (vivant) ou 0 (mort) selon la densité choisie
function randomDensity(){
    return Math.random() < density.value/10 ? 1 : 0;
}

// 🔀 Remplit la grille avec des cellules vivantes aléatoires selon la densité
function randomise(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = randomDensity();
        }
    }
    readGrid(); // met à jour l'affichage
}

// 🧹 Réinitialise toute la grille à zéro (cellules mortes)
function resetGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = 0;
        }
    }
    readGrid(); // met à jour l'affichage
}

// ▶️ Lance la simulation si elle n'est pas déjà en cours
function gameStart(){
    if (!running) {
        running = true;
        interval = setInterval(() => {
            updateGrid();
            readGrid();
        }, 1000 / speed.value); // vitesse contrôlée par le slider
    }
}

// ⏹️ Stoppe la simulation
function gameStop(){
    running = false;
    clearInterval(interval); // arrête l'intervalle
}

// ⚡ Met à jour la vitesse de la boucle si on modifie le slider en cours de simulation
speed.addEventListener("input", () => {
    if (running) {
        clearInterval(interval);
        interval = setInterval(() => {
            updateGrid();
            readGrid();
        }, 1000 / speed.value);
    }
});

// 🖱️ Clique sur le canvas : active une cellule à la position cliquée
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;
    const pX = Math.floor(posX / cellSize);
    const pY = Math.floor(posY / cellSize);

    gridCell[pX][pY] = 1; // met la cellule à l'état 1 (vivante à fond)
    readGrid(); // met à jour le rendu
});

// 🔘 Écouteurs pour les boutons de contrôle
startBtn.addEventListener("click", gameStart);
stopBtn.addEventListener("click", gameStop);
resetBtn.addEventListener("click", () => {
    gameStop(); // stoppe d'abord le jeu
    resetGrid(); // puis réinitialise
});
randomBtn.addEventListener("click", () => {
    gameStop(); // stoppe d'abord
    randomise(); // puis remplit aléatoirement
});

// 🚀 Initialisation au chargement
initGrid(); // crée la grille vide
readGrid(); // affiche l'état initial
