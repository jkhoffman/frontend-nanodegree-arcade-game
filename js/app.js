/*
 * Enemies our player must avoid
 */

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.resetPositionSpeed();
};

Enemy.prototype.getX = function() {
    return this.x;
};

// Translate lane (yPos) into Y coordinate
Enemy.prototype.getY = function() {
    return this.yPos * 83 - 23;
};

// Start the enemy stage left, with a random lane and speed.
Enemy.prototype.resetPositionSpeed = function() {
    // start off-screen, stage left
    this.x = -101;

    // randomly choose a lane between 1 and 3.
    this.yPos = Math.floor((Math.random() * 3) + 1);

    // randomly choose a speed between 100 and 300.
    this.speed = Math.floor((Math.random() * 300) + 100);
};

// Update the enemy's position given delta time
Enemy.prototype.update = function(dt) {
    // move enemy relative to speed and time lapsed
    this.x = this.x + (this.speed * dt);

    // reset if off-screen
    if (this.x > 5 * 101) {
        this.resetPositionSpeed();
    }
};

// Detect and react to enemy collisions with player
Enemy.prototype.checkCollisions = function(dt) {
    // if in the same lane as the player
    if (this.yPos === player.yPos) {
        // ...and within +/- 30 pixels
        if ((this.x > player.getX() - 30) && (this.x < player.getX() + 30)) {
            // game over
            Engine.reset();
        }
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.getX(), this.getY());
};



/*
 * Gems, for extra points
 */

var Gem = function() {
    // randomly choose a row between 1 and 3
    this.yPos = Math.floor((Math.random() * 3) + 1);
    // randomly choose a column between 0 and 4
    this.xPos = Math.floor((Math.random() * 5));
};

// Translate column (xPos) into X coordinate
Gem.prototype.getX = function() {
    return this.xPos * 101;
};

// Translate lane (yPos) into Y coordinate
Gem.prototype.getY = function() {
    return this.yPos * 83 - 36;
};

Gem.prototype.update = function() {
    // do nothing
};

Gem.prototype.checkCollisions = function() {
    // if in the same lane as the player
    if (this.yPos === player.getYPos()) {
        // and the same cell
        if (this.xPos === player.getXPos()) {
            // add points
            player.addScore(this.score);

            // collision
            return true;
        }
    }
    // no collision
    return false;
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.getX(), this.getY());
};

var BlueGem = function() {
    Gem.call(this);
    this.sprite = 'images/gem-blue.png';
    this.score = 100;
};
BlueGem.prototype = Object.create(Gem.prototype);
BlueGem.prototype.constructor = BlueGem;

var GreenGem = function() {
    Gem.call(this);
    this.sprite = 'images/gem-green.png';
    this.score = 250;
};
GreenGem.prototype = Object.create(Gem.prototype);
GreenGem.prototype.constructor = GreenGem;

var OrangeGem = function() {
    Gem.call(this);
    this.sprite = 'images/gem-orange.png';
    this.score = 500;
};
OrangeGem.prototype = Object.create(Gem.prototype);
OrangeGem.prototype.constructor = OrangeGem;



/*
 * The Player
 */

var Player = function() {
    this.sprite = 'images/char-boy.png';
    // reset position and score
    this.reset();
};

// Reset position and score
Player.prototype.reset = function() {
    this.resetPosition();
    this.score = 0;
};

// Put the player in the starting position
Player.prototype.resetPosition = function() {
    // center
    this.setXPos(2);
    // bottom
    this.setYPos(5);
};

// Set the X position on the grid, making sure we stay on the board
Player.prototype.setXPos = function(xPos) {
    if (xPos < 0) {
        this.xPos = 0;
    } else if (xPos > 4) {
        this.xPos = 4;
    } else {
        this.xPos = xPos;
    }
};

Player.prototype.getXPos = function() {
    return this.xPos;
};

// Translate column (xPos) into X coordinate
Player.prototype.getX = function() {
    return this.xPos * 101;
};

// Set the Y position on the grid, making sure we stay on the board, and detect scoring
Player.prototype.setYPos = function(yPos) {
    // check to see if player scored
    if (yPos === 0) {
        this.resetPosition();
        this.score += 1000;
    } else if (yPos > 5) {
        this.yPos = 5;
    } else {
        this.yPos = yPos;
    }
};

Player.prototype.getYPos = function() {
    return this.yPos;
};

// Translate lane (yPos) into Y coordinate
Player.prototype.getY = function() {
    return this.yPos * 83 - 35;
};

Player.prototype.addScore = function(points) {
    this.score += points;
};

Player.prototype.update = function(dt) {
    // no per-frame updates for player
};

// Draw the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.getX(), this.getY());
};

// Handle keystrokes from keyup listener
Player.prototype.handleInput = function(keycode) {
    switch (keycode) {
        case 37: // left
            this.setXPos(this.xPos - 1);
            break;
        case 38: // up
            this.setYPos(this.yPos - 1);
            break;
        case 39: // right
            this.setXPos(this.xPos + 1);
            break;
        case 40: // down
            this.setYPos(this.yPos + 1);
            break;
    }
};

/*
 * Setup
 */

// Instantiate player object
var player = new Player();

// Listen for keys and delegate to the engine's input handler
document.addEventListener('keyup', function(e) {
    Engine.handleInput(e.keyCode);
});
