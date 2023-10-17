// board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight,
}

 
//physics
let velocityX = 0 ;
//doodler jump speed
let velocityY = 0;
// starting velocity Y 
let initialVelocityY = -8;
//
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  //used for drawing on the board
  context = board.getContext("2d");

  //draw doodler
//   context.fillStyle = "green"
//   context.fillRect(doodler.x,doodler.y,doodler.width, doodler.height);

  //load image
  doodlerRightImg = new Image();
  doodlerRightImg.src = "./Img/doodler-right.png";
  doodler.img = doodlerRightImg;
 doodlerRightImg.onload = ()=>{
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
 }

 doodlerLeftImg = new Image();
 doodlerLeftImg.src = "./Img/doodler-left.png";

 platformImg = new Image();
 platformImg.src = "./Img/platform.png";
 
 velocityY = initialVelocityY;
 placePlatforms();
 requestAnimationFrame(update);
 document.addEventListener('keydown',moveDoodler)
};

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0, board.width, board.height);
    // doodler 
    doodler.x += velocityX;
    if(doodler.x > boardWidth){
        doodler.x = 0;
    }else if(doodler.x + doodler.width < 0){
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    if(doodler.y > board.height){
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platforms
    for(let i=0; i < platformArray.length; i++){
        let platform= platformArray[i];

        //slide the platform
        if(velocityY < 0 && doodler.y < boardHeight*3/4){
            platform.y -= initialVelocityY ;
        }

        if(detectCollision(doodler, platform)){
            //jump
            velocityY = initialVelocityY
        }
        context.drawImage(platform.img,platform.x, platform.y, platform.width, platform.height);
    }
    // clear platforms and new platforms
    while(platformArray.length  > 0 && platformArray[0].y >= boardHeight){
        //removes first element from the array
        platformArray.shift();
        // replavr with new platform on top

        newPlatforms();
    }
    //score
    updateScore();
    context.fillStyle = 'black';
    context.font = '16px sans-serif';
    context.fillText(score, 5, 20);
    if(gameOver){
        context.fillText("Game over: press 'space' to restart", boardWidth/7, boardHeight*7/8);
    }
}

function moveDoodler(e){
    // move right
    if(e.code == "ArrowRight" || e.code == "KeyD"){
        velocityX = 4;
        doodler.img =doodlerRightImg;
    }else if(e.code == "ArrowLeft" || e.code == "KeyA"){
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }else if(e.code == "Space" || e.code == "Enter" && gameOver){
        //restart
        doodler = {
            img: doodlerRightImg,
            x: doodlerX,
            y: doodlerY,
            width: doodlerWidth,
            height: doodlerHeight,
        }
        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms(){
    platformArray =[];

    // start platforms
    let platform = {
        img: platformImg,
        x: boardWidth/2,
        y: boardHeight -50,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform);

    // platform = {
    //     img: platformImg,
    //     x: boardWidth/2,
    //     y: boardHeight -150,
    //     width: platformWidth,
    //     height: platformHeight
    // }
    // platformArray.push(platform);

    for(let i=0; i < 6; i++){
        let randomX =Math.floor(Math.random() * boardWidth*3/4)
        let platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 75*i - 149,
            width: platformWidth,
            height: platformHeight
        }
        platformArray.push(platform);
    
    }
}

function newPlatforms(){
   
        let randomX =Math.floor(Math.random() * boardWidth*3/4)
        let platform = {
            img: platformImg,
            x: randomX,
            y: -platformHeight,
            width: platformWidth,
            height: platformHeight
        }

        platformArray.push(platform);
}

function detectCollision(a,b){
    return  a.x < b.x + b.width && 
            a.x + b.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y ;
}

function updateScore(){
    // (0-1)*50 
    let points = Math.floor(50*Math.random());
    // negative going to
    if(velocityY < 0){
        maxScore += points;
        if(score < maxScore){
            score = maxScore
        }     
    }else if(velocityY >= 0){
        maxScore -= points;
    }
}