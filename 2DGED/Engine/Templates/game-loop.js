// Create a handle to our canvas
const canvas = document.getElementById("main_canvas");

// Get a handle to our canvas 2D context
const context = canvas.getContext("2d");

/** CORE GAME LOOP CODE - DO NOT CHANGE */

let gameTime;
let notificationCenter;

let cameraManager;
let objectManager;
let keyboardManager;
let soundManager;

// TO DO:
// Add more managers as necessary

function start() {

    // Create a new gameTime object
    // This will allow us to keep track of the time in our game
    gameTime = new GameTime();

    // Load game elements
    load();

    // Initialize game elements
    initialize();

    // TO DO: Publish an event to pause the object manager 
    // and show the menu

    // Start the game loop
    window.requestAnimationFrame(animate);
}

function animate(now) {

    // Update game time
    gameTime.update(now);

    // Update game
    update(gameTime);

    // Re-draw game
    draw(gameTime);

    // Loop
    window.requestAnimationFrame(animate);
}

function update(gameTime) {

    // Call the update method of the object manager class
    // to update all sprites
    objectManager.update(gameTime);

    // Call the update method of the camera manager class
    // to update all cameras
    cameraManager.update(gameTime);

    // TO DO: Update other managers
}

function draw(gameTime) {

    // Clear previous draw
    clearCanvas();

    // Call the draw method of the object manager class
    // to draw all sprites
    objectManager.draw(gameTime);
}

function clearCanvas() {

    // Clear the canvas
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

/** GAME SPECIFIC CODE BELOW - CHANGE AS NECESSARY */

function initialize() {

    initializeNotificationCenter();
    initializeManagers();
    
    // TO DO: Call other initialize functions
    
    // It is important that you call initialize functions in the correct 
    // order. Think about what elements of your game are dependant on other
    // elements being initialized before they can be constructed. For 
    // example, do your sprites require a camera in their constructor? If
    // so, you should initialize your camera before attemptng to initialize
    // your sprites...
    
    initializeSprites();
}

function initializeNotificationCenter() {

    // TO DO: Initialize notification center
}

function initializeManagers() {

    // TO DO: Initialize managers

    // Initialize camera manager?
    // Initialize object manager?
    // Initialize game manager?
    // Initialize sound manager?
    // Initialize keyboard manager?
}

function initializeSprites() {

    // TO DO: Initialize sprites

    // Initialize background?
    // Initialize platforms?
    // Initialize players?
    // Initialize enemies?
    // Initialize pickups?
}

function resetGame() {

    clearCanvas();
    startGame();
}

// Start the game once the page has loaded
window.addEventListener("load", start);