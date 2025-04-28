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

// 0 = vide, 1 = arbre, 2 = feu
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
            if (gridCell[i][j] === 1){
                ctx.fillStyle = "green"; // Arbre
            }
            else if (gridCell[i][j] === 2){
                ctx.fillStyle = "red"; // Feu
            }
            else {
                ctx.fillStyle = "black"; // Vide
            }
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}

function updateGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = gridCell[i][j];
            if (cell === 2) {
                gridNext[i][j] = 0; // Feu -> Vide
            } else if (cell === 1) {
                // Si au moins un voisin est en feu, l'arbre prend feu
                if (hasBurningNeighbor(i, j)) {
                    gridNext[i][j] = 2;
                } else {
                    gridNext[i][j] = 1;
                }
            } else {
                // Sol vide : avec une petite chance, un arbre pousse
                gridNext[i][j] = Math.random() < 0.01 ? 1 : 0;
            }
        }
    }
    [gridCell, gridNext] = [gridNext, gridCell];
}

function hasBurningNeighbor(x, y) {
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx !== 0 || dy !== 0) {
                const i = (x + dx + gridSize) % gridSize;
                const j = (y + dy + gridSize) % gridSize;
                if (gridCell[i][j] === 2) {
                    return true;
                }
            }
        }
    }
    return false;
}

function randomDensity(){
    const r = Math.random();
    if (r < density.value / 10) return 1; // arbre
    return 0; // vide
}

function randomise(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = randomDensity();
        }
    }
    // Quelques feux au hasard
    for (let k = 0; k < 10; k++) {
        gridCell[Math.floor(Math.random() * gridSize)][Math.floor(Math.random() * gridSize)] = 2;
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

speed.addEventListener("input", () => {
    if (running) {
        clearInterval(interval);
        interval = setInterval(() => {
            updateGrid();
            readGrid();
        }, 1000 / speed.value);
    }
});

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;
    const pX = Math.floor(posX / cellSize);
    const pY = Math.floor(posY / cellSize);

    gridCell[pX][pY] = 2; // Enflammer une cellule manuellement
    readGrid();
});

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

initGrid();
readGrid();
