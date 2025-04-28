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
            const brightness = Math.floor(gridCell[i][j] * 255);
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}

function updateGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const sum = countNeighbors(i, j);
            const current = gridCell[i][j];

            if (sum > 2.0 && sum < 3.3) {
                gridNext[i][j] = Math.min(1, current + 0.1);
            } else {
                gridNext[i][j] = Math.max(0, current - 0.1);
            }
        }
    }
    [gridCell, gridNext] = [gridNext, gridCell];
}

function countNeighbors(x, y){
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const col = (x + i + gridSize) % gridSize;
            const row = (y + j + gridSize) % gridSize;
            if (!(i === 0 && j === 0)) {
                sum += gridCell[col][row];
            }
        }
    }
    return sum;
}

function randomDensity(){
    return Math.random() < density.value/10 ? 1 : 0;
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

    gridCell[pX][pY] = 1; // Remplir la cellule
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
