/**
 * Title of Project
 * Author Name
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
    correctSound = loadSound('data/sound/correct.mp3');
    incorrectSound = loadSound('data/sound/incorrect.mp3');
    constellations = loadJSON('data/JSON/constellations.json');
}

function setup() {
    createCanvas(800, 800);
    textFont('Georgia');
    constellationsData = constellations; // Assign loaded data
    noLoop(); // Initial setup stops drawing loop
    setupGame();
    console.log(constellations);
}

function setupGame() {
    // Generate constellations for this session
    generateSessionConstellations();
    console.log("Selected Constellations: ", selectedConstellations);
    console.log("Scrambled Constellations: ", scrambledConstellations);
    loop(); // Start drawing loop after setup
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

function drawGhostToggleNotification() {
    if (showGhosts) {
        fill(0, 200); // Semi-transparent background
        stroke(255);
        rect(width - 160, 20, 140, 40);
        fill(255);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text("Ghosts: ON", width - 90, 40);
    } else {
        fill(0, 200);
        stroke(255);
        rect(width - 160, 20, 140, 40);
        fill(255);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text("Ghosts: OFF", width - 90, 40);
    }
}

function generateSessionConstellations() {
    let allConstellations = constellationsData.constellations;

    // Shuffle and pick 6 total constellations
    selectedConstellations = shuffleArray(allConstellations).slice(0, 6);

    // Store positions already used to prevent overlap
    let usedPositions = [];

    for (let constellation of selectedConstellations) {
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

    // Choose 3 constellations to scramble based on user input
    let letterInput = "A"; // Example user input
    let ageInput = "27"; // Example user input
    let shapeInput = "triangle"; // Example user input

    scrambledConstellations = selectedConstellations.filter(constellation =>
        [letterInput, ageInput, shapeInput].includes(constellation.id)
    );
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
            // Snap to position
            selectedStar.x = target.x;
            selectedStar.y = target.y;
            selectedStar.isAligned = true;
            playSound("correct");
        } else {
            playSound("incorrect");
        }

        selectedStar = null; // Deselect star
    }
}

function checkPuzzleCompletion() {
    for (let constellation of scrambledConstellations) {
        if (constellation.coordinates.every(star => star.isAligned)) {
            constellation.isCompleted = true;
        }
    }

    // All constellations completed
    if (scrambledConstellations.every(c => c.isCompleted)) {
        noLoop(); // Stop the game loop
        setTimeout(() => displayVictoryMessage(), 500); // Delay for a better effect
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

