/**
 * conditional challenges
 * edited by Kaisa Catt * 
 */

"use strict";

/**
 * Circle Master
 * Pippin Barr
 *
 * This will be a program in which the user can move a circle
 * on the canvas using their own circle to "lead" it around.
 */

const puck = {
    x: 350,
    y: 350,
    size: 100,
    fill: "#ff0000"
  };
  
  const user = {
    x: undefined, // will be mouseX
    y: undefined, // will be mouseY
    size: 75,
    fill: "#000000"
  };

  
  
  /**
   * Create the canvas
   */
  function setup() {
    createCanvas(400, 400);
  }
  
  /**
   * Move the user circle, check for overlap, draw the two circles
   */
  function draw() {
    background("#aaaaaa");
    
    // Move user circle
    moveUser();
    
    // Draw the user and puck
    drawUser();
    drawPuck();

    //to move the target
    moveTarget();
  }
  
  function moveTarget() {
    // Check if the user and puck circles overlap
    const distance = dist(user.x, user.y, puck.x, puck.y);
  
    // Calculate the distance between the user and the target on x and y separately
    const dx = user.x - puck.x;
    const dy = user.y - puck.y;
  
    // If the distance is less than the sum of their radii (they overlap)
    if (distance < (user.size / 2 + puck.size / 2)) {
      // Check which distance (x or y) is smaller and move away by 1 pixel on that axis
      if (Math.abs(dx) > Math.abs(dy)) {
        // User is closer on the y-axis, move the puck horizontally
        puck.x += dx > 0 ? -1 : 1;
      } else {
        // User is closer on the x-axis, move the puck vertically
        puck.y += dy > 0 ? -1 : 1;
      }
    }
  }
  
      /**
   * Sets the user position to the mouse position
   */
  function moveUser() {
    user.x = mouseX;
    user.y = mouseY;
  }
  
  /**
   * Displays the user circle
   */
  function drawUser() {
    push();
    noStroke();
    fill(user.fill);
    ellipse(user.x, user.y, user.size);
    pop();
  }
  
  /**
   * Displays the puck circle
   */
  function drawPuck() {
    push();
    noStroke();
    fill(puck.fill);
    ellipse(puck.x, puck.y, puck.size);
    pop();
  }