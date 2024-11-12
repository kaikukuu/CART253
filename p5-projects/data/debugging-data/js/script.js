/**
 * Basic States (with localization JSON)
 * Pippin Barr
 *
 * A program to demonstrate the idea of a program with *states*
 * controlled by different functions so we can split it up into
 * a title, main part, and ending, for instance.
 *
 * This version of the program moves all the language into
 * a JSON file that allows us to display the program in
 * English OR French based on a variable.
 */

"use strict";

// A circle that will move across the screen
let circle = {
    x: 0,
    y: 250,
    size: 100,
    velocity: { x: 0, y: 0 },
    speed: 2,
};

// Text data (will be loaded from JSON)
let stringData;

// Language setting (en = English, fr = French)
let lang = "fr";

// Initial program state set to "title"
let state = "title";

/**
 * Loads text data from JSON file
 */
function preload() {
    stringData = loadJSON("assets/data/localisation.json");
}

/**
 * Sets up canvas and text properties
 */
function setup() {
    createCanvas(500, 500);
    textSize(32);
    textAlign(CENTER, CENTER);
}

/**
 * Manages program states
 */
function draw() {
    if (state === "title") {
        title();
    }
    else if (state === "animation") {
        animation();
    }
    else if (state === "ending") {
        ending();
    }
}

/**
 * Displays the title screen and waits for user input
 */
function title() {
    if (!stringData) return;  // Ensure stringData is loaded
    background("#0000ff");

    push();
    fill("#ffffff");
    text(stringData.title[lang], width / 2, height / 2);
    pop();

    if (mouseIsPressed) {
        state = "animation";
        circle.velocity.x = circle.speed;
    }
}

/**
 * Animates the circle; switches state if it reaches the edge
 */
function animation() {
    background("#000000");

    // Move the circle
    circle.x += circle.velocity.x;
    circle.y += circle.velocity.y;

    // Draw the circle
    push();
    noStroke();
    fill("#ff0000");
    ellipse(circle.x, circle.y, circle.size);
    pop();

    if (circle.x > width) {
        state = "ending";
    }
}

/**
 * Displays the ending screen
 */
function ending() {
    if (!stringData) return;  // Ensure stringData is loaded
    background("#ff0000");

    push();
    fill("#ffffff");
    text(stringData.ending[lang], width / 2, height / 2);
    pop();
}
