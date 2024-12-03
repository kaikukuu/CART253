"use strict";

/** === GLOBAL VARIABLES === */
const gameState = {
    constellationsData: null,
    selectedConstellations: [],
    scrambledConstellations: [],
    telescope: { x: 400, y: 400, radius: 100 },
    selectedStar: null,
    offsetX: 0,
    offsetY: 0,
    showGhosts: true,
    notificationTimeout: null,
    gameStarted: false,
    correctSound: null,
    incorrectSound: null,
};

let inputName, inputAge, inputShape, startButton, predefinedShapesLabel;

/** === PRELOAD ASSETS === */
function preload() {
    try {
        gameState.correctSound = loadSound('data/sound/correct.mp3');
        gameState.incorrectSound = loadSound('data/sound/incorrect.mp3');
        gameState.constellationsData = loadJSON(
            'data/JSON/constellations.json',
            () => console.log("Constellations loaded."),
            () => console.error("Failed to load constellations.json.")
        );
    } catch (e) {
        console.error("Error during preload:", e);
    }
}

/** === INITIAL SETUP === */
function setup() {
    createCanvas(800, 800);
    textFont('Georgia');
    noLoop();
    setupStartScreen();
}

/** === START SCREEN === */
function setupStartScreen() {
    const centerX = width / 2, centerY = height / 2;

    createInputField("The first letter of your name:", "Uppercase", centerX - 100, centerY - 140, (value) => inputName = value);
    createInputField("Your age (1-100):", "Number", centerX - 100, centerY - 70, (value) => inputAge = value);
    createInputField("A shape you feel most connected to:", "Lowercase", centerX - 100, centerY, (value) => inputShape = value);

    predefinedShapesLabel = createP("circle, star, square, triangle, hexagon").style('color', 'white').position(centerX - 100, centerY + 20);

    startButton = createButton('Start Game').position(centerX - 50, centerY + 120).mousePressed(startGame);
}

function createInputField(labelText, transform, x, y, callback) {
    createP(labelText).position(x, y).style('color', 'white').style('font-size', '16px');
    let inputField = createInput().position(x, y + 30).size(200);
    if (transform === "Uppercase") inputField.input(() => callback(inputField.value().toUpperCase()));
    else if (transform === "Lowercase") inputField.input(() => callback(inputField.value().toLowerCase()));
    else if (transform === "Number") inputField.attribute('type', 'number').input(() => callback(inputField.value()));
}

/** === GAME START === */
function startGame() {
    const nameValue = inputName.value().toUpperCase();
    const ageValue = parseInt(inputAge.value(), 10);
    const shapeValue = inputShape.value().toLowerCase();

    if (!nameValue || isNaN(ageValue) || ageValue < 1 || ageValue > 100 || !shapeValue) {
        return alert("Please fill in all fields correctly. Age should be between 1 and 100.");
    }

    generateSessionConstellations({ letter: nameValue, age: ageValue, shape: shapeValue });
    removeStartScreen();
    gameState.gameStarted = true;
    loop();

    // Add the ghost toggle button after the game starts
    createGhostToggleButton();
}

/** === GHOST TOGGLE BUTTON === */
function createGhostToggleButton() {
    const button = createButton('Toggle Ghost Stars');
    button.position(10, 10);
    button.mousePressed(toggleGhostStars);
}

/** Toggle function to show or hide ghost stars */
function toggleGhostStars() {
    gameState.showGhosts = !gameState.showGhosts;
    console.log(`Ghost stars are now ${gameState.showGhosts ? 'ON' : 'OFF'}`);
}


function removeStartScreen() {

    let elements = selectAll('p'); // Get all paragraph elements (labels)
    elements.forEach((element) => {
        element.remove();
    });

    // Remove input fields
    inputName.remove();
    inputAge.remove();
    inputShape.remove();

    // Remove the start button
    startButton.remove();
}


/** === CONSTELLATION GENERATION === */
function generateSessionConstellations({ letter, age, shape }) {
    const allConstellations = [
        ...Object.values(gameState.constellationsData.constellations.letters || {}),
        ...Object.values(gameState.constellationsData.constellations.numbers || {}),
        ...(gameState.constellationsData.constellations.shapes || []),
    ];

    gameState.scrambledConstellations = filterAndScrambleConstellations(allConstellations, { letter, age, shape });
    const remainingConstellations = allConstellations.filter(c => !gameState.scrambledConstellations.includes(c));
    const additionalConstellations = shuffleArray(remainingConstellations).slice(0, 3);

    gameState.selectedConstellations = [
        ...gameState.scrambledConstellations,
        ...additionalConstellations.map(c => ({ ...c, coordinates: offsetCoordinates(c.coordinates) })),
    ];
}

function filterAndScrambleConstellations(allConstellations, { letter, age, shape }) {
    let userConstellations = allConstellations.filter(c =>
        c.name?.includes(letter) || c.name?.includes(age) || c.id?.includes(shape)
    ).slice(0, 3);

    return userConstellations.map(c => ({ ...c, coordinates: scrambleCoordinates(c.coordinates) }));
}

function offsetCoordinates(coords) {
    const positions = [];
    return coords.map(coord => {
        const newPosition = generateUniquePosition(positions, 200); // Increased spacing
        positions.push(newPosition);
        return {
            x: constrain(coord.x + newPosition.x - width / 2, 50, width - 50),  // Added more margin
            y: constrain(coord.y + newPosition.y - height / 2, 50, height - 50)  // Added more margin
        };
    });
}


function scrambleCoordinates(coords) {
    const positions = [];
    return coords.map(() => generateUniquePosition(positions, 150));
}

function generateUniquePosition(existing, minSpacing = 150) {
    let maxAttempts = 100, position;
    while (maxAttempts--) {
        position = { x: random(100, width - 100), y: random(100, height - 100) };
        if (!existing.some(p => dist(p.x, p.y, position.x, position.y) < minSpacing)) return position;
    }
    console.warn("Position overlap; defaulting.");
    return position;
}

/** === GAME LOOP === */
function draw() {
    if (!gameState.gameStarted) return drawStartScreen();

    background(0);
    drawTelescopeView();
    drawConstellations();
    if (gameState.notificationTimeout) drawGhostToggleNotification();
    moveTelescope();
}

/** DRAWING FUNCTIONS */
function drawConstellations() {
    for (const constellation of gameState.selectedConstellations) {
        const isScrambled = gameState.scrambledConstellations.includes(constellation);

        stroke(isScrambled ? color(255, 100, 100) : 255); // Brighter stroke for scrambled
        strokeWeight(1);
        noFill();
        beginShape();
        for (const star of constellation.coordinates) vertex(star.x, star.y);
        endShape(CLOSE);

        for (const star of constellation.coordinates) {
            const visible = dist(star.x, star.y, gameState.telescope.x, gameState.telescope.y) < gameState.telescope.radius;
            if (visible && gameState.showGhosts && isScrambled && !star.isAligned) {
                drawGhostStar(star.x, star.y); // Draw ghost stars if enabled
            }

            fill(star.isAligned ? "lime" : "red");
            noStroke();
            circle(star.x, star.y, 10);
        }
    }
}


function drawGhostStar(x, y) {
    for (let radius = 20; radius > 5; radius -= 5) {
        fill(255, map(radius, 5, 20, 20, 5)); // Gradually fade glow
        noStroke();
        circle(x, y, radius);
    }
    fill(255, 50); // Core circle
    noStroke();
    circle(x, y, 10);
}

function drawTelescopeView() {
    noStroke();
    fill(50);
    rect(0, 0, width, height);
    push();
    fill(0);
    circle(gameState.telescope.x, gameState.telescope.y, gameState.telescope.radius * 2);
    pop();
}

function drawStartScreen() {
    background(20);
    fill(255);
    textAlign(CENTER);
    textSize(36);
    text('Welcome to the Observatory', width / 2, height / 2 - 200);
    textSize(18);
    text('Long ago, the constellations sang in perfect harmony. Today, they are scrambled, and their melodies distorted. Will you restore their balance?', width / 2, height / 2 - 160);
    textSize(16);
    text('Please provide your details below:', width / 2, height / 2 - 120);
}

function moveTelescope() {
    let speed = 5;
    if (keyIsDown(LEFT_ARROW)) gameState.telescope.x -= speed;
    if (keyIsDown(RIGHT_ARROW)) gameState.telescope.x += speed;
    if (keyIsDown(UP_ARROW)) gameState.telescope.y -= speed;
    if (keyIsDown(DOWN_ARROW)) gameState.telescope.y += speed;

    gameState.telescope.x = constrain(gameState.telescope.x, gameState.telescope.radius, width - gameState.telescope.radius);
    gameState.telescope.y = constrain(gameState.telescope.y, gameState.telescope.radius, height - gameState.telescope.radius);
}

/** UTILITY FUNCTIONS */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createInputField(labelText, transform, x, y, assignGlobal) {
    createP(labelText).position(x, y).style('color', 'white').style('font-size', '16px');
    let inputField = createInput().position(x, y + 30).size(200);
    if (transform === "Uppercase") inputField.input(() => inputField.value(inputField.value().toUpperCase()));
    else if (transform === "Lowercase") inputField.input(() => inputField.value(inputField.value().toLowerCase()));
    else if (transform === "Number") inputField.attribute('type', 'number');

    assignGlobal(inputField); // Pass the input field reference to a global variable
}

function setupStartScreen() {
    const centerX = width / 2, centerY = height / 2;

    createInputField("The first letter of your name:", "Uppercase", centerX - 100, centerY - 140, (field) => inputName = field);
    createInputField("Your age (1-100):", "Number", centerX - 100, centerY - 70, (field) => inputAge = field);
    createInputField("A shape you feel most connected to:", "Lowercase", centerX - 100, centerY, (field) => inputShape = field);

    predefinedShapesLabel = createP("circle, star, square, triangle, hexagon").style('color', 'white').position(centerX - 100, centerY + 20);

    startButton = createButton('Start Game').position(centerX - 50, centerY + 120).mousePressed(startGame);
}

/**
 *  Check if a star is clicked
 */
function mousePressed() {
    for (let constellation of gameState.scrambledConstellations) {
        for (let star of constellation.coordinates) {
            if (dist(mouseX, mouseY, star.x, star.y) < 10 && !star.isAligned) {
                gameState.selectedStar = star;
                gameState.offsetX = mouseX - star.x;
                gameState.offsetY = mouseY - star.y;
                break;
            }
        }
    }
}


/**
 * Drag the selected star
 */
function mouseDragged() {
    if (gameState.selectedStar) {
        gameState.selectedStar.x = mouseX - gameState.offsetX;
        gameState.selectedStar.y = mouseY - gameState.offsetY;
    }
}

/**
 * checks upon release of mouse if the coordinates for the stars of scrambeled constellations are aligned with the correct target stars
 */
function mouseReleased() {
    if (gameState.selectedStar) {
        let constellation = gameState.scrambledConstellations.find(c => c.coordinates.includes(gameState.selectedStar));
        let target = constellation.coordinates[constellation.coordinates.indexOf(gameState.selectedStar)];

        if (checkAlignment([gameState.selectedStar], [target])) {
            gameState.selectedStar.x = target.x;
            gameState.selectedStar.y = target.y;
            gameState.selectedStar.isAligned = true;
            playSound("correct");
        } else {
            playSound("incorrect");
        }

        gameState.selectedStar = null;
        checkPuzzleCompletion();
    }
}

/**
 * checks that scrambled constellations are aligned and once they are stops the game loop and displays victory screen
 */
function checkPuzzleCompletion() {
    const allAligned = gameState.scrambledConstellations.every(constellation =>
        constellation.coordinates.every(star => star.isAligned)
    );

    if (allAligned) {
        noLoop(); // Stop the game loop once the puzzle is complete
        setTimeout(() => displayVictoryMessage(), 500); // Delay victory message for effect
    }
}

/**
 * plays the correct sound when a star is placed in the correct spot and vice versa.
 * If player begins to move a star and the sound is playing it will stop and play the other
 */
function playSound(type) {
    if (type === "correct") {
        gameState.incorrectSound.stop();
        gameState.correctSound.play();
    } else if (type === "incorrect") {
        gameState.correctSound.stop();
        gameState.incorrectSound.play();
    }
}

/**
 * displays victory message and provides a restart button
 */
function displayVictoryMessage() {
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("Congratulations! All constellations restored!", width / 2, height / 2);

    let restartButton = createButton("Restart");
    restartButton.position(width / 2 - 50, height / 2 + 50);
    restartButton.mousePressed(() => location.reload());
}

/**
 * Removes the start screen UI elements
 */
function removeStartScreen() {

    let elements = selectAll('p'); // Get all paragraph elements (labels)
    elements.forEach((element) => {
        element.remove();
    });

    // Remove input fields
    inputName.remove();
    inputAge.remove();
    inputShape.remove();

    // Remove the start button
    startButton.remove();
}

function checkAlignment(currentCoordinates, originalCoordinates) {
    const tolerance = 10; // Example tolerance (pixels)
    return currentCoordinates.every((current, index) => {
        let original = originalCoordinates[index];
        return dist(current.x, current.y, original.x, original.y) < tolerance;
    });
}

function isAligned(star, alignedPosition) {
    let distance = dist(star.x, star.y, alignedPosition.x, alignedPosition.y);
    return distance < alignmentThreshold; // Threshold for snapping into place
}
