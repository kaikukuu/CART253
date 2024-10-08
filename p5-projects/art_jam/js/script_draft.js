/**
 * Fed Cat is Happy Cat
 * Kaisa Catt
 * 
 * See what happens when you play or feed the cat !
 */

"use strict";

// Setting cat values as constant
const cat = {
    x: 450,
    y: 100,
    size: 170, //based on head
};

// Define the cat's states, each is out of 3
let catStates = {
    energy: 2,       // Current energy level (0 to 3)
    hunger: 1,       // Current hunger level (0 to 3)
    stimulation: 3,  // Current stimulation level (0 to 3)
    happiness: 3     // Current happiness level (0 to 3)
};

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

// Menu position and size
let menuX = 20;
let menuY = 20;
let barWidth = 30;   // Width of each bar
let barHeightMax = 50; // Maximum height of a bar (when the value is 3)
let barGap = 5;     // Gap between bars

// Add a new variable to track if the cat has been fed
let isFishFed = false;
let isMouthOpen = false; // Define openMouth state
let fish; // Fish toy

/**
 * creates the canvas in specified size
*/
function setup() {
    createCanvas(600, 400);

    // Create some toy objects
    toys.push(new Toy(100, 200, 50, 'red'));   // Toy 1
    toys.push(new Toy(200, 150, 40, 'blue'));  // Toy 2
    toys.push(new Toy(300, 250, 60, 'green')); // Toy 3

    // Create the fish object
    fish = new Fish(100, 300, 100, 'orange');  // Fish toy


    /**
     * 
    */
    function draw() {
        background(50);

        // Update the floating menu
        drawFloatingMenu();

        // Display and update all toys
        for (let toy of toys) {
            toy.display();
            toy.drag();
        }
        // Display and update the fish
        fish.display();
        fish.drag();

        // Draw the cat
        drawCat();

        // Check if the fish is near the cat's head
        let distFishCat = dist(fish.x, fish.y, cat.x, cat.y);

        // If fish is near the cat's head and being dragged, open the mouth
        if (distFishCat < cat.size / 2 && fish.isDragging) {
            isMouthOpen = true;
        } else if (!mouseIsPressed && distFishCat < cat.size / 2) {
            // If fish is released over the cat, close the mouth
            isMouthOpen = false;
            isFishFed = true; // Mark the cat as fed
        }

        // Draw the cat's mouth
        if (isMouthOpen) {
            drawOpenMouthWithTeeth();  // Open mouth with teeth
        } else {
            drawClosedMouth();  // Closed mouth
        }

        // Draw the cat's eyes (Closed if happy and fed, otherwise open)
        if (catStates.happiness === 3 && isFishFed) {
            drawClosedEyes();
        } else {
            drawOpenEyes();
        }
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

        // Bar for happiness
        drawStateBar(catStates.happiness, 'Happiness', menuX, menuY + 4 * (barWidth + barGap));
    }

    // Function to draw a single state bar
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

    // Fish class extending Toy class for simplicity
    class Fish {
        constructor(x, y, size, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.isDragging = false;
            this.offsetX = 0;
            this.offsetY = 0;
        }

        // Display fish
        display() {
            fill(this.color);
            ellipse(this.x, this.y, this.size, this.size / 2);  // Draw fish body

            // Draw fish tail
            triangle(this.x - this.size / 2, this.y, this.x - this.size / 1.5, this.y - this.size / 4, this.x - this.size / 1.5, this.y + this.size / 4);
        }

        // Dragging functionality
        drag() {
            if (this.isDragging) {
                this.x = mouseX + this.offsetX;
                this.y = mouseY + this.offsetY;
            }
        }

        startDragging() {
            if (dist(mouseX, mouseY, this.x, this.y) < this.size / 2) {
                this.isDragging = true;
                this.offsetX = this.x - mouseX;
                this.offsetY = this.y - mouseY;
            }
        }

        stopDragging() {
            this.isDragging = false;
        }
    }

    // Draw the cat
    function drawCat() {
        //tail
        noStroke();
        fill(255);
        ellipse(cat.x - cat.size, 3.25 * cat.y, 1.5 * cat.size, cat.size / 8);

        //tail stripes
        fill("#bab4ad");
        ellipse(cat.x - cat.size, 3.25 * cat.y, cat.size, cat.size / 8);
        fill("#8f7964");
        ellipse(cat.x - cat.size / 2, 3.25 * cat.y, 1.5 * cat.size, cat.size / 8);

        //lower legs
        fill("#8f7964");
        ellipse(cat.x - cat.size / 2, cat.y + cat.size, cat.size / 3, cat.size);
        ellipse(cat.x + cat.size / 2, cat.y + cat.size, cat.size / 3, cat.size);

        //back paws
        fill(255);
        ellipse(cat.x - cat.size / 2, 2 * cat.y + cat.size, cat.size / 2, cat.size / 4);
        ellipse(cat.x + cat.size / 2, 2 * cat.y + cat.size, cat.size / 2, cat.size / 4);

        //body
        fill("#bab4ad");
        ellipse(cat.x, cat.y + cat.size, cat.size, 2 * cat.size);
        fill(255);
        ellipse(cat.x, cat.y + cat.size / 2, cat.size / 1.5, cat.size);

        //chest
        fill("#8f7964");
        triangle(cat.x, 0.4 * cat.y + cat.size, cat.x - (cat.size / 15) * 4, cat.size, cat.x + (cat.size / 15) * 4, cat.size);

        //front paws
        fill(255);
        ellipse(cat.x - cat.size / 4, 2 * cat.y + cat.size, cat.size / 2, cat.size / 4);
        ellipse(cat.x + cat.size / 4, 2 * cat.y + cat.size, cat.size / 2, cat.size / 4);

        //rectangle to clean up the bottom
        noStroke();
        fill(50);
        rect(cat.x - cat.size, 2 * cat.y + cat.size, 2 * cat.size, cat.size);

        //ears
        noStroke();
        fill("#bab4ad");
        triangle(cat.x - cat.size / 5, cat.y - cat.size / 3, cat.x - cat.size / 2, cat.y - cat.size / 2, cat.x - cat.size / 2, cat.y);
        triangle(cat.x + cat.size / 5, cat.y - cat.size / 3, cat.x + cat.size / 2, cat.y - cat.size / 2, cat.x + cat.size / 2, cat.y);

        //head
        ellipse(cat.x, cat.y, cat.size);

        //brows
        fill(255);
        ellipse(cat.x - 45, cat.y - 30, cat.size / 3);
        ellipse(cat.x + 45, cat.y - 30, cat.size / 3);

        //whiskers
        let centerX = cat.x;
        let centerY = cat.y + 100;
        let whiskerLength = 150;
        strokeWeight(3);
        stroke("black");
        line(centerX - whiskerLength / 2, centerY, centerX, centerY - whiskerLength / 2);
        line(centerX + whiskerLength / 2, centerY, centerX, centerY - whiskerLength / 2);

        // Left and right top whisker line (mirrored)
        stroke("black");
        line((centerX - 50) - whiskerLength / 2, centerY, centerX, centerY - whiskerLength / 2);
        line((centerX + 50) + whiskerLength / 2, centerY, centerX, centerY - whiskerLength / 2);

        // main snout 
        noStroke();
        fill("#8f7964");
        ellipse(cat.x, cat.y + cat.y / 3.5, cat.size / 2);

        //front snout
        noStroke();
        fill(255);
        ellipse(cat.x, cat.y + cat.y / 3.5, cat.size / 4);

        // Define the vertical offset
        let verticalOffset = 2 / 3 * cat.size - cat.y * 0.85;

        // Nose
        fill("black");
        triangle(
            cat.x, cat.y + verticalOffset,  // Move the nose down by verticalOffset
            cat.x - cat.size / 20, cat.y + verticalOffset - cat.size / 15,  // Adjust the L vertex
            cat.x + cat.size / 20, cat.y + verticalOffset - cat.size / 15   // Adjust the R vertex
        );

        // Left closed eye (arc)
        arc(cat.x - cat.size / 5, cat.y - cat.size / 10, cat.size / 4, cat.size / 8, PI, TWO_PI);

        // Draw the face elements
        // Draw the eyes and mouth in the respective functions
    }

    // Function to draw closed eyes (for happy state)
    function drawClosedEyes() {
        noFill();
        strokeWeight(3);

        // Left closed eye (arc)
        arc(cat.x - cat.size / 5, cat.y - cat.size / 10, cat.size / 4, cat.size / 8, PI, TWO_PI);

        // Right closed eye (arc)
        arc(cat.x + cat.size / 5, cat.y - cat.size / 10, cat.size / 4, cat.size / 8, PI, TWO_PI);
    }

    // Function to draw open eyes (normal state)
    function drawOpenEyes() {
        let distMouse = dist(mouseX, mouseY, width / 2, height / 2);
        let pupilHeight = map(distMouse, 0, width, 40, 30);
        let pupilWidth = map(distMouse, 0, width, 40, 5);

        fill(0);
        ellipse(cat.x - cat.size / 5, cat.y - cat.size / 25, pupilWidth, pupilHeight); // Left pupil
        ellipse(cat.x + cat.size / 5, cat.y - cat.size / 25, pupilWidth, pupilHeight); // Right pupil

    }

    // Function to draw an open mouth with teeth
    function drawOpenMouthWithTeeth() {
        fill("black");
        arc(cat.x, cat.y + cat.size / 2, cat.size / 4, cat.size / 8, 0, PI); // Open mouth shape
        fill(255);
        rect(cat.x - 10, cat.y + cat.size / 2 - 10, 5, 10); // Left tooth
        rect(cat.x + 5, cat.y + cat.size / 2 - 10, 5, 10);  // Right tooth
    }

    // Function to draw closed mouth
    function drawClosedMouth() {
        stroke("black");
        // Adjust the mouth lines to move down by verticalOffset
        // Define the vertical offset
        let verticalOffset = 2 / 3 * cat.size - cat.y * 0.85;

        line(cat.x, cat.y + verticalOffset, cat.x - cat.size / 20, cat.y + verticalOffset + cat.size / 15);

        line(cat.x, cat.y + verticalOffset, cat.x + cat.size / 20, cat.y + verticalOffset + cat.size / 15);

    }

    // Handle mouse press and release events
    function mousePressed() {
        fish.startDragging();
    }

    function mouseReleased() {
        fish.stopDragging();
    }