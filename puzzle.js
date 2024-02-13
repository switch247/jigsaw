var rows ;
var columns;

let pieces ;

var level = 0;
const levelLimit = 3;
var currTile;
var otherTile;

var turns = 0;


window.onload = async function() {
   await initBoard();

}

async function initBoard() {
    const gridInfo = await findGrid(level);
    rows = gridInfo.rows;
    columns = gridInfo.columns;
    // console.log(rows, columns);

    //initialize the rxc board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //<img>
            let tile = document.createElement("img");
            tile.src = "images/blank.jpg";

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

    //pieces
    pieces = [];

    for (let i=1; i <= rows*columns; i++) {
        pieces.push(i.toString()); //put "1" to "25" into the array (puzzle images names)
    }

    // shufflePiece(pieces);

    fillPiece(pieces);
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
    if (currTile.src.includes("blank")) {
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
        
        return { rows, columns };
    } catch (error) {
        console.error('Error fetching folder content:', error);
        return { rows: 0, columns: 0 };
    }
}


function popup(){
    swal("Good Job", "You Cleared The Level!","success");
}




