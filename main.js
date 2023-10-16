// board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight/2;
let doodlerRightImg;
let doodlerLeftImg;

//physics
let velocityX = 0 ;

//plasforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight,
}



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
 
 placePlatforms();
 requestAnimationFrame(update);
 document.addEventListener('keydown',moveDoodler)
};

function update(){
    requestAnimationFrame(update);
    context.clearRect(0,0, board.width, board.height);
    // doodler 
    doodler.x += velocityX;
    if(doodler.x > boardWidth){
        doodler.x = 0;
    }else if(doodler.x + doodler.width < 0){
        doodler.x = boardWidth;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platforms
    for(let i=0; i < platformArray.length; i++){
        let platform= platformArray[i];
        context.drawImage(platform.img,platform.x, platform.y, platform.width, platform.height);

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
}