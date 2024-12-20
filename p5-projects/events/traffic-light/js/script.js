/**
 * Traffic Light
 * Pippin Barr
 * 
 * A starting point for creating a traffic light
*/

"use strict";

// The traffic light
const trafficLight = {
    // Position and size
    x: 200,
    y: 200,
    size: 100,
    fill: "#00ff00", // Starts green
    fills: {
        stop: "#ff0000", // Red
        slow: "#ffbb00", // Orange
        go: "#00ff00" // Green
    },
    delay: 1000 // How long between lights
};

/**
 * Create the canvas and start the light cycle
 */
function setup() {
    createCanvas(400, 400);

    // Start the traffic light cycle
    setInterval(changeLight, trafficLight.delay);
}

/**
 * Display the traffic light
 */
function draw() {
    background(0);

    // Traffic light
    push();
    noStroke();
    fill(trafficLight.fill);
    ellipse(trafficLight.x, trafficLight.y, trafficLight.size);
    pop();
}

// setsetInterval(eventHandlerFunction, delayInMilliseconds);
// /**
//  * Create the canvas and start the timer
//  */
// function setup() {
//     createCanvas(400, 400);

//     // Start the timer after the traffic light's delay
//     setTimeout(changeLight, trafficLight.delay);
// }

// /**
//  * Changes the traffic light to red
//  */
// function changeLight() {
//     trafficLight.fill = trafficLight.fills.stop;
// }


/**
 * Change the light through the cycle
 */
function changeLight() {
    // Green goes to orange
    if (trafficLight.fill === trafficLight.fills.go) {
        trafficLight.fill = trafficLight.fills.slow;
    }
    // Orange goes to red
    else if (trafficLight.fill === trafficLight.fills.slow) {
        trafficLight.fill = trafficLight.fills.stop;
    }
    // Red goes to green
    else if (trafficLight.fill === trafficLight.fills.stop) {
        trafficLight.fill = trafficLight.fills.go;
    }
}
