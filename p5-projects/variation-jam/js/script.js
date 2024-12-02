/**
* the celestial observatory
* by: Kaisa Catt
* 
* welcome to the observatory
something strange has happened in the universe and it’s caused the constellations in the sky to get scrambled and imbalance of the harmony of the constellations’ songs! 

we need your help to put the stars all back into place and restore the parts of the songs that are scrambled! the songs can only be restored by the right person 

so first, visitor, please share with the universe the following to locate the constellations for you to restore

*/

"use strict";

let constellations;
let constellationsData; // Store loaded JSON data
let selectedConstellations = []; // Store the 6 constellations for the session
let scrambledConstellations = []; // User-specified scrambled constellations
let telescopePosition = { x: 400, y: 400 }; // Initial telescope position
let telescopeRadius = 200; // Visible area radius
let selectedStar = null; // The star currently being dragged
let offsetX, offsetY; // Offset for dragging
let magneticZone = 15; // Radius for snapping to magnetic points
let correctSound, incorrectSound;
let showGhosts = true; // Visibility toggle for ghost stars
let inputName, inputAge, inputShape, startButton;
let gameStarted = false; // Track whether the game has started
let selectedLetter, selectedAge, selectedShapeId;
let predefinedShapesLabel;

function preload() {
    try {
        correctSound = loadSound('data/sound/correct.mp3');
        incorrectSound = loadSound('data/sound/incorrect.mp3');
        constellations = loadJSON('data/JSON/constellations.json', () => {
            console.log("Constellations loaded successfully.");
        }, () => {
            console.error("Failed to load constellations.json.");
            constellations = { constellations: [] }; // Provide a fallback
        });
    } catch (e) {
        console.error("Error during preload:", e);
    }
}

function setup() {
    createCanvas(800, 800);
    textFont('Georgia');
    constellationsData = constellations; // Assign loaded data
    noLoop(); // Initial setup stops drawing loop
    setupStartScreen(); // Display start screen
    console.log(constellations);
}

function setupStartScreen() {
    // Define center position based on canvas size
    let centerX = width / 2;
    let centerY = height / 2;

    // Label for the name input
    let nameLabel = createP("The first letter of your name:");
    nameLabel.position(centerX - 100, centerY - 140);
    nameLabel.style('color', 'white');
    nameLabel.style('font-size', '16px');

    // Input for the first letter of the name
    inputName = createInput();
    inputName.position(centerX - 100, centerY - 110);
    inputName.size(200);

    // Automatically convert input to uppercase
    inputName.input(() => {
        inputName.value(inputName.value().toUpperCase());
    });

    // Label for the age input
    let ageLabel = createP("Your age (1-100):");
    ageLabel.position(centerX - 100, centerY - 70);
    ageLabel.style('color', 'white');
    ageLabel.style('font-size', '16px');

    // Input for the age
    inputAge = createInput();
    inputAge.position(centerX - 100, centerY - 40);
    inputAge.size(200);
    inputAge.attribute('type', 'number');

    // Label for the shape input
    let shapeLabel = createP("A shape you feel most connected to:");
    shapeLabel.position(centerX - 100, centerY);
    shapeLabel.style('color', 'white');
    shapeLabel.style('font-size', '16px');

    // Label for predefined shapes
    let predefinedShapesLabel = createP("circle, star, square, triangle, hexagon");
    predefinedShapesLabel.position(centerX - 100, centerY + 20);
    predefinedShapesLabel.style('color', 'white');
    predefinedShapesLabel.style('font-size', '14px');
    // Input for the shape
    inputShape = createInput();
    inputShape.position(centerX - 100, centerY + 50);
    inputShape.size(200);
    // Automatically convert shape input to lowercase
    inputShape.input(() => {
        inputShape.value(inputShape.value().toLowerCase());
    });

    // Start button
    startButton = createButton('Start Game');
    startButton.position(centerX - 50, centerY + 120);
    startButton.mousePressed(() => {
        // Explicitly resume the AudioContext here
        if (getAudioContext().state === 'suspended') {
            getAudioContext().resume().then(() => {
                console.log('Audio Context resumed');
                startGame();  // Proceed to start the game after resuming
            });
        } else {
            startGame();  // If the AudioContext is already running, just start the game
        }
    });
}

function startGame() {
    let inputs = {
        letter: inputName.value().toUpperCase().trim(),
        age: inputAge.value().trim(),
        shape: inputShape.value().trim().toLowerCase()
    };

    if (inputs.letter && inputs.age && inputs.shape) {
        setupGame(inputs);
        loop(); // Restart the loop to enable the game screen rendering
    } else {
        alert("Please fill in all fields correctly.");
    }
}

function setupGame(inputs) {
    selectedLetter = inputs.letter;
    selectedAge = inputs.age;
    selectedShapeId = inputs.shape;

    generateSessionConstellations(inputs);
    removeStartScreen(); // Clean up the input UI
    gameStarted = true;
    loop();
}

// Modify to use the updated `coordinates` field for scrambling logic
function generateSessionConstellations(inputs) {
    console.log("Constellations Data:", constellationsData);

    // Normalize all constellations into a single array
    let lettersArray = Object.values(constellationsData.constellations.letters || {});
    let numbersArray = Object.values(constellationsData.constellations.numbers || {});
    let shapesArray = constellationsData.constellations.shapes || [];

    let allConstellations = [...lettersArray, ...numbersArray, ...shapesArray];

    console.log("All Constellations:", allConstellations);

    // Filter based on user inputs
    let userConstellations = allConstellations.filter(constellation =>
        (constellation.name && constellation.name.includes(inputs.letter)) ||
        (constellation.name && constellation.name.includes(inputs.age)) ||
        (constellation.id && constellation.id.includes(inputs.shape))
    );

    // Ensure at least 3 scrambled candidates
    if (userConstellations.length < 3) {
        console.warn("Not enough matching constellations found. Falling back to random choices.");
        userConstellations = shuffleArray(allConstellations).slice(0, 3);
    } else {
        userConstellations = userConstellations.slice(0, 3);
    }

    // Scramble the coordinates for scrambled constellations
    scrambledConstellations = userConstellations.map(constellation => ({
        ...constellation,
        coordinates: scrambleCoordinates(constellation.coordinates)
    }));

    // Select additional constellations to fill the session
    let remainingConstellations = allConstellations.filter(c => !userConstellations.includes(c));
    selectedConstellations = [
        ...scrambledConstellations,
        ...shuffleArray(remainingConstellations).slice(0, 3)
    ];
}



function generateRandomPosition(existingPositions, minSpacing = 150) {
    let maxAttempts = 100;
    let newPosition;

    do {
        newPosition = {
            x: random(100, width - 100),
            y: random(100, height - 100)
        };

        let overlaps = existingPositions.some(pos => dist(pos.x, pos.y, newPosition.x, newPosition.y) < minSpacing);

        if (!overlaps) break;
    } while (--maxAttempts > 0);

    return newPosition;
}

function draw() {
    if (!gameStarted) {
        drawStartScreen();
    } else {
        background(0);
        drawTelescopeView();
        drawConstellations();
        drawGhostToggleNotification();
        checkPuzzleCompletion();
        moveTelescope();
    }
}

function drawStartScreen() {
    background(20);
    fill(255);
    textAlign(CENTER);
    textSize(36);
    text('Welcome to the Observatory', width / 2, height / 2 - 200);
    textSize(18);
    text('Restore the constellations and their harmonious songs!', width / 2, height / 2 - 160);
    textSize(16);
    text('Please provide your details below:', width / 2, height / 2 - 120);
}


async function getUserInputs() {
    return new Promise((resolve) => {
        let inputDiv = createDiv().style("color", "white").style("text-align", "center");
        inputDiv.html("<h2>Welcome to the Observatory</h2><p>Please provide the following:</p>");

        let letterInput = createInput("").attribute("placeholder", "First letter of your name").parent(inputDiv);
        let ageInput = createInput("").attribute("placeholder", "Your age (1-100)").parent(inputDiv);
        let shapeInput = createInput("").attribute("placeholder", "A shape you like (circle, triangle, etc.)").parent(inputDiv);

        let submitButton = createButton("Submit").parent(inputDiv).mousePressed(() => {
            let inputs = {
                letter: letterInput.value().toUpperCase().trim(),
                age: ageInput.value().trim(),
                shape: shapeInput.value().trim().toLowerCase(),
            };

            inputDiv.remove(); // Remove the input div immediately
            resolve(inputs); // Resolve the inputs
        });
    });
}


function scrambleCoordinates(coordinates) {
    return coordinates.map(coord => ({
        x: coord.x + random(-50, 50),
        y: coord.y + random(-50, 50),
        isAligned: false  // Ensure the alignment flag is reset
    }));
}

function checkAlignment(currentCoordinates, originalCoordinates) {
    const tolerance = 10; // Example tolerance (pixels)
    return currentCoordinates.every((current, index) => {
        let original = originalCoordinates[index];
        return dist(current.x, current.y, original.x, original.y) < tolerance;
    });
}

function drawConstellations() {
    for (let constellation of selectedConstellations) {
        let isScrambled = scrambledConstellations.includes(constellation);

        stroke(255, isScrambled ? 100 : 255); // Dimmer for scrambled constellations
        strokeWeight(1);
        noFill();
        beginShape();
        for (let star of constellation.coordinates) {
            vertex(star.x, star.y);
        }
        endShape(CLOSE);

        for (let i = 0; i < constellation.coordinates.length; i++) {
            let star = constellation.coordinates[i];
            let isAligned = star.isAligned || !isScrambled;

            if (dist(star.x, star.y, telescopePosition.x, telescopePosition.y) < telescopeRadius) {
                if (showGhosts && isScrambled && !isAligned) {
                    drawGhostStar(constellation.coordinates[i].x, constellation.coordinates[i].y);
                }

                fill(isAligned ? "lime" : "red");
                noStroke();
                circle(star.x, star.y, 10);
            }
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

function keyPressed() {
    if (key === 'g' || key === 'G') {
        showGhosts = !showGhosts; // Toggle ghost visibility
    }
}

let notificationTimeout;

function drawGhostToggleNotification() {
    if (showGhosts && notificationTimeout === undefined) {
        notificationTimeout = setTimeout(() => {
            notificationTimeout = undefined; // Clear timeout after showing once
        }, 3000); // Show notification for 3 seconds
    }
    if (notificationTimeout) {
        fill(0, 200);
        stroke(255);
        rect(width - 160, 20, 140, 40);
        fill(255);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text(`Ghosts: ${showGhosts ? "ON" : "OFF"}`, width - 90, 40);
    }
}

function drawTelescopeView() {
    // Draw background with a visible circular telescope
    background(0);
    noStroke();
    fill(50);
    rect(0, 0, width, height);

    // Clip to the telescope area
    push();
    fill(0);
    circle(telescopePosition.x, telescopePosition.y, telescopeRadius * 2);
    pop();
}

//ensures smooth movement when pressing keys to move the telescope view
function moveTelescope() {
    let speed = 5; // Speed of the telescope movement

    // Smooth movement based on arrow keys
    if (keyIsDown(LEFT_ARROW)) {
        telescopePosition.x -= speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        telescopePosition.x += speed;
    }
    if (keyIsDown(UP_ARROW)) {
        telescopePosition.y -= speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        telescopePosition.y += speed;
    }

    // Constrain the telescope within canvas bounds
    telescopePosition.x = constrain(telescopePosition.x, telescopeRadius, width - telescopeRadius);
    telescopePosition.y = constrain(telescopePosition.y, telescopeRadius, height - telescopeRadius);

    // Ensure no part of the telescope view exceeds bounds
    if (telescopePosition.x - telescopeRadius < 0) telescopePosition.x = telescopeRadius;
    if (telescopePosition.y - telescopeRadius < 0) telescopePosition.y = telescopeRadius;

}

// Utility function to shuffle an array
function shuffleArray(array) {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function mousePressed() {
    // Check if a star is clicked
    for (let constellation of scrambledConstellations) {
        for (let star of constellation.coordinates) {
            if (dist(mouseX, mouseY, star.x, star.y) < 10 && !star.isAligned) {
                selectedStar = star;
                offsetX = mouseX - star.x;
                offsetY = mouseY - star.y;
                break;
            }
        }
    }
}

function mouseDragged() {
    // Drag the selected star
    if (selectedStar) {
        selectedStar.x = mouseX - offsetX;
        selectedStar.y = mouseY - offsetY;
    }
}

function mouseReleased() {
    if (selectedStar) {
        let constellation = scrambledConstellations.find(c => c.coordinates.includes(selectedStar));
        let target = constellation.coordinates[constellation.coordinates.indexOf(selectedStar)];

        let isAligned = checkAlignment([selectedStar], [target]);

        if (isAligned) {
            selectedStar.x = target.x;
            selectedStar.y = target.y;
            selectedStar.isAligned = true;
            playSound("correct");
        } else {
            playSound("incorrect");
        }

        selectedStar = null;
    }
}


function checkPuzzleCompletion() {
    if (scrambledConstellations.length === 0) {
        console.warn("No scrambled constellations to check.");
        return;
    }

    let allAligned = scrambledConstellations.every(constellation =>
        constellation.coordinates.every(star => star.isAligned)
    );

    if (allAligned) {
        noLoop(); // Stop the game loop once the puzzle is complete
        setTimeout(() => displayVictoryMessage(), 500); // Delay victory message for effect
    }
}


function playSound(type) {
    if (type === "correct") {
        incorrectSound.stop();
        correctSound.play();
    } else if (type === "incorrect") {
        correctSound.stop();
        incorrectSound.play();
    }
}


function displayVictoryMessage() {
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("Congratulations! All constellations restored!", width / 2, height / 2);

    let restartButton = createButton("Restart");
    restartButton.position(width / 2 - 50, height / 2 + 50);
    restartButton.mousePressed(() => location.reload());
}

function removeStartScreen() {
    // Remove the start screen UI elements
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
