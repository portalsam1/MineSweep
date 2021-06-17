class Tile {

    x:number;
    y:number;

    neighborCount:number = 0;   

    mine:boolean = false;

    revealed:boolean = false;
    flagged:boolean = false;
    beingPressed:boolean = false;
    hovered:boolean = false;
    
    constructor(x:number, y:number) {

        this.x = x;
        this.y = y;

    }

    /**
     * Will display the tile based on if its revealed, hovered over, and if its a mine or number tile.
     */
    show():void {

        if(this.revealed) {

            if(this.mine) {
                image(mineTileSprite, (this.x * 32) + 128, this.y * 32, 32, 32);
            } else {
                image(this.getNumberSprite(this.neighborCount), (this.x * 32) + 128, this.y * 32, 32, 32);
            }
            
        } else if(this.flagged) {
            image(flagTileSprite, (this.x *32) + 128, this.y * 32, 32, 32);
        } else if(this.beingPressed) {
            image(clickedTileSprite, (this.x * 32) + 128, this.y * 32, 32, 32);
        } else if(this.hovered) {
            image(hoveredTileSprite, (this.x * 32) + 128, this.y * 32, 32, 32);
        } else image(tileSprite, (this.x * 32) + 128, this.y * 32, 32, 32);

    }

    /**
     * Reveal the Tile and get it's neighbors.
     */
    reveal(noFlood:boolean):void {

        this.revealed = true;
        this.getNeighbors();
        if(!noFlood) {if(this.neighborCount == 0 && !this.mine) this.floodReveal();}
    
    }

    /**
     * Reveal all valid tiles around this Tile.
     */
    floodReveal():void {

        for (var xoff = -1; xoff <= 1; xoff++) {
            var i = this.x + xoff;
            if (i < 0 || i >= gridSizeX) continue;
        
            for (var yoff = -1; yoff <= 1; yoff++) {
              var j = this.y + yoff;
              if (j < 0 || j >= gridSizeY) continue;
        
              var neighbor = mineGrid[i][j];
              if (!neighbor.revealed && !neighbor.mine) {
                neighbor.reveal(false);
              }
            }
        }
    }

    /**
     * Will check if the mouse is within bounds of this Tile.
     * @returns If mouse is within bounds of Tile.
     */
    mouseIsOver() {
        return (mouseX > (this.x * 32) + 128 && mouseX < (this.x * 32) + 160 && mouseY > (this.y * 32) && mouseY < (this.y * 32) + 32);
    }

    /**
     * Will return a revealed sprite based on how many neighbors given.
     * @param neighbors How many neighbors this tile has.
     * @returns Image of correct tile sprite.
     */
    getNumberSprite(neighbors:number):p5.Image {

        switch(neighbors) {

            case 1: return oneTileSprite;
            case 2: return twoTileSprite;
            case 3: return threeTileSprite;    
            case 4: return fourTileSprite;
            case 5: return fiveTileSprite;
            case 6: return sixTileSprite;
            case 7: return sevenTileSprite;
            case 8: return eightTileSprite;
    
            default: return emptyTileSprite;
    
        }

    }

    /** Get the amount of mines around this tile and update neighborCount. */
    getNeighbors():void {

        if (this.mine) this.neighborCount = 0; else {

        var total:number = 0;
        for (var xoff = -1; xoff <= 1; xoff++) {
            var i = this.x + xoff;
            if (i < 0 || i >= gridSizeX) continue;
        
            for (var yoff = -1; yoff <= 1; yoff++) {
              var j = this.y + yoff;
              if (j < 0 || j >= gridSizeY) continue;
        
              var neighbor = mineGrid[i][j];
              if (neighbor.mine) {
                total++;
              }
            }
          }
          this.neighborCount = total;

        }
    }

}