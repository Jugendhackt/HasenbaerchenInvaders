var drawElements = new Array();
var ENEMY, RECT_ENEMY, SINUS_ENEMY, canvas;
// Overwritten later. Just adding here to hide IDE warnings

function generateLevel(num) {
    if(num === 0) {
        var gridSize = 20;
        var startY = -100;
        var startX = 80;
        var rows = 2;
        var cols = 8;
        for (var i = 0; i < rows*cols; i++) {
            enemy = Object.create(ENEMY);
            enemy.setPosition(startX + (i % cols) * gridSize, startY + ((i-(i % cols)) / cols) * gridSize);
            drawElements.push(enemy);
        }
    } else if(num === 1) {
        var gridSize = 20;
        var startY = -100;
        var startX = 30;
        var rows = 5;
        var cols = 12;
        for (var i = 0; i < rows*cols; i++) {
            enemy = Object.create(ENEMY);
            enemy.speed = 0.2;
            enemy.setPosition(startX + (i % cols) * gridSize, startY + ((i-(i % cols)) / cols) * gridSize);
            drawElements.push(enemy);
        }
    } else if(num === 2) {
        var gridSize = 20;
        var startY = -100;
        var startX = 30;
        var rows = 5;
        var cols = 12;
        for (var i = 0; i < rows*cols; i++) {
            enemy = Object.create(ENEMY);
            enemy.speed = 0.3;
            enemy.setPosition(startX + (i % cols) * gridSize, startY + ((i-(i % cols)) / cols) * gridSize);
            drawElements.push(enemy);
        }
    } else if(num === 3) {
        var startY = -20;
        var startX = -800;
        var deltaX = 30;
        for (var i = 0; i < 40; i++) {
            enemy = Object.create(RECT_ENEMY);
            enemy.posXMax = canvas.width - enemy.width - 10;
            enemy.posXMin = 10;
            enemy.speed = 1.8;
            enemy.setPosition(startX + i*deltaX, startY);
            drawElements.push(enemy);
        }
    } else if(num === 4) {
        var startY = -20;
        var startX = -500;
        var deltaX = 30;
        for (var i = 0; i < 20; i++) {
            enemy = Object.create(RECT_ENEMY);
            enemy.posXMax = canvas.width/2 - enemy.width - 10;
            enemy.posXMin = 10;
            enemy.speed = 1.8;
            enemy.setPosition(startX + i*deltaX, startY);
            drawElements.push(enemy);
            
            enemy = Object.create(RECT_ENEMY);
            enemy.posXMax = canvas.width - enemy.width - 10;
            enemy.posXMin = canvas.width/2 + 10;
            enemy.speed = 1.8;
            enemy.setPosition(startX + i*deltaX, startY - 4*enemy.lineHeight);
            drawElements.push(enemy);
        }
    } else if(num === 5) {
        var startY = -50;
        var startX = 100;
        for (var i = 0; i < 20; i++) {
            enemy = Object.create(SINUS_ENEMY);
            enemy.delay = 20*i;
            enemy.speed = 0.9;
            enemy.oszillationSpeed = 0.06;
            enemy.oszillationDistance = 1;
            enemy.setPosition(startX, startY);
            drawElements.push(enemy);
        }
    } else {
        win();
    }
}
