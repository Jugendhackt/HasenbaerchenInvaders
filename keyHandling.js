var KEY_RIGHT = 39;
var KEY_LEFT = 37;
var KEY_SPACE = 32;

var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
document.onkeydown = function(event) {
    if (event.which === KEY_RIGHT) {
        rightPressed = true;
    } else if (event.which === KEY_LEFT) {
        leftPressed = true;
    } else if (event.which === KEY_SPACE) {
        spacePressed = true;
    }
};
document.onkeyup = function(event) {
    if (event.which === KEY_RIGHT) {
        rightPressed = false;
    } else if (event.which === KEY_LEFT) {
        leftPressed = false;
    } else if(event.which === KEY_SPACE) {
        spacePressed = false;
    }
};
