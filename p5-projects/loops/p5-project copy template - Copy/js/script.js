/**
/**
 * Star-field
 **/

"use strict";

// The brief
// Consider the problem of drawing 100 stars in random positions.Doing that line by line would take way too long.

// The solution
// However, a for-loop can count to 100 for us, and we can just draw a star each time…
// How many stars to display?
const NUM_STARS = 100;

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(0);

    // randomSeed() allows us to make random() more predictable
    // When we set the random seed we make it so that all the
    // random() functions we call from here will have the same
    // (random) return values in a sequence
    // (Try removing it and seeing what happens!)
    randomSeed(1);
    // A for-loop to count from 0 up to the number of stars
    for (let i = 0; i < NUM_STARS; i++) {
        drawStar();
    }
    // Once we get here (with the for-loop done) we will have
    // drawn NUM_STARS stars.
}

/**
 * Draws a star at a random position
 */
function drawStar() {
    push();
    const x = random(0, width);
    const y = random(0, height);
    const diameter = random(2, 5);
    ellipse(x, y, diameter);
    pop();
}

// for...of and arrays
// We’ve already seen that we can use for...of to easily do something with each element of an array:

// const fruits = ["Apples", "Peaches", "Strawberries", "Bananas"];

// for (let fruit of fruits) {
//     console.log(fruit);
// }
// The above will print out each fruit name in the array, one by one, in order.

// for and arrays
// for...of is really quite nice, but it’s important to know that a lot of the time you’ll see people doing this with a standard for-loop:

//     const fruits = ["Apples", "Peaches", "Strawberries", "Bananas"];

// for (let i = 0; i < fruits.length; i++) {
//     let fruit = fruits[i];
//     console.log(fruit);
// }
// Same thing, just a slightly different approach to writing it out.

// One reason you might want to do it this way ? If it’s useful to have the i variable when you’re processing the elements in the array.Occasionally it is.