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

let opacity = 0; // Starting opacity

function displayTitleScreen() {
    background(0);
    fill(255, 255, 255, opacity);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("The Fly's Vengeance!", width / 2, height / 2 - 40);
    textSize(16);
    text("Press any key to start", width / 2, height / 2 + 20);

    if (opacity < 255) opacity += 2; // Adjust speed as needed
}
let scrollPosition = 0;
let textOpacity = 0;

function displayCutScene1() {
    background(30);
    image(swamp1, -scrollPosition, 0); // Scroll the background
    scrollPosition += 1; // Adjust for scroll speed
    fill(255, 255, 255, textOpacity);
    textSize(16);
    textAlign(CENTER);
    text("Honored fly your kingdom has been overrun by the Frogs who have killed your father king fly in cold blood, taken your comrades prisoner and stolen the crown rightfully yours", width / 2, height / 2 - 40);

    if (textOpacity < 255) textOpacity += 3; // Fade in text
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
let boltCharge = 0;
let boltReady = false;

function keyPressed() {
    if (key === 'Shift') boltCharge = 0; // Start charging when shift is pressed
}

function keyReleased() {
    if (key === 'Shift' && boltReady) {
        fireElectricBolt();
        boltReady = false;
    }
}

function playGame() {
    if (keyIsDown(SHIFT) && boltCharge < 100) {
        boltCharge += 1; // Charge bolt
        if (boltCharge >= 100) boltReady = true; // Bolt is ready after full charge
    }
}

function fireElectricBolt() {
    // Define what happens when bolt is fired (e.g., damage frog king)
}

let shieldCooldown = 0;
let defenseMode = false;

function playGame() {
    if (keyIsDown(32) && shieldCooldown <= 0) {
        defenseMode = true;
        shieldCooldown = 180; // 3 seconds cooldown (approx. 60 fps)
    } else {
        defenseMode = false;
        shieldCooldown--;
    }
}

let notificationText = "";
let notificationTimer = 0;

function displayNotification(message) {
    fill(255, 0, 0);
    textSize(16);
    text(message, width / 2, height - 50);
}

function playGame() {
    if (defenseMode && frogHit) {
        notificationText = "Stunning!";
        notificationTimer = 60;
    } else if (playerHit) {
        notificationText = "Ouch!";
        notificationTimer = 60;
    }
    if (notificationTimer > 0) {
        displayNotification(notificationText);
        notificationTimer--;
    }
}

function moveFrog(frog) {
    if (dist(frog.x, frog.y, frog.targetLilyPad.x, frog.targetLilyPad.y) < 5) {
        frog.targetLilyPad = random(lilyPads); // Choose new lily pad target
    } else {
        frog.x += (frog.targetLilyPad.x - frog.x) * 0.05; // Adjust speed as needed
        frog.y += (frog.targetLilyPad.y - frog.y) * 0.05;
    }
}

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


function fadeInText(text, x, y, alpha) {
    fill(255, 255, 255, alpha);
    textSize(16);
    text(text, x, y);
}

function displayNotification(text) {
    fill(255, 100, 100);
    textSize(16);
    text(text, width / 2, height - 20);
}

function displayHearts() {
    for (let i = 0; i < fly.hearts; i++) {
        image(fullHeart, 20 + i * 20, 20, 16, 16); // Full hearts
    }
    // Logic to draw half-hearts
    //make heart image 1/2 opacity
}

function moveFrog(frog) {
    if (frameCount % 100 === 0) {
        frog.x = random(lilyPads).x;  // Move to random lily pad
        frog.y = random(lilyPads).y;
    }
}

let boltCharged = 0;  // Bolt charging status

function chargeElectricBolt() {
    if (keyIsDown(SHIFT)) {
        boltCharged += 1;
        if (boltCharged >= 100) {
            boltCharged = 100;  // Fully charged
            displayNotification("Bolt Charged!");
        }
    } else {
        boltCharged = 0;  // Reset if not charging
    }
}

function updateHealth() {
    if (fly.hearts <= 0) {
        gameState = "lose";
        displayGameOverScreen();
    } else if (fly.hearts === 1) {
        displayNotification("Warning: Health Critically Low!");
    }
}


function displayCutScene1() {
    scrollPosition += 1;  // Slow scroll effect
    image(background, scrollPosition, 0);

    if (scrollPosition > width) {
        scrollPosition = 0;
    }
    fill(255);
    text("Honored fly, your kingdom has been overrun...", 50, height - 50);
}

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

function displayGameOverScreen() {
    background(200, 0, 0);
    textSize(32);
    text("Game Over!", width / 2, height / 2);
    textSize(16);
    text(`Flies Freed: ${fliesFreed}`, width / 2, height / 2 + 40);
    text("Press any key to restart", width / 2, height / 2 + 80);
}

function keyPressed() {
    if (gameState === "win" || gameState === "lose") {
        resetGame(); // Restart game variables
    }
}
