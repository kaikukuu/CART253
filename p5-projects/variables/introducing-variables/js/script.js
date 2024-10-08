/**
 * Title of Project
 * Author Name
 * 
 *practice
 */

"use strict";


function setup() {
    // Create the canvas
    createCanvas(640, 640);
}

function draw() {
    background(0);
    
    // Draw a circle in the centre of the canvas
    push();
    noStroke();
    fill(155, 100, 100);
    // If we set the ellipse's (x,y) coordinates to
    // *half* the width and *half* the height, it will
    // always end up in the centre of our canvas.
    // That's math, baby! / means division
    // ellipse(width/2, height/2, 100, 100);
    
    // We use the variable names mouseX and mouseY instead
    // of numbers for the x and y coordinates of our circle
    // JavaScript will *use the values inside them* (the numbers)
    // to send as the x and y arguments of ellipse()
    // And that will mean the ellipse will be drawn with its (x, y)
    // position set to the current mouse (x, y) position.
    ellipse(mouseX, mouseY, 100, 100);

     // We use the variable names mouseX and mouseY instead
    // of numbers for the width and height of the ellipse
    // This causes it to be bigger the further from the origin (0,0)
    ellipse(width/2, height/2, mouseX, mouseY);

     // We use the variable names mouseX and mouseY instead
    // of numbers for the red and green of the circle's fill
    fill(mouseX, mouseY, 0);
    ellipse(width/2, height/2, 100, 100);

    pop();
}
