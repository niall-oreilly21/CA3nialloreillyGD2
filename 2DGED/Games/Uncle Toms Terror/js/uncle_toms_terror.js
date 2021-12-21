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
let mouseManager;
let soundManager;
let gameStateManager;
let menuManager;
let uiManager;

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
}

function clearCanvas() 
{

    context.save();
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.restore();
}

/** GAME SPECIFIC CODE BELOW - CHANGE AS NECESSARY */

function initialize() 
{

    initializeNotificationCenter();
    initializeManagers();
    initializeCameras();
    initializeSprites();

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
        100,                            // Initial player health
        36                              // Initial player ammo
    )

    menuManager = new MyMenuManager
    (
        "Menu Manager",
        notificationCenter,
        keyboardManager
    );

    uiManager = new MyUIManager
    (
        "UI Manager",
        notificationCenter,
        objectManager,
        mouseManager
    )
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
    initializeDrinksPickups();
    initializePlayer();
    initializePuddle();
    initializeHUD();
    initializeOnScreenText();
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


function initializeDrinksPickups() 
{

    let artist;
    let transform;

    let spriteArchetype = null;
    let spriteClone = null;

    artist = new AnimatedSpriteArtist
    (
        context,                                        // Context
        1,

        GameData.COLLECTIBLES_ANIMATION_DATA            // Animation data
    );

    transform = new Transform2D
    (
        new Vector2(200, 150),                          // Translation
        0,                                              // Rotation
        new Vector2(0.2, 0.2),                                    // Scale
        Vector2.Zero,                                   // Origin
        artist.getBoundingBoxByTakeName("Drink"),  // Dimensions
        0
    );

    spriteArchetype = new Sprite
    (
        "Drink",
        transform,
        ActorType.Pickup,
        CollisionType.Collidable,
        StatusType.Updated | StatusType.Drawn,
        artist,
        1,          // Scroll speed multiplier
        1           // Layer depth
    );

    // Create 5 pickup sprites
    for (let i = 1; i <= 5; i++) 
    {

        // Clone sprite
        spriteClone = spriteArchetype.clone();

        // Update ID
        spriteClone.id = spriteClone.id + " " + i;

        // Translate sprite
        spriteClone.transform.translateBy(
            new Vector2(
                (i * 100),
                0
            )
        );

        // Set sprite take
        spriteClone.artist.setTake("Drink");

        // Add to object manager
        objectManager.add(spriteClone);
    }
}


function initializePlayer() 
{

    let transform;
    let artist;
    let sprite;

    artist = new AnimatedSpriteArtist(
        context,                                                // Context
        1,                                                      // Alpha
        GameData.WAITER_ANIMATION_DATA                          // Animation Data
    );

    // Set animation
    artist.setTake("Idle");

    transform = new Transform2D(
        GameData.WAITER_START_POSITION,                         // Translation
        0,                                                      // Rotation
        Vector2.One,                                              // Scale
        Vector2.Zero,                                           // Origin
        artist.getBoundingBoxByTakeName("Idle"),                // Dimensions
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
            objectManager,
            GameData.RUNNER_MOVE_KEYS,
            GameData.WAITER_WALK_VELOCITY,
            GameData.WAITER_JUMP_VELOCITY
        )
    );

    // Add sprite to object manager
    objectManager.add(sprite);
}


function initializePuddle() 
{

    let transform;
    let artist;
    let sprite;

    artist = new AnimatedSpriteArtist
    (
        context,
        1,
        GameData.PUDDLE_ANIMATION
    );

    artist.setTake("Puddle");

    transform = new Transform2D
    (
        new Vector2(400, 310),
        0,
        new Vector2(0.25, 0.25),
        Vector2.Zero,
        artist.getBoundingBoxByTakeName("Puddle"),
        0
    );

    sprite = new MoveableSprite(
        "Puddle",
        transform,
        ActorType.Enemy,
        CollisionType.Collidable,
        StatusType.Updated | StatusType.Drawn,
        artist,
        1,
        1
    );

    // Set performance characteristics of the physics body that is
    // attached to the moveable sprite
    sprite.body.maximumSpeed = 6;
    sprite.body.friction = FrictionType.Normal;
    sprite.body.gravity = GravityType.Normal;


    // Add enemy to object manager
    objectManager.add(sprite);
}


function initializeBackground() 
{

    let transform;
    let artist;
    let backgroundSprite;


    transform = new Transform2D
    (
        Vector2.Zero,                   // Translation
        0,                              // Rotation
        Vector2.One,                    // Scale
        Vector2.Zero,                   // Origin
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
        GameData.BACKGROUND,                                  // Sprite sheet                 (Image)
        Vector2.Zero,                                           // Selection start point        (Vector2)
        new Vector2
        (                                            // Selection area (             (Vector2)
        canvas.clientWidth,
        canvas.clientHeight                                // selection height
        )                                                       // )
    );

    backgroundSprite = new Sprite
    (
        "Background",                                           // ID
        transform,                                              // Transform
        ActorType.Background,                                   // ActorType    (Background, NPC, Player, Projectile)
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
            canvas.clientWidth - 40,
            10
        ),
        0,
        new Vector2(3, 3),
        Vector2.Zero,
        new Vector2(10, 10),
        0
    );

    artist = new SpriteArtist(
        context,                                        // Context
        1,                                              // Alpha
        GameData.UI,                                  // Spritesheet
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


function initializeOnScreenText() 
{

    let transform;
    let artist;
    let sprite;

    transform = new Transform2D
    (
        new Vector2
        (
            (canvas.clientWidth / 2 - 40), 
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
        "The Customers are Thirsty!",                  // Text
        FontType.InformationMedium,     // Font Type
        Color.White,                    // Color
        TextAlignType.Left,             // Text Align
        200,                            // Max Width
        false                            // Fixed Position
    );

    sprite = new Sprite
    (
        "Text UI Info",
        transform,
        ActorType.HUD,
        CollisionType.NotCollidable,
        StatusType.Updated | StatusType.Drawn,
        artist,
        1,
        1
    );

    // Add sprite to object manager
    objectManager.add(sprite);
}

function resetGame() {

    clearCanvas();
    startGame();
}

// Start the game once the page has loaded
window.addEventListener("load", start);