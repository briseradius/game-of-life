const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const gridCell = [];
const gridSize = 100;
const cellSize = canvas.width / gridSize;
var mainLoop = null;

const nbArray=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];

var startBtn = document.getElementById("start");
var stopBtn = document.getElementById("stop");
var randomBtn = document.getElementById("random");
var density = document.getElementById("density");
var speed = document.getElementById("speed");
var reset = document.getElementById("reset");

let ant = {
    x: Math.floor(gridSize / 2),
    y: Math.floor(gridSize / 2),
    dir: 0 // 0 = haut, 1 = droite, 2 = bas, 3 = gauche
};

// Initialisation de la grille
function initGrid(){
    for (let i = 0; i < gridSize; i++) {
        gridCell[i] = [];
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = 0;
        }
    }
}

// Remettre à zéro
function resetGrid(){
    reset.addEventListener('click', function(){
        clearInterval(mainLoop);
        mainLoop = null;
        initGrid();
        ant.x = Math.floor(gridSize / 2);
        ant.y = Math.floor(gridSize / 2);
        ant.dir = 0;
        readGrid();
    })
}

// Dessin de la grille
function readGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gridCell[i][j] === 1) {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = "black";
            }
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
    drawAnt();
}

// Dessiner la fourmi
function drawAnt(){
    ctx.fillStyle = "red";
    ctx.fillRect(ant.x * cellSize, ant.y * cellSize, cellSize, cellSize);
}

// Mouvement de la fourmi
function moveAnt(){
    let cellState = gridCell[ant.x][ant.y];

    // règle de Langton
    if (cellState === 0) {
        ant.dir = (ant.dir + 1) % 4; // Tourner à droite
        gridCell[ant.x][ant.y] = 1; // Passer à blanc
    } else {
        ant.dir = (ant.dir + 3) % 4; // Tourner à gauche
        gridCell[ant.x][ant.y] = 0; // Passer à noir
    }

    // Avancer d'une case
    if (ant.dir === 0) ant.y--;
    if (ant.dir === 1) ant.x++;
    if (ant.dir === 2) ant.y++;
    if (ant.dir === 3) ant.x--;

    // Gérer les bords
    if (ant.x < 0) ant.x = gridSize - 1;
    if (ant.y < 0) ant.y = gridSize - 1;
    if (ant.x >= gridSize) ant.x = 0;
    if (ant.y >= gridSize) ant.y = 0;
}

// Bouton start
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

// Bouton stop
function gameStop(){
    stopBtn.addEventListener('click', function(){
        clearInterval(mainLoop);
        mainLoop = null;
    })
}

// Remplissage aléatoire
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

// Changer la vitesse en direct
speed.addEventListener('input', function(){
    if (mainLoop !== null) {
        clearInterval(mainLoop);
        mainLoop = setInterval(function(){
            moveAnt();
            readGrid();
        }, speed.value * 5);
    }
});

// Interaction souris pour colorier manuellement
function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    var pX = Math.floor(posX / cellSize);
    var pY = Math.floor(posY / cellSize);

    gridCell[pX][pY] = gridCell[pX][pY] ? 0 : 1;
    readGrid();
}

canvas.addEventListener('click', function(e){ 
    getMousePosition(e);
});

// Initialisation générale
initGrid();
readGrid();
gameStart();
gameStop();
resetGrid();
randomise();
