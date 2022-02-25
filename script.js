var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
};
var canvas = document.createElement("canvas");
var width = canvas.width;
var height = canvas.height;
var context = canvas.getContext('2d');
var player = new Player();
var computer = new Computer();
var ball = new Ball(width/2, height/2);
var scoreboard = new Scoreboard(0, 0);

var keysDown = {};




var render = function () {
context.fillStyle = "#000000";
context.fillRect(0, 0, width, height);
for (var i=0; i<height; i+=height/5) {
    context.fillStyle= "#FFFFFF";
    context.fillRect(width/2-1, i + height/25, 2, height/9);
}
player.render();
computer.render();
ball.render();
scoreboard.render();
};

var update = function () {
player.update();
computer.update(ball);
ball.update(player.paddle, computer.paddle, scoreboard);

};

var step = function () {
update();
render();
animate(step);
};

function Paddle(x, y, width, height) {
this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.x_speed = 0;
this.y_speed = 0;
}

Paddle.prototype.render = function () {
context.fillStyle = "#FFFFFF";
context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
this.x += x;
this.y += y;
this.x_speed = x;
this.y_speed = y;
if (this.x < 0) {
    this.x = 0;
    this.x_speed = 0;
} else if (this.x + this.width > 400) {
    this.x = 400 - this.width;
    this.x_speed = 0;
}
};

function Computer() {
this.paddle = new Paddle(width-20, height/2-15, 5, 30);
}

Computer.prototype.render = function () {
this.paddle.render();
};

Computer.prototype.update = function (ball) {
var y_pos = ball.y;
var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
if (diff < 0 && diff < -1.75) {
    diff = -1.75;
} else if (diff > 0 && diff > 1.75) {
    diff = 1.75;
}
this.paddle.move(0, diff);
if (this.paddle.y < 0) {
    this.paddle.y = 0;
} else if (this.paddle.y + this.paddle.height > 400) {
    this.paddle.y = 400 - this.paddle.height;
}
};

function Player() {
this.paddle = new Paddle(10, height/2-15, 5, 30);
}

Player.prototype.render = function () {
this.paddle.render();
};

Player.prototype.update = function () {
for (var key in keysDown) {
    var value = Number(key);
    if (this.paddle.y > 0 && value == 38) {
        this.paddle.move(0, -4);
    } else if (this.paddle.y < height-30 && value == 40) {
        this.paddle.move(0, 4);
    } else {
        this.paddle.move(0, 0);
    }
}
};

function Ball(x, y) {
this.x = x;
this.y = y;
this.x_speed = -2;
this.y_speed = 0;
this.x_increment = 0.03;
}

Ball.prototype.render = function () {
context.beginPath();
context.arc(this.x, this.y, 3, 2 * Math.PI, false);
context.fillStyle = "#FFFFFF";
context.fill();
};

Ball.prototype.update = function (paddle1, paddle2, scoreboard) {
this.x += this.x_speed;
this.y += this.y_speed;
var left_x = this.x - 4;
var left_y = this.y - 4;
var right_x = this.x + 4;
var right_y = this.y + 4;

if (this.y - 4 < 0) {
    this.y = 4;
    this.y_speed = -this.y_speed;
} else if (this.y + 4 > height) {
    this.y = height-4;
    this.y_speed = -this.y_speed;
}

if (this.x < 0 || this.x > width) {
    var sign1 = 0;
    var sign2 = 0;
    var x = Math.random();
    if (x > 0.5) {
        sign1 = 1;
    } else {
        sign1 = -1
    }
    x = Math.random();
    if (x > 0.5) {
        sign2 = 1;
    } else {
        sign2 = -1
    }
    if (this.x < 0) {
        scoreboard.c +=1;
    } else {
        scoreboard.p +=1;
    }
    this.y_speed = 0; //sign1 * (Math.random() * 3);
    this.x_speed = sign2 * -2;
    this.y = height/2;
    this.x = width/2;
}

if (left_x < 13) {
    if (left_x < (paddle1.x + paddle1.height) && right_x > paddle1.x && left_y < (paddle1.y + paddle1.height) && right_y > paddle1.y) {
        this.x_speed = -this.x_speed;
        this.y_speed += (paddle1.y_speed / 2.2);
        this.x += this.x_speed;
        this.x_speed+= this.x_increment;
    }
} else if (right_x > width-15) {
    if (left_x < (paddle2.x + paddle2.width) && right_x > paddle2.x && left_y < (paddle2.y + paddle2.height) && right_y > paddle2.y) {
        this.x_speed = -this.x_speed;
        this.y_speed += (paddle2.y_speed / 2.2);
        this.x += this.x_speed;
        this.x_speed+= -this.x_increment;
    }
}
};

function Scoreboard(p, c) {
    this.p = p;
    this.c = c;
}

Scoreboard.prototype.render = function() {
    context.fillStyle = "#FFFFFF";
    context.fillText(`${this.p}`, width/2-15, 15);
    context.fillText(`${this.c}`, width/2+10, 15);
}



document.body.appendChild(canvas);
animate(step);

window.addEventListener("keydown", function (event) {
keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
delete keysDown[event.keyCode];
});
