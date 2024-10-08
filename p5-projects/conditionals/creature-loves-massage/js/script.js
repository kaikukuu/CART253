/**
 * Creature Loves Massage
 * Pippin Barr
 * 
 * A creature that responds to mouse massage by changing colour
 */

"use strict";

// Our creature
const creature = {
    // Position
    x: 200,
    y: 200,
    // Size
    size: 200,
    // Fill
    fill: "#000000", // Starts out bored
    // Possible fills for the creature that show its mood
    // We'll need these when we start changing its colour
    // and its nice to keep them along with all the other info
    // about the creature
    fills: {
        bored: "#000000", // Black
        happy: "#33cc33", // Green
        angry: "#cc3333" // Red
    }
};

/**
 * Responds to user input
 */
/**
 * Creature is happy if being massaged and otherwise bored
 */
function checkInput() {
    // Calculate the distance between the cursor and the creature
    // and put it into a "distance" variable (using const again since
    // we won't change this again later!)
    const distance = dist(mouseX, mouseY, creature.x, creature.y);
    // Calculate whether the mouse overlaps the creature by checking whether
    // the distance is less than its radius! (Half its diameter)
    const mouseIsOverlapping = (distance < creature.size/2);
    // Check if EITHER movedX OR movedY are NOT equal to zero
    // and store the result in our mouseIsMoving variable (another
    // const because we don't want to change it later)
    const mouseIsMoving = (movedX !== 0 || movedY !== 0);
    // Check if the mouse if over the creature and moving
    if (mouseIsOverlapping && mouseIsMoving) {
        // The cursor is overlapping the creature AND it's moving
        // So the creature is happy! Massage!
        creature.fill = creature.fills.happy;
    }
    else {
        // Otherwise the creature is bored
        creature.fill = creature.fills.bored;
    }
}



/**
 * Creates the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Fills the background, displays the creature 
 */
function draw() {
    background(255, 200, 127);

    checkInput();
    drawCreature();
}

/**
 * Responds to user input
 */
function checkInput() {
    // Check if the mouse is pressed...
    if (mouseIsPressed) {
        // The mouse is pressed!
        // Change the colour of the creature to show it's happy
        // It likes the mouse! Squeak squeak!
        creature.fill = creature.fills.happy;
    }
    // Mouse if not pressed, check if a key is pressed...
    else if (keyIsPressed) {
        // A key is pressed!
        // Change the colour of the creature to show it's angry
        // It hates those keys! Ugh!
        creature.fill = creature.fills.angry;
    }
    else {
        // The mouse isn't pressed and no key is pressed!
        // Change the colour of the creature to show it's bored
        creature.fill = creature.fills.bored;
    }
}

/**
 * Draws the creature
 */
function drawCreature() {
    push();
    noStroke();
    // Use the creature's fill
    fill(creature.fill);
    // Display the creature at its position and size
    ellipse(creature.x, creature.y, creature.size);
    pop();
}