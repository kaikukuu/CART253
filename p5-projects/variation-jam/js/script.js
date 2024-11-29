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
    setupGame();
    console.log(constellations);
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

function setupGame() {
    getUserInputs().then((inputs) => {
        generateSessionConstellations(inputs);
        loop(); // Start the game loop after inputs are gathered and form is removed
    });
}

function draw() {
    background(0);
    drawTelescopeView();
    drawConstellations();
    drawGhostToggleNotification(); // Show notification
    checkPuzzleCompletion(); // Check if all stars are aligned
    moveTelescope(); // Smooth telescope movement
}

function drawConstellations() {
    for (let constellation of selectedConstellations) {
        let isScrambled = scrambledConstellations.includes(constellation);

        // Draw lines connecting stars
        stroke(255, isScrambled ? 100 : 255); // Dimmer for scrambled constellations
        strokeWeight(1);
        noFill();
        beginShape();
        for (let star of constellation.originalCoordinates) {
            vertex(star.x, star.y);
        }
        endShape(CLOSE);

        // Draw stars and their "ghosts"
        for (let i = 0; i < constellation.coordinates.length; i++) {
            let star = constellation.coordinates[i];
            let isAligned = star.isAligned || !isScrambled;

            if (dist(star.x, star.y, telescopePosition.x, telescopePosition.y) < telescopeRadius) {
                if (showGhosts && isScrambled && !isAligned) {
                    // Draw glowing ghost for the missing star
                    drawGhostStar(constellation.originalCoordinates[i].x, constellation.originalCoordinates[i].y);
                }

                // Draw actual star
                fill(isAligned ? "lime" : "red"); // Green for aligned, red for misaligned
                noStroke();
                circle(star.x, star.y, 10);

                // Highlight the selected star (if dragging)
                if (isScrambled && star === selectedStar) {
                    stroke(255);
                    strokeWeight(2);
                    noFill();
                    circle(star.x, star.y, 15);
                }
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

function generateSessionConstellations(inputs) {
    let allConstellations = constellationsData.constellations;

    // Filter constellations based on the provided inputs
    let scrambledCandidates = allConstellations.filter(constellation =>
        constellation.id &&
        (constellation.id.includes(inputs.letter) ||
            constellation.id.includes(inputs.age) ||
            constellation.id.includes(inputs.shape))
    );

    // Handle missing constellations gracefully
    if (scrambledCandidates.length < 3) {
        console.warn("Not enough matching constellations found. Falling back to random choices.");
        scrambledCandidates = shuffleArray(allConstellations).slice(0, 3);
    } else {
        scrambledCandidates = scrambledCandidates.slice(0, 3); // Ensure exactly 3 scrambled constellations
    }


    scrambledConstellations = scrambledCandidates;

    // Shuffle and select the remaining constellations
    let remainingConstellations = allConstellations.filter(c => !scrambledCandidates.includes(c));
    selectedConstellations = [...scrambledCandidates, ...shuffleArray(remainingConstellations).slice(0, 3)];

    // Store positions already used to prevent overlap
    let usedPositions = [];

    for (let constellation of selectedConstellations) {
        constellation.isCompleted = false; // Initialize the completion state
        let position = generateRandomPosition(usedPositions);
        usedPositions.push(position);

        // Offset each star in the constellation by this position
        constellation.coordinates = constellation.coordinates.map(star => ({
            x: star.x + position.x,
            y: star.y + position.y,
            isAligned: false // Reset alignment status
        }));

        // Store original coordinates for snapping back
        constellation.originalCoordinates = [...constellation.coordinates];
    }

}

function generateRandomPosition(existingPositions, minSpacing = 150) {
    let maxAttempts = 100; // To prevent infinite loops
    let newPosition;

    do {
        newPosition = {
            x: random(100, width - 100), // Ensure stars don't go off the edges
            y: random(100, height - 100)
        };

        // Check against existing positions to avoid overlap
        let overlaps = existingPositions.some(pos => dist(pos.x, pos.y, newPosition.x, newPosition.y) < minSpacing);

        if (!overlaps) break; // Valid position found
    } while (--maxAttempts > 0);

    return newPosition;
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
        // Check if the star is close to its target position
        let constellation = scrambledConstellations.find(c => c.coordinates.includes(selectedStar));
        let target = constellation.originalCoordinates[constellation.coordinates.indexOf(selectedStar)];

        if (dist(selectedStar.x, selectedStar.y, target.x, target.y) < magneticZone) {
            // Snap to position and mark as aligned
            selectedStar.x = target.x;
            selectedStar.y = target.y;
            selectedStar.isAligned = true;
            playSound("correct");
        } else {
            // Reset position to the original if it's not aligned
            selectedStar.isAligned = false;
            playSound("incorrect");
        }

        selectedStar = null; // Deselect star
    }
}


function checkPuzzleCompletion() {
    if (scrambledConstellations.length === 0) {
        console.warn("No scrambled constellations to check.");
        return;
    }

    let allAligned = scrambledConstellations.every(constellation =>
        constellation.coordinates && constellation.coordinates.every(star => star.isAligned)
    );

    if (allAligned) {
        noLoop(); // Stop the game loop
        setTimeout(() => displayVictoryMessage(), 500); // Delay for better effect
    }
}




function playSound(type) {
    if (type === "correct") {
        correctSound.play();
    } else if (type === "incorrect") {
        incorrectSound.play();
    }
}

function displayVictoryMessage() {
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("Congratulations! All constellations restored!", width / 2, height / 2);
}

