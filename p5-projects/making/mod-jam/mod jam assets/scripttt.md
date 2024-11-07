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
let opacity = 0; // Starting opacity for title screen
let scrollPosition = 0;
let textOpacity = 0;
let boltCharge = 0;
let boltReady = false;
let shieldCooldown = 0;
let defenseMode = false;
let notificationText = "";
let notificationTimer = 0;
let fliesFreed = 0; // For tracking freed flies

// Setup canvas and initial game objects
function setup() {
    createCanvas(640, 480);
    fly = createFly();
    loadLevel(level);
}

// Display the title screen with a fade-in effect
function displayTitleScreen() {
    background(0);
    fill(255, 255, 255, opacity);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("The Fly's Vengeance!", width / 2, height / 2 - 40);
    textSize(16);
    text("Press any key to start", width / 2, height / 2 + 20);

    if (opacity < 255) opacity += 2; // Increase opacity for fade-in effect
}
function displayCutScene1() {
    background(30);
    image(swamp1, -scrollPosition, 0); // Scroll the background
    scrollPosition += 1; // Adjust for scroll speed
    fill(255, 255, 255, textOpacity);
    textSize(16);
    textAlign(CENTER);
    text("Honored fly, your kingdom has been overrun by the Frogs who have killed your father king fly in cold blood, taken your comrades prisoner, and stolen the crown rightfully yours.", width / 2, height / 2 - 40);

    if (textOpacity < 255) textOpacity += 3; // Fade in text

    if (textOpacity >= 255) {
        displayPlayerGuide(); // Display player guide after the first cutscene
    }
}

// Player guide function for controls and strategy
function displayPlayerGuide() {
    fill(255);
    textSize(14);
    textAlign(CENTER);
    text("Player Guide", width / 2, height / 2 + 50);
    text("Electric Flash: Charge by holding Shift. Release at the Frog King.", width / 2, height / 2 + 80);
    text("Note: While charging, your shield will be down. Proceed with caution!", width / 2, height / 2 + 100);
    text("Electric Shield: Hold Space to activate and stun nearby frogs.", width / 2, height / 2 + 120);
    text("Unlock Prisoner Flies: Hold Space and click on the lock to free flies.", width / 2, height / 2 + 140);
}

// Main draw loop based on game state
function draw() {
    if (gameState === "start") {
        displayTitleScreen();
    } else if (gameState === "playing") {
        playGame();
    } else if (gameState === "win") {
        displayWinScreen();
    } else if (gameState === "lose") {
        displayLoseScreen();
    }
}

// Display the score
function displayScore() {
    fill(255);
    textSize(16);
    text("Frogs evaded: " + score, 10, 60);
}

// Move the player fly based on arrow keys
function moveFly() {
    if (keyIsDown(LEFT_ARROW)) fly.x -= fly.moveSpeed;
    if (keyIsDown(RIGHT_ARROW)) fly.x += fly.moveSpeed;
    if (keyIsDown(UP_ARROW)) fly.y -= fly.moveSpeed;
    if (keyIsDown(DOWN_ARROW)) fly.y += fly.moveSpeed;

    fly.x = constrain(fly.x, 0, width);
    fly.y = constrain(fly.y, 0, height);
}

// Move frogs randomly with tongue attack behavior
function moveFrog(frog) {
    if (frameCount % 100 === 0) {
        frog.targetLilyPad = random(lilyPads);
    }
    frog.x += (frog.targetLilyPad.x - frog.x) * 0.05;
    frog.y += (frog.targetLilyPad.y - frog.y) * 0.05;

    if (frog.tongueState === "outbound") {
        frog.tongueY -= frog.tongueSpeed;
        if (frog.tongueY < frog.y - 50) frog.tongueState = "inbound";
    } else if (frog.tongueState === "inbound" && frog.tongueY >= frog.y) {
        frog.tongueState = "idle";
    } else if (frog.tongueState === "idle" && random(100) > 98) {
        frog.tongueState = "outbound";
    }
}

// Move other flies horizontally with collision detection
function moveOtherFly(otherFly) {
    otherFly.x += otherFly.speed;
    if (otherFly.x > width || otherFly.x < 0) otherFly.speed *= -1;
}

// Draw other flies
function drawOtherFly(otherFly) {
    fill(200, 100, 100);
    ellipse(otherFly.x, otherFly.y, otherFly.size);
}

// Check for collisions between fly and objects
function checkCollision(fly, obj) {
    let d = dist(fly.x, fly.y, obj.x, obj.y);
    return d < (fly.size / 2 + obj.size / 2);
}

// Display game win screen
function displayWinScreen() {
    background(0, 200, 0);
    fill(255);
    textSize(32);
    text("You Win!", width / 2, height / 2);
}

// Display game over screen with score
function displayLoseScreen() {
    background(200, 0, 0);
    fill(255);
    textSize(32);
    text("Game Over!", width / 2, height / 2);
    textSize(16);
    text(`Flies Freed: ${fliesFreed}`, width / 2, height / 2 + 40);
    text("Press any key to restart", width / 2, height / 2 + 80);
}

// Handle key events for starting, playing, and resetting game
function keyPressed() {
    if (gameState === "start") gameState = "playing";
    else if (gameState === "win" || gameState === "lose") resetGame();
}

// Electric bolt charging and firing
function chargeElectricBolt() {
    if (keyIsDown(SHIFT)) {
        boltCharge += 1;
        if (boltCharge >= 100) {
            boltReady = true;
            displayNotification("Bolt Charged!");
        }
    } else {
        boltCharge = 0;
        boltReady = false;
    }
}

function fireElectricBolt() {
    if (boltReady) {
        // Fire bolt logic
        boltReady = false;
    }
}

// Display notifications for critical moments
function displayNotification(message) {
    fill(255, 100, 100);
    textSize(16);
    text(message, width / 2, height - 20);
}

// Display the player's hearts as lives
function displayHearts() {
    for (let i = 0; i < hearts; i++) {
        image(fullHeart, 20 + i * 20, 20, 16, 16); // Full hearts
    }
}

// Load specific level configurations
function loadLevel(level) {
    if (level === 1) {
        frogs = [createFrog(100, 100)];
        lilyPads = [createLilyPad(150, 150)];
        backgroundImage = swamp1;
    } else if (level === 2) {
        frogs = [createFrog(100, 100), createFrog(200, 200)];
        lilyPads = [createLilyPad(150, 150), createLilyPad(250, 250)];
        backgroundImage = swamp2;
    }
}

// Right-click to free captured flies with space bar held
function mousePressed() {
    if (mouseButton === RIGHT && keyIsDown(32)) {
        for (let capturedFly of capturedFlies) {
            if (capturedFly.locked && dist(mouseX, mouseY, capturedFly.x, capturedFly.y) < 20) {
                capturedFly.locked = false;
                fliesFreed++;
            }
        }
    }
}

// Reset game to initial state
function resetGame() {
    hearts = 3;
    score = 0;
    level = 1;
    gameState = "start";
    fly = createFly();
    frogs = [];
    otherFlies = [];
    loadLevel(level);
}
