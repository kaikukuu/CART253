/**
 * Mod Jam: The Fly's Vengeance
 * Kaisa Catt
 * 
 * A game of escaping frogs and reclaiming the king fly's crown.
 * 
 * Instructions:
 * - 
 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Game Variables
let fly;
let frogs = [];
let hearts = 3;
let score = 0;
let level = 1;
let gameState = "start"; // Possible states: "start", "playing", "win", "lose"
let opacity = 0; // Starting opacity for title screen
let scrollPosition = 0;
let textOpacity = 0;
let shieldCooldown = 0;
let notificationText = "";
let notificationTimer = 0;
let backgroundOffset = 0;  // To scroll background
//Variables for Reset Period
let resetTimer = 0;
const resetDuration = 30;  // Frames for reset period after collision
let lilyPads = [];


// Image Assets I made
let flyImage, flyStun, flyNearDeath, deadFly, frogImage, frogTongue, lilyPadv1, lilyPadv2, fullHeartImage, emptyHeartImage, crown, swamp1, swamp2;

// Load images
function preload() {
    //loading fly assets
    fly = loadImage("assets/images/fly.png"); //
    flyStun = loadImage("assets/images/fly-stun.png"); //
    flyNearDeath = loadImage("assets/images/fly-hit.png");//
    deadFly = loadImage("assets/images/fly-dead.png");//

    //loading frog assets
    frogImage = loadImage("assets/images/frog.png");//

    //loading other game assets
    lilyPadv1 = loadImage("assets/images/lilypad-v1.png");//
    lilyPadv2 = loadImage("assets/images/lilypad-v2.png");//
    fullHeartImage = loadImage("assets/images/full-hearts.png");//
    emptyHeartImage = loadImage("assets/images/empty-hearts.png");//
    crown = loadImage("assets/images/crown.png");//

    //backgrounds
    swamp1 = loadImage("assets/images/swamp1.png"); //
    swamp2 = loadImage("assets/images/swamp2.png");//
}

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
    text("Honored fly, your kingdom has been overrun by the Frogs who have killed your father king fly in cold blood, taken your comrades prisoner, and stolen the crown rightfully yours. As the fly kingdom's last hope you have been bestowed the power of the friction of thousands of wings with the ultimate weapon and shield: electricity.", width / 2, height / 2 - 40);

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
    text("Electric Shield: Hold Space to activate and stun frogs in case you are hit by their tongue.", width / 2, height / 2 + 120);
    text("Make it to the other end of the frog swamp and reclaim your crown without running into frogs or getting eaten.", width / 2, height / 2 + 80);
}

// Main draw loop based on game state
function draw() {
    if (gameState === "start") {
        displayTitleScreen();
    } else if (gameState === "playing") {
        updateBackground(); // Continuously update background
        playGame();
    } else if (gameState === "win") {
        displayWinScreen();
    } else if (gameState === "lose") {
        displayLoseScreen();
    }

    // Reset the fly position after a brief delay (reset period)
    if (resetTimer > 0) {
        resetTimer--;  // Decrease reset timer each frame
    }

    // Draw the fly (normal, stunning shield, or near-death)
    drawFly(fly);
    updateFlyState(fly);// Update fly state based on health
    moveFly(fly);// Update fly movement and apply health effects
    applyHealthEffects(fly);// Display health (hearts) at the top of the screen
    displayHearts(fly);

    // Check for collisions with frogs
    for (let frog of frogs) {
        if (checkFrogCollision(fly, frog)) {
            handleCollision(fly, frog);  // Apply damage for body collision
        }

        if (checkTongueCollision(fly, frog)) {
            handleTongueCollision(fly, frog);  // Apply damage for tongue collision
        }

        drawFrog(frog);  // Draw the frog (and tongue)
    }

    // Display the notification text
    displayNotification(notificationText);
    updateNotification();
}

// Display notification text on screen
function displayNotification(message) {
    if (message !== "") { //if message is not empty/clearing
        fill(255, 100, 100);
        textSize(16);
        text(message, width / 2, height - 40);
    }
}

// Update notification timer
function updateNotification() {
    if (notificationTimer > 0) {
        notificationTimer--; // Decrease timer each frame
    } else {
        notificationText = ""; // Clear message after timer expires
    }
}


function createLilyPad(x, y) {
    let padType = random() > 0.5 ? lilyPadv1 : lilyPadv2;  // Randomize between two lily pads
    return { x: x, y: y, size: 40, image: padType };
}

function drawLilyPad(lilyPad) {
    image(lilyPad.image, lilyPad.x, lilyPad.y, lilyPad.size, lilyPad.size);
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "nothing") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    if (dist(fly.x, fly.y, frog.tongue.x, frog.tongue.y) < fly.size / 2) {
        handleTongueCollision(fly, frog);
    }
}

function createFrog(x, y) {
    return {
        body: {
            x: x,
            y: y,
            size: 100,
            stunned: false,
            stunTimer: 0,
        },

        tongue: {
            // The frog's tongue has a position, size, speed, and state
            x: x,
            y: y,
            size: 20,
            speed: 10,
            // Determines how the tongue moves each frame
            state: "idle"// State can be: idle, outbound, inbound
        }

    }
}


function drawFrog(frog) {
    if (frog.stunned && frameCount - frog.stunTimer < 60) {
        tint(150);  // Grayscale for stunned effect
    } else {
        noTint();
    }
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();
    //Draw frog img
    //CHECK POSITIONING
    image(frogImage, frog.body.x, frog.body.y, frog.body.size, frog.body.size); // Regular frog

    frog.stunned = false;  // Reset stunned state after drawing
}

function createFly() {
    return {
        x: 50,
        y: height / 2,
        size: 20,
        moveSpeed: 2,
        hearts: 3,
        electric: false
    }
}

function updateFlyState(fly) {
    if (fly.hearts <= 1) {
        fly.state = 'nearDeath';
    } else if (fly.electric) {
        fly.state = 'stun';  // Apply stun state when electric is active
    } else {
        fly.state = 'normal';  // Default state for fly
    }
}

function drawFly(fly) {
    if (fly.state === 'stun') {
        image(flyStun, fly.x, fly.y, fly.size, fly.size);
    } else if (fly.state === 'nearDeath') {
        image(flyNearDeath, fly.x, fly.y, fly.size, fly.size);
    } else {
        image(flyImage, fly.x, fly.y, fly.size, fly.size);
    }
}

// Collision detection with frog body
function checkFrogCollision(fly, frog) {
    let d = dist(fly.x, fly.y, frog.x, frog.y);
    if (d < (fly.size / 2 + frog.size / 2)) {
        // Collided with the frog body
        return true;
    }
    return false;
}

// Collision detection with frog's tongue
function checkTongueCollision(fly, frog) {
    let tongueX = frog.x + frog.size / 2;
    let tongueY = frog.y;
    let tongueWidth = frog.size / 2; // Adjust width of tongue for collision detection
    let tongueHeight = frog.size; // Adjust height of tongue for collision detection

    let d = dist(fly.x, fly.y, tongueX, tongueY);
    if (d < tongueWidth / 2 + fly.size / 2) {
        // Collided with the frog's tongue end
        return true;
    }
    return false;
}

// Apply damage when a collision occurs
function handleCollision(fly, frog) {
    if (resetTimer === 0) { // Only apply damage if not in reset period
        fly.hearts -= 1;
        resetTimer = resetDuration;  // Start reset period
        notificationText = "Ouch! Frog Body Hit!";
    }
}

// Handle frog tongue collision
function handleTongueCollision(fly, frog) {
    if (resetTimer === 0) { // Only apply damage if not in reset period
        fly.hearts -= 1;
        resetTimer = resetDuration;  // Start reset period
        notificationText = "Yikes! Frog Tongue Hit!";
    }
}


// Display the score
function displayScore() {
    fill(255);
    textSize(16);
    text("Frogs evaded: " + score, 10, 60);
}

function moveFly(fly) {
    if (resetTimer > 0) {
        return; // Skip movement during reset period
    }

    let jitterX = random(2 * -fly, fly);
    let jitterY = random(-fly / 2, fly);

    // Adjust jitter based on health level (more jitter for low health)
    if (fly.hearts <= 1) {  // If health is at 1 heart or less, increase jitter
        jitterX *= 2;  // Double the jitter
        jitterY *= 2;  // Double the jitter
    }

    // Control fly movement
    if (keyIsDown(LEFT_ARROW)) fly.x -= fly.moveSpeed + jitterX;
    if (keyIsDown(RIGHT_ARROW)) fly.x += fly.moveSpeed + jitterX;
    if (keyIsDown(UP_ARROW)) fly.y -= fly.moveSpeed + jitterY;
    if (keyIsDown(DOWN_ARROW)) fly.y += fly.moveSpeed + jitterY;

    // Ensure fly stays within screen bounds
    fly.x = constrain(fly.x, 0, width);
    fly.y = constrain(fly.y, 0, height);
}

    if (frog.tongueState === "outbound") {
        frog.tongueY -= frog.tongueSpeed;
        if (frog.tongueY < frog.y - 50) frog.tongueState = "inbound";
    } else if (frog.tongueState === "inbound" && frog.tongueY >= frog.y) {
        frog.tongueState = "idle";
    } else if (frog.tongueState === "idle" && random(100) > 98) {
        frog.tongueState = "outbound";
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
    text("You reclaimed your crown!", width / 2 - 80, height / 2);
    image(crownImage, width / 2 - 50, height / 2 + 40, 100, 100);
}

// Display game over screen with score
function displayLoseScreen() {
    background(200, 0, 0);
    fill(255);
    textSize(32);
    text("Game Over!", width / 2, height / 2);
    textSize(16);
    text("Press any key to restart", width / 2, height / 2 + 80);
}

// Handle key events for starting, playing, and resetting game
function keyPressed() {
    if (gameState === "start") gameState = "playing";
    else if (gameState === "win" || gameState === "lose") resetGame();
}

function displayHearts(fly) {
    let heartImage = fullHeartImage; // Default to full heart image
    let xPos = width - 120; // Position for the hearts, starts from the right

    // Display 3 hearts (each heart represents 1 health point)
    for (let i = 0; i < 3; i++) {
        if (fly.hearts <= i) {
            heartImage = emptyHeartImage; // Display empty heart when health is reduced
        } else {
            heartImage = fullHeartImage; // Full heart when health is intact
        }
        image(heartImage, xPos, 20, 30, 30);  // Draw heart
        xPos -= 40;  // Move the next heart to the left
    }
}

// Load specific level configurations
function loadLevel(level) {
    frogs = []; // Clear any existing frogs
    lilyPads = []; // Clear any existing lily pads
    if (level === 1) {
        frogs = [createFrog(100, 100)];
        lilyPads = [createLilyPad(150, 150)];

    } else if (level === 2) {
        frogs = [createFrog(100, 100), createFrog(200, 200)];
        lilyPads = [createLilyPad(150, 150), createLilyPad(250, 250)];
    }
}

function updateBackground() {
    backgroundOffset += 2;  // Move the background left to right
    if (backgroundOffset >= width) {
        backgroundOffset = 0;  // Reset to start when the player reaches the right side
        level++;  // Change the level to transition to a new area
    }

    if (level === 1) {
        image(swamp1, -backgroundOffset, 0, width, height);
    } else if (level === 2) {
        image(swamp2, -backgroundOffset, 0, width, height);
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
    loadLevel(level);
}
