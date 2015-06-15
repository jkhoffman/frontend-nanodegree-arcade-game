/*
 * The title screen
 */
var TitleScreenState = {

    titleMusic: new Howl({
        src: ['sounds/title.ogg'],
        volume: 0.5
    }),

    enter: function() {
        this.titleMusic.play();
    },

    leave: function() {
        this.titleMusic.stop();
    },

    update: function() {
        // do nothing
    },

    render: function() {
        GameState.renderBackground();
        this.renderTitleScreen();
    },

    renderTitleScreen: function() {
        ctx.drawImage(Resources.get('images/title-screen.png'), 50, 65);
    },

    handleInput: function() {
        Engine.enterState(GameState);
    }

};



/*
 * The game
 */
var GameState = {

    levelStartMusic: new Howl({
        src: ['sounds/level_start.ogg'],
        volume: 0.5
    }),

    allEnemies: [],

    allGems: [],

    enter: function() {
        player.reset();

        this.allEnemies = [new Enemy(), new Enemy(), new Enemy()];

        this.allGems = [new BlueGem(), new GreenGem(), new OrangeGem()];
        // Sort gems for correct draw order (back to front)
        this.allGems.sort(function(a, b) {
            if (a.yPos > b.yPos) {
                return 1;
            } else if (a.yPos < b.yPos) {
                return -1;
            } else {
                return 0;
            }
        });

        this.levelStartMusic.play();
    },

    leave: function() {
        this.levelStartMusic.stop();
    },

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    update: function(dt) {
        this.updateEntities(dt);
        this.checkCollisions(dt);
    },

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    updateEntities: function(dt) {
        this.allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        this.allGems.forEach(function(gem) {
            gem.update();
        });
        player.update();
    },

    checkCollisions: function(dt) {
        this.allEnemies.forEach(function(enemy) {
            enemy.checkCollisions(dt);
        });
        var self = this;
        this.allGems.forEach(function(gem) {
            if (gem.checkCollisions(dt)) {
                self.allGems.splice(self.allGems.indexOf(gem), 1);
            }
        });
    },
    
    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    render: function() {
        this.renderBackground();
        this.renderEntities();
        this.renderScore();
    },

    renderBackground: function() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
    },

    renderEntities: function() {
        this.allGems.forEach(function(gem) {
            gem.render();
        });
        this.allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
    },

    renderScore: function() {
        var scoreText = 'SCORE: ' + player.score;
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24pt Impact';
        ctx.fillText(scoreText, 12, canvas.height - 28);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(scoreText, 12, canvas.height - 28);
    },

    handleInput: function(keycode) {
        player.handleInput(keycode)
    }

};