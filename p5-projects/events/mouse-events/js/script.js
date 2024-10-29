/**
 * Mouse Events
 * Pippin Barr
 * 
 * A chance to experiment with mouse events in a simple setting.
*/

"use strict";

// Our ball
const ball = {
    // Position
    x: 0,
    y: 200,
    // Size
    size: 50,
    // Velocity so it can move
    velocity: {
        x: 0,
        y: 0
    },
    // Speed when it moves
    speed: 5
}

/**
 * Starts the ball moving on mouse pressed
 */
function mousePressed() {
    ball.velocity.x = ball.speed;
}

/**
 * Stops the ball moving
 */
function mouseReleased() {
    ball.velocity.x = 0;
}

/**
 * Grows the ball when the mouse wheel is rolled
 */
function mouseWheel() {
    ball.size += 0.5;
}

/**
 * Resizes the ball
 */
function mouseWheel(event) {
    // Add the number of pixels scrolled to the ball size
    // Positive for scrolling down, negative for scrolling up
    ball.size += event.delta;
    // Constrain the size of the ball so it doesn't get silly
    ball.size = constrain(ball.size, 10, width);
}

// mouseMoved() is called whenever the mouse moves
// mouseDragged() is called whenever the mouse moves while the button is pressed down
// mouseClicked() is called whenever the mouse is clicked(pressed and then released)
// mouseDblClicked() is called whenever the mouse is clicked twice in a row quickly

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Moves the ball and draws it
 */
function draw() {
    background(0);

    // Move the ball
    ball.x += ball.velocity.x
    ball.y += ball.velocity.y;

    // Draw the ball
    push();
    ellipse(ball.x, ball.y, ball.size);
    pop();
}