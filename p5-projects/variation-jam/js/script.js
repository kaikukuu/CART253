/**
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

function preload() {
    constellations = loadJSON('data/constellations.json');
}

function setup() {
    createCanvas(800, 800);
    console.log(constellations);
}

let selectedStar = null; // The star currently being dragged
let offsetX, offsetY; // Offset for dragging
let magneticZone = 15; // Radius for snapping to magnetic points

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

    // If all scrambled constellations are solved, show success message
    if (scrambledConstellations.every(c => c.isCompleted)) {
        displayVictoryMessage();
        noLoop(); // Stop game loop
    }
}

function playSound(type) {
    if (type === "correct") {
        // Play correct placement sound
    } else if (type === "incorrect") {
        // Play incorrect placement sound
    }
}

function displayVictoryMessage() {
    fill(255);
    textSize(32);
    textAlign(CENTER);
    text("Congratulations! All constellations restored!", width / 2, height / 2);
}

