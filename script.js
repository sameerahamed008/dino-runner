const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const difficulty = document.getElementById("difficulty");

let gameRunning = false;

let score = 0;
let gameSpeed = 5;

let gravity = 0.8;

const dino = {
    x: 100,
    y: 300,
    width: 60,
    height: 60,
    velocityY: 0,
    jumping: false
};

let obstacles = [];

function setDifficulty() {

    const level = difficulty.value;

    if(level === "easy"){
        gameSpeed = 5;
    }

    if(level === "medium"){
        gameSpeed = 8;
    }

    if(level === "hard"){
        gameSpeed = 12;
    }
}

function jump(){

    if(!dino.jumping){

        dino.velocityY = -15;
        dino.jumping = true;
    }
}

document.addEventListener("keydown",(e)=>{

    if(e.code==="Space" || e.code==="ArrowUp"){
        jump();
    }
});

function createObstacle(){

    if(!gameRunning) return;

    const type = Math.random() > 0.5 ? "human" : "car";

    obstacles.push({

        x: canvas.width,
        y: type === "human" ? 300 : 280,
        width: type === "human" ? 40 : 80,
        height: type === "human" ? 60 : 80,
        type:type
    });
}

let obstacleInterval;

function startGame(){

    score = 0;
    obstacles = [];

    setDifficulty();

    gameRunning = true;

    clearInterval(obstacleInterval);

    obstacleInterval = setInterval(
        createObstacle,
        1500
    );
}

function restartGame(){

    startGame();
}

function drawDino(){

    ctx.fillStyle="#22c55e";

    ctx.fillRect(
        dino.x,
        dino.y,
        dino.width,
        dino.height
    );

    ctx.fillStyle="white";

    ctx.fillRect(
        dino.x+40,
        dino.y+10,
        8,
        8
    );

    ctx.fillStyle="black";

    ctx.fillRect(
        dino.x+42,
        dino.y+12,
        4,
        4
    );

    // Running legs animation

    let legMove = Math.sin(Date.now()/100)*8;

    ctx.fillStyle="#14532d";

    ctx.fillRect(
        dino.x+10,
        dino.y+50,
        10,
        15+legMove
    );

    ctx.fillRect(
        dino.x+35,
        dino.y+50,
        10,
        15-legMove
    );
}

function drawHuman(x,y){

    ctx.fillStyle="black";

    ctx.beginPath();
    ctx.arc(x+20,y+10,10,0,Math.PI*2);
    ctx.fill();

    ctx.fillRect(x+15,y+20,10,25);

    ctx.fillRect(x+10,y+45,8,15);
    ctx.fillRect(x+22,y+45,8,15);
}

function drawCar(x,y){

    ctx.fillStyle="#ef4444";

    ctx.fillRect(x,y+20,80,30);

    ctx.fillRect(x+10,y,50,25);

    ctx.fillStyle="black";

    ctx.beginPath();
    ctx.arc(x+15,y+50,8,0,Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x+65,y+50,8,0,Math.PI*2);
    ctx.fill();
}

function updateDino(){

    dino.velocityY += gravity;
    dino.y += dino.velocityY;

    if(dino.y >= 300){

        dino.y = 300;
        dino.jumping = false;
    }
}

function updateObstacles(){

    obstacles.forEach((obs,index)=>{

        obs.x -= gameSpeed;

        if(obs.x < -100){

            obstacles.splice(index,1);

            score++;

            scoreText.textContent = score;
        }

        if(
            dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height &&
            dino.y + dino.height > obs.y
        ){

            gameOver();
        }

        if(obs.type==="human"){
            drawHuman(obs.x,obs.y);
        }
        else{
            drawCar(obs.x,obs.y);
        }

    });
}

function drawGround(){

    ctx.fillStyle="#16a34a";

    ctx.fillRect(
        0,
        360,
        canvas.width,
        40
    );
}

function gameOver(){

    gameRunning = false;

    clearInterval(obstacleInterval);

    alert(
        "Game Over!\nScore: " + score
    );
}

function animate(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawGround();

    if(gameRunning){

        updateDino();
        updateObstacles();
    }

    drawDino();

    requestAnimationFrame(animate);
}

startBtn.addEventListener("click",startGame);
restartBtn.addEventListener("click",restartGame);

animate();
