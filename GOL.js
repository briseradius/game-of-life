
// ctx.moveTo(1000,1000);
// ctx.lineTo(500,0);
// ctx.stroke();

// ctx.moveTo(0,1000);
// ctx.lineTo(500,0);
// ctx.stroke();

// for (let i = 0; i < 1000; i+=50 ){
//     ctx.moveTo(i,0);
//     ctx.lineTo(i,1000);
//     ctx.stroke();
//     ctx.moveTo(0,i);
//     ctx.lineTo(1000,i);
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.arc(500, 500, i, 0, 2 * Math.PI);
//     ctx.stroke();
//ctx.fillRect(rand(1000),rand(1000),cellSize,cellSize);
//ctx.fillRect(rand(1000),rand(1000),10,10);
//}
//function rand(max) {
//     return Math.floor(Math.random() * max);
//   }
  


// for (let i = 0; i < 5000; i++) {
//     gridCell[Math.floor(Math.random()*gridSize)][Math.floor(Math.random()*gridSize)] = 1;
//   }
const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const gridCell = [];
const gridUpdate = [];
const gridSize = 100;
const cellSize = canvas.width / gridSize;
var mainLoop = null;
const nbArray=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
var start = document.getElementById("start");
var stoped = document.getElementById("stop");
var random = document.getElementById("random");
var density = document.getElementById("density");
var speed = document.getElementById("speed");
var reset = document.getElementById("reset");
//creation de la grille et grille de Maj
  //initialisation tableau avec deux boucle for avec toutes les celulles morte
  function initGrid(){
    for (let i = 0; i < gridSize; i++) {
        gridCell[i]= [];
        gridUpdate[i]=[];
        for (let j = 0; j < gridSize; j++){
            gridCell[i][j] = 0;
            gridUpdate[i][j] = 0;
        }       
    }
}
function resetGrid(){
    reset.addEventListener('click',function(){
        initGrid();
        readGrid();
    })
}
//dessins des cellules
  //lecture de la grille avec deux boucle for
function readGrid(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if(gridCell[i][j] === 1){
                ctx.fillStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                //ctx.fillStyle = "#C60000";
                //ctx.fillStyle = "white";
            }
            else{
                //ctx.fillStyle = "#F7D000";
                ctx.fillStyle = "black";
            }
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }        
    }
}
    function gameStart(){
        start.addEventListener('click', function(){
            if(mainLoop === null){
             mainLoop = setInterval(function(){
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    let state = gridCell[i][j];
                    let neightboursSum = numberNeighbours(i, j)
                    let isAlive = rules(neightboursSum, state);
                    gridUpdate[i][j] = isAlive;
                }
            }
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    gridCell[i][j] = gridUpdate[i][j];   
                }           
            }
            readGrid();
        },speed.value * 10);
    }})
}
function gameStop() {
    stoped.addEventListener("click", function(){
        clearInterval(mainLoop);
        mainLoop = null;
    })
    
}
function numberNeighbours(cellx, celly){
    let count = 0;
    nbArray.forEach(nb=>{
        count += getNeighbours(cellx + nb[0],celly + nb[1]);
    });
    return count;
    // count += gridCell[cellx -1][celly -1];
    // count += gridCell[cellx -1][celly];
    // count += gridCell[cellx -1][celly+1];
    // count += gridCell[cellx][celly +1];
    // count += gridCell[cellx + 1][celly +1];
    // count += gridCell[cellx + 1][celly];
    // count += gridCell[cellx + 1][celly -1];
    // count += gridCell[cellx][celly -1];
}
function getNeighbours(x,y){
    try{
        return gridCell[x][y];
    }
    catch{
        return 0;
    }
}
function randomise(){random.addEventListener('click',function(){
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            gridCell[i][j] = randomDensity();
        }
    }
    readGrid()
})}
function randomDensity(){
    return Math.random() <= density.value/10 ? 1: 0
}
  //verification de chaque position si elle est vivante ou morte
  //si oui on dessine en noir sinon un carré blanc
//   function rules(nbsSum, currentState){
//     if(currentState === 0 && nbsSum === 3){
//         return 1;
//     }
//     if(currentState === 1 && nbsSum === 2 || nbsSum === 3){
//         return 1;
//     }
//     else{
//         return 0;
//     }
//   }
function rules(nbSum, currentState) {
    return +(nbSum===3 || (currentState===1 && nbSum===2))
  }
  
  stoped.addEventListener('click',function(){
      var pause = true;
      
  })
//creer la boucle principale
  //avent listener bouton start || stop
  //mise en place setInterval() les calcule se feront dedans 

//lecture de la grille pour le calcule
  //a chaque position lecture de l'etat des 8 cellule voisine
  //on additionne l'etat des cellules
  //on determine avec le resultat l'etat de la celllule



//mise en place des boutons
  //on lie les boutons a un ecouteur d'evenement
    //start
    //stop
    //randoms

//mise en place du pinceau
  //event listener pour la souris.

//creer des outils de debugage
  //creation d'un affichage des coordonné de la grille /pointeur souris
  //affichage des seules cellules qui changent d'etat
  function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    // var cX = e.offsetX;
    // var cY = e.offsetY;
            var posX = e.clientX - rect.left;
            var posY = e.clientY - rect.top;
            var pX = Math.floor(posX / cellSize);
            var pY = Math.floor(posY / cellSize);
    console.log(e);
    if(gridCell[pX][pY] === 1){

        gridCell[pX][pY] = 0;
        ctx.fillStyle = "#F7D000";
    }
    else{
        gridCell[pX][pY] = 1;
        ctx.fillStyle = "#C60000";
    }

    ctx.fillRect((Math.floor(posX/cellSize))*cellSize, (Math.floor(posY/cellSize))*cellSize, cellSize, cellSize);
  } 

canvas.addEventListener('click', function(e){ 
    getMousePosition(e);
});

    // random.addEventListener('click', function(){
    //     randomise();
    // });
    // start.addEventListener('click', function(){
    //     gameStart();
    // });
//   gridCell[50][50];
//   gridCell[51][50];
//   gridCell[50][51];
//   gridCell[49][51];
//   gridCell[50][52];
//   readGrid();
    initGrid();
    randomise();
    gameStart();
    gameStop()
    resetGrid();

    
