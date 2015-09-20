/* Engine.js
 * Credit - Udacity
 * Modifications have been made to include various features of the game
 */

var Engine = (function (global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        canvasContainer = doc.getElementById("canvas-container");

    var start = doc.getElementById("start-button");
    var stop = doc.getElementById("stop-button");
    var stopClick = false;

    canvas.width = 505;
    canvas.height = 606;
    canvasContainer.appendChild(canvas);

    /*
    * @description Main driver function that reacts to start and stop events
    *              of the game
    */
    function main() {
        start.onclick = function () {
            stopClick = false;
            play();
        };

        stop.onclick = function () {
            stopClick = true;
            reset();
        };
    }

    /*
    * @description Initializes the game
    */
    function init() {
        lastTime = Date.now();
        render();
        main();
    }

    /*
    * @description Used to update all the enemy and player object
    *              It calls the respective functions to update
    *              their positions
    */
    function update(dt) {
        updateEntities(dt);
    }

    /*
    * @description Helper function that calls the respective functions of
    *              object to update their positions
    */
    function updateEntities(dt) {
        var collision;
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        collision = checkCollision(player);

        player.update(dt, collision);
    }

    /*
    * @description Checks for collisions betweeen the player and the
    *              enemies. It checks the enemies that are in the same
    *              row as the player
    * @param {object} player
    */
    var checkCollision = function (player) {
        var enemies;
        if (player.y < 100) {
            enemies = enemyPositions.ROW1;
            enemies.forEach(function (enemy) {
                if (compareDistance(player, enemy)) {
                    return true;
                }
            });
        } else if (player.y < 200) {
            enemies = enemyPositions.ROW2;
            enemies.forEach(function (enemy) {
                if (compareDistance(player, enemy)) {
                    return true;
                }
            });
        } else {
            enemies = enemyPositions.ROW3;
            enemies.forEach(function (enemy) {
                if (compareDistance(player, enemy)) {
                    return true;
                }
            });
        }
    }

    /*
    * @description Helper function for checkCollision. Determines
    *              collisions by checking the difference in x values
    * @param {object} player
    * @param {object} enemy
    */
    var compareDistance = function (player, enemy) {
        if (Math.abs(enemy.x - player.x) < 50 && player.y < 300) {
            player.y = 398;
            return true;
        }
    }

    /*
    * @description Renders the game canvas
    */
    function render() {
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

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /*
    * @description Renders the enemy and player objects
    */
    function renderEntities() {
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();
    }

   /*
    * @description Resets the postions of the player and enemy objects
    */
    function reset() {
        allEnemies.forEach(function (enemy) {
            enemy.resetPosition();
        });

        player.resetPosition();
    }

    /*
    * @description Starts the game and calls the function recursively to
    *              render the updated postions of the enemy and player
    */
    function play() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();

        /* Update lastTime for the next invocation of play */
        lastTime = now;

        if (!stopClick) {
            win.requestAnimationFrame(play);
        }
    }

    /* Handles to the rules, avatar and the modal cancel buttons */
    var rules = doc.getElementById("rules-button");
    var avatar = doc.getElementById("avatar-button");
    var rulesCancel = doc.getElementById("rules-cancel");
    var avatarCancel = doc.getElementById("avatar-cancel");

    rules.addEventListener("click", displayRules);
    avatar.addEventListener("click", displayAvatars);
    rulesCancel.addEventListener("click", closeRules);
    avatarCancel.addEventListener("click", closeAvatar);

    /*
    * @description Displays the modal popup for the rules
    */
    function displayRules() {
        var modal = doc.getElementById("rules");
        var display = window.getComputedStyle(modal, '').getPropertyValue("display");
        if (display === "none") {
            modal.style.display = "block";
        }
    }

    /*
    * @description Displays the modal popup for the avatars
    */
    function displayAvatars() {
        var modal = doc.getElementById("avatar");
        var display = window.getComputedStyle(modal, '').getPropertyValue("display");
        if (display === "none") {
            modal.style.display = "block";
        }
    }

    /*
    * @description Closes the modal popup
    */
    function closeRules() {
        var modal = doc.getElementById("rules");
        var display = window.getComputedStyle(modal, '').getPropertyValue("display");

        if (display !== "none") {
            modal.style.display = "none";
        }
    }

    /*
    * @description Closes the modal popup
    */
    function closeAvatar() {
        var modal = doc.getElementById("avatar");
        var display = win.getComputedStyle(modal, '').getPropertyValue("display");

        if (display !== "none") {
            modal.style.display = "none";
        }
    }

    /* Handles to the elements that display the Avatars */
    var avatar = "images/char-boy.png";
    var boy = doc.getElementById("boy");
    var catGirl = doc.getElementById("cat-girl");
    var pinkGirl = doc.getElementById("pink-girl");
    var princess = doc.getElementById("princess");

    boy.addEventListener("click", setAvatar);
    catGirl.addEventListener("click", setAvatar);
    pinkGirl.addEventListener("click", setAvatar);
    princess.addEventListener("click", setAvatar);

    /*
    * @description Sets the sprite of the player
    */
    function setAvatar() {
        Resources.load(this.firstChild.getAttribute("src"));
        player.updateSprite(this.firstChild.getAttribute("src"));
    }

    /* Load images for the initial state of the game */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Make the ctx variable globally available */
    global.ctx = ctx;
})(this);