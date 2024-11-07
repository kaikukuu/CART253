// Game Variables
let fly;
let frogs = [];
let otherFlies = [];
let hearts = 3;
let score = 0;
let level = 1;
const maxLevels = 3;
let gameState = "start"; // Possible states: "start", "playing", "win", "lose"
let opacity = 0; // Starting opacity for title screen
let scrollPosition = 0;
let textOpacity = 0;
let boltCharge = 0;
let boltReady = false;
let shieldCooldown = 0;
let notificationText = "";
let notificationTimer = 0;
let fliesFreed = 0; // For tracking freed flies
let backgroundOffset = 0;  // To scroll background
//Variables for Reset Period
let resetTimer = 0;
const resetDuration = 30;  // Frames for reset period after collision


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
    text("Electric Flash: Charge by holding Shift. You have one chance to release at the Frog King after successful charge.", width / 2, height / 2 + 80);
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

    // Reset the fly position after a brief delay (reset period)
    if (resetTimer > 0) {
        resetTimer--;  // Decrease reset timer each frame
    }

    // Update fly state based on health
    updateFlyState(fly);

    // Update fly movement and apply health effects
    moveFly(fly);
    applyHealthEffects(fly);

    // Display health (hearts) at the top of the screen
    displayHearts(fly);

    // Draw the fly (normal, stunned, or near-death)
    drawFly(fly);

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
    if (message !== "") {
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

function createFrog(x, y, isKing = false) {
    return {
        x: x,
        y: y,
        size: 100,
        stunned: false,
        stunTimer: 0,
        isKing: isKing,
        tongueState: "idle",  // Add this to track the tongue's state
        tongueY: y,  // Position for tongue
        tongueSpeed: 5,  // Speed for tongue movement
    };
}


function drawFrog(frog) {
    if (frog.stunned && frameCount - frog.stunTimer < 60) {
        tint(150);  // Grayscale for stunned effect
    } else {
        noTint();
    }

    if (frog.isKing) {
        image(frogKing, frog.x, frog.y, frog.size, frog.size);  // Display frog king image
        // Draw tongue for frog king
        image(frogKingTongue, frog.x + frog.size / 2, frog.y, frog.size / 2, frog.size / 2);
    } else {
        image(frogImage, frog.x, frog.y, frog.size, frog.size);  // Regular frog
        // Draw tongue dynamically for frogs
        image(frogTongue, frog.x + frog.size / 2, frog.y, frog.size / 2, frog.size / 2);
    }

    frog.stunned = false;  // Reset stunned state after drawing
}

function createFly(isPlayer = false) {
    return {
        x: 50,
        y: height / 2,
        size: 20,
        moveSpeed: 2,
        hearts: 3,
        electric: false,
        state: isPlayer ? 'normal' 
    };
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
    text("You Win!", width / 2 - 80, height / 2);
    image(crownImage, width / 2 - 50, height / 2 + 40, 100, 100);  // Show crown after frog king is defeated
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
    if (level === 1) {
        frogs = [createFrog(100, 100)];
        lilyPads = [createLilyPad(150, 150)];
        updateBackground();
    } else if (level === 2) {
        frogs = [createFrog(100, 100), createFrog(200, 200)];
        lilyPads = [createLilyPad(150, 150), createLilyPad(250, 250)];
        updateBackground();
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
    otherFlies = [];
    loadLevel(level);
}
