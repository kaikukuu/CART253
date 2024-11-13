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
    text("Fly Adventure!", width / 2 - 80, height / 2 - 40);
    textSize(16);
    text("Press any key to start", width / 2 - 60, height / 2);
    text("Use arrow keys to move and avoid frogs!", width / 2 - 120, height / 2 + 40);
}

function playGame() {
    background(50, 150, 50); // Swamp background

    displayHearts();
    displayScore();

    moveFly();
    drawFly();

    // Handle frog movements and collisions
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

// Display functions, collision checks, movement controls, and other utilities follow...

// Example of displayHearts() and displayScore()
function displayHearts() {
    // Code to display hearts as you defined previously
}

function displayScore() {
    fill(255);
    textSize(16);
    text("Score: " + score, 10, 40);
}

function keyPressed() {
    if (gameState === "start") {
        gameState = "playing";
    }
}
