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

let viewfinderX, viewfinderY; // Position of the telescope
let viewfinderSize = 250;    // Diameter of the viewfinder
let stars = [];              // Array for random stars
let constellation = [];      // Predefined constellation
let scrambledStars = [];     // Scrambled stars for the puzzle
let isDragging = null;       // Currently dragged star
let victory = false;         // Track puzzle completion

function setup() {
    createCanvas(800, 800);

    // Initialize telescope position
    viewfinderX = width / 2;
    viewfinderY = height / 2;

    // Create random stars
    for (let i = 0; i < 100; i++) {
        stars.push({ x: random(width), y: random(height) });
    }

    // Create a predefined constellation (simple triangle)
    constellation = [
        { x: 200, y: 200, fixed: true },
        { x: 300, y: 300, fixed: true },
        { x: 100, y: 300, fixed: true },
    ];

    // Scramble constellation positions slightly
    scrambledStars = constellation.map((star) => ({
        x: star.x + random(-50, 50),
        y: star.y + random(-50, 50),
        targetX: star.x, // Target position for snapping
        targetY: star.y,
    }));
}

function draw() {
    background(0);

    // Draw the full star field
    for (let star of stars) {
        fill(255);
        noStroke();
        ellipse(star.x, star.y, 3);
    }

    // Create the telescope view
    createTelescopeMask();

    // Move the visible stars and constellation into the viewport
    push();
    translate(-viewfinderX + width / 2, -viewfinderY + height / 2);

    // Draw predefined constellation stars
    for (let star of constellation) {
        fill(0, 255, 0);
        ellipse(star.x, star.y, 10);
    }

    // Draw scrambled stars
    for (let star of scrambledStars) {
        fill(255, 0, 0);
        ellipse(star.x, star.y, 10);
    }
    pop();

    // Viewfinder outline
    noFill();
    stroke(255);
    strokeWeight(3);
    ellipse(width / 2, height / 2, viewfinderSize);

    // Victory message
    if (victory) {
        textAlign(CENTER, CENTER);
        textSize(32);
        fill(255, 255, 0);
        text("Constellation Restored!", width / 2, height / 2);
    }
}

function createTelescopeMask() {
    // Mask to simulate the telescope
    fill(0);
    rect(0, 0, width, height);

    // Cut out the circular view
    blendMode(REMOVE);
    ellipse(width / 2, height / 2, viewfinderSize);
    blendMode(BLEND);
}

function keyPressed() {
    // Move the telescope with arrow keys
    if (keyCode === UP_ARROW) viewfinderY -= 20;
    if (keyCode === DOWN_ARROW) viewfinderY += 20;
    if (keyCode === LEFT_ARROW) viewfinderX -= 20;
    if (keyCode === RIGHT_ARROW) viewfinderX += 20;

    // Constrain viewfinder position
    viewfinderX = constrain(viewfinderX, viewfinderSize / 2, width - viewfinderSize / 2);
    viewfinderY = constrain(viewfinderY, viewfinderSize / 2, height - viewfinderSize / 2);
}

function mousePressed() {
    // Check if mouse is over a scrambled star
    for (let i = 0; i < scrambledStars.length; i++) {
        let star = scrambledStars[i];
        if (dist(mouseX, mouseY, star.x, star.y) < 10) {
            isDragging = i; // Set current dragging star
            break;
        }
    }
}

function mouseDragged() {
    // Update the position of the dragged star
    if (isDragging !== null) {
        scrambledStars[isDragging].x = mouseX + viewfinderX - width / 2;
        scrambledStars[isDragging].y = mouseY + viewfinderY - height / 2;
    }
}

function mouseReleased() {
    // Check if the star was dropped near the target position
    if (isDragging !== null) {
        let star = scrambledStars[isDragging];
        if (dist(star.x, star.y, star.targetX, star.targetY) < 15) {
            star.x = star.targetX; // Snap to target
            star.y = star.targetY;
        }
    }

    // Clear dragging state
    isDragging = null;

    // Check for victory condition
    victory = scrambledStars.every(
        (star) => star.x === star.targetX && star.y === star.targetY
    );
}
