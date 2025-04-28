const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const density = document.getElementById("density");
const speed = document.getElementById("speed");

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");
const randomBtn = document.getElementById("random");

const gridSize = 100;
const cellSize = canvas.width / gridSize;
let interval;
let running = false;

// Grilles
let gridCell = [];
let gridNext = [];

function initGrid(){
    gridCell = Array.from({length: gridSize}, () => Array(gridSize).fill(0));
    gridNext = Array.from({length: gridSize}, () => Array(gridSize).fill(0));
}

function readGrid(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if(gridCell[i][j] === 1){
                ctx.fillStyle = "#00FFFF"; // vivant (cyan)
            }
            else if (gridCell[i][j] === 2){
                ctx.fillStyle = "#FF00FF"; // réfractaire (violet)
            }
            else{
                ctx.fillStyle = "black"; // mort
            }
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }        
    }
}

function updateGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const nbSum = countNeighbors(i, j);
            gridNext[i][j] = rules(nbSum, gridCell[i][j]);
        }
    }

    // Copie de la grille suivante
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = gridNext[i][j];
        }
    }
}

function countNeighbors(x, y){
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i === 0 && j === 0)) {
                const col = (x + i + gridSize) % gridSize;
                const row = (y + j + gridSize) % gridSize;
                if (gridCell[col][row] === 1) {
                    sum++;
                }
            }
        }
    }
    return sum;
}

// Règles de Brian's Brain
function rules(nbSum, currentState) {
    if (currentState === 0 && nbSum === 2) {
        return 1; // De mort à vivant
    }
    if (currentState === 1) {
        return 2; // De vivant à réfractaire
    }
    if (currentState === 2) {
        return 0; // De réfractaire à mort
    }
    return currentState;
}

// Remplissage aléatoire
function randomDensity(){
    return Math.random() <= density.value/10 ? 1 : 0;
}

function randomise(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = randomDensity();
        }
    }
    readGrid();
}

function resetGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = 0;
        }
    }
    readGrid();
}

function gameStart(){
    if (!running) {
        running = true;
        interval = setInterval(() => {
            updateGrid();
            readGrid();
        }, 1000 / speed.value);
    }
}

function gameStop(){
    running = false;
    clearInterval(interval);
}

// Clic sur le canvas pour changer l'état de la cellule
function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    var pX = Math.floor(posX / cellSize);
    var pY = Math.floor(posY / cellSize);

    gridCell[pX][pY] = (gridCell[pX][pY] + 1) % 3; // Cycle 0 -> 1 -> 2 -> 0

    readGrid();
}

// Mise à jour de la vitesse si l'utilisateur bouge le slider pendant l'exécution
speed.addEventListener("input", () => {
    if (running) {
        clearInterval(interval);
        interval = setInterval(() => {
            updateGrid();
            readGrid();
        }, 1000 / speed.value);
    }
});

// Evenements
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

// Initialisation
initGrid();
readGrid();
