/**
 * Keyboard Events
 * Pippin Barr
 * 
 * A chance to experiment with keyboard events in a simple setting.
*/

"use strict";

// Our ball
const ball = {
    // Position
    x: 200,
    y: 200,
    // Size
    size: 50,
    // fill
    fill: "#ffffff",
    // fills
    fills: {
        white: "#ffffff",
        red: "#ff0000",
        blue: "#0000ff"
    }
}

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Draws the ball
 */
function draw() {
    background(0);

    // Draw the ball
    push();
    noStroke();
    fill(ball.fill);
    ellipse(ball.x, ball.y, ball.size);
    pop();
}

/**
 * Change the colour of the ball
 */
function keyPressed() {
    ball.fill = ball.fills.red;
}

/**
 * Reset the colour of the ball
 */
function keyReleased() {
    ball.fill = ball.fills.white;
}

/**
 * Handle keypress:
 * - r = make the ball red
 */
function keyPressed(event) {
    if (event.key === "r") {
        ball.fill = ball.fills.red;
    }
}

/**
 * Handle keyreleased:
 * - r = Set the ball back to default
 */
function keyReleased(event) {
    if (event.key === "r") {
        ball.fill = ball.fills.white;
    }
}

/**
 * Handle keypress:
 * - r = make the ball red
 * - b = make the ball blue
 */
function keyPressed(event) {
    if (event.key === "r") {
        ball.fill = ball.fills.red;
    }
    else if (event.key === "b") {
        ball.fill = ball.fills.blue;
    }
}

/**
 * Handle keyreleased:
 * - r or b = Set the ball back to default
 */
function keyReleased(event) {
    if (event.key === "r" || event.key === "b") {
        ball.fill = ball.fills.white;
    }
}

/**
 * Handle keypress:
 * - R = make the ball red
 * - B = make the ball blue
 */
function keyPressed(event) {
    if (event.keyCode === 82) {
        ball.fill = ball.fills.red;
    }
    else if (event.keyCode === 66) {
        ball.fill = ball.fills.blue;
    }
}

/**
 * Handle keyreleased:
 * - R or B = Set the ball back to default
 */
function keyReleased(event) {
    if (event.keyCode === 82 || event.keyCode === 66) {
        ball.fill = ball.fills.white;
    }
}

// This is more robust for the user because they don’t have to worry about whether they have capslock on.But it’s harder to read for you, because you probably don’t have the entire ASCII key code table memorized.The comments help, but maybe not enough.

// Where would you get those keycodes ? Well the internet.This is a good option: https://www.toptal.com/developers/keycode.


