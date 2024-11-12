/**
 * Lines
 * Pippin Barr
 * 
 * A series of lines across the canvas
 */

"use strict";
function setup() {
    createCanvas(500, 500);
    colorMode(HSB, 360, 100, 100); // Set color mode to HSB
}

function draw() {
    // Draw a gradient background using HSB color
    for (let i = 0; i < width; i++) {
        let hue = map(i, 0, width, 0, 360); // Map i to a hue from 0 to 360
        stroke(hue, 100, 100);
        line(i, 0, i, height);
    }

    // Add vertical lines as before
    let x = 0;
    let strokeVar = 0;
    let strokeWeightVar = 0.5;

    while (x <= width) {
        stroke(strokeVar);
        strokeWeight(strokeWeightVar);
        line(x, 0, x, height);

        x += 50;
        strokeVar += 25;
        strokeWeightVar += 0.5;
    }

    // Add horizontal lines from top to bottom as before
    let y = 0;
    strokeVar = 0;
    strokeWeightVar = 0.5;

    while (y <= height) {
        stroke(strokeVar);
        strokeWeight(strokeWeightVar);
        line(0, y, width, y);

        y += 50;
        strokeVar += 25;
        strokeWeightVar += 0.5;
    }
}


// /**
//  * Creates the canvas
//  */
// function setup() {
//     createCanvas(500, 500);
// }

// /**
//  * Draws lines across the canvas with increasing thickness and
//  * gradually lightening colour
//  */
// function draw() {
//     background("pink");

//     let x = 0;
//     let strokeVar = 0;
//     let strokeWeightVar = 0.5;  // Start with a thin line

//     // Loop until we reach the right side of the canvas
//     while (x <= width) {
//         // Set the stroke color and weight
//         stroke(strokeVar);
//         strokeWeight(strokeWeightVar);

//         // Draw the line from top to bottom at the current x position
//         line(x, 0, x, height);

//         // Increment values for the next line
//         x += 50;                // Move x 50 pixels to the right
//         strokeVar += 25;        // Increase stroke color intensity
//         strokeWeightVar += 0.5; // Increase line thickness gradually
//     }
// }

//     stroke(0);
// strokeWeight(1);
// line(0, 0, 0, height);

// stroke(25);
// strokeWeight(2);
// line(50, 0, 50, height);

// stroke(50);
// strokeWeight(3);
// line(100, 0, 100, height);

// stroke(75);
// strokeWeight(4);
// line(150, 0, 150, height);

// stroke(100);
// strokeWeight(5);
// line(200, 0, 200, height);

// stroke(125);
// strokeWeight(6);
// line(250, 0, 250, height);

// stroke(150);
// strokeWeight(7);
// line(300, 0, 300, height);

// stroke(175);
// strokeWeight(8);
// line(350, 0, 350, height);

// stroke(200);
// strokeWeight(9);
// line(400, 0, 400, height);

// stroke(225);
// strokeWeight(10);
// line(450, 0, 450, height);

// stroke(250);
// strokeWeight(11);
// line(500, 0, 500, height);