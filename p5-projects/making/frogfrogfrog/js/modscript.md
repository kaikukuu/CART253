// Game Variables
let fly;
let frogs = [];
let otherFlies = [];
let hearts = 3;
let level = 1;
const maxLevels = 3;

// Fly Object
function createFly() {
    return {
        x: 50,
        y: random(50, height - 50),
        size: 10,
        speed: 3,
        moveSpeed: 2
    };
}

// Frog Object
function createFrog(x, y) {
    return {
        x: x,
        y: y,
        tongueState: "idle",
        tongueY: y,
        tongueSpeed: 5,
        size: 30
    };
}

// Other Fly Object
function createOtherFly(x, y) {
    return {
        x: x,
        y: y,
        size: 5,
        speed: random(1, 2)
    };
}

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
    background(50, 150, 50); // Swamp background
    displayHearts();
    moveFly();
    drawFly();

    // Frog behavior
    for (let frog of frogs) {
        moveFrog(frog);
        drawFrog(frog);
        if (checkCollision(fly, frog)) {
            hearts--;
            resetFlyPosition();
            if (hearts <= 0) {
                displayLoseScreen();
            }
        }
    }

    // Other fly behavior
    for (let otherFly of otherFlies) {
        moveOtherFly(otherFly);
        drawOtherFly(otherFly);
        if (checkCollision(fly, otherFly)) {
            hearts -= 0.5;
            if (hearts <= 0) {
                displayLoseScreen();
            }
        }
    }

    // Check level completion
    if (fly.x > width) {
        level++;
        if (level <= maxLevels) {
            loadLevel(level);
            resetFlyPosition();
        } else {
            displayWinScreen();
        }
    }
}

// Display Hearts
function displayHearts() {
    fill(255);
    textSize(16);
    text("Hearts: " + hearts, 10, 20);
}

// Fly Movement with Keyboard Controls
function moveFly() {
    if (keyIsDown(LEFT_ARROW)) {
        fly.x -= fly.moveSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        fly.x += fly.moveSpeed;
    }
    if (keyIsDown(UP_ARROW)) {
        fly.y -= fly.moveSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        fly.y += fly.moveSpeed;
    }

    // Keep fly within screen bounds
    fly.x = constrain(fly.x, 0, width);
    fly.y = constrain(fly.y, 0, height);
}

function drawFly() {
    fill(0);
    ellipse(fly.x, fly.y, fly.size);
}

function resetFlyPosition() {
    fly.x = 50;
    fly.y = random(50, height - 50);
}

// Frog Movement and Tongue Action
function moveFrog(frog) {
    frog.x += random(-1, 1); // Slight movement
    frog.tongueY = frog.tongueState === "outbound" ? frog.tongueY - frog.tongueSpeed : frog.y;
    if (frog.tongueState === "idle" && random(100) > 98) {
        frog.tongueState = "outbound";
    } else if (frog.tongueState === "outbound" && frog.tongueY < frog.y - 50) {
        frog.tongueState = "inbound";
    } else if (frog.tongueState === "inbound" && frog.tongueY >= frog.y) {
        frog.tongueState = "idle";
    }
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

// Other Flies Movement
function moveOtherFly(otherFly) {
    otherFly.x += otherFly.speed;
    if (otherFly.x > width || otherFly.x < 0) {
        otherFly.speed *= -1; // Bounce back
    }
}

function drawOtherFly(otherFly) {
    fill(200, 100, 100);
    ellipse(otherFly.x, otherFly.y, otherFly.size);
}

// Collision Detection
function checkCollision(fly, obj) {
    let d = dist(fly.x, fly.y, obj.x, obj.y);
    return d < (fly.size / 2 + obj.size / 2);
}

// Win/Loss Screens
function displayWinScreen() {
    background(0, 200, 0);
    fill(255);
    textSize(32);
    text("You Win!", width / 2 - 80, height / 2);
    noLoop();
}

function displayLoseScreen() {
    background(200, 0, 0);
    fill(255);
    textSize(32);
    text("Game Over!", width / 2 - 100, height / 2);
    noLoop();
}

function mousePressed() {
    for (let frog of frogs) {
        if (frog.tongueState === "idle") {
            frog.tongueState = "outbound";
        }
    }
}

