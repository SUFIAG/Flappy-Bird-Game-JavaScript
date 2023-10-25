/* DOM */
const ground = document.getElementById("ground");
const flappy = document.getElementById("flappy");




/* Global */
const sizeGround = { w: 360, h: 500 };
const sizeFlappy = { w: 45, h: 40 };
const sizePipe = { w: 45 };
const posFlappy = { x: 95, y: 230 };

let pipes = [];

let score = 0;
let isGameOver = false;

let createPipeTimer;
let movePipeTimer;
let addScoreTimer;
let fallTimer;




/* Function */
// random range
const randRange = (from, to) => {
    let num = 0;
    // while num in from-to, than break;
    while (true) {
        if ((num >= from) && (num <= to)) {
            return num;
        };
        num = Math.floor(Math.random() *to);
    };
};


// game Over
const gameOver = () => {
    // Clear Timer
    clearInterval(createPipeTimer);
    clearInterval(movePipeTimer);
    clearInterval(addScoreTimer);
    clearInterval(fallTimer);
    // remove space event listener
    document.removeEventListener("keypress", (event) => event.keyCode===32 && fly());
    // show score
    const h1 = document.createElement("h1");
    h1.innerText = score;
    h1.style.fontSize = "3rem";
    h1.style.position = "absolute";
    h1.style.width = 100 +"%";
    h1.style.textAlign = "center";
    ground.appendChild(h1)
};


// fly
const fly = () => {
    // increase Y
    posFlappy.y += 60;
    // ? flappy passed top(ground height) than fall down
    if (posFlappy.y > (sizeGround.h-sizeFlappy.h)) { posFlappy.y -= 60 };
    // show
    flappy.style.bottom = posFlappy.y +"px";
};


// fall
const fall = () => {
    // increase Y
    posFlappy.y -= 1;
    // ? flappy passed bottom(0) than game over
    if (posFlappy.y <= 0) { gameOver() };
    // show
    flappy.style.bottom = posFlappy.y +"px";
};


// move pipe
const movePipe = () => {
    pipes.forEach((i, j) => {
        // decrease pipe X
        i.pipeX -= 1;
        // show in DOM
        i.pipeTop.style.left = i.pipeX +"px";
        i.pipeBottom.style.left = i.pipeX +"px";

        // pipe passed left side, than remove it
        if (i.pipeX <= -sizePipe.w) {
            // removing from DOM
            i.pipeTop.remove();
            i.pipeBottom.remove();
            // remove from array
            pipes.splice(j, 1);
        };
 
        // Collide, than game Over
        if ( 
            ((posFlappy.x +sizeFlappy.w) >= i.pipeX) &&
            (posFlappy.x <= (i.pipeX +sizeFlappy.w)) &&
            ( 
                ((sizeGround.h -i.pipeTopH -sizeFlappy.h) <= posFlappy.y) ||
                (posFlappy.y <= i.pipeBottomH)
            )
        ) { gameOver() };
    });
};


// new Pipe
class newPipe {
    constructor() {
        // pipe pos
        this.pipeTopH = randRange(50, 200);
        this.pipeBottomH = sizeGround.h -this.pipeTopH -120;
        this.pipeX = sizeGround.w;
        // create pipe
        this.pipeTop = document.createElement("div");
        this.pipeBottom =  document.createElement("div");
        // pipe top
        this.pipeTop.className = "pipe-top";
        this.pipeTop.style.height = this.pipeTopH +"px";
        this.pipeTop.style.left = this.pipeX +"px";
        // pipe bottom
        this.pipeBottom.className = "pipe-bottom";
        this.pipeBottom.style.height = this.pipeBottomH +"px";
        this.pipeBottom.style.left = this.pipeX +"px";

        // append them
        ground.appendChild(this.pipeTop);
        ground.appendChild(this.pipeBottom);
    };
};


// create pipe
const createPipe = () => {
    // object
    const pipe = new newPipe();
    // push them
    pipes.push(pipe);    
};


// start the game
const startGame = () => {
    // create first pipe
    createPipe();
    // Add Score
    addScoreTimer = setInterval(() => score += 1, 7000);
    // create pipe
    createPipeTimer = setInterval(createPipe, 8000);
    // move pipe
    movePipeTimer = setInterval(movePipe, 40);
    // fall down Timer
    fallTimer = setInterval(fall, 20);
    // Space Key Event
    document.addEventListener("keypress", (event) => event.keyCode===32 && fly());

};




/* Run */
startGame();