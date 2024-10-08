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
  ellipse(cat.x -45, cat.y -30, cat.size/3);
  ellipse(cat.x + 45, cat.y - 30, cat.size/3);

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
  line((centerX - 50) - whiskerLength/2, centerY, centerX, centerY - whiskerLength/2);
  line((centerX + 50) + whiskerLength/2, centerY, centerX, centerY - whiskerLength/2);
  
  // main snout 
  noStroke();
  fill("#8f7964");
  ellipse(cat.x, cat.y + cat.y/3.5, cat.size/2);
   
  //front snout
  noStroke();
  fill (255);
  ellipse(cat.x, cat.y + cat.y/3.5, cat.size/4);
  
   // Define the vertical offset
  let verticalOffset = 2/3*cat.size - cat.y*0.85;

  // Nose
  fill("black");
  triangle(
  cat.x, cat.y + verticalOffset,  // Move the nose down by verticalOffset
  cat.x - cat.size/20, cat.y + verticalOffset - cat.size/15,  // Adjust the L vertex
  cat.x + cat.size / 20, cat.y + verticalOffset - cat.size / 15   // Adjust the R vertex
  );

  // Mouth
  stroke("black");
  // Adjust the mouth lines to move down by verticalOffset
  // Define the vertical offset
  //let verticalOffset = 2 / 3 * cat.size - cat.y * 0.85;


//  line(cat.x,cat.y+verticalOffset,cat.x-cat.size/20,cat.y+verticalOffset+cat.size/15);
  //line(cat.x,cat.y+verticalOffset,cat.x+cat.size/20,cat.y+verticalOffset+cat.size/15);

  //pupils
  let verticalOffsetEYE = cat.size * (2 / 3) - cat.y;
  let distMouse = dist(mouseX, mouseY, width / 2, height / 2);
  let pupilHeight = map(distMouse, 0, width, 40, 30);
  let pupilWidth = map(distMouse, 0, width, 40, 5);
  
  fill(0);
  ellipse(cat.x-cat.size/5,cat.y-cat.size/25+verticalOffsetEYE,pupilWidth,pupilHeight);
  ellipse(cat.x+cat.size/5,cat.y-cat.size/25+verticalOffsetEYE,pupilWidth,pupilHeight);
  
  //closed eyes and mouth (for happy state)
  //if happiness = 3
  push();
  noFill();
  strokeWeight(12);
  strokeCap(SQUARE);
  arc(cat.x-35, cat.y+15, cat.x/18, cat.y/3.5, PI, 0, OPEN);
  arc(cat.x+35, cat.y+15, cat.x/18, cat.y/3.5, PI, 0, OPEN);
  pop();
  
//open mouth simulation when holding fish over cat
// Mouth
  stroke("black");
  // Adjust the mouth lines to move down by verticalOffset
  triangle(cat.x, cat.y+verticalOffset,cat.x-10, cat.y+verticalOffset+2 , cat.x+10, cat.y+verticalOffset+2);
//teethsies
  // Nose
  fill("beige");
  triangle(
  cat.x, cat.y + verticalOffset,  // Move the nose down by verticalOffset
  cat.x - cat.size/20, cat.y + verticalOffset - cat.size/15,  // Adjust the L vertex
  cat.x + cat.size / 20, cat.y + verticalOffset - cat.size / 15   // Adjust the R vertex
  );
  
  //dress cat
  //cat clothes/accessories

}

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
  text(stateName, x +10, y + barWidth / 2); 
  
  
}


function draw() {
  background(50);
  
  // Update the floating menu
  drawFloatingMenu();
  
  // Display and update all toys
  for (let toy of toys) {
    toy.display();
    toy.drag();
  }
  
  // Draw the cat
  drawCat();
}
  


