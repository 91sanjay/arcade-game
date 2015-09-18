/*******************************************************************
* CONSTANTS
********************************************************************/
/** @constant {string } */
var ROW1 = "Row1";
var ROW2 = "Row2";
var ROW3 = "Row3";

/*******************************************************************
* GLOBAL
********************************************************************/
/** @global */
var allEnemies = [];
var totalEnemies = 4;
var score = 0;
var enemyPositions = {};

enemyPositions.ROW1 = [];
enemyPositions.ROW2 = [];
enemyPositions.ROW3 = [];

var getRandomPosition = function() {
    var positionArray = [60, 140, 230];
    var i = Math.floor(Math.random()*(positionArray.length));
    return positionArray[i];
}

/*
* @class Creates an Enemy object
* @classdesc Accepts the x y coordinates and sets the sprite to be
*            used while rendering the enemy
* @param {number} x
* @param {number} y
*/
var Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.speed = Math.floor((Math.random() * 250) + 125);
    this.sprite = 'images/enemy-bug.png';
};

/*
* @description Updates the position of the enemy
* @param {number} dt
*/
Enemy.prototype.update = function(dt) {
        if (this.x < 505) {
            this.x = this.x + this.speed * dt;
        } else {
            this.x = -98;
        }
};

/*
* @description Renders the sprite of the enemy on the canvas
*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
* @description Resets the position of the enemy to put it off canvas
*/
Enemy.prototype.resetPosition = function() {
    this.x = -110;
}

/*
* @class Creates an Player object
* @classdesc Accepts the x y coordinates and sets the sprite to be
*            used while rendering the player
* @param {number} x
* @param {number} y
*/
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png'
}

/*
* @description Renders the sprite of the player on the canvas
*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
}

/*
* @description Updates the position of the player such that the
*              player moves from one tile to the other
* @param {number} dt
*/
Player.prototype.update = function(dt) {
    if (checkCollision(this)) {
        this.y = 398*dt;
    }
}

/*
* @description Updates the sprite of the player
* @param {String} src
*/
Player.prototype.updateSprite = function(src) {
    this.sprite = src;
}

/*
* @description Reset the position of the player
*/
Player.prototype.resetPosition = function() {
    this.x = 0;
    this.y = 398;
}

/*
* @description Reads the key strokes and moves the player in the
*              corresponding direction
* @param {string} key
*/
Player.prototype.handleInput = function(key) {
    if (key == "right" && this.x < 404) {
        this.x += 101;
    } else if (key == "left" && this.x > 0) {
        this.x -= 101;
    } else if (key == "up") {
        if(this.y > 101) {
            this.y -= 83;
        } else {
            this.y = 398;
        }
    } else if (key == "down" && this.y < 398) {
        this.y += 83;
    }
}

/*
* @description Checks for collisions betweeen the player and the
*              enemies. It checks the enemies that are in the same
*              row as the player
* @param {object} player
*/
var checkCollision = function(player) {
    if (player.y < 100) {
        var enemies = enemyPositions.ROW1;
        enemies.forEach(function(enemy){
            if (compareDistance(player,enemy)) {
                return true;
            }
        });
    } else if (player.y < 200) {
        var enemies = enemyPositions.ROW2;
        enemies.forEach(function(enemy){
            if (compareDistance(player,enemy)) {
                return true;
            }
        });
    } else {
        var enemies = enemyPositions.ROW3;
        enemies.forEach(function(enemy){
            if (compareDistance(player,enemy)) {
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
var compareDistance = function(player, enemy) {
    if (Math.abs(enemy.x - player.x) < 50 && player.y<300) {
        player.y = 398;
        return true;
    }
}

/*
* Instantiate the player and enemies. Add enemies to global map
* to track their position on the canvas
*/
var pos = getRandomPosition();
var player = new Player(0, 398);
var enemy1 = new Enemy(-98, 60);
var enemy2 = new Enemy(-98, 140);
var enemy3 = new Enemy(-98, 230);
var enemy4 = new Enemy(-98, pos);

allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);
allEnemies.push(enemy4);

allEnemies.forEach(function(enemy) {
    if (enemy.y < 100) {
        enemyPositions.ROW1.push(enemy);
    } else if (enemy.y > 100 && enemy.y < 200) {
        enemyPositions.ROW2.push(enemy);
    } else {
        enemyPositions.ROW3.push(enemy);
    }
});

/*
* @description Read the keys pressed by the users and map to
*              the strings representing directions
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});