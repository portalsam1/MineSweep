/*/ MineSweep, 2021 portalsam. /*/
/*/ Default variables. /*/

var gridSizeX:number;
var gridSizeY:number;

var mines:number;
var flags:number;
var mineGrid:Array<Tile>[];

var firstMove:boolean = true;
var firstLaunch:boolean = true;
var hasLost:boolean = false;
var hasWon:boolean = false;
var gameActive:boolean = false;

var explodedMinePos:Array<Vector2D> = [];

/*/ List of standard minesweeper difficulties. /*/
const defaultLevels = {
  Easy: {
    Width: 9, Height: 9, Mines: 10,
  },
  Medium: {
    Width: 16, Height: 16, Mines: 40,
  },
  Hard: {
    Width: 30, Height: 16, Mines: 99,
  }
}

/**
 * Disables right-click context menu.
 * @returns False.
 */
document.oncontextmenu = function() { return false; }

function preload() {
  console.log("Info: Loading assets.");
  loadAssets();
}

function setup() {

  console.log("Info: Canvas ready.");
  createCanvas(windowWidth, windowHeight)
  rectMode(CENTER).noFill().frameRate(30);

  this.startGame();
  
  
}

function windowResized() {
  resizeCanvas(128 + (mineGrid.length * 32), (mineGrid[0].length * 32));
}

function draw() {
  
   // Clear.
  noSmooth();
  background(200);  

  if(gameActive) {
  drawMineGrid();
  checkMouseHover();
  
  if(allMinesFlagged()) {
    hasWon = true; 
    clearInterval(timer);
  } else hasWon = false;
  
  }

  drawExplodedMines();
  showUI();

}

/**
 * When left mouse button is pressed tile that is hovered over will darken even more. When right clicked, will flag the tile.
 * Will also check input for smiley.
 */
function mousePressed() {

  if(!hasLost || hasWon) {

    if(mouseButton == LEFT) {

      /*/ Tile. /*/
      for (var i = 0; i < gridSizeX; i++) {
        for (var j = 0; j < gridSizeY; j++) {
          if (mineGrid[i][j].mouseIsOver()) {
            mineGrid[i][j].beingPressed = true;
            smiley.smileySurprised = true;
          } 
        }
      }

    } else {
      if(!hasWon) {
        for (var i = 0; i < gridSizeX; i++) {
          for (var j = 0; j < gridSizeY; j++) {
            if (mineGrid[i][j].mouseIsOver()) {
              if(mineGrid[i][j].flagged) { mineGrid[i][j].flagged = false; flags++; } else if(!mineGrid[i][j].flagged && flags > 0) { mineGrid[i][j].flagged = true; flags--; }
          }
        }
      }
    }
  }

}

  /*/ Smiley. /*/
  if(smiley.mouseIsOver()) smiley.smileyPressed = true;
  
}

/**
 * When left mouse button is released, the tile will return to normal and be revealed if mouse is still over it.
 * Will also check input for smiley.
 */
function mouseReleased() {

  if(!hasLost || hasWon) {
    if (mouseButton == LEFT) {

      /*/ Tile. /*/
      for (var i = 0; i < gridSizeX; i++) {
        for (var j = 0; j < gridSizeY; j++) {
          if(mineGrid[i][j].beingPressed && (mineGrid[i][j].mouseIsOver())) {

            /*/ Make sure the first move is always safe, move the mine somewhere else if it's the players first click /*/
            if(firstMove && mineGrid[i][j].mine) {

              console.log("Info: Saved player from instant death. Moving mine.");
              mineGrid[i][j].mine = false;
              mineGrid[i][j].beingPressed = false;
              smiley.smileySurprised = false;
              mineGrid[i][j].reveal(true);

              this.addMines(1);
              firstMove = false;

              revealSound.play();

            } else if(firstMove) {
              
              //TODO No guess algorithm.
              
            } else {

              mineGrid[i][j].beingPressed = false;
              smiley.smileySurprised = false;
              mineGrid[i][j].reveal(false);
              firstMove = false;

              revealSound.play();

              /*/ If Tile revealed is a mine, player loses the game, reveal all mine tiles. /*/
              if(mineGrid[i][j].mine) {
              
                for (var i = 0; i < gridSizeX; i++) {
                  for (var j = 0; j < gridSizeY; j++) {
                      if(mineGrid[i][j].mine) mineGrid[i][j].reveal(true);
                  }
                }

                console.log("Info: Player has died.");
                clearInterval(timer);
                hasLost = true;

                explosionEvent();

              }
            }
          } else if(mineGrid[i][j].beingPressed) mineGrid[i][j].beingPressed = false; smiley.smileySurprised = false;
        }
      }
    }
  }

    /*/ Smiley. /*/
    if(smiley.smileyPressed && smiley.mouseIsOver()) {

      smiley.smileyPressed = false;
      clearInterval(timer);
      seconds = 0;
      startGame();
      
    } else if(smiley.smileyPressed) smiley.smileyPressed = false;

}

/**
 * Called when the game is started.
 */
function startGame() {

  gameActive = false;
  firstMove = true;
  hasLost = false;
  hasWon = false;
  inputError = false;
  explodeSound.stop(); explodedMinePos = [];
  
  console.log(`Info: New game is starting with board size of ${gridSizeX} by ${gridSizeY}, with ${mines} mines.`);

  if(firstLaunch) {
    setupUI();
    setDifficulty('easy');
    firstLaunch = false;
  } 

  /*/ Get user input for custom boards but catch errors. /*/
  try {
    
    /*/ If the board is larger than 30 by 24, or smaller than 9 by 9, invalidGame. /*/
    if((parseInt(widthInput.value() as string) > 30 || parseInt(heightInput.value() as string) > 24) ||
       (parseInt(widthInput.value() as string) < 9 || parseInt(heightInput.value() as string) < 9)) { invalidGame(); }

    gridSizeX = parseInt(widthInput.value() as string);
    gridSizeY = parseInt(heightInput.value() as string);

    /*/ If there are more mines than the board can handle, invalidGame. /*/
    if((parseInt(mineInput.value() as string) > ((gridSizeX * gridSizeY) - 2)) || parseInt(mineInput.value() as string) < 1) { invalidGame(); }

    mines = parseInt(mineInput.value() as string);

  } catch (invalidInput) {
    invalidGame();
  }

  flags = mines;

  mineGrid = createMineGrid(gridSizeX, gridSizeY);
  resizeCanvas(128 + (mineGrid.length * 32), (mineGrid[0].length * 32));
  
  for (var i = 0; i < mineGrid.length; i++){
    for (var j = 0; j < mineGrid[i].length; j++){
      mineGrid[i][j] = new Tile(i, j);
    }
  }

  addMines(mines);

  gameActive = true;

  /*/ Setup timers. /*/
  timer = setInterval(function() { seconds++; }, 1000);

}

/**
 * Creates a 2D with a specified width.
 * @param rows Width of mine grid.
 * @param cols Height of mine grid.
 * @returns Mine grid Tile 2D array.
 */
function createMineGrid(rows:number, cols:number):Array<Tile>[] {

  var array = new Array(rows);
  for(var i = 0; i < array.length; i++) {
    array[i] = new Array(cols);
  }
  return array;

}

/**
 * Adds a specified amount of mines to the already existing mine grid.
 * @param numOfMines Number of mines to add.
 */
function addMines(numOfMines:number):void {

  var count = 0;
  while(count < numOfMines) {

    var row = Math.floor(random(0, mineGrid.length));
    var col = Math.floor(random(0, mineGrid[0].length));

    if(!mineGrid[row][col].mine) {
      count++;
      mineGrid[row][col].mine = true;
    }

  }

}

/**
 * Draws the mine grid.
 */
function drawMineGrid():void {
  for (var i = 0; i < mineGrid.length; ++i) {
    var entry = mineGrid[i];
    for (var j = 0; j < entry.length; ++j) {
        entry[j].show();
    }
  }
}

/**
 * Will check if the player is hovering over a tile with their mouse and will update the tiles sprite if so.
 * Also will check if mouse is over smiley.
 */
function checkMouseHover():void {

  for (var i = 0; i < gridSizeX; i++) {
    for (var j = 0; j < gridSizeY; j++) {
      if (mineGrid[i][j].mouseIsOver()) {
        mineGrid[i][j].hovered = true;
      } else mineGrid[i][j].hovered = false;
    }
  }

  if(smiley.mouseIsOver()) smiley.smileyHovered = true; else smiley.smileyHovered = false;

}

/**
 * Sets the difficulty of the board to a predetermined value.
 * @param difficulty String value of the default difficulty.
 */
function setDifficulty(difficulty:string) {
  switch(difficulty) {
    case "easy":    widthInput.value(defaultLevels.Easy.Width); heightInput.value(defaultLevels.Easy.Height); mineInput.value(defaultLevels.Easy.Mines); break;
    case "medium":  widthInput.value(defaultLevels.Medium.Width); heightInput.value(defaultLevels.Medium.Height); mineInput.value(defaultLevels.Medium.Mines); break;
    case "hard":    widthInput.value(defaultLevels.Hard.Width); heightInput.value(defaultLevels.Hard.Height); mineInput.value(defaultLevels.Hard.Mines); break;
    default: break;
  }
}

/**
 * Function to trigger when there is an invalid custom board input.
 */
function invalidGame():void {
  inputError = true;
  setDifficulty('easy');
  console.log("Error: Player tried to make an invalid custom game.");
}

/**
 * Checks if all mines on the board have been flagged indicating a win.
 * @returns If all mines are flagged.
 */
function allMinesFlagged():boolean {

  for (var i = 0; i < gridSizeX; i++) {
    for (var j = 0; j < gridSizeY; j++) {
      if(mineGrid[i][j].mine && !mineGrid[i][j].flagged) return false;
    }
  }

  return true;

}

/**
 * Animation event for when the player loses.
 */
function explosionEvent():void {

  var locMineCount:number = 0;
  var locMinePositions:Array<Vector2D>;

  locMinePositions = [];

  for (var i = 0; i < gridSizeX; i++) {
    for (var j = 0; j < gridSizeY; j++) {
      if(mineGrid[i][j].mine && !mineGrid[i][j].flagged) {
        locMineCount++;
        locMinePositions.push(new Vector2D((mineGrid[i][j].x * 32) + 128, mineGrid[i][j].y * 32));
      }
    }
  }

  for (j = 0; j < locMineCount; j++) {
    (function(j) {
        setTimeout(function () {
          if(hasLost && gameActive) {
            explodeSound.play();
            image(explosionReference, locMinePositions[j].x, locMinePositions[j].y, 32, 32);
            for(var a = 0; a < locMinePositions.length; a++)
              explodedMinePos.push(locMinePositions[a]);
          }
        }, Math.floor(Math.random() * 1000));
      }
    )(j); 
  }​

}

/**
 * Draw the exploded mines in the explosion buffer.
 */
function drawExplodedMines() {

    for(var i = 0; i < explodedMinePos.length; i++) {
      explosionBuffer.image(explosionReference, explodedMinePos[i].x, explodedMinePos[i].y, 32, 32);
    }

}