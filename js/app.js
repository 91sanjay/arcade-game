var ROW1 = "Row1";
var ROW2 = "Row2";
var ROW3 = "Row3";
var score = 0;
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
    // console.log(positionArray[i]);
    return positionArray[i];
}

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = Math.floor((Math.random() * 250) + 125);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
        if (this.x < 505) {
            this.x = this.x + this.speed * dt;
        } else {
            this.x = -98;
        }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png'
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
}

Player.prototype.update = function(dt) {
    if (checkCollision(this)) {
        this.y = 398*dt;
    }
}

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
        // console.log("y "+this.y);
    } else if (key == "down" && this.y < 398) {
        this.y += 83;
    }
}

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

var compareDistance = function(player, enemy) {
    if (Math.abs(enemy.x - player.x) < 50 && player.y<300) {
        console.log("COLLISION");
        player.y = 398;
        return true;
    }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var pos = getRandomPosition();
var player = new Player(0, 398);
var enemy1 = new Enemy(98, 60);
var enemy2 = new Enemy(98, 140);
var enemy3 = new Enemy(98, 230);
var enemy4 = new Enemy(-98, pos);

allEnemies.push(enemy1);
allEnemies.push(enemy2);
allEnemies.push(enemy3);
allEnemies.push(enemy4);

allEnemies.forEach(function(enemy) {
    console.log(enemy.y);
    if (enemy.y < 100) {
        enemyPositions.ROW1.push(enemy);
    } else if (enemy.y > 100 && enemy.y < 200) {
        enemyPositions.ROW2.push(enemy);
    } else {
        enemyPositions.ROW3.push(enemy);
    }
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
