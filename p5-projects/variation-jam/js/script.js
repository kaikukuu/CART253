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
let telescopeRadius = 100; // Visible area radius
let selectedStar = null; // The star currently being dragged
let offsetX, offsetY; // Offset for dragging
let magneticZone = 15; // Radius for snapping to magnetic points
let correctSound, incorrectSound; //sounds initialization
let showGhosts = true; // Visibility toggle for ghost stars
let inputName, inputAge, inputShape, startButton;
let gameStarted = false; // Track whether the game has started
let selectedLetter, selectedAge, selectedShapeId;
let predefinedShapesLabel;
let notificationTimeout;

/**
 * preloads the sound files and json data to prevent missing data errors, etc...
 */
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

/**
 * Creates the canvas, defines textfont, then assigns the constellations data and displays start screen
 */
function setup() {
    createCanvas(800, 800);
    textFont('Georgia');
    constellationsData = constellations; // Assign loaded data
    noLoop(); // Initial setup stops drawing loop
    setupStartScreen(); // Display start screen
    console.log(constellations);
}

/**
 * Creates labels and textboxes to inform and collect user inputs to start the game
 */
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

/**
 * gathering and clearing up any possible user errors in inputs 
 * then if inputs are collected calls setupGame to use them to generate constellations
 */
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

/**
 * sets up the user inputs and calls generateSessionConstellations to generate the constellations, 
 * removes the start screen and starts the game loop
 */
function setupGame(inputs) {
    selectedLetter = inputs.letter;
    selectedAge = inputs.age;
    selectedShapeId = inputs.shape;

    generateSessionConstellations(inputs);
    removeStartScreen(); // Clean up the input UI
    gameStarted = true;
    loop();
}

/**
 * first gathers the constellation data from constellations.json into arrays that consolidates all the types of constellations
 * filters through constellations to find the 3 selected by user to be scrambled and generates initial positions
 * randomly chooses 3 constellation from the remaining available constellations to be displayed alongside those scrambled
 */
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

    // Generate initial positions for scrambled constellations
    scrambledConstellations = userConstellations.map(constellation => ({
        ...constellation,
        coordinates: scrambleCoordinates(constellation.coordinates)
    }));

    // Select additional constellations to fill the session
    let remainingConstellations = allConstellations.filter(c => !userConstellations.includes(c));
    let additionalConstellations = shuffleArray(remainingConstellations).slice(0, 3);

    selectedConstellations = [
        ...scrambledConstellations,
        ...additionalConstellations.map(constellation => ({
            ...constellation,
            coordinates: offsetCoordinates(constellation.coordinates)
        }))
    ];
}

/**
 * stores the existing positions of constellations and returns their new offset coordinates
 */
function offsetCoordinates(coordinates) {
    let existingPositions = []; // Store positions for comparison

    return coordinates.map(coord => {
        let newPosition = generateRandomPosition(existingPositions, 150); // Ensure spacing
        existingPositions.push(newPosition);
        return { x: coord.x + newPosition.x, y: coord.y + newPosition.y };
    });
}

/**
 * generates random positions for constellations while trying to prevent overlap 
 */
function generateRandomPosition(existingPositions, minSpacing = 150) {
    let maxAttempts = 100;
    let newPosition;

    while (maxAttempts > 0) {
        newPosition = {
            x: random(100, width - 100),
            y: random(100, height - 100)
        };

        let isTooClose = existingPositions.some(pos =>
            dist(pos.x, pos.y, newPosition.x, newPosition.y) < minSpacing
        );

        if (!isTooClose) {
            return newPosition; // Valid position found
        }

        maxAttempts--;
    }

    console.warn("Could not find a valid position after maximum attempts.");
    return { x: random(100, width - 100), y: random(100, height - 100) };
}

/**
 * function to scramble the coordinates of the positions of constellations
 */
function scrambleCoordinates(coordinates) {
    let existingPositions = []; // Track positions to avoid overlaps

    return coordinates.map(() => {
        let newPosition = generateRandomPosition(existingPositions, 150); // Adjust spacing
        existingPositions.push(newPosition);
        return { ...newPosition, isAligned: false };
    });
}

/**
 * draws the start screen if the game hasn't started; otherwise draws the game's background and game elements
 */
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

/**
 * Draws the start screen and text
 */
function drawStartScreen() {
    background(20);
    fill(255);
    textAlign(CENTER);
    textSize(36);
    text('Welcome to the Observatory', width / 2, height / 2 - 200);
    textSize(18);
    text('Restore the constellations and their harmonious song!', width / 2, height / 2 - 160);
    textSize(16);
    text('Please provide your details below:', width / 2, height / 2 - 120);
}

/**
 * collects the user inputs at start of game
 */
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

/**
 * checks if the current coordinates of scrambeled stars align with the defined correct coordinates
 */
function checkAlignment(currentCoordinates, originalCoordinates) {
    const tolerance = 20; // Example tolerance (pixels)
    return currentCoordinates.every((current, index) => {
        let original = originalCoordinates[index];
        return dist(current.x, current.y, original.x, original.y) < tolerance;
    });
}

/**
 * draws the stars of both unscrambled and scrambled constellations
 * also draws ghost stars if their constellations are scrambled and not aligned
 */
function drawConstellations() {
    for (let constellation of selectedConstellations) {
        let isScrambled = scrambledConstellations.includes(constellation);

        stroke(255, !isScrambled ? 100 : 255); // Dimmer for scrambled constellations
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
                if (isScrambled && !isAligned) {
                    drawGhostStar(constellation.coordinates[i].x, constellation.coordinates[i].y);
                }

                fill(isAligned ? "lime" : "red");
                noStroke();
                circle(star.x, star.y, 10);
            }
        }
    }
}

/**
 * draws the ghost stars indicating the correct placements of scrambled constellations
 */
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

/**
 * function to allow user to toggle ghost stars through pressing the 'g' key
 */
function keyPressed() {
    if (key.toLowerCase() === 'g') {
        showGhosts = !showGhosts; console.log(`Ghosts toggled: ${showGhosts}`);
        setNotificationTimeout();
    }
}

/**
 * utility function to set the amt of time the notification appears
 */
function setNotificationTimeout() {
    if (notificationTimeout) return;
    notificationTimeout = setTimeout(() => {
        notificationTimeout = undefined;
    }, 3000);
}

/**
 * draws the Ghost Toggle Notification at top right showing if ghost stars are activated
 */
function drawGhostToggleNotification() {
    if (notificationTimeout) {
        const x = constrain(width - 160, 0, width - 140);
        const y = constrain(20, 0, height - 40);

        fill(0, 200);
        stroke(255);
        rect(x, y, 140, 40);

        fill(255);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text(`Ghosts: ${showGhosts ? "ON" : "OFF"}`, x + 70, y + 20);
    }
}

/**
 *  Draw background with a visible circular telescope
 */
function drawTelescopeView() {
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

/**
 * ensures smooth movement when pressing keys to move the telescope view
 */
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

/**
 * Utility function to shuffle an array
 */
function shuffleArray(array) {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 *  Check if a star is clicked
 */
function mousePressed() {
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

/**
 * Drag the selected star
 */
function mouseDragged() {
    if (selectedStar) {
        selectedStar.x = mouseX - offsetX;
        selectedStar.y = mouseY - offsetY;
    }
}

/**
 * checks upon release of mouse if the coordinates for the stars of scrambeled constellations are aligned with the correct target stars
 */
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

/**
 * checks that scrambled constellations are aligned and once they are stops the game loop and displays victory screen
 */
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

/**
 * plays the correct sound when a star is placed in the correct spot and vice versa.
 * If player begins to move a star and the sound is playing it will stop and play the other
 */
function playSound(type) {
    if (type === "correct") {
        incorrectSound.stop();
        correctSound.play();
    } else if (type === "incorrect") {
        correctSound.stop();
        incorrectSound.play();
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
