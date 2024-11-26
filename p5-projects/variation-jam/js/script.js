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
    checkPuzzleCompletion(); // Check if all stars are aligned
}

function drawConstellations() {
    for (let constellation of selectedConstellations) {
        let isScrambled = scrambledConstellations.includes(constellation);

        for (let i = 0; i < constellation.coordinates.length; i++) {
            let star = constellation.coordinates[i];
            let isCorrect = star.isAligned || !isScrambled;

            if (dist(star.x, star.y, telescopePosition.x, telescopePosition.y) < telescopeRadius) {
                fill(isCorrect ? "lime" : "red"); // Green for aligned, red for scrambled
                noStroke();
                circle(star.x, star.y, 10);

                // Highlight draggable stars in scrambled constellations
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
function generateSessionConstellations() {
    let allConstellations = constellationsData.constellations;

    // Shuffle and pick 6 total constellations
    selectedConstellations = shuffleArray(allConstellations).slice(0, 6);

    // Choose 3 constellations to scramble based on user input
    let letterInput = "A"; // Example user input
    let ageInput = "27"; // Example user input
    let shapeInput = "triangle"; // Example user input

    scrambledConstellations = selectedConstellations.filter(constellation =>
        [letterInput, ageInput, shapeInput].includes(constellation.id)
    );
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

function keyPressed() {
    // Move telescope with arrow keys
    if (keyCode === LEFT_ARROW) telescopePosition.x -= 10;
    if (keyCode === RIGHT_ARROW) telescopePosition.x += 10;
    if (keyCode === UP_ARROW) telescopePosition.y -= 10;
    if (keyCode === DOWN_ARROW) telescopePosition.y += 10;

    // Keep telescope within canvas bounds
    telescopePosition.x = constrain(telescopePosition.x, telescopeRadius, width - telescopeRadius);
    telescopePosition.y = constrain(telescopePosition.y, telescopeRadius, height - telescopeRadius);

    redraw(); // Redraw with new telescope position
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

