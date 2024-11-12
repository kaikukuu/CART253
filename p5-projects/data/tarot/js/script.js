/**
 * Tarot
 * Pippin Barr
 * 
 * Some experiments with data representing a Tarot deck
 */

"use strict";

// A global variable to store our data in
let tarot;
// A global variable to store our fortune in
let fortune;

function preload() {
    // Used in preload, loadJSON will just return the data into our variable
    tarot = loadJSON("assets/tarot_interpretations.json");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Choose a random card
    let card = random(tarot.tarot_interpretations);
    // Choose a random fortune
    fortune = random(card.fortune_telling);
}

function draw() {
    background(0);

    // Display the fortune
    push();
    textSize(18);
    textAlign(CENTER, CENTER);
    fill(255, 255, 0);
    text(fortune, width / 2, height / 2);
    pop();
}