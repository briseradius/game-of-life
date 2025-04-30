const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gridSize = 100;
const cellSize = canvas.width / gridSize;
const gridCell = [];
const gridUpdate = [];
const nbArray = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1]
];

const start = document.getElementById("start");
const stoped = document.getElementById("stop");
const random = document.getElementById("random");
const density = document.getElementById("density");
const speed = document.getElementById("speed");
const reset = document.getElementById("reset");

let mainLoop = null;

function initGrid() {
  for (let i = 0; i < gridSize; i++) {
    gridCell[i] = [];
    gridUpdate[i] = [];
    for (let j = 0; j < gridSize; j++) {
      gridCell[i][j] = 0;
      gridUpdate[i][j] = 0;
    }
  }
}

function readGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      ctx.fillStyle = gridCell[i][j] === 1 ? "#C60000" : "black";
      ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

function updateGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const currentState = gridCell[i][j];
      const nbSum = countNeighbours(i, j);
      gridUpdate[i][j] = applyRules(nbSum, currentState);
    }
  }
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      gridCell[i][j] = gridUpdate[i][j];
    }
  }
}

function countNeighbours(x, y) {
  let count = 0;
  for (const [dx, dy] of nbArray) {
    count += getCellState(x + dx, y + dy);
  }
  return count;
}

function getCellState(x, y) {
  if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) return 0;
  return gridCell[x][y];
}

function applyRules(nbSum, currentState) {
  return +(nbSum === 3 || (currentState === 1 && nbSum === 2));
}

function randomDensityValue() {
  return Math.random() <= density.value / 10 ? 1 : 0;
}

function randomiseGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      gridCell[i][j] = randomDensityValue();
    }
  }
  readGrid();
}

function toggleCell(x, y) {
  gridCell[x][y] = gridCell[x][y] ? 0 : 1;
  ctx.fillStyle = gridCell[x][y] ? "#C60000" : "#F7D000";
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function getMousePosition(e) {
  const rect = canvas.getBoundingClientRect();
  const posX = e.clientX - rect.left;
  const posY = e.clientY - rect.top;
  const x = Math.floor(posX / cellSize);
  const y = Math.floor(posY / cellSize);
  toggleCell(x, y);
}

canvas.addEventListener("click", getMousePosition);

start.addEventListener("click", () => {
  if (mainLoop === null) {
    mainLoop = setInterval(() => {
      updateGrid();
      readGrid();
    }, 1000 / speed.value);
  }
});

stoped.addEventListener("click", () => {
  clearInterval(mainLoop);
  mainLoop = null;
});

random.addEventListener("click", randomiseGrid);

reset.addEventListener("click", () => {
  initGrid();
  readGrid();
});

initGrid();
randomiseGrid();
readGrid();
