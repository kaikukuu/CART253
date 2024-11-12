/**
 * Machines
 * Pippin Barr
 * 
 * A starting point for a project that displays different machines
 * on the canvas. Eventually I'd like to be able to drag and drop
 * items onto the machines and have them act in different ways.
 * For now I'm happy to just show that they're distinct.
 */

"use strict";

// /**
//  * Create the canvas
//  */
// function setup() {
//     createCanvas(400, 200);
// }

// /**
//  * Display the three machines
//  */
// function draw() {
//     background(0);

//     // Incinerator
//     push();
//     noStroke();
//     fill("#ff4400");
//     rect(0, 100, 100, 100);
//     pop();

//     // Freezer
//     push();
//     noStroke();
//     fill("#bbbbff");
//     rect(150, 100, 100, 100);
//     pop();

//     // Crusher
//     push();
//     noStroke();
//     fill("#777777");
//     rect(300, 100, 100, 100);
//     pop();
// }

const machineWidth = 100;
const machineHeight = 100;

// An array of machines data
// We don’t necessarily use type yet, but it’s clearly an important part of what a machine is and does, so it makes sense to include it. It will enable us to distinguish the different machines and have our program act differently depending on the machine in question.
let machines = [
    {
        type: "incinerator",
        x: 0,
        y: 100,
        width: machineWidth,
        height: machineHeight,
        fill: "#ff4400",
    },
    {
        type: "freezer",
        x: 150,
        y: 100,
        width: machineWidth,
        height: machineHeight,
        fill: "#bbbbff",
    },
    {
        type: "crusher",
        x: 300,
        y: 100,
        width: machineWidth,
        height: machineHeight,
        fill: "#777777"
    }
];

function setup() {
    createCanvas(400, 200);
}

function draw() {
    background(0);

    // Go through the machine in the array and draw them
    for (let machine of machines) {
        drawMachine(machine);
    }

}

function drawMachine(machine) {
    push();
    noStroke();
    fill(machine.fill);
    rect(machine.x, machine.y, machine.width, machine.height);
    pop();
}