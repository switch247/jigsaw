var rows ;
var columns;

let pieces ;
let rotationAngles = {};
var level = 0;
const levelLimit = 3;
var currTile;
var otherTile;
var images = [];
var turns = 0;

const lev = document.getElementById("level");

const canvas = document.querySelector("canvas");

const ctx = canvas.getContext('2d');

window.onload = async function() {
    const board = document.createElement('div');
    board.id = 'board';
    //   canvas.style.position = 'relative';
    canvas.appendChild(board);

   await initBoard();

}




async function initBoard() {
    levelimage();
    currTile =null;
    otherTile = null;
    rotationAngles = {};
    lev.innerHTML=level;
    const gridInfo = await findGrid(level);
    rows = gridInfo.rows;
    columns = gridInfo.columns;
    // console.log(rows, columns);
    images = [];
    //initialize the rxc board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //<img>
            let tile = document.createElement("img");
            tile.src = "images/blank.jpg";
            images.push(tile);
            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on image to drag
            tile.addEventListener("dragover", dragOver);   //drag an image
            tile.addEventListener("dragenter", dragEnter); //dragging an image into another one
            tile.addEventListener("dragleave", dragLeave); //dragging an image away from another one
            tile.addEventListener("drop", dragDrop);       //drop an image onto another one
            tile.addEventListener("dragend", dragEnd);      //after you completed dragDrop

            document.getElementById("board").append(tile);
        }
    }
    images.forEach((image, index) => {
        const imageId = `image_${index}`;
        rotationAngles[imageId] = 0;
        image.setAttribute('data-image-id', imageId);
        image.addEventListener('dblclick', rotateImage);
      });
    //pieces
    pieces = [];

    for (let i=1; i <= rows*columns; i++) {
        pieces.push(i.toString()); //put "1" to "25" into the array (puzzle images names)
    }

    // shufflePiece(pieces);

    fillPiece(pieces);


    const board = document.getElementById('board');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');


    const boardRect = board.getBoundingClientRect();
    console.log(boardRect)
    
    canvas.style.left = boardRect.left +'px';
    canvas.style.top = boardRect.top +'px';

    canvas.width = boardRect.width;
    canvas.height = boardRect.height;

    // canvas.width = board.offsetWidth;
    // canvas.height = board.offsetHeight;

    // const firstChild = board.firstElementChild;
    // const firstChildRect = firstChild.getBoundingClientRect();
    // // const boardRect = board.getBoundingClientRect();
    // const canvasLeft = firstChildRect.left - boardRect.left;
    // const canvasTop = firstChildRect.top - boardRect.top;

    // canvas.style.left = canvasLeft+'px';
    // //  + 'px';
    // canvas.style.top = canvasTop + 'px';
    //  + 'px';

    const cellWidth = canvas.width / columns;
    const cellHeight = canvas.height / rows;

    // Draw borders for each cell
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = (col * cellWidth);
        const y = (row * cellHeight) ;

        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    }
}

function fillPiece(pieces) {

    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.src = "images/"+ level+"/" + pieces[i] + ".jpg";

        //DRAG FUNCTIONALITY
        tile.addEventListener("dragstart", dragStart); //click on image to drag
        tile.addEventListener("dragover", dragOver);   //drag an image
        tile.addEventListener("dragenter", dragEnter); //dragging an image into another one
        tile.addEventListener("dragleave", dragLeave); //dragging an image away from another one
        tile.addEventListener("drop", dragDrop);       //drop an image onto another one
        tile.addEventListener("dragend", dragEnd);      //after you completed dragDrop

        document.getElementById("pieces").append(tile);
    }
}

function shufflePiece(pieces) {
    pieces.reverse();
    for (let i =0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        //swap
        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
    }
}

function unShufflePiece(pieces) {
    
    pieces.sort((a, b) => Number(a) - Number(b));
    
}

function clickImagesRandomly() {
    images.forEach((image) => {
      const randomClicks = Math.floor(Math.random() * 4); // Generate a random number between 0 and 3
      for (let i = 0; i < randomClicks; i++) {
        image.dispatchEvent(new Event('dblclick')); // Simulate a double-click event
      }
    });
  }

// 1 6  11 16 21
// 2 7  12 17 22
// 3 8  13 18 23
// 4 9  14 19 24
// 5 10 15 20 25
// haven't decided yet
// 1  2  3  4  5
// 6  7  8  9  10
// 11 12 13 14 15
// 16 17 18 19 20
// 21 22 23 24 25

//DRAG TILES
function dragStart() {
    currTile = this; //this refers to image that was clicked on for dragging
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; //this refers to image that is being dropped on
}

function dragEnd() {
    if (currTile.src.includes("blank") ||currTile===otherTile ) {
        if (currTile===otherTile){
            rotateImage(currTile);}
        return;
    }
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;

    turns += 1;
    document.getElementById("turns").innerText = turns;


    if (checkWin()) {
        popup();
        // alert("You win!");
        level += 1;
        if (level==levelLimit){level=0}
        resetGame();
    }

}

function rotateImage(event) {
    const image = event.target;
    const imageId = image.getAttribute('data-image-id');
    rotationAngles[imageId] += 90;
    image.style.transform = `rotate(${rotationAngles[imageId]}deg)`;
  }


function checkWin() {
    let boardImages = document.getElementById("board").getElementsByTagName("img");
    for (let i = 0; i < boardImages.length; i++) {
        let expectedImg = "images/" + level + "/" + (i + 1) + ".jpg";
        // console.log(boardImages[i].src.split("/").slice(4).join('/'), expectedImg.split("/").slice(1).join('/') );
        if (boardImages[i].src.split("/").slice(4).join('/')!== expectedImg.split("/").slice(1).join('/')) {
            // console.log(boardImages[i].src.split("/").slice(3).join('/'), expectedImg.split("/").slice(1).join('/'))
            console.log("no")
            return false;
        }
    }
    console.log('yes')
    return true;
}

async function resetGame() {
    // Reset the game for the next level
    
    turns = 0;
    document.getElementById("turns").innerText = turns;
    // Increase the level and update the grid
    // level += 1;
    removeAllChildren( document.getElementById("board"));
    removeAllChildren( document.getElementById("pieces"));
    
    await initBoard();
}


function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}


// const fs = require('fs');
// const path = require('path');

// async function getFileCount(folderPath) {
//   return new Promise((resolve, reject) => {
//     fs.readdir(folderPath, (err, files) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(files.length);
//       }
//     });
//   });
// }


async function findGrid(level) {
    const folderPath = `./images/${level}`; // Replace with the actual folder path

    try {
        
        // const response = await getFileCount(folderPath);
        const response = await fetch(folderPath);
        const data = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');
        const files = Array.from(htmlDoc.querySelectorAll('a')).map(a => a.getAttribute('href'));

        const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.gif'));

        // const folder = await getFolder(folderPath);
        // const files = await getFilesFromFolder(folder);
        // const imageFiles = files.filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.gif'));



        const columns = Math.sqrt(imageFiles.length);
        const rows = Math.sqrt(imageFiles.length);
        gridTemplateColumns = "repeat(" + columns + ", 1fr)";
        
        gridTemplateRows = "repeat(" + rows + ", 1fr)";
        document.getElementById("board").style.gridTemplateColumns = gridTemplateColumns;
        document.getElementById("board").style.gridTemplateRows = gridTemplateRows;
        // console.log(`Total number of image files: ${imageFiles.length}`);
        // drawGrid('canvas', rows, columns, 81);
        return { rows, columns };
    } catch (error) {
        console.error('Error fetching folder content:', error);
        return { rows: 0, columns: 0 };
    }
}


function drawGrid(canvasId, rows, columns, width) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Calculate the size of each cell
    const cellWidth = width / columns;
    const cellHeight = width / rows;

    // Set the canvas size based on the provided width
    canvas.width = width;
    canvas.height = width;

    // Draw the grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = col * cellWidth;
        const y = row * cellHeight;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    }
  }

  // Generate a 5x5 grid with a width of 400 pixels
  


function popup(){
    try {
        
        swal("Good Job", "You Cleared The Level!","success");
    } catch (error) {
        alert("Good Job You Cleared The Level! success")
    }
}


function clearBoard(){
    removeAllChildren( document.getElementById("board"));
    images = [];
    //initialize the rxc board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //<img>
            let tile = document.createElement("img");
            tile.src = "images/blank.jpg";
            images.push(tile);
            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on image to drag
            tile.addEventListener("dragover", dragOver);   //drag an image
            tile.addEventListener("dragenter", dragEnter); //dragging an image into another one
            tile.addEventListener("dragleave", dragLeave); //dragging an image away from another one
            tile.addEventListener("drop", dragDrop);       //drop an image onto another one
            tile.addEventListener("dragend", dragEnd);      //after you completed dragDrop

            document.getElementById("board").append(tile);
        }
    }

    images.forEach((image, index) => {
        const imageId = `image_${index}`;
        rotationAngles[imageId] = 0;
        image.setAttribute('data-image-id', imageId);
        image.addEventListener('dblclick', rotateImage);
      });

}


// dificulty adjester


const difficultySelect = document.getElementById('difficulty-select');

difficultySelect.addEventListener('change', handleDifficultyChange);

function handleDifficultyChange(event) {
  const selectedDifficulty = event.target.value;
  
  if (selectedDifficulty === 'easy') {
    turns=0;
    document.getElementById("turns").innerText = turns;

    clearBoard();
    console.log('Easy difficulty chosen');
    removeAllChildren( document.getElementById("pieces"));
    
    unShufflePiece(pieces);
    console.log(pieces)
    fillPiece(pieces);
    // Perform actions specific to the easy difficulty level
  } else if (selectedDifficulty === 'medium') {
    turns=0;
    document.getElementById("turns").innerText = turns;

    clearBoard();

    removeAllChildren( document.getElementById("pieces"));
    shufflePiece(pieces);
    fillPiece(pieces);
    console.log('Medium difficulty chosen');
    console.log(pieces)


  } else if (selectedDifficulty === 'hard') {
        turns=0;
        document.getElementById("turns").innerText = turns;
        clearBoard();

        removeAllChildren( document.getElementById("pieces"));
        
        shufflePiece(pieces);
        
        fillPiece(pieces);

        console.log('Hard difficulty chosen');
        console.log(pieces)
        clickImagesRandomly();


  }
}











const openModalButton = document.getElementById('openModalButton');
const modal = document.getElementById('myModal');
const closeButton = document.getElementsByClassName('close')[0];

openModalButton.addEventListener('click', () => {
  modal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});




const openModalButton2 = document.getElementById('openModalButton2');
const modal2 = document.getElementById('myModal2');
const closeButton2 = document.getElementsByClassName('close')[1];

openModalButton2.addEventListener('click', () => {
  modal2.style.display = 'block';
});

closeButton2.addEventListener('click', () => {
  modal2.style.display = 'none';
});

function levelimage(){


im = document.getElementById("levelImage")
im.src= 'images/'+ level+'.jpg';
im.style.width = "100%";

}