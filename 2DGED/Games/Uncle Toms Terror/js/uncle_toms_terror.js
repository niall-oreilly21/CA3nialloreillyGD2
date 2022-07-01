// Create a handle to our canvas
const canvas = document.getElementById("main_canvas");

// Get a handle to our canvas 2D context
const context = canvas.getContext("2d");

let gameTime;
let notificationCenter;
let cameraManager;
let objectManager;
let keyboardManager;
let mouseManager;
let soundManager;
let gameStateManager;
let menuManager;
let uiManager;
let orientationManager;
let touchScreenManager;
let seconds = 0;
let minutes = 3;
let intervalTimer;
let intervalTime = 1000;

//Timer is 3 minutes long
let totalSeconds = 180;

// Set to false to hide bounding boxes
const debugMode = false;

function start() 
{

    // Create a new gameTime object
    // This will allow us to keep track of the time in our game
    gameTime = new GameTime();

    // Initialize game
    initialize();

    // Publish an event to pause the object manager, by setting its StatusType
    // to off (i.e. no update, no draw). This, in turn, shows the menu.
    notificationCenter.notify(
        new Notification(
            NotificationType.Menu,
            NotificationAction.ShowMenuChanged,
            [StatusType.Off]
        )
    );

    // Start the game loop
    window.requestAnimationFrame(animate);
}


function animate(now) 
{

    // Update game time
    gameTime.update(now);

    // Update game
    update(gameTime);

    // Re-draw game
    draw(gameTime);

    // Loop
    window.requestAnimationFrame(animate);
}


function update(gameTime) 
{
    // Call the update method of the object manager class
    // to update all sprites
    objectManager.update(gameTime);
    
    // Call the update method of the game state manager
    // class to update the game state
    gameStateManager.update(gameTime);

    // Call the update method of the menu manager class to
    // check for menu state changes
    menuManager.update(gameTime);

    // Call the update method of the ui manager class to
    // check for ui state changes
    uiManager.update(gameTime);

    // Call the update method of the camera manager class
    // to update all cameras
    cameraManager.update(gameTime);

    // If we are in debug mode
    if (debugMode) {

        // Call the update method of the debug drawer class
        // to update debug info
        debugDrawer.update(gameTime);
    }
}


function draw(gameTime) 
{

    // Clear previous draw
    clearCanvas();

    // Call the draw method of the object manager class
    // to draw all sprites
    objectManager.draw(gameTime);


    // If we are in debug mode
    if (debugMode) 
    {

        // Call the draw method of the debug drawer class
        // to display debug info
        debugDrawer.draw(gameTime);
    }
    
    context.font = FontType.Wage;
    context.fillStyle = Color.LightBlue;

    //Updates and draws the timer to the canvas
    if(seconds > 9)
    {
    context.fillText(` ${minutes}:${seconds}  `, 400, 80)  
    }
    else
    {
        context.fillText(` ${minutes}:0${seconds}  `, 400, 80)  
    }

    context.fillStyle = Color.Green;

    //Updates and draws the wage to the canvas
    context.fillText(`\u20AC ${wage}`, 1000, 50)

    context.fillStyle = Color.Black;
    context.font = FontType.orderTally;

    //Updates and draws the orders details to the canvas
    context.fillText(` ${waiterPizza} /`, 85, 300)
    context.fillText(` ${orderPizza} `, 125, 300)
    context.fillText(` ${waiterBeer} /`, 85, 540)
    context.fillText(` ${orderBeer} `, 125, 540)  

}


function clearCanvas() 
{

    context.save();
    context.fillStyle = Color.Grey;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.restore();
}


function initialize() 
{

    initializeNotificationCenter();
    initializeManagers();
    initializeCameras();
    initializeSprites();
    registerForNotifications();

    // If we are in debug mode
    if (debugMode) 
    {
        // Initialize debug drawer
        initializeDebugDrawer();
    }
}


function initializeNotificationCenter() 
{
    notificationCenter = new NotificationCenter();
}


function initializeManagers() 
{
    
    cameraManager = new CameraManager
    (
        "Camera Manager"
    );

    objectManager = new ObjectManager
    (
        "Object Manager",
        notificationCenter,
        context,
        StatusType.Drawn | StatusType.Updated,
        cameraManager
    );

    keyboardManager = new KeyboardManager
    (
        "Keyboard Manager"
    );

    mouseManager = new MouseManager
    (
        "Mouse Manager"
    );

    soundManager = new SoundManager
    (
        "Sound Manager",
        notificationCenter,
        GameData.AUDIO_CUE_ARRAY
    );

    gameStateManager = new MyGameStateManager
    (
        "Game State Manager",
        notificationCenter,
        objectManager                            
    )

    menuManager = new MyMenuManager
    (
        "Menu Manager",
        notificationCenter,
        keyboardManager
    );

    touchScreenManager = new TouchScreenManager
    (
        "Touch Screen Manager"
    ) 

    uiManager = new MyUIManager
    (
        "UI Manager",
        notificationCenter,
        objectManager,
        mouseManager,
        touchScreenManager
    )

    orientationManager = new OrientationManager
    (
        "Orientation Manager"
    ) 
    
}


function registerForNotifications() 
{
    notificationCenter.register
    (
        NotificationType.Reset, 
        this, 
        handleResetGameNotification
    );
}


function handleResetGameNotification(notification) 
{

    switch (notification.notificationAction) 
    {

        case NotificationAction.ResetGame:
            resetGame(); 

        case NotificationAction.StartTimer:
            startIntervalTimer();
            break;

        case NotificationAction.PauseTimer:
            pauseTimer();
            break;
        
    }
  
}
  

function initializeDebugDrawer() 
{

    debugDrawer = new DebugDrawer
    (
        "Debug Drawer",
        context,
        objectManager,
        cameraManager
    );
}


function initializeCameras() 
{

    let transform = new Transform2D
    (
        Vector2.Zero,
        0,
        Vector2.One,
        new Vector2
        (
            canvas.clientWidth / 2,
            canvas.clientHeight / 2
        ),
        new Vector2
        (
            canvas.clientWidth,
            canvas.clientHeight
        )
    );

    let camera = new Camera2D
    (
        "Camera 1",
        transform,
        ActorType.Camera,
        StatusType.Updated
    );

    cameraManager.add(camera);
}


function initializeSprites() 
{

    initializeBackground();
    initializePlatforms();
    initializePlayer();
    initializeHUD();
    initializeOnScreenOrder();
    drawTimer();
    drawOrderDecorator();
}


function initializePlatforms() 
{

    let artist;
    let transform;

    let spriteArchetype;
    let spriteClone = null;

    artist = new SpriteArtist
    (
        context,
        1,
        GameData.PLATFORM_DATA.spriteSheet,
        GameData.PLATFORM_DATA.sourcePosition,
        GameData.PLATFORM_DATA.sourceDimensions
    );

    transform = new Transform2D
    (
        Vector2.Zero,
        GameData.PLATFORM_DATA.rotation,
        GameData.PLATFORM_DATA.scale,
        GameData.PLATFORM_DATA.origin,
        GameData.PLATFORM_DATA.sourceDimensions,
        GameData.PLATFORM_DATA.explodeBoundingBoxInPixels
    );

    spriteArchetype = new Sprite
    (
        GameData.PLATFORM_DATA.id,
        transform,
        GameData.PLATFORM_DATA.actorType,
        GameData.PLATFORM_DATA.collisionType,
        StatusType.Updated | StatusType.Drawn,
        artist,
        GameData.PLATFORM_DATA.scrollSpeedMultiplier,
        GameData.PLATFORM_DATA.layerDepth
    );

    for (let i = 0; i < GameData.PLATFORM_DATA.translationArray.length; i++) 
    {

        // Clone sprite
        spriteClone = spriteArchetype.clone();

        // Update id
        spriteClone.id = spriteClone.id + " " + i;

        // Update translation
        spriteClone.transform.setTranslation(GameData.PLATFORM_DATA.translationArray[i]);

        // Add to object manager
        objectManager.add(spriteClone);
    }
}


function startIntervalTimer() 
{
    
    // Store a handle to the timer 
    intervalTimer = setInterval(intervalFunction, intervalTime);
}


// Create a function that will be called when our interval timer expires
function intervalFunction() 
{
    totalSeconds--;
    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;

    //If the timer ends 
    if(totalSeconds === 0)
    {
        //Ifthe current wage is greter then the topWage, then change the topWage to the current wage
        if(wage > localStorage.topWage)
        {
            localStorage.topWage = wage;
        }
        localStorage.playersWage = wage;

        stopIntervalTimer(); 
    }
}


function stopIntervalTimer() 
{
    // Stop the interval timer
    clearInterval(intervalTimer);

    //Send a notification to show the game over screen
    notificationCenter.notify
    (
        new Notification
        (
            NotificationType.Menu,
            NotificationAction.ShowGameOverMenuChanged,
            [StatusType.Off]
        )
    );
    
}

//Stops and resets the timer
function pauseTimer()
{
    clearInterval(intervalTimer);
}

let sprite;
function initializePlayer() 
{

    let transform;
    let artist;
    

    artist = new AnimatedSpriteArtist(
        context,                                                // Context
        1,                                                      // Alpha
        GameData.WAITER_ANIMATION_DATA                          // Animation Data
    );

    // Set animation
    artist.setTake("Idle Right");

    transform = new Transform2D(
        GameData.WAITER_START_POSITION,                         // Translation
        0,                                                      // Rotation
        Vector2.One,                                              // Scale
        Vector2.Zero,                                           // Origin
        artist.getBoundingBoxByTakeName("Idle Right"),                // Dimensions
        0                                                       // Explode By
    );

    sprite = new MoveableSprite(
        "Player",                                               // ID
        transform,                                              // Transform
        ActorType.Player,                                       // ActorType
        CollisionType.Collidable,                               // CollisionType
        StatusType.Updated | StatusType.Drawn,                  // StatusType
        artist,                                                 // Artist
        1,                                                      // ScrollSpeedMultipler
        1                                                       // LayerDepth
    );

    sprite.body.maximumSpeed = 6;
    sprite.body.friction = FrictionType.Low;
    sprite.body.gravity = GravityType.Weak;


    sprite.attachController(
        new PlayerMoveController(
            notificationCenter,
            keyboardManager,
            orientationManager,
            touchScreenManager,
            objectManager,
            GameData.WAITER_MOVE_KEYS,
            GameData.WAITER_WALK_VELOCITY,
            GameData.WAITER_JUMP_VELOCITY
        )
    );

    // Add sprite to object manager
    objectManager.add(sprite);
}


function initializeBackground() 
{

    let transform;
    let artist;
    let backgroundSprite;

    transform = new Transform2D
    (
        new Vector2
        (                   
            250,
            0
        ),                                                       // Translation
        0,                                                      // Rotation
        Vector2.One,                                            // Scale
        Vector2.Zero,                                           // Origin
        new Vector2
        (                   
            canvas.clientWidth + 259 ,
            canvas.clientHeight * 2
        ),
    );

    artist = new SpriteArtist
    (
        context,                                                // 2D Context                   (Context)
    1,                                                          // Alpha                        (Number)
        GameData.BACKGROUND,                                    // Sprite sheet                 (Image)
        Vector2.Zero,                                           // Selection start point        (Vector2)
        new Vector2
        (                                                       
            canvas.clientWidth,
            canvas.clientHeight                                 
        )                                                       
    );

    backgroundSprite = new Sprite
    (
        "Background",                                           // ID
        transform,                                              // Transform
        ActorType.Background,                                   // ActorType    
        null,                                                   // CollisionType
        StatusType.Drawn,                                       // StatusType   (Off, Drawn, Updated)
        artist,                                                 // Artist (Set up above)
        1,
        1
    );

    // Add to the object manager
    objectManager.add(backgroundSprite);
}


function initializeHUD() 
{

    let transform;
    let artist;
    let sprite;

    transform = new Transform2D(
        new Vector2(
            canvas.clientWidth - 80,
            10
        ),
        0,
        new Vector2(5, 5),
        Vector2.Zero,
        new Vector2(10, 10),
        0
    );

    artist = new SpriteArtist(
        context,                                        // Context
        1,                                              // Alpha
        GameData.UI,                                    // Spritesheet
        Vector2.Zero,                                   // Source Position
        new Vector2(32, 32),                            // Source Dimension
        true                                            // Fixed Position
    );

    sprite = new Sprite
    (
        "Pause Button",
        transform,
        ActorType.HUD,
        CollisionType.NotCollidable,
        StatusType.Updated | StatusType.Drawn,
        artist,
        1,
        1
    );

    // Add sprite to the object manager
    objectManager.add(sprite);
}


function initializeOnScreenOrder() 
{
    initializeOrder();
    initializeImagesOrderDecoration("Pizza", 160);
    initializeImagesOrderDecoration("Drink", 400);
    initializeOrderTypeText("Pizza", 120);
    initializeOrderTypeText("Beer", 360);

}


function initializeOrder() 
{

    let transform;
    let artist;
    let sprite;

    transform = new Transform2D
    (
        new Vector2
        (
            125, 
            10
        ),
        0,
        Vector2.One,
        Vector2.Zero,
        Vector2.Zero,
        0
    );

    artist = new TextSpriteArtist
    (
        context,                        // Context
        1,                              // Alpha
        "Order",                        // Text
        FontType.InformationLarge,      // Font Type
        Color.Black,                    // Color
        TextAlignType.Center,           // Text Align
        250,                            // Max Width
        true                            // Fixed Position
    );

    sprite = new Sprite
    (
        "Order",
        transform,
        ActorType.OrderMenu,
        CollisionType.NotCollidable,
        StatusType.Updated | StatusType.Drawn,
        artist,
        1,
        1
    );

    // Add sprite to object manager
    objectManager.add(sprite);
}


function initializeImagesOrderDecoration(takeName, y)
{
    
    let artist;
    let transform;
    let sprite;

    artist = new AnimatedSpriteArtist
    (
        context,                                        // Context
        1,

        GameData.COMSUMABLES_ANIMATION_DATA            // Animation data
    );

    transform = new Transform2D
    (
        new Vector2
        (
            80, y
        ),                                              // Translation
        0,                                              // Rotation
        new Vector2(0.3, 0.3),                          // Scale
        Vector2.Zero,                                   // Origin
        artist.getBoundingBoxByTakeName(takeName),      // Dimensions
        0
    );

    sprite = new Sprite
    (
        "Consumable Decoration",
        transform,
        ActorType.Decorator,
        CollisionType.NotCollidable,
        StatusType.Updated | StatusType.Drawn,
        artist,
        1,          // Scroll speed multiplier
        1           // Layer depth
    );

    // Set sprite take
    sprite.artist.setTake(takeName);

    // Add to object manager
    objectManager.add(sprite);
}


function initializeOrderTypeText(text, y)
{
    let transform;
    let artist;
    let sprite;

    transform = new Transform2D
    (
        new Vector2
        (
            125, 
            y
        ),
        0,
        Vector2.One,
        Vector2.Zero,
        Vector2.Zero,
        0
    );

    artist = new TextSpriteArtist
    (
        context,                        // Context
        1,                              // Alpha
        text,                           // Text
        FontType.InformationOrder,      // Font Type
        Color.Orange,                   // Color
        TextAlignType.Center,           // Text Align
        250,                            // Max Width
        false                           // Fixed Position
    );

    sprite = new Sprite
    (
        "Order Type",
        transform,
        ActorType.OrderMenu,
        CollisionType.NotCollidable,
        StatusType.Updated | StatusType.Drawn,
        artist,
        1,
        1
    );

    // Add sprite to object manager
    objectManager.add(sprite);
} 


function drawTimer()
{
    let transform;
    let artist;
    let sprite;

    transform = new Transform2D
    (
        new Vector2
        (                   
            300,
            0
        ),                   
        0,                             
        new Vector2
        (
            0.5,
            0.5
        ),                    
        Vector2.Zero,                   
        new Vector2
        (                   
            canvas.clientWidth,
            canvas.clientHeight
        ),
    );

    artist = new SpriteArtist
    (
        context,                                                // 2D Context                   (Context)
        1,                                                      // Alpha                        (Number)
        GameData.CLOCK,                                         // Sprite sheet                 (Image)
        Vector2.Zero,                                           // Selection start point        (Vector2)
        new Vector2
        (                                            
        canvas.clientWidth,
        canvas.clientHeight                               
        )                                                      
    );

    sprite = new Sprite
    (
        "Clock",                                                // ID
        transform,                                              // Transform
        ActorType.HUD,                                          // ActorType    
        null,                                                   // CollisionType
        StatusType.Drawn,                                       // StatusType   (Off, Drawn, Updated)
        artist,                                                 // Artist (Set up above)
        1,
        1
    );

    // Add to the object manager
    objectManager.add(sprite);
}


function drawOrderDecorator()
{
    let transform;
    let artist;
    let sprite;

    transform = new Transform2D
    (
        new Vector2
        (                   
            0,
            80
        ),                   
        0,                              
        new Vector2
        (
            0.43,
            1
        ),                   
        Vector2.Zero,                   
        new Vector2
        (                   
            canvas.clientWidth,
            canvas.clientHeight
        ),
    );

    artist = new SpriteArtist
    (
        context,                                                // 2D Context                   (Context)
        1,                                                      // Alpha                        (Number)
        GameData.ORDER_DECORATOR,                               // Sprite sheet                 (Image)
        Vector2.Zero,                                           // Selection start point        (Vector2)
        new Vector2
        (                                            
        canvas.clientWidth,
        canvas.clientHeight                               
        )                                                    
    );

    sprite = new Sprite
    (
        "Order Decorator",                                       // ID
        transform,                                               // Transform
        ActorType.Decorator,                                     // ActorType    
        null,                                                    // CollisionType
        StatusType.Drawn,                                        // StatusType   (Off, Drawn, Updated)
        artist,                                                  // Artist (Set up above)
        1,
        1
    );

    // Add to the object manager
    objectManager.add(sprite);
}


function resetGame() 
{
    clearCanvas();
    handleResetGame();
}


function handleResetGame()
{   
    level = 0;
    endLevel = true; 
    consumablesVelocity = 0.05;
    message = "";
    wage = 100

    //https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
    //Reloads the web page
    window.location.reload();

    //Sends a notification to show the main menu
    notificationCenter.notify(
        new Notification(
            NotificationType.Menu,
            NotificationAction.ShowMenuChanged,
            [StatusType.Off]
        )
    );
    
}


// Start the game once the page has loaded
window.addEventListener("load", start);

