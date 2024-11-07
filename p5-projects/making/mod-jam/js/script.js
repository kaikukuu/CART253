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
let lilyPads = []; // Array to store lily pads


// Image Assets I made
let flyImage, flyStun, flyNearDeath, deadFly, frogImage, lilyPadv1, lilyPadv2, fullHeartImage, emptyHeartImage, crown, swamp1, swamp2;

// Load images
function preload() {
    //loading fly assets
    flyImage = loadImage("assets/images/fly.png"); //
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

// Main draw loop based on game state
function draw() {
    if (gameState === "start") {
        displayTitleScreen();
    } else if (gameState === "cutScene") {
        displayCutScene1();
    } else if (gameState === "playing") {
        updateBackground(); // Continuously update background
        playGame();
    } else if (gameState === "win") {
        displayWinScreen();
    } else if (gameState === "lose") {
        displayLoseScreen();
    }

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

    if (opacity < 255) opacity += 5; // Faster visibility for fade-in effect

}


function playGame() {
    displayHearts();
    drawFly();
    moveFly();

    for (let lilyPad of lilyPads) {
        image(lilyPad.image, lilyPad.x, lilyPad.y, lilyPad.size, lilyPad.size); // Draw the lily pad
    }

    for (let frog of frogs) {
        if (checkFrogCollision(fly, frog)) handleCollision();
        drawFrog(frog);
    }
}

function displayHearts() {
    let xPos = width - 50;
    for (let i = 0; i < 3; i++) {
        let heartImage = fly.hearts <= i ? emptyHeartImage : fullHeartImage;
        image(heartImage, xPos, 20, 30, 30);
        xPos -= 40;
    }
}

/**
 * Handles the fly controlled by player
 */

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


function drawFly() {
    let imageToDraw = flyImage;
    if (fly.hearts <= 1) imageToDraw = flyNearDeath;
    else if (fly.electric) imageToDraw = flyStun;
    image(imageToDraw, fly.x, fly.y, fly.size, fly.size);
}
//Player controls for fly movement
function moveFly() {
    if (keyIsDown(LEFT_ARROW)) fly.x -= fly.moveSpeed;
    if (keyIsDown(RIGHT_ARROW)) fly.x += fly.moveSpeed;
    if (keyIsDown(UP_ARROW)) fly.y -= fly.moveSpeed;
    if (keyIsDown(DOWN_ARROW)) fly.y += fly.moveSpeed;
    fly.x = constrain(fly.x, 0, width);
    fly.y = constrain(fly.y, 0, height);
}

function checkFrogCollision(fly, frog) {
    return dist(fly.x, fly.y, frog.body.x, frog.body.y) < 30;
}
// Apply damage when a collision occurs
function handleCollision(fly, frog) {
    if (resetTimer === 0) { // Only apply damage if not in reset period
        fly.hearts -= 1;
        resetTimer = resetDuration;  // Start reset period
        notificationText = "Ouch! Frog Body Hit!";
    }
}

/**
 * Loads and reloads level
 */

function loadLevel(level) {
    frogs = [];
    lilyPads = [];
    if (level === 1) {
        frogs.push(createFrog(100, 100), createFrog(200, 200), createFrog(200, 200));
        lilyPads.push(createLilyPad(150, 150), createLilyPad(250, 250), createLilyPad(150, 150));
    }
}

/**
 * Handles the creation of frogs systematically
 */

function createFrog(x, y) {
    return {
        body: { x, y, size: 125, stunned: false, stunTimer: 0 },
        tongue: { x, y, size: 20, speed: 10, state: "idle" }
    };
}

function drawFrog(frog) {
    image(frogImage, frog.body.x, frog.body.y, frog.body.size, frog.body.size);
}

function createLilyPad(x, y) {
    let padType = random() > 0.5 ? lilyPadv1 : lilyPadv2;  // Randomize between two lily pads
    return { x: x, y: y, size: 100, image: padType };
}

function drawLilyPads(lilyPads) {
    for (let lilyPad of lilyPads) {
        image(lilyPad.image, lilyPad.x, lilyPad.y, lilyPad.size, lilyPad.size); // Draw the lily pad
    }
}

function resetGame() {
    level = 1;
    fly.hearts = 3;
    resetFlyPosition();
    gameState = "playing";  // Ensure the game starts over
}


function resetFlyPosition() {
    fly.x = 50;
    fly.y = height / 2;
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

// Updated Tongue Movement Function with Frog Parameter
function moveTongue(frog) {
    if (frog.tongueState === "outbound") {
        frog.tongueY -= frog.tongueSpeed;
        if (frog.tongueY < frog.body.y - 50) {
            frog.tongueState = "inbound";
        }
    } else if (frog.tongueState === "inbound") {
        frog.tongueY += frog.tongueSpeed;
        if (frog.tongueY > frog.body.y) {
            frog.tongueState = "idle";
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

/**
 * Handles the fly's states and visual changes
 */

function updateFlyState(fly) {
    if (fly.hearts <= 1) {
        fly.state = 'nearDeath';
    } else if (fly.electric) {
        fly.state = 'stun';  // Apply stun state when electric is active
    } else {
        fly.state = 'normal';  // Default state for fly
    }
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

// Check for collisions between fly and objects
function checkCollision(fly, obj) {
    let d = dist(fly.x, fly.y, obj.x, obj.y);
    return d < (fly.size / 2 + obj.size / 2);
}

// Win Screen
function displayWinScreen() {
    background(0, 0, 0, 180);  // Dark overlay for the win screen
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text("You win! The fly's mission is complete!", width / 2, height / 2 - 50);
    text("You reclaimed your crown!", width / 2 - 80, height / 2);

    image(crown, width / 2 - 50, height / 2 + 20, 100, 100);  // Display crown
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
    if (gameState === "startFirst") displayCutScene1(), gameState = "cutScene"
    else if (gameState === "start") gameState = "playing";
    else if (gameState === "win" || gameState === "lose") resetGame();
}

// Updated Background Transition and Level Logic
function updateBackground() {
    image(level === 1 ? swamp1 : swamp2, -backgroundOffset, 0, width, height);
    backgroundOffset += 1;
    if (backgroundOffset >= width && level < 2) {
        backgroundOffset = 0;
        level++;
    }
}
