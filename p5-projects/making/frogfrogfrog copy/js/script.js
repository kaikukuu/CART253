// Game Variables
let fly;
let frogs = [];
let otherFlies = [];
let hearts = 3;
let score = 0;
let level = 1;
const maxLevels = 3;
let gameState = "start"; // Possible states: "start", "playing", "win", "lose"
let captureEffect = false;

// Setup function to initialize canvas and objects
function setup() {
    createCanvas(640, 480);
    fly = createFly();
    loadLevel(level);
}

// Load level function to set up new levels with frogs and flies
function loadLevel(level) {
    hearts = 3;
    frogs = [];
    otherFlies = [];
    let numFrogs = level + 1;
    let numOtherFlies = level * 2;

    // Create frogs with increasing number per level
    for (let i = 0; i < numFrogs; i++) {
        let frogX = random(100, width - 100);
        let frogY = random(100, height - 100);
        frogs.push(createFrog(frogX, frogY));
    }

    // Create other flies with increasing number per level
    for (let i = 0; i < numOtherFlies; i++) {
        let flyX = random(100, width - 100);
        let flyY = random(100, height - 100);
        otherFlies.push(createOtherFly(flyX, flyY));
    }
}

// Main draw loop
function draw() {
    if (gameState === "start") {
        displayStartScreen();
    } else if (gameState === "playing") {
        playGame();
    } else if (gameState === "win") {
        displayWinScreen();
    } else if (gameState === "lose") {
        displayLoseScreen();
    }
}

function displayStartScreen() {
    background(30);
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("Fly Adventure!", width / 2, height / 2 - 40);
    textSize(16);
    text("Press any key to start", width / 2, height / 2);
    text("Use arrow keys to move and avoid frogs!", width / 2, height / 2 + 40);
}

function playGame() {
    background(50, 150, 50); // Swamp background

    displayHearts();
    displayScore();

    moveFly();
    drawFly();

    // Handle frog movements and display
    for (let frog of frogs) {
        moveFrog(frog);
        drawFrog(frog);
        if (checkCollision(fly, frog)) {
            hearts -= 1; // Lose 1 full heart
            score -= 5;
            captureEffect = true;
            if (hearts <= 0) {
                gameState = "lose";
            }
        }
    }

    // Handle other fly movements and collisions
    for (let otherFly of otherFlies) {
        moveOtherFly(otherFly);
        drawOtherFly(otherFly);
        if (checkCollision(fly, otherFly)) {
            hearts -= 0.5; // Lose half a heart
            score -= 3;
            if (hearts <= 0) {
                gameState = "lose";
            }
        }
    }

    // Check if fly reaches end of level
    if (fly.x > width) {
        level++;
        score += 20; // Bonus for reaching the end of each level
        if (level <= maxLevels) {
            loadLevel(level);
            resetFlyPosition();
            fly.speed += fly.speedIncrease; // Increase fly's speed for added challenge
        } else {
            gameState = "win";
        }
    }
}

// Fly Object Creation and Drawing
function createFly() {
    return {
        x: 50,
        y: random(50, height - 50),
        size: 10,
        speed: 3,
        moveSpeed: 2,
        speedIncrease: 0.1 // gradual speed increase
    };
}

function drawFly() {
    if (captureEffect) {
        fill(255, 0, 0, 150);
        captureEffect = false;
    } else {
        fill(0);
    }
    ellipse(fly.x, fly.y, fly.size);
}

// Frog Object Creation and Drawing
function createFrog(x, y) {
    return {
        x: x,
        y: y,
        tongueState: "idle",
        tongueY: y,
        tongueSpeed: 5,
        size: 100
    };
}

function drawFrog(frog) {
    fill(0, 100, 0);
    ellipse(frog.x, frog.y, frog.size);
    if (frog.tongueState !== "idle") {
        stroke(255, 0, 0);
        line(frog.x, frog.y, frog.x, frog.tongueY);
        noStroke();
    }
}

// Other Fly Object Creation and Drawing
function createOtherFly(x, y) {
    return {
        x: x,
        y: y,
        size: 10,
        speed: random(1, 2)
    };
}

function drawOtherFly(otherFly) {
    fill(200, 100, 100);
    ellipse(otherFly.x, otherFly.y, otherFly.size);
}

// Display Functions for Hearts and Score
function displayHearts() {
    let fullHearts = Math.floor(hearts);
    let halfHearts = (hearts % 1) >= 0.5 ? 1 : 0;
    let emptyHearts = 3 - fullHearts - halfHearts;

    let heartX = 10;
    let heartY = 20;
    let heartSize = 20;

    fill(255, 0, 0);
    for (let i = 0; i < fullHearts; i++) {
        ellipse(heartX + i * (heartSize + 5), heartY, heartSize, heartSize);
    }

    if (halfHearts === 1) {
        fill(255, 0, 0);
        arc(heartX + fullHearts * (heartSize + 5), heartY, heartSize, heartSize, PI, 0);
    }

    fill(100);
    for (let i = 0; i < emptyHearts; i++) {
        ellipse(heartX + (fullHearts + halfHearts + i) * (heartSize + 5), heartY, heartSize, heartSize);
    }
}

function displayScore() {
    fill(255);
    textSize(16);
    text("Score: " + score, 10, 40);
}

// Movement and Position Reset Functions
function moveFly() {
    if (keyIsDown(LEFT_ARROW)) fly.x -= fly.moveSpeed;
    if (keyIsDown(RIGHT_ARROW)) fly.x += fly.moveSpeed;
    if (keyIsDown(UP_ARROW)) fly.y -= fly.moveSpeed;
    if (keyIsDown(DOWN_ARROW)) fly.y += fly.moveSpeed;

    fly.x = constrain(fly.x, 0, width);
    fly.y = constrain(fly.y, 0, height);
}

function resetFlyPosition() {
    fly.x = 50;
    fly.y = random(50, height - 50);
}

// Key Events
function keyPressed() {
    if (gameState === "start") {
        gameState = "playing";
    }
}
