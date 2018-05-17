function start() {
    $("#startButton").remove();
    const board = document.getElementById("game-container");    // board
    const ctx = board.getContext("2d");                         // game's context
    const color = "#00ff00";                                    // snake's color
    var direction = "up";                                       // the direction that snake goes to
    var score = 0;                                              // score
    var multiplier = 1;                                         // time multiplier

    // measurements
    const mea = 100;                                            // multiply every coordinate with mea
    var x = [9 * mea];                                          // initialize snake with this X
    var y = [9 * mea];                                          // initialize snake with this Y

    // apple's attributes
    var appleX;                                                 // apple's X
    var appleY;                                                 // apple's Y



    // changing player's direction
    function changeDirection(e) {
        e = e || window.event;
        switch (e.keyCode) {
            case 37:
                direction = "left";
                break;
            case 38:
                direction = "up";
                break;
            case 39:
                direction = "right";
                break;
            case 40:
                direction = "down";
                break;
        }
    }
    document.onkeydown = changeDirection;



    // set rectangle on board
    function setRect() {
        ctx.beginPath();
        ctx.fillStyle = color;
        for (let i = 0; i < x.length; i++) {
            for (let j = 0; j < y.length; j++) {
                ctx.fillRect(x[i] + 5, y[j] + 5, mea - 10, mea - 10);
            }
        }
        ctx.stroke();
    }



    // set an apple on the board
    // do...while to not let apple appear on the snake
    function newApple() {
        do {
            appleX = Math.floor(Math.random() * 20) * mea;
        } while (x.includes(appleX));

        do {
            appleY = Math.floor(Math.random() * 20) * mea;
        } while (y.includes(appleY));

        // draw apple
        let apple = new Image();
        apple.src = "./apple.png";
        apple.onload = function () {
            ctx.drawImage(apple, appleX + 15, appleY + 15, mea - 30, mea - 30);
        };
    }



    // initialize
    setRect();
    newApple();



    // every multiplier * 0.5 seconds snake will move in a direction
    var moveSnake = setInterval(function () {


        let latestX = x[x.length];
        let latestY = y[y.length];


        // check if coordinates are out of board
        currentLoop: for (let i = 0; i < x.length; i++) {
            for (let j = 0; j < y.length; j++) {
                if (x[i] < 0 || x[i] >= 2000 || y[j] < 0 || y[j] >= 2000) {
                    clearInterval(moveSnake);
                    alert("The game is over");
                    break currentLoop;
                }
            }

        }


        // delete snake from board
        for (let i = 0; i < x.length; i++) {
            for (let j = 0; j < y.length; j++) {
                ctx.clearRect(x[i] + 5, y[j] + 5, mea - 10, mea - 10);
            }
        }


        // if eaten an apple
        if ((x.includes(appleX)) && (y.includes(appleY))) {
            newApple();
            score += 1;
            $("#pointCounter").text("Points: " + score);

            // multiply the multiplier (player's speed) every 5 eaten apples
            if (score % 5 == 0) multiplier *= 1.25;

            x.push(latestX);
            y.push(latestY);
        }


        // change the coordinates 
        for (let i = x.length - 1; i > 0; i--) {
            for (let j = y.length - 1; j > 0; j--) {
                x[i] = x[i - 1];
                y[j] = y[j - 1];
            }
        }
        switch (direction) {
            case "left":
                x[0] -= mea;
                break;
            case "up":
                y[0] -= mea;
                break;
            case "right":
                x[0] += mea;
                break;
            case "down":
                y[0] += mea;
                break;
        }

        
        // print new snake
        setRect();

    }, multiplier * 250);
}
