Outline for Fly Game:
Game Structure:
Start Screen: Instructions and play button.
Level Start and End Screens: Each level has a title and feedback based on performance.
Feedback Text: Warnings and updates like “near miss!” or “caught by frog tongue! Try again?”
Win/Loss Screens: Final messages for winning or losing all hearts.
Gameplay:
Player Goal: Guide the fly across the swamp while avoiding obstacles.
Levels: Three levels with increasing numbers of frogs.
Player Health (Hearts): Three hearts that decrease by one if hit by a frog, or half if colliding with other flies.
Challenges:
Frog Tongues: Frogs randomly attempt to catch the fly with tongues.
Other Flies: Moving obstacles that, if collided with, reduce hearts by half.
Key Features Explained:
Level Progression: Increases frogs and flies on each level load, making it progressively harder.
Collision Handling: Deducts hearts for each collision, with different penalties based on the obstacle.
Feedback Messages: Displays player feedback based on in-game events like collisions.
Explanation of Controls
Keyboard Controls:
LEFT_ARROW: Move fly left
RIGHT_ARROW: Move fly right
UP_ARROW: Move fly up
DOWN_ARROW: Move fly down
Boundary Constraints: constrain() keeps the fly within the canvas limits.
pseudocode:
# Pseudocode for Fly Adventure Game

# Game Variables
fly
position(x, y) : starting near left edge, random y on each reset
speed: 3 // pixels per frame
size: 10 // for collision detection

hearts: 3 // Player lives, reset to 3 at each level start

frog
number: increases with each level
position(x, y) : spread across the swamp
    tongue state: idle / outbound / inbound
    tongue speed: 5 // pixels per frame

otherFlies
number: increases with each level
positions(x, y) : randomized across the canvas, moving horizontally

level: current level of the game(starts at 1)
maxLevels: 3 // total levels in the game

# Setup
setup()
    create canvas(640, 480)
displayStartScreen()

# Start Screen
displayStartScreen()
    show title and instructions
    wait for player to start game

# Game Start / Restart
startGame()
    set level to 1
    set hearts to 3
loadLevel(level)

# Load Level
loadLevel(level)
    reset fly position to starting point
    initialize frogs and otherFlies based on level
displayLevelTitle(level)

# Main Game Loop
draw()
if hearts > 0 and level <= maxLevels
drawBackground()
displayHearts()
moveFly()
drawFly()
moveFrogs()
drawFrogs()
moveOtherFlies()
drawOtherFlies()
checkCollisions()
    else if hearts <= 0
        displayLoseScreen()
else
    displayWinScreen()

# Fly Movement
moveFly()
    update fly x - position by speed
if fly reaches right edge of canvas
if level < maxLevels
            level++
loadLevel(level)
        else
displayWinScreen()

# Drawing Functions
drawFly()
    draw circle at fly position with fly size

drawFrogs()
for each frog
        draw circle for frog body at position(frog.x, frog.y)
        draw line for frog tongue based on tongue state and position

drawOtherFlies()
for each fly in otherFlies
        draw small circle at fly position

# Frog Movement
moveFrogs()
for each frog
        frog x - position follows player x - position randomly within a range
        frog tongue state changes randomly between idle, outbound, and inbound

# Other Flies Movement
moveOtherFlies()
for each fly in otherFlies
        update x - position with horizontal movement
if fly reaches canvas edge, reverse direction

# Collision Detection
checkCollisions()
if fly collides with frog tongue
hearts--
        reset fly position to left edge with random y - position
display “caught by frog!” feedback
if fly collides with any other fly in otherFlies
hearts -= 0.5
display “ouch! another fly bumped into you!”

# Win / Loss Screens
displayWinScreen()
    display message for game completion

displayLoseScreen()
    display message for losing all hearts

# Mouse Interaction
mousePressed()
for each frog
        if tongue is idle, set state to outbound

# Game Setup
- Define variables:
    - fly: represents the player-controlled fly (x, y, size, speed, moveSpeed)
    - frogs: an array of frog objects (each frog has x, y, size, tongueState, tongueY, tongueSpeed)
    - otherFlies: an array of other fly obstacles (each has x, y, size, speed)
    - hearts: the player's health points, starting at 3
    - level: the current game level, starting at 1
    - maxLevels: maximum number of levels, set to 3

- Define fly creation function `createFly()`:
    - Sets initial position near the left side of the screen and random y
    - Assigns fly size and speed values

- Define frog creation function `createFrog(x, y)`:
    - Sets initial x, y for the frog
    - Defines tongueState as "idle", with initial tongueY and tongueSpeed
    - Assigns frog size

- Define other fly creation function `createOtherFly(x, y)`:
    - Sets initial x, y position randomly within screen bounds
    - Assigns random speed for movement

# Setup and Level Loading
- In `setup()`:
    - Create the canvas
    - Create the player-controlled fly
    - Call `loadLevel(level)`

- Define `loadLevel(level)`:
    - Reset hearts to 3
    - Clear previous frogs and other flies
    - Increase number of frogs and other flies based on level
    - Populate frogs and otherFlies arrays with new frogs and other flies at random positions

# Main Game Loop
- In `draw()`:
    - Display game background (swamp-like color)
    - Display player hearts with `displayHearts()`
    - Call `moveFly()` to update fly’s position based on keyboard input
    - Draw the fly with `drawFly()`

    - For each frog in frogs array:
        - Call `moveFrog(frog)` to handle frog tongue movement
        - Call `drawFrog(frog)` to display frog and its tongue
        - Check if the fly collides with the frog using `checkCollision(fly, frog)`
            - If true:
                - Decrement hearts by 1
                - Call `resetFlyPosition()`
                - If hearts are 0, show the lose screen with `displayLoseScreen()`

    - For each otherFly in otherFlies array:
        - Call `moveOtherFly(otherFly)` to handle movement
        - Call `drawOtherFly(otherFly)` to display each other fly
        - Check if the fly collides with otherFly using `checkCollision(fly, otherFly)`
            - If true:
                - Decrement hearts by 0.5
                - If hearts are 0, show the lose screen with `displayLoseScreen()`

    - Check if the fly has reached the right edge of the screen
        - If yes, increment the level
            - If level is within maxLevels, call `loadLevel(level)` to increase difficulty
            - If level exceeds maxLevels, show the win screen with `displayWinScreen()`

# Fly Controls
- Define `moveFly()`:
    - Check if `LEFT_ARROW` is pressed, move fly left
    - Check if `RIGHT_ARROW` is pressed, move fly right
    - Check if `UP_ARROW` is pressed, move fly up
    - Check if `DOWN_ARROW` is pressed, move fly down
    - Use `constrain()` to keep fly within screen boundaries

- Define `drawFly()`:
    - Draw the fly as a small circle at its current position

- Define `resetFlyPosition()`:
    - Reset the fly’s position to the left side of the screen at a random y position

# Frog Behavior
- Define `moveFrog(frog)`:
    - Frog randomly "wobbles" slightly along the x-axis
    - If `tongueState` is "idle" and a random condition is met, set `tongueState` to "outbound"
    - If `tongueState` is "outbound", move tongueY up by `tongueSpeed`
        - If tongueY is high enough, switch `tongueState` to "inbound"
    - If `tongueState` is "inbound", move tongueY back down
        - If tongueY reaches initial position, set `tongueState` to "idle"

- Define `drawFrog(frog)`:
    - Draw frog as a circle at its x, y position
    - If `tongueState` is not "idle", draw the tongue as a line extending from the frog

# Other Fly Behavior
- Define `moveOtherFly(otherFly)`:
    - Move otherFly based on its speed
    - Reverse direction if otherFly reaches the screen edge

- Define `drawOtherFly(otherFly)`:
    - Draw otherFly as a small circle at its current position

# Collision Detection
- Define `checkCollision(fly, obj)`:
    - Calculate distance between fly and another object (frog or other fly)
    - If distance is less than sum of half sizes, return true (collision detected)

# Win/Lose Screens
- Define `displayWinScreen()`:
    - Display "You Win!" message, and stop game loop with `noLoop()`

- Define `displayLoseScreen()`:
    - Display "Game Over!" message, and stop game loop with `noLoop()`

# Interaction with Frog Tongues
- Define `mousePressed()`:
    - For each frog, if `tongueState` is "idle", set `tongueState` to "outbound" to trigger tongue action
