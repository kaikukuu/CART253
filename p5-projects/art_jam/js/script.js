
/**
 * Happy Cat with Toys
 * Kaisa Catt
 * 
 * Drag toys around or just watch the cat eyes change size based on distance from the cursor (you) ! Feelings menu is for show only (for now it is not implemented to change based on interaction but i'm working on it!) :p
 * 
 * there are a couple of js script code draft versions with different aspects implemented but aren't entirely functional either. just a note as they are just experiments but are more recently written code. This script version is a bit messy for which I apologize...
 */

"use strict";


//setting cat values as constant
const cat = {
    x: 450,
    y: 100,
    size: 170, //based on head
    //mood preset
    mood: {
        sleepy: 100,
        hateful: 0
    }
};

// Define the cat's states, each is out of 3
let catStates = {
    energy: 2,       // Current energy level (0 to 3)
    hunger: 1,       // Current hunger level (0 to 3)
    stimulation: 3,  // Current stimulation level (0 to 3)
    thirst: 0,       // Current thirst level (0 to 3)
    happiness: 3     // Current happiness level (0 to 3)
};

// Menu position and size
let menuX = 20;
let menuY = 20;
let barWidth = 30;   // Width of each bar
let barHeightMax = 50; // Maximum height of a bar (when the value is 3)
let barGap = 5;     // Gap between bars


// Toy class
class Toy {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.isDragging = false;  // Tracks if the toy is being dragged
        this.offsetX = 0;         // Mouse offset relative to toy center
        this.offsetY = 0;
    }

    // Display the toy
    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size);
    }

    // Check if the mouse is over the toy
    isMouseOver() {
        let d = dist(mouseX, mouseY, this.x, this.y);
        return d < this.size / 2;
    }

    // Start dragging the toy
    startDragging() {
        if (this.isMouseOver()) {
            this.isDragging = true;
            // Calculate the offset between the mouse and the toy's center
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
        }
    }

    // Stop dragging the toy
    stopDragging() {
        this.isDragging = false;
    }

    // Update toy's position when dragging
    drag() {
        if (this.isDragging) {
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
        }
    }
}


// Handle mouse press event
function mousePressed() {
    for (let toy of toys) {
        toy.startDragging();  // Check each toy to see if it should start dragging
    }
}

// Handle mouse release event
function mouseReleased() {
    for (let toy of toys) {
        toy.stopDragging();  // Stop dragging all toys when mouse is released
    }
}

// Create an array to store multiple toys
let toys = [];


function setup() {
    createCanvas(600, 400);

    // Create some toy objects
    toys.push(new Toy(100, 200, 50, 'red'));   // Toy 1
    toys.push(new Toy(200, 150, 40, 'blue'));  // Toy 2
    toys.push(new Toy(300, 250, 60, 'green')); // Toy 3
}

function draw() {
    push();
    background(50);


    // Update the bar graph
    drawFloatingMenu();

    // Display and update all toys
    for (let toy of toys) {
        toy.display();
        toy.drag();
    }

    //drawing cat
    //tail
    noStroke();
    fill(255);
    ellipse(cat.x - cat.size, 3.25 * cat.y, 1.5 * cat.size, cat.size / 8);
    //tail stripes?
    fill(" #bab4ad");
    ellipse(cat.x - cat.size, 3.25 * cat.y, cat.size, cat.size / 8);
    fill("#8f7964");
    ellipse(cat.x - cat.size / 2, 3.25 * cat.y, 1.5 * cat.size, cat.size / 8);

    //lower legs
    //left leg
    fill("#8f7964");
    ellipse(cat.x - cat.size / 2, cat.y + cat.size, cat.size / 3, cat.size);
    //right leg
    ellipse(cat.x + cat.size / 2, cat.y + cat.size, cat.size / 3, cat.size);

    //back paws
    fill(255);
    //left
    ellipse(cat.x - cat.size / 2, 2 * cat.y + cat.size, cat.size / 2, cat.size / 4);
    //right
    ellipse(cat.x + cat.size / 2, 2 * cat.y + cat.size, cat.size / 2, cat.size / 4);

    //body
    fill(" #bab4ad");
    ellipse(cat.x, cat.y + cat.size, cat.size, 2 * cat.size);
    //fur coloring
    fill(255);
    ellipse(cat.x, cat.y + cat.size / 2, cat.size / 1.5, cat.size);


    triangle(
        cat.x, cat.y + 1.2 * cat.size,  // Vertex 1 (center of the cat body)

        cat.x - (cat.size / 20) * 4, cat.y + cat.size - (cat.size / 15) * 2,  // Vertex 2, scaled up by a factor of 4

        cat.x + (cat.size / 20) * 4, cat.y + cat.size - (cat.size / 15) * 2   // Vertex 3, scaled up by a factor of 4
    );

    //chest 
    fill("#8f7964");
    triangle(
        cat.x, 0.4 * cat.y + cat.size,  // Vertex 1 (center of the cat body)

        cat.x - (cat.size / 15) * 4, cat.size,  // Vertex 2, scaled up by a factor of 4

        cat.x + (cat.size / 15) * 4, cat.size   // Vertex 3, scaled up by a factor of 4
    );

    //front paws
    fill(255);
    //left
    ellipse(cat.x - cat.size / 4, 2 * cat.y + cat.size, cat.size / 2, cat.size / 4);
    //right
    ellipse(cat.x + cat.size / 4, 2 * cat.y + cat.size, cat.size / 2, cat.size / 4);

    //rectangle shape to cleanup shapes of bottom of body
    noStroke();
    fill(50);
    rect(cat.x - cat.size, 2 * cat.y + cat.size, 2 * cat.size, cat.size);

    // ears
    noStroke();
    fill(" #bab4ad");
    triangle(cat.x - cat.size / 5, cat.y - cat.size / 3, cat.x - cat.size / 2, cat.y - cat.size / 2, cat.x - cat.size / 2, cat.y);
    triangle(cat.x + cat.size / 5, cat.y - cat.size / 3, cat.x + cat.size / 2, cat.y - cat.size / 2, cat.x + cat.size / 2, cat.y);

    //cat head
    ellipse(cat.x, cat.y, cat.size);
    //brows
    fill(255);
    ellipse(cat.x - 50, cat.y - 40, cat.size / 4);
    ellipse(cat.x + 50, cat.y - 40, cat.size / 4);

    //whiskers
    // Calculate the center of cat's face
    let centerX = cat.x;
    let centerY = cat.y + 100;

    // Whisker line length
    let whiskerLength = 150; // adjust this to change the length of the whiskers
    strokeWeight(3);

    // Left bottom whisker line
    stroke("black");
    line(centerX - whiskerLength / 2, centerY, centerX, centerY - whiskerLength / 2);

    // Right bottom whisker line (mirrored)
    line(centerX + whiskerLength / 2, centerY, centerX, centerY - whiskerLength / 2);

    // Left top whisker line
    stroke("black");
    line((centerX - 50) - whiskerLength / 2, centerY, centerX, centerY - whiskerLength / 2);

    // Right top whisker line (mirrored)
    line((centerX + 50) + whiskerLength / 2, centerY, centerX, centerY - whiskerLength / 2);

    // main snout 
    noStroke();
    fill("#8f7964");
    ellipse(cat.x, cat.y + cat.y / 3.5, cat.size / 2);

    //front snout
    noStroke();
    fill(255);
    ellipse(cat.x, cat.y + cat.y / 3.5, cat.size / 4);

    //START
    //og code DO NOT DELETE
    //cat eyes with pupils that respond to mouse distance (closer the mouse, the larger the pupils)
    //normal mood

    //let distMouse = dist(mouseX, mouseY, width / 2, height / 2);
    //cat.pupilSize = map(distMouse, 0, width, 30, 15);

    // Draw pupils
    //fill(0);
    //ellipse(cat.x - cat.size/5, cat.y - cat.size/10, cat.pupilSize, cat.pupilSize);
    //ellipse(cat.x + cat.size/5, cat.y - cat.size/10, cat.pupilSize, cat.pupilSize);
    //END

    //SLIT EYES TEST
    // Define the vertical offset
    let verticalOffsetEYE = cat.size * (2 / 3) - cat.y;

    // Calculate distance from mouse to cat's center
    let distMouse = dist(mouseX, mouseY, width / 2, height / 2);

    // Map the pupil width and height based on mouse distance
    let pupilHeight = map(distMouse, 0, width, 40, 30); // Max height 40 when close, Min height 10 when far
    let pupilWidth = map(distMouse, 0, width, 40, 5);   // Max width 20 when close, Min width 2 (slit-like) when far

    // Draw pupils (round and big when close, narrow and slit-like when far)
    fill(0);
    ellipse(cat.x - cat.size / 5, cat.y - cat.size / 25 + verticalOffsetEYE, pupilWidth, pupilHeight); // Left pupil
    ellipse(cat.x + cat.size / 5, cat.y - cat.size / 25 + verticalOffsetEYE, pupilWidth, pupilHeight); // Right pupil
    pop();

    //closed eyes and mouth (for happy state)
    noFill();
    //strokeWeight(6);
    arc(cat.x - 35, cat.y, cat.x / 14, cat.y / 4, PI, 0, OPEN);
    arc(cat.x + 35, cat.y, cat.x / 14, cat.y / 4, PI, 0, OPEN);

    //open mouth simulation when holding fish over cat




    // Define the vertical offset
    let verticalOffset = 2 / 3 * cat.size - cat.y * 0.85;

    // Nose

    fill("black");
    triangle(
        cat.x, cat.y + verticalOffset,  // Move the nose down by verticalOffset
        cat.x - cat.size / 20, cat.y + verticalOffset - cat.size / 15,  // Adjust the left vertex
        cat.x + cat.size / 20, cat.y + verticalOffset - cat.size / 15   // Adjust the right vertex
    );

    // Mouth
    stroke("black");
    // Adjust the mouth lines to move down by verticalOffset
    line(cat.x, cat.y + verticalOffset, cat.x - cat.size / 20, cat.y + verticalOffset + cat.size / 15);
    line(cat.x, cat.y + verticalOffset, cat.x + cat.size / 20, cat.y + verticalOffset + cat.size / 15);


}


// Function to draw the floating horizontal bar graph menu
function drawFloatingMenu() {
    fill(255);
    stroke(0);
    rect(menuX - 10, menuY - 10, 100, 200);  // Menu background

    // Bar for energy
    drawStateBar(catStates.energy, 'Energy', menuX, menuY);

    // Bar for hunger
    drawStateBar(catStates.hunger, 'Hunger', menuX, menuY + barWidth + barGap);

    // Bar for stimulation
    drawStateBar(catStates.stimulation, 'Stimulation', menuX, menuY + 2 * (barWidth + barGap));

    // Bar for thirst
    drawStateBar(catStates.thirst, 'Thirst', menuX, menuY + 3 * (barWidth + barGap));

    // Bar for happiness
    drawStateBar(catStates.happiness, 'Happiness', menuX, menuY + 4 * (barWidth + barGap));
}


// Function to draw a single state bar (horizontally) with text on the left and value on the right
function drawStateBar(stateValue, stateName, x, y) {
    let barWidthMapped = map(stateValue, 0, 3, 0, barHeightMax); // Map state value (0-3) to bar width


    // Draw the bar itself
    fill("#62a132");
    noStroke();
    rect(x, y, barWidthMapped, barWidth); // Draw the bar horizontally

    // Draw state value (e.g., "2/3") to the right of the bar
    fill(0);
    textAlign(LEFT, CENTER);
    text(stateValue + "/3", x + barHeightMax + 15, y + barWidth / 2); // State value on the right

    // Draw state name within bar
    fill(0);
    textAlign(LEFT, CENTER);
    textSize(10); // Smaller font size
    text(stateName, x + 10, y + barWidth / 2);


}

