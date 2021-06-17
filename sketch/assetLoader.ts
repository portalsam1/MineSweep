
let smileSprite:p5.Image;
let surpriseSprite:p5.Image;
let deadSprite:p5.Image;
let coolSprite:p5.Image;

let tileSprite:p5.Image;
let emptyTileSprite:p5.Image;
let hoveredTileSprite:p5.Image;
let clickedTileSprite:p5.Image;
let mineTileSprite:p5.Image;
let flagTileSprite:p5.Image;

let oneTileSprite:p5.Image;
let twoTileSprite:p5.Image;
let threeTileSprite:p5.Image;
let fourTileSprite:p5.Image;
let fiveTileSprite:p5.Image;
let sixTileSprite:p5.Image;
let sevenTileSprite:p5.Image;
let eightTileSprite:p5.Image;

let easyTileSprite:p5.Image;
let mediumTileSprite:p5.Image;
let hardTileSprite:p5.Image;

let explosionReference:p5.Image;

let minesweepFont:p5.Font;

let revealSound:p5.SoundFile;
let explodeSound:p5.SoundFile;

let explosionBuffer:p5.Graphics;

function loadAssets() {

    smileSprite = loadImage("/assets/game/face/SmileyFace.png");
    surpriseSprite = loadImage("/assets/game/face/SurprisedFace.png");
    deadSprite = loadImage("/assets/game/face/DeadFace.png");
    coolSprite = loadImage("/assets/game/face/CoolFace.png");

    tileSprite = loadImage("/assets/game/tile/Tile.png");
    emptyTileSprite = loadImage("/assets/game/tile/EmptyTile.png");
    hoveredTileSprite = loadImage("/assets/game/tile/TileHovered.png");
    clickedTileSprite = loadImage("/assets/game/tile/TileClicked.png");
    mineTileSprite = loadImage("/assets/game/tile/MineTile.png");
    flagTileSprite = loadImage("/assets/game/tile/FlagTile.png");

    oneTileSprite = loadImage("/assets/game/tile/OneTile.png");
    twoTileSprite = loadImage("/assets/game/tile/TwoTile.png");
    threeTileSprite = loadImage("/assets/game/tile/ThreeTile.png");
    fourTileSprite = loadImage("/assets/game/tile/FourTile.png");
    fiveTileSprite = loadImage("/assets/game/tile/FiveTile.png");
    sixTileSprite = loadImage("/assets/game/tile/SixTile.png");
    sevenTileSprite = loadImage("/assets/game/tile/SevenTile.png");
    eightTileSprite = loadImage("/assets/game/tile/EightTile.png");

    easyTileSprite = loadImage("/assets/game/tile/EasyTile.png");
    mediumTileSprite = loadImage("/assets/game/tile/MediumTile.png");
    hardTileSprite = loadImage("/assets/game/tile/HardTile.png");

    explosionReference = loadImage("/assets/game/explosion/explode.gif");

    minesweepFont = loadFont("assets/font/FORWARD.TTF");

    revealSound = loadSound("assets/sound/Reveal.mp3"); revealSound.setVolume(0.5);
    explodeSound = loadSound("assets/sound/Explode.mp3"); revealSound.setVolume(0.5);

    explosionBuffer = createGraphics(windowWidth, windowHeight);

}   