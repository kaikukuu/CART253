# Happy Cat

By Kaisa Catt

[View this project online](https://github.com/allecatt/art-jam.git)

## Description

Drag toys around or just watch the cat eyes change size based on distance from the cursor (you) ! Feelings menu is for show only (for now it is not implemented to change based on interaction but i'm working on it!) :p


## Credits

This project uses [p5.js](https://p5js.org).

## Attribution

Thank you to Pippin's examples and for initial cat code example from which I built off of: 

const cat = {
  x: 200,
  y: 200,
  size: 200,
  mood: {
    sleepy: 100,
    hateful: 0
  }
};

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background("#87ceeb");
  
  noStroke();
  
  fill("pink");
    triangle(cat.x - cat.size/5, cat.y - cat.size/3, cat.x - cat.size/2, cat.y - cat.size/2, cat.x - cat.size/2, cat.y);
    triangle(cat.x + cat.size/5, cat.y - cat.size/3, cat.x + cat.size/2, cat.y - cat.size/2, cat.x + cat.size/2, cat.y);

  
  ellipse(cat.x, cat.y, cat.size);
  
  fill(0);
  ellipse(cat.x - cat.size/5, cat.y - cat.size/10, cat.size/10);
  ellipse(cat.x + cat.size/5, cat.y - cat.size/10, cat.size/10);
  
  fill("coral")
  triangle(cat.x, cat.y, cat.x - cat.size/20, cat.y - cat.size/15, cat.x + cat.size/20, cat.y - cat.size/15)
  
  stroke("coral");
  line(cat.x, cat.y, cat.x - cat.size/20, cat.y + cat.size/15);
  line(cat.x, cat.y, cat.x + cat.size/20, cat.y + cat.size/15);  
}