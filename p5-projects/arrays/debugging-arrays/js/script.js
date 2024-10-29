/**
 * Bug Squasher (Debugging Arrays)
 * Pippin Barr
 * 
 * Squash bugs by clicking on them. Squish.
 */

"use strict";

// The bugs array (starts empty)
let bugs = [];

// Time between bugs. This will get bigger.
const minimumBugDelay = 0.5 * 1000;
const maximumBugDelay = 2 * 1000;
let bugDelay = maximumBugDelay;

/**
 * Create the canvas
*/
function setup() {
    createCanvas(600, 600);
    setTimeout(addBug, bugDelay);
}

/**
 * Adds a bug to the array, updates the timer to get faster
 */
function addBug() {
    const bug = createBug();
    bugs.push(bug); // Add the bug to the array

    // Reduce the delay
    bugDelay -= random(0, 100);
    bugDelay = constrain(bugDelay, minimumBugDelay, maximumBugDelay);
    setTimeout(addBug, bugDelay);
}

/**
 * Creates and returns a randomized bug that will start at the top of the
 * canvas and move down
 */
function createBug() {
    const bug = {
        x: random(0, width),
        y: -100,
        velocity: {
            x: 0,
            y: random(2, 10)
        },
        size: random(15, 40),
        fill: "#445566"
    };
    return bug;
}

/**
 * Move and display the bugs
*/
function draw() {
    background("#ddeeff");

    // Move and draw the bugs
    for (let bug of bugs) {
        moveBug(bug);
        drawBug(bug);
    }
}

/**
 * Moves a bug according to its velocity
 */
function moveBug(bug) {
    bug.x += bug.velocity.x;
    bug.y += bug.velocity.y;
}

/**
 * Draws a bug according to its properties
 */
function drawBug(bug) {
    push();
    noStroke();
    fill(bug.fill);
    ellipse(bug.x, bug.y, bug.size);
    pop();
}

/**
 * Removes bugs if you click (near) them
 */
function mousePressed() {
    // Check every bug to see if it was clicked
    for (let bug of bugs) {
        const d = dist(mouseX, mouseY, bug.x, bug.y);
        if (d < bug.size / 2) {
            const index = bugs.indexOf(bug);
            bugs.splice(index, 1); // Remove one element at the index
        }
    }
}
