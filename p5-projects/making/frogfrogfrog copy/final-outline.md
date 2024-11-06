//outline for full game

//  !!!Core Game Structure and Variables

// Game Variables
let fly;
let frogs = [];
let lilyPads = [];
let capturedFlies = [];
let hearts = 3;
let fliesFreed = 0;
let gameState = "start";  // Possible states: "start", "playing", "cutScene", "win", "lose"
let level = 1;
let electric=false; 
<!-- if ((spaceBarKey && keyPressHold)==true) {
    electric=true;
} else {

electric=false;
} -->

// Image Assets I made
let fly, flyStun, flyNearDeath, deadFly, frog, frogTongue, frogStun, frogKing, frogKingTongue, frogKingStun, frogKingDead, lilyPadv1, lilyPadv2, full-heart, empty-heart, crown, electricBolt, swamp1, swamp2;

// Load images
function preload() {
    //loading fly assets
fly= loadImage("assets/images/fly.png"); //
flyStun= loadImage("assets/images/fly-stun.png"); //
flyNearDeath= loadImage("assets/images/fly-hit.png");//
deadFly= loadImage("assets/images/fly-dead.png");//

 //loading frog assets
frog = loadImage("assets/images/frog.png");//
frogTongue = loadImage("assets/images/frog.png");
frogStun = loadImage("assets/images/frog-stunned.png"); 
frogKing = loadImage("assets/images/frog-king.png");//
frogKingTongue = loadImage("assets/images/frog-king-stunned.png");
frogKingStun  = loadImage("assets/images/frog-king-stunned.png");//
frogKingDead = loadImage("assets/images/frog-king-dead.png");//

 //loading other game assets
lilyPadv1 = loadImage("assets/images/lilypad-v1.png");//
lilyPadv2 = loadImage("assets/images/lilypad-v2.png");//
full-heart = loadImage("assets/images/full-hearts.png");//
empty-heart = loadImage("assets/images/empty-hearts.png");//
crown = loadImage("assets/images/crown.png");//
electricBolt = loadImage("assets/images/crown.png");

//backgrounds
swamp1 = loadImage("assets/images/swamp1.png"); //
swamp2 = loadImage("assets/images/swamp2.png");//
}

// Setup function to initialize canvas and objects
function setup() {
  createCanvas(640, 480);
  fly = createFly();
  //loadLevel(level);


}

// !!! Title Screen and Cutscene Display

function draw() {
  if (gameState === "start") {
    displayTitleScreen();
  } else if (gameState === "cutScene") {
    displayCutScene1();
  } else if (gameState === "playing") {
    playGame();
  } else if (gameState === "win") {
    displayWinScreen();
  } else if (gameState === "lose") {
    displayGameOverScreen();
  }
}

function displayTitleScreen() {
  background(0);
  fill(255);
  textSize(32);
  text("The Fly's Vengeance!", width / 2 - 100, height / 2 - 40);
  textSize(16);
  text("Press any key to start", width / 2 - 60, height / 2);
}

function displayCutScene1() {
  background(30);
  fill(255);
  textSize(16);
  text("Honored fly, your kingdom has been overrun by the Frogs who...", width / 2 - 200, height / 2 - 40);
  text("Press any key to start your journey", width / 2 - 80, height / 2 + 40);
}

function keyPressed() {
  if (gameState === "start") {
    gameState = "cutScene";
  } else if (gameState === "cutScene") {
    gameState = "playing";
  }
}

//Game Objects

// Fly Object
function createFly() {
  return {
    x: 50,
    y: height / 2,
    size: 20,
    moveSpeed: 2,
    hearts: 3,
    electric: false;
  };
}

//sub group fly objects: captured flies
function createCapturedFlies(x, y) {
  return { x: x, y: y, locked: true };
}


// Frog Object 
function createFrog(x, y) {
  return {
    x: x,
    y: y,
    size: 100,
    stunned: false,
    stunTimer: 0
  };
}

//sub group frog object: king frog has more properties than frog
function createFrog(x, y) {
  return {
    x: x,
    y: y,
    size: 100,
    stunned: false,
    stunTimer: 0
  };
}

// lily pad objects
//logic: 2 types of lily img choose either at random
 let x = random(0, 100);
function createLilyPad(x, y) {
  return { x: x, y: y, size: 40 };
}


//!!! Game Play Logic

function playGame() {
  // Change placements of frogs and lilypads for each swamp level
  if (level === 1) = loadlvl1;
  if (level === 2) = loadlvl2;

  displayHearts();
  displayScore();

  if (keyIsDown(32)) { // Space bar for defense mode
    fly.defenseMode = true;
  } else {
    fly.defenseMode = false;
  }

  moveFly();
  drawFly();

  for (let frog of frogs) {
    if (checkCollision(fly, frog)) {
      if (fly.defenseMode && !frog.stunned) {
        frog.stunned = true;
        frog.stunTimer = frameCount;
      } else if (!fly.defenseMode) {
        fly.hearts -= 0.5;
        if (fly.hearts <= 0) gameState = "lose";
      }
    }
    moveFrog(frog);
    drawFrog(frog);
  }

  for (let lilyPad of lilyPads) drawLilyPad(lilyPad);
  for (let capturedFly of capturedFlies) {
    if (checkCollision(fly, capturedFly) && capturedFly.locked) {
      fliesFreed++;
      capturedFly.locked = false;
    }
    drawCapturedFly(capturedFly);
  }
}

function drawFly() {
  image(fly.defenseMode ? laserImage : flyImage, fly.x, fly.y, fly.size, fly.size);
}

function drawFrog(frog) {
  if (frog.stunned && frameCount - frog.stunTimer < 60) {
    tint(150);  // Grayscale
  } else {
    noTint();
    frog.stunned = false;
  }
  image(frogImage, frog.x, frog.y, frog.size, frog.size);
}

function drawLilyPad(lilyPad) {
  image(lilyPadImage, lilyPad.x, lilyPad.y, lilyPad.size, lilyPad.size);
}

function drawCapturedFly(capturedFly) {
  image(flyImage, capturedFly.x, capturedFly.y, capturedFly.size, capturedFly.size);
}

// !!! Game Over and Win Screens

function displayGameOverScreen() {
  background(200, 0, 0);
  fill(255);
  textSize(32);
  text("Game Over!", width / 2 - 100, height / 2);
  textSize(16);
  text("Flies Freed: " + fliesFreed, width / 2 - 60, height / 2 + 40);
  text("Press any key to restart", width / 2 - 80, height / 2 + 80);
}

function displayWinScreen() {
  background(0, 200, 0);
  fill(255);
  textSize(32);
  text("You Win!", width / 2 - 80, height / 2);
  textSize(16);
  text("Congratulations, you've freed the flies!", width / 2 - 140, height / 2 + 40);
}
