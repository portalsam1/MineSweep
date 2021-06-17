/**
 * Smiley acts as a game status and a restart button.
 */
 class Smiley {

    x:number; y:number;

    smileyHovered:boolean = false;
    smileyPressed:boolean = false;
    smileySurprised:boolean = false;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Draw Smiley with current state.
     */
    show() {

        /*/ Draw Smiley background. /*/
        if(this.smileyPressed) {
            image(clickedTileSprite, this.x, this.y, 24, 24);
        } else if(this.smileyHovered) {
            image(hoveredTileSprite, this.x, this.y, 24, 24);
        } else {
            image(tileSprite, this.x, this.y, 24, 24);
        }

        /*/ Draw Smiley. /*/
        if(hasWon) {
            image(coolSprite, this.x, this.y, 24, 24);
        } else if(hasLost) {
            image(deadSprite, this.x, this.y, 24, 24);
        } else if(this.smileySurprised) {
            image(surpriseSprite, this.x, this.y, 24, 24);
        } else {
            image(smileSprite, this.x, this.y, 24, 24);
        }

    }

    /**
     * Will check if the mouse is within bounds of Smiley.
     * @returns If mouse is within bounds of Smiley.
     */
     mouseIsOver() {
        return (mouseX > this.x && mouseX < this.x + 24 && mouseY > this.y && mouseY < this.y + 24);
    }

}

/**
 * Utility class that stores 2 numbers.
 */
class Vector2D {

    x:number; y:number;

    constructor(x:number, y:number) {
        this.x = x; this.y = y;
    }
    
}

var seconds:number = 0;
var timer:number;

var inputError:boolean = false;

const smiley = new Smiley(50, 40);

var easyButton:p5.Element;
var mediumButton:p5.Element;
var hardButton:p5.Element;

var widthInput:p5.Element;
var heightInput:p5.Element;
var mineInput:p5.Element;

/**
 * Formats into time.
 * @param value Number to parse.
 * @returns Formatted numbers.
 */
function pad (value:number) { return value > 9 ? value : "0" + value; }

/**
 * Setup UI.
 */
function setupUI():void {

    widthInput = createInput(); heightInput = createInput(); mineInput = createInput();
    widthInput.value(gridSizeX); heightInput.value(gridSizeY); mineInput.value(mines);

    widthInput.style('font-family', 'FFF Forward'); widthInput.style('color', '#ffffff'); widthInput.style('background-color', '#000000'); widthInput.style('text-align', 'center');
    heightInput.style('font-family', 'FFF Forward'); heightInput.style('color', '#ffffff'); heightInput.style('background-color', '#000000'); heightInput.style('text-align', 'center');
    mineInput.style('font-family', 'FFF Forward'); mineInput.style('color', '#ffffff'); mineInput.style('background-color', '#000000'); mineInput.style('text-align', 'center');

    easyButton = createButton('E'); mediumButton = createButton('M'); hardButton = createButton('H');
    easyButton.position(12, 244); mediumButton.position(51, 244); hardButton.position(90, 244);
    easyButton.size(24, 24); mediumButton.size(24, 24); hardButton.size(24, 24);
    easyButton.style('font-family', 'FFF Forward'); easyButton.style('color', '#2dd635'); easyButton.style('background-color', '#a1a1a1'); 
    mediumButton.style('font-family', 'FFF Forward'); mediumButton.style('color', '#f59733'); mediumButton.style('background-color', '#a1a1a1'); 
    hardButton.style('font-family', 'FFF Forward'); hardButton.style('color', '#f53333'); hardButton.style('background-color', '#a1a1a1'); 
    easyButton.mousePressed(easyButtonFunction); mediumButton.mousePressed(mediumButtonFunction); hardButton.mousePressed(hardButtonFunction);

}

/**
 * Draw the game sidebar UI.
 */
function showUI():void {

    /*/ Draw title. /*/
    textAlign(LEFT);
    stroke(160);
    textFont(minesweepFont);
    textSize(14);
    fill(0);
    text("MineSweep", 12, 32);

    smiley.show();

    /*/ Score. /*/
    noStroke();
    fill(16);

    textSize(10);
    stroke(160);
    line(12, 68, 116, 68);

    /*/ Timer. /*/
    fill(16);
    stroke(160, 0, 0);
    rect(64, 84, 104, 24);
    fill(245, 0, 0);
    noStroke();
    text(`Time: ${pad(Math.floor(seconds / 60))}:${pad(seconds%60)}`, 16, 90);

    /*/ Mines and Flags. /*/
    fill(16);
    stroke(160, 0, 0);
    rect(64, 116, 104, 24);
    fill(245, 0, 0);
    noStroke();
    if(!inputError) {
        if(hasWon) text("You won!", 16, 122);
        else if(hasLost) text("Dead!", 16, 122);
        else text(`M: ${mines}, F: ${flags}`, 16, 122);
    } else text("Invalid Input!", 16, 122);

    stroke(160);
    line(12, 133, 116, 133);

    /*/ Custom game input. /*/
    fill(0);
    textSize(8);
    noStroke();
    text("Custom Game: ", 12, 146);
    text("Width, Height, Mines.", 12, 164);

    textAlign(CENTER);
    widthInput.position(12, 170); widthInput.size(54, 24); 
    heightInput.position(64, 170); heightInput.size(54, 24);
    mineInput.position(12, 194); mineInput.size(106, 24);
    textAlign(LEFT);

    text("Smiley to reset :)", 12, 234);

    stroke(160);
    line(12, 240, 116, 240);

    textSize(7);
    fill(210)
    textAlign(CENTER);
    text("portalsam, 2021", 64, 10);

}

function easyButtonFunction() {
    setDifficulty('easy');
    clearInterval(timer);
      seconds = 0;
      startGame();
}

function mediumButtonFunction() {
    setDifficulty('medium');
    clearInterval(timer);
      seconds = 0;
      startGame();
}

function hardButtonFunction() {
    setDifficulty('hard');
    clearInterval(timer);
      seconds = 0;
      startGame();
}