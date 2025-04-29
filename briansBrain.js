// Récupération du canevas HTML et de son contexte 2D pour le dessin
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Récupération des sliders pour contrôler la densité de départ et la vitesse d'exécution
const density = document.getElementById("density");
const speed = document.getElementById("speed");

// Récupération des boutons d'interaction utilisateur
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const randomBtn = document.getElementById("random");

// Définition de la taille de la grille (100x100)
const gridSize = 100;
// Taille d'une cellule en pixels, calculée selon la taille du canvas
const cellSize = canvas.width / gridSize;

// Variables de contrôle du jeu
let interval; // stocke l'identifiant de l'intervalle de mise à jour
let running = false; // indique si le jeu est en cours ou non

// Déclaration des grilles de jeu
let gridCell = []; // Grille actuelle
let gridNext = []; // Grille de l'état suivant

// Fonction d'initialisation des grilles (remplies de 0 = cellules mortes)
function initGrid(){
    gridCell = Array.from({length: gridSize}, () => Array(gridSize).fill(0));
    gridNext = Array.from({length: gridSize}, () => Array(gridSize).fill(0));
}

// Fonction d'affichage de la grille dans le canvas
function readGrid(){
    // Nettoie la surface du canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Parcours toutes les cellules de la grille
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // Détermine la couleur selon l'état de la cellule
            if(gridCell[i][j] === 1){
                ctx.fillStyle = "#00FFFF"; // vivant (cyan)
            }
            else if (gridCell[i][j] === 2){
                ctx.fillStyle = "#FF00FF"; // réfractaire (violet)
            }
            else{
                ctx.fillStyle = "black"; // mort
            }
            // Dessine la cellule à la bonne position
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }        
    }
}

// Calcule l'état suivant de la grille selon les règles
function updateGrid(){
    // Application des règles à chaque cellule
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const nbSum = countNeighbors(i, j); // Nombre de voisins vivants
            gridNext[i][j] = rules(nbSum, gridCell[i][j]); // Application des règles
        }
    }

    // Copie de la nouvelle grille dans la grille actuelle
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = gridNext[i][j];
        }
    }
}

// Compte le nombre de cellules voisines vivantes autour d'une cellule
function countNeighbors(x, y){
    let sum = 0;
    // Boucle dans la zone 3x3 autour de la cellule
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i === 0 && j === 0)) { // Ignore la cellule elle-même
                const col = (x + i + gridSize) % gridSize; // rebouclage (bords connectés)
                const row = (y + j + gridSize) % gridSize;
                if (gridCell[col][row] === 1) { // Si voisine vivante
                    sum++;
                }
            }
        }
    }
    return sum;
}

// Règles de l'automate "Brian's Brain"
function rules(nbSum, currentState) {
    if (currentState === 0 && nbSum === 2) {
        return 1; // Une cellule morte avec 2 voisines vivantes devient vivante
    }
    if (currentState === 1) {
        return 2; // Une cellule vivante devient réfractaire
    }
    if (currentState === 2) {
        return 0; // Une cellule réfractaire devient morte
    }
    return currentState; // Sinon, l'état reste inchangé
}

// Fonction qui détermine aléatoirement l'état initial d'une cellule selon la densité choisie
function randomDensity(){
    return Math.random() <= density.value/10 ? 1 : 0; // 1 (vivant) ou 0 (mort)
}

// Remplissage aléatoire de la grille
function randomise(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = randomDensity(); // Remplit avec cellules vivantes ou mortes
        }
    }
    readGrid(); // Affiche la grille
}

// Réinitialise la grille à vide (toutes cellules mortes)
function resetGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = 0;
        }
    }
    readGrid(); // Mise à jour visuelle
}

// Lance le jeu : met à jour la grille à intervalles réguliers
function gameStart(){
    if (!running) {
        running = true;
        interval = setInterval(() => {
            updateGrid();
            readGrid();
        }, 1000 / speed.value); // Vitesse selon le slider
    }
}

// Stoppe l'exécution du jeu
function gameStop(){
    running = false;
    clearInterval(interval);
}

// Récupère la position de la souris sur le canvas pour interagir avec les cellules
function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect(); // Position absolue du canvas
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    var pX = Math.floor(posX / cellSize); // Coordonnée X en cellule
    var pY = Math.floor(posY / cellSize); // Coordonnée Y en cellule

    // Fait évoluer l’état de la cellule cliquée : mort -> vivant -> réfractaire -> mort
    gridCell[pX][pY] = (gridCell[pX][pY] + 1) % 3;

    readGrid(); // Mise à jour visuelle
}

// Permet de changer la vitesse à la volée en réinitialisant l'intervalle
speed.addEventListener("input", () => {
    if (running) {
        clearInterval(interval);
        interval = setInterval(() => {
            updateGrid();
            readGrid();
        }, 1000 / speed.value);
    }
});

// Ajout des gestionnaires d'événements pour les boutons et le clic sur le canevas
canvas.addEventListener("click", getMousePosition);
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

// Initialisation de la grille et affichage à la première exécution
initGrid();
readGrid();
