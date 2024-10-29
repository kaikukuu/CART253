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


//function to set up canvas and game objects
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
    textSize(10);
    textAlign(CENTER);
    textWrap(WORD);
    text("Honored fly your kingdom has been overrun by the Frogs who have killed your father king fly in cold blood, taken your comrades prisoner and stolen the crown rightfully yours", width / 6, height / 2 - 150);

    textSize(32);
    textAlign(CENTER);
    textWrap(WORD);
    text("Fly Adventure!", width / 2 - 80, height / 2 - 40);
    textSize(16);
    text("Press any key to start", width / 2 - 60, height / 2);
    text("Use arrow keys to move and avoid frogs!", width / 2 - 100, height / 2 + 40);
}

function playGame() {
    background(50, 150, 50); // Swamp background

    displayHearts();
    displayScore();

    moveFly();
    drawFly();

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
}
// Fly Object
function createFly() {
    return {
        x: 50,
        y: random(50, height - 50),
        size: 10,
        speed: 3,
        moveSpeed: 2,
        speedIncrease: 0.1, // gradual speed increase
        buzziness: 4 //need to work on implementing buzziness

    };
}

// Frog Object
function createFrog(x, y) {
    return {
        x: x,
        y: y,
        tongueState: "idle",
        tongueY: x * y,
        tongueSpeed: 5,
        size: 100
    };
}

// Other Fly Object
function createOtherFly(x, y) {
    return {
        x: x,
        y: y,
        size: 10,
        speed: random(1, 2)
    };
}

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


function displayHearts() {
    let fullHearts = Math.floor(hearts);
    let halfHearts = (hearts % 1) >= 0.5 ? 1 : 0;
    let emptyHearts = 3 - fullHearts - halfHearts; // Starting with 3 max hearts

    // Set position to start drawing hearts
    let heartX = 20;
    let heartY = 20;
    let heartSize = 30;

    // Display full hearts
    fill(255, 0, 0); // Red for full hearts
    for (let i = 0; i < fullHearts; i++) {
        ellipse(heartX + i * (heartSize + 5), heartY, heartSize, heartSize);
    }

    // Display half heart if applicable
    if (halfHearts === 1) {
        fill(255, 0, 0); // Red for half heart
        arc(heartX + fullHearts * (heartSize + 5), heartY, heartSize, heartSize, PI, 0); // Half-heart arc
    }

    // Display empty hearts
    fill(100); // Gray for empty hearts
    for (let i = 0; i < emptyHearts; i++) {
        ellipse(heartX + (fullHearts + halfHearts + i) * (heartSize + 5), heartY, heartSize, heartSize);
    }
}


function displayScore() {
    fill(255);
    textSize(16);
    text("Frogs evaded: " + score, 10, 60);
}
/**
 * Moves the fly by changing its position randomly
 * according to its buzziness
 */
function moveFly(fly) {
    fly.x += random(-fly.buzziness, fly.buzziness);
    fly.y += random(-fly.buzziness, fly.buzziness);
}

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

    fly.x = constrain(fly.x, 0, width);
    fly.y = constrain(fly.y, 0, height);
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

function resetFlyPosition() {
    fly.x = 50;
    fly.y = random(50, height - 50);
}

function moveFrog(frog) {
    frog.x += random(-1, 1);
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
        strokeWeight(10);
        line(frog.x, frog.y, frog.x, frog.tongueY);
        noStroke();
    }
}

function moveOtherFly(otherFly) {
    otherFly.x += otherFly.speed;
    if (otherFly.x > width || otherFly.x < 0) {
        otherFly.speed *= -1;
    }
}

function drawOtherFly(otherFly) {
    fill(200, 100, 100);
    ellipse(otherFly.x, otherFly.y, otherFly.size);
}

function checkCollision(fly, obj) {
    let d = dist(fly.x, fly.y, obj.x, obj.y);
    return d < (fly.size / 2 + obj.size / 2);
}

function displayWinScreen() {
    background(0, 200, 0);
    fill(255);
    textSize(32);
    text("You Win!", width / 2 - 80, height / 2);
}

function displayLoseScreen() {
    background(200, 0, 0);
    fill(255);
    textSize(32);
    text("Game Over!", width / 2 - 100, height / 2);
}

function keyPressed() {
    if (gameState === "start") {
        gameState = "playing";
    }
}