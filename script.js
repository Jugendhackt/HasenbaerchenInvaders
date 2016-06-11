var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
// Overwritten later. Just adding here to hide IDE warnings

var imagesLoaded = 0;
function imageWasLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 4) {
        gameLoop();
    }
}

var IMAGE_SHOT = new Image();
IMAGE_SHOT.onload = imageWasLoaded;
IMAGE_SHOT.src = 'shot.png';

var IMAGE_PLAYER = new Image();
IMAGE_PLAYER.onload = imageWasLoaded;
IMAGE_PLAYER.src = 'player.png';

var IMAGE_ENEMY = new Image();
IMAGE_ENEMY.onload = imageWasLoaded;
IMAGE_ENEMY.src = 'enemy.png';

var IMAGE_ENEMY_PARTICLE = new Image();
IMAGE_ENEMY_PARTICLE.onload = imageWasLoaded;
IMAGE_ENEMY_PARTICLE.src = 'enemy_particle.png';

var drawElements = new Array();
var canvas = document.getElementById("theGame");
var ctx = canvas.getContext("2d");

var OBJ2D = {
    type: "null",
    delay: 0,
    posX: 0,
    posY: 0,
    width: 0,
    height: 0,
    image: null,
    setSize: function(w, h) {
        this.width = w;
        this.height = h;
    },
    setPosition: function(x, y) {
        this.posX = x;
        this.posY = y;
    },
    destroy: function() {
        drawElements.splice(drawElements.indexOf(this), 1);
    },
    checkCollisions: function() {},
    callTick: function() {
        this.checkCollisions();
        if(this.delay <= 0) {
            this.tick();
        } else {
            this.delay--;
        }
    },
    tick: function() { },
    draw: function(context2d) {
        context2d.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }
};

var SHOT = Object.create(OBJ2D);
SHOT.type = "shot";
SHOT.image = IMAGE_SHOT;
SHOT.setSize(12.5, 12.5);
SHOT.tick = function() {
    this.posY -= 3;
    if (this.posY < -this.height) {
        this.destroy();
    }
};

var FIREWORK_PARTICLE = Object.create(OBJ2D);
FIREWORK_PARTICLE.type = "firework-particle";
FIREWORK_PARTICLE.color = "#ffffff";
FIREWORK_PARTICLE.dx = 1;
FIREWORK_PARTICLE.dy = 1;
FIREWORK_PARTICLE.width = 3;
FIREWORK_PARTICLE.lifetime = 40;
FIREWORK_PARTICLE.draw = function(context2d) {
    context2d.fillStyle = shadeColor(this.color, this.lifetime/5);
    context2d.beginPath();
    context2d.arc(this.posX,this.posY,this.width/2,0,2*Math.PI);
    context2d.fill();
};
FIREWORK_PARTICLE.tick = function() {
    this.posX += this.dx;
    this.posY += this.dy;
    this.lifetime--;
    if (this.lifetime <= 0) {
        this.destroy();
    }
};

var ENEMY_PARTICLE = Object.create(OBJ2D);
ENEMY_PARTICLE.floatValue = 0;
ENEMY_PARTICLE.type = "enemy-particle";
ENEMY_PARTICLE.image = IMAGE_ENEMY_PARTICLE;
ENEMY_PARTICLE.setSize(12.5, 12.5);
ENEMY_PARTICLE.tick = function() {
    this.posY -= 1;
    this.floatValue++;
    this.posX += 0.5 * Math.sin(this.floatValue*0.2);
};

var ENEMY = Object.create(OBJ2D);
ENEMY.type = "enemy";
ENEMY.speed = 0.2;
ENEMY.image = IMAGE_ENEMY;
ENEMY.setSize(12.5, 12.5);
ENEMY.checkCollisions = function() {
    if (this.posY > canvas.height - getPlayer().height) {
        loose();
    }
    
    for (var i = 0; i < drawElements.length; i++) {
        if (drawElements[i].type === "shot") {
            shot = drawElements[i];
            if (shot.posX+shot.width > this.posX && shot.posX < this.posX + this.width) {
                if (shot.posY+shot.height > this.posY && shot.posY < this.posY + this.height) {
                    
                    enemyParticle = Object.create(ENEMY_PARTICLE);
                    enemyParticle.setPosition(this.posX, this.posY);
                    drawElements.push(enemyParticle);
                    
                    this.destroy();
                    shot.destroy();
                }
            }
        }
    }
};
ENEMY.tick = function() {
    this.posY += this.speed;
};

var RECT_ENEMY = Object.create(ENEMY);
RECT_ENEMY.directionRight = true;
RECT_ENEMY.bottom = -1;
RECT_ENEMY.lineHeight = 10;
RECT_ENEMY.posXMax = 200;
RECT_ENEMY.posXMin = 10;
RECT_ENEMY.tick = function() {
    if(this.bottom >= 0) {
        this.bottom++;
        this.posY += this.speed;
        if (this.bottom > this.lineHeight) {
            this.bottom = -1;
            this.directionRight = !this.directionRight;
        }
    } else {
        if (this.directionRight) {
            this.posX += this.speed;
            if(this.posX > this.posXMax) {
                this.posX = this.posXMax;
                this.bottom = 0;
            }
        } else {
            this.posX -= this.speed;
            if(this.posX < this.posXMin) {
                this.posX = this.posXMin;
                this.bottom = 0;
            }
        }
    }
};

var SINUS_ENEMY = Object.create(ENEMY);
SINUS_ENEMY.posXMax = 200;
SINUS_ENEMY.posXMin = 10;
SINUS_ENEMY.oszillationStep = 0;
SINUS_ENEMY.oszillationSpeed = 1;
SINUS_ENEMY.tick = function() {
    this.oszillationStep++;
    this.posY += this.speed;
    this.posX += this.oszillationDistance * Math.sin(this.oszillationStep * this.oszillationSpeed);
};


var PLAYER = Object.create(OBJ2D);
PLAYER.type = "player";
PLAYER.image = IMAGE_PLAYER;
PLAYER.setSize(12.5, 12.5);
PLAYER.posY = canvas.height - 8;
PLAYER.tick = function() {
    if (rightPressed) {
        this.posX += 2;
    }
    if (leftPressed) {
        this.posX -= 2;
    }
    if(this.posX > canvas.width - 10) {
        this.posX = canvas.width - 10;
    } else if(this.posX < 0) {
        this.posX = 0;
    }
};
drawElements[0] = PLAYER;

function getPlayer() {
    return drawElements[0];
}

function fireworkRocket(x, y, color) {
    numOfParticles = 8;
    for (i=0; i < numOfParticles; i++) {
        particle = Object.create(FIREWORK_PARTICLE);
        particle.color = color;
        particle.dx = Math.sin((i/numOfParticles)*(Math.PI*2));
        particle.dy = Math.cos((i/numOfParticles)*(Math.PI*2));
        particle.setPosition(x,y);
        drawElements.push(particle);
    }
}

var shotDone = false;
function handleShots() {
    if(spacePressed && !shotDone) {
        shotDone = true;
        var newShot = Object.create(SHOT);
        newShot.setPosition(getPlayer().posX, canvas.height);
        drawElements.push(newShot);
    } else if(!spacePressed) {
        shotDone = false;
    }
}

function handleLevelLoad() {
    enemyFound = false;
    for (var i = 0; i < drawElements.length; i++) {
        if (drawElements[i].type === "enemy") {
            enemyFound = true;
        }
    }
    
    if (!enemyFound) {
        generateLevel(level);
        level++;
    }
}

function loose() {
    loopRunning = false;
}

function win() {
    if(Math.random() > 0.9) {
        color = "#"+((1<<24)*Math.random()|0).toString(16);
        fireworkRocket(Math.random()*canvas.width, Math.random()*canvas.height, color);
    }
}

var level = 0;
var loopRunning = true;
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = drawElements.length - 1; i >= 0; i--) {
        drawElements[i].draw(ctx);
        drawElements[i].callTick();
    }
    
    handleShots();
    handleLevelLoad();
    
    if (loopRunning) {
        setTimeout(gameLoop, 15);
    }
}
