/**
/**
 * Title of Project

"use strict";
// The background colour
const bg = {
    fill: "#000000",
    fills: {
        black: "#000000",
        white: "#ffffff"
    },
    switchKey: 32 // Space bar
}

/**
 * Create the canvas and set up event listener
 */
function setup() {
    createCanvas(400, 400);


    // Start listening for key down
    // It often makes sense to set up event listeners in setup()
    // But there are other possibilities too
    // Call changeBG when a keydown event happens:

    window.addEventListener("keydown", changeBG);
}

/**
 * Fill the canvas
 */
function draw() {
    background(bg.fill);
}

/**
 * Switch the background
 */
function changeBG(event) { // NOTE the event parameter
    // Use event.keyCode to check if they pressed the switching key...
    if (event.keyCode === bg.switchKey) {
        if (bg.fill === bg.fills.black) {
            bg.fill = bg.fills.white;
        }
        else {
            bg.fill = bg.fills.black;
        }
    }
}