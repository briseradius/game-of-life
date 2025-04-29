// 🎨 Récupération du canvas et de son contexte de dessin en 2D
const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// 📦 Déclaration de la grille et de ses paramètres
const gridCell = []; // Grille contenant l'état (0 ou 1) de chaque cellule
const gridSize = 100; // Taille de la grille (100x100 cellules)
const cellSize = canvas.width / gridSize; // Taille d'une cellule

// 🕹️ Stockage de l'ID de la boucle d'animation
var mainLoop = null;

// 🧭 Tableau des directions possibles (non utilisé ici mais souvent utile)
const nbArray = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];

// 🎛️ Récupération des éléments de l'interface utilisateur
var startBtn = document.getElementById("start");
var stopBtn = document.getElementById("stop");
var randomBtn = document.getElementById("random");
var density = document.getElementById("density");
var speed = document.getElementById("speed");
var reset = document.getElementById("reset");

// 🐜 Objet représentant la fourmi de Langton
let ant = {
    x: Math.floor(gridSize / 2), // Position X initiale au centre
    y: Math.floor(gridSize / 2), // Position Y initiale au centre
    dir: 0 // Direction (0 = haut, 1 = droite, 2 = bas, 3 = gauche)
};

// 🏗️ Fonction d'initialisation de la grille (toutes les cellules à 0)
function initGrid(){
    for (let i = 0; i < gridSize; i++) {
        gridCell[i] = [];
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = 0;
        }
    }
}

// 🔁 Fonction pour réinitialiser la grille et l'état de la fourmi
function resetGrid(){
    reset.addEventListener('click', function(){
        clearInterval(mainLoop); // Arrêt de la boucle
        mainLoop = null;
        initGrid(); // Réinitialisation de la grille
        ant.x = Math.floor(gridSize / 2); // Réinitialisation de la position
        ant.y = Math.floor(gridSize / 2);
        ant.dir = 0;
        readGrid(); // Rafraîchissement de l'affichage
    })
}

// 🧾 Fonction qui lit la grille et affiche chaque cellule
function readGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.fillStyle = gridCell[i][j] === 1 ? "white" : "black";
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
    drawAnt(); // Affichage de la fourmi
}

// 🐜 Fonction pour dessiner la fourmi en rouge
function drawAnt(){
    ctx.fillStyle = "red";
    ctx.fillRect(ant.x * cellSize, ant.y * cellSize, cellSize, cellSize);
}

// 🧠 Fonction principale qui applique les règles de Langton
function moveAnt(){
    let cellState = gridCell[ant.x][ant.y];

    if (cellState === 0) {
        ant.dir = (ant.dir + 1) % 4; // Tourner à droite si cellule noire
        gridCell[ant.x][ant.y] = 1;  // Cellule devient blanche
    } else {
        ant.dir = (ant.dir + 3) % 4; // Tourner à gauche si cellule blanche
        gridCell[ant.x][ant.y] = 0;  // Cellule devient noire
    }

    // 🧭 Avancer d'une case dans la direction actuelle
    if (ant.dir === 0) ant.y--;
    if (ant.dir === 1) ant.x++;
    if (ant.dir === 2) ant.y++;
    if (ant.dir === 3) ant.x--;

    // 🌍 Gestion du dépassement des bords (effet torique)
    if (ant.x < 0) ant.x = gridSize - 1;
    if (ant.y < 0) ant.y = gridSize - 1;
    if (ant.x >= gridSize) ant.x = 0;
    if (ant.y >= gridSize) ant.y = 0;
}

// ▶️ Lancer la simulation (boucle d'animation)
function gameStart(){
    startBtn.addEventListener('click', function(){
        if (mainLoop === null) {
            mainLoop = setInterval(function(){
                moveAnt();
                readGrid();
            }, speed.value * 5);
        }
    })
}

// ⏹️ Arrêter la simulation
function gameStop(){
    stopBtn.addEventListener('click', function(){
        clearInterval(mainLoop);
        mainLoop = null;
    })
}

// 🎲 Remplissage aléatoire de la grille selon la densité choisie
function randomise(){
    randomBtn.addEventListener('click', function(){
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                gridCell[i][j] = Math.random() <= density.value / 10 ? 1 : 0;
            }
        }
        readGrid();
    })
}

// ⏩ Mise à jour de la vitesse pendant la simulation
speed.addEventListener('input', function(){
    if (mainLoop !== null) {
        clearInterval(mainLoop);
        mainLoop = setInterval(function(){
            moveAnt();
            readGrid();
        }, speed.value * 5);
    }
});

// 🖱️ Interaction avec la souris pour dessiner à la main sur la grille
function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    var pX = Math.floor(posX / cellSize);
    var pY = Math.floor(posY / cellSize);

    gridCell[pX][pY] = gridCell[pX][pY] ? 0 : 1; // Inverser la cellule
    readGrid();
}
canvas.addEventListener('click', function(e){ 
    getMousePosition(e);
});

// 🔃 Initialisation générale au démarrage
initGrid();
readGrid();
gameStart();
gameStop();
resetGrid();
randomise();
