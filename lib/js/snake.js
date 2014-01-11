var Snake = function () {
 
    'use strict';
 
    // canvas
    this.canvas = null;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    // context
    this.ctx = null;
    // snake
    this.snake = [];
    // food
    this.food = null;
    // snake's cell size in px
    this.cellSize = 10;
    // snakes number of cells
    this.nCells = 6;
    // game loop
    this.gameLoop = null;
    // direction
    this.direction = 'right';
    // stats
    this.score = 0;
    
    // initialize game
    this.start = function () {
 
        // canvas
        this.canvas = document.getElementById('canvas');
        
        // context
        this.setContext();
 
        // create snake
        this.createSnake();
 
        // handle keyboard
        this.setKeyboardEvents();
 
        // start game loop
        this.startGame();
    };
 
    // set canvas context
    this.setContext = function () {
 
        if (this.canvas.getContext){
 
            // get canvas dimensions
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = this.canvas.height;
 
            // get context
            this.ctx = this.canvas.getContext('2d');
 
        } else {
            window.alert('Your browser is not supported!');
        }
    };
 
    // create the snake
    this.createSnake = function () {
        // Tail will be index 0 and Head index length - 1
        for (var i = 0; i < this.nCells; i++) {
 
            this.snake.push({
                x: i * this.cellSize,
                y: 0
            });
 
        }
    };

    // set keyboard events
    this.setKeyboardEvents = function () {
 
        var that = this;
 
        document.onkeydown = function (e) {
 
            switch (e.keyCode) {
                case 37:
                    if (that.direction !== 'right') {
                        that.direction = 'left';
                    }
                break;
                case 38:
                    if (that.direction !== 'down') {
                        that.direction = 'up';
                    }
                break;
                case 39:
                    if (that.direction !== 'left') {
                        that.direction = 'right';
                    }
                break;
                case 40:
                    if (that.direction !== 'up') {
                        that.direction = 'down';
                    }
                break;
            }
 
            e.preventDefault();
        };
    };
 
    // starts the game loop
    this.startGame = function () {
 
        // set the right context for the setInterval
        var that = this;
        // create game loop
        this.gameLoop = window.setInterval(function(){
                that.update();
            },
            80);
    };
 
    // update game
    this.update = function () {
        
        // clear canvas first
        this.clearCanvas();

        // update snake
        this.updateSnakeLayout();
 
        // if no food generate a new one
        if (!this.food) {
            this.food = this.generateFood();
        }
 
        // draw game scene
        this.draw();
    };
 
    // draw game scene
    this.draw = function () {
     
        // draw food
        this.drawFood(this.food);
        
        // draw snake
        this.drawSnake();

        // draw score
        this.drawText("Score: " + this.score, 30, this.canvasHeight - 10 );
        
    };
 
    // update the snake layout
    this.updateSnakeLayout = function () {
       
        // get the last cell that will be moved to the begin of snake
        var cellToRedraw = this.snake.shift();
        var head = this.snake[this.snake.length - 1];
 
        // snake movement
        switch(this.direction){
            case 'right':
                cellToRedraw.x = head.x + this.cellSize;
                cellToRedraw.y = head.y;
            break;
            case 'left':
                cellToRedraw.x = head.x - this.cellSize;
                cellToRedraw.y = head.y;
            break;
            case 'up':
                cellToRedraw.x = head.x;
                cellToRedraw.y = head.y - this.cellSize;
            break;
            case 'down':
                cellToRedraw.x = head.x;
                cellToRedraw.y = head.y + this.cellSize;
            break;
        }
 
        // insert at the begin of the snake
        this.snake.push(cellToRedraw);
    };
 
    // generates random food
    this.generateFood = function () {
        return {
            x: Math.floor(Math.random() * (this.canvasWidth / this.cellSize)) * this.cellSize,
            y: Math.floor(Math.random() * (this.canvasHeight / this.cellSize)) * this.cellSize
        };
    };

    // draw snake
    this.drawSnake = function () {
        this.ctx.fillStyle = "#0000FF";
  
        for (var i=0; i< this.snake.length; i++){
            this.ctx.fillRect(this.snake[i].x, this.snake[i].y, this.cellSize, this.cellSize);
        }

        // check colisions
        this.checkCollisions();
    };
 
    // draw food
    this.drawFood = function (food) {
        
        if (food) {
            this.ctx.fillStyle = "#0000FF";
            this.ctx.fillRect(food.x, food.y, this.cellSize, this.cellSize);
        }
    };
 
    // checks all collisions
    this.checkCollisions = function () {
 
        // against wall
        var head = this.snake[this.snake.length - 1];
 
        if ( (head.x > this.canvasWidth) || (head.x < 0)  ||
            (head.y > this.canvasHeight) || (head.y < 0) ) {
 
            // collided against wall - game over
            this.gameOver();
        }
        
        // with itself - exclude the head from checking 
        for (var i = 0; i < this.snake.length -1; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {

                // collided against itself - game over
                this.gameOver();
            }
        }
        
        // with food
        if ( (head.x === this.food.x) && (head.y === this.food.y) ) {
 
            // hit on food
            this.eatFood();
        }

    };
 
    // game is over
    this.gameOver = function () {
 
        // stop timer
        clearTimeout(this.gameLoop);
        // clear canvas and display game over scene
        this.clearCanvas();

        var centerX = this.canvasWidth / 2; 
        var centerY = this.canvasHeight / 2;

        this.drawText('Game Over', centerX, centerY);
        this.drawText('Press any key to start again', centerX, centerY + 20);

        // wait for Enter  
        var that = this;             
        document.onkeyup = function (e) {
            e.preventDefault();
            document.onkeydown = null;
            that.restartGame();         
        };
    };

    // restart game
    this.restartGame = function () {
        // reset snake
        this.snake = [];
        // create snake
        this.createSnake();
        // reset other properties
        this.direction = 'right';
        this.score = 0;
        // start game
        this.startGame();
    };
 
    // eat the food
    this.eatFood = function () {
        // remove food
        this.food = null;
        
        // add another cell to the snake tail 
        var tail = this.snake[0];
        this.snake.unshift({
                x: tail.x - this.cellSize,
                y: 0
            });

        // add score
        this.score += 1;
    };
 
    // draw a white rectangle with same dimensions as canvas element
    this.clearCanvas = function () {
 
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    };
 
    this.drawText = function (text, posX, posY ) {
 
        // get the text width so that we can center on canvas
        var textWidth = this.ctx.measureText(text).width;
 
        // set font
        this.ctx.fillStyle = '#0000FF';
        this.ctx.font="12px Arial";
 
        this.ctx.fillText(text, posX - (textWidth / 2), posY);
    };
 
    return this;
};