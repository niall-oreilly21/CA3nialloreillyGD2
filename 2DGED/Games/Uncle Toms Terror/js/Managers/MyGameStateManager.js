/**
 * Stores, updates, and changes game state in my specific game e.g. Snailbait.
 * @author
 * @version 1.0
 * @class MyGameStateManager
 */
class MyGameStateManager extends GameStateManager {
    
    constructor(id, notificationCenter, objectManager) {
        
        super(id);

        this.notificationCenter = notificationCenter;
        this.objectManager = objectManager;
        this.intervalTime = 180000;
        this.intervalTimer = 0;
        this.consumables = new Consumables
        (
            notificationCenter,
            keyboardManager,
            objectManager
        );

        this.randomSideCharacter = new RandomGeneratorSideCharacters
        (
            notificationCenter,
            objectManager
        )
       
        // this.minutes = Math.floor((this.intervalTime );
        // this.seconds = Math.floor((this.intervalTime % (1000 * 60)) / 1000);
        
        this.registerForNotifications();
        
    
    }

    registerForNotifications() {
        this.notificationCenter.register(
            NotificationType.GameState, 
            this, 
            this.handleGameStateNotification
        );
    }

    handleGameStateNotification(notification) {

        switch (notification.notificationAction) {

            case NotificationAction.Wage:
                this.handleWageStateChange(notification.notificationArguments[0]);
                break;

            case NotificationAction.Timer:
                this.handleTimer();
                break;

            // case NotificationAction.ResetGame:
            //     this.handleResetGame();
            //     break;

            case NotificationAction.Level:
                this.handlelevelStateChange(notification.notificationArguments);
                break;

            case NotificationAction.RandomGenerateSideCharacters:
                this.handleSideCharacter();
                break;

            case NotificationAction.CreateTable:
                this.createTable();

            // Add more cases here...

            default:
                break;
        }
    }

    handleWageStateChange(value) 
    {
        wage = wage - value;
        waiterPizza = 0;
        waiterBeer = 0;
        // Add your own code here...
        // Maybe update a health variable?
        // Maybe update a UI element?

        if(wage === 0)
        {
            notificationCenter.notify(
                new Notification(
                    NotificationType.Reset,
                    NotificationAction.ResetGame,
                    null
                )
            );

        }
     
    }

    handleTimer() 
    {
    //     setTimeout(this.myFunction(), 3000);

    //     var endDate = new Date('Aug 20, 2021 00:00:00').getTime();

    //     var now = new Date().getTime();

    //     let remainingTime = now - endDate

    //     const second = 18000;

    //     const minute = second * 60;

        
    //     minutesLeft = Math.trunc((remainingTime % hour) / minute);
        
    //     secondsLeft = Math.trunc((remainingTime % minute) / second);

    //     console.log(minute,second)
    // }

    // myFunction()
    // {
    //     console.log("HEre")
     }

    handleLevelStateChange(value) 
    {
        level + value;

        // Add your code here...
        // Maybe update an ammo variable?
        // Maybe update a UI element?
    }

    handleSideCharacter()
    {
        const SideCharacterDetails = this.objectManager.get(ActorType.SideCharacter);

        // If enemies is null, exit the function
        if (SideCharacterDetails == null || SideCharacterDetails.length === 0)
        {
            this.randomSideCharacter.generateRandomCharacterSprite();
        } 

       
    }

  

    update(gameTime) 
    {
        
            this.handleOrderComplete();
            
            this.isRemoveTable();
            if(this.playerHealth === 0)
            {
                console.log("hello")
                this.playerHealth = 0;
            }
            
        if(endLevel)
        {           
            this.handleEndLevel();
        }
        
        //this.startIntervalTimer();
        // Add your code here...
        
        // For example, every update(), we could check the player's health. If
        // the player's health is <= 0, then we can create a notification...
        // Play a sound?
        // Pause the game?
        // Play the 'player death' animation?
        // Remove the player sprite from the game?
        // Show the win/lose screen?

        // How could we have these events fire one after each other, rather
        // than all at the same time? Hint: use timers.
    }


    handleOrderComplete()
    {
        if((orderBeer === 0) && (waiterBeer === 0) && (orderPizza === 0) && (waiterPizza === 0)) return;
        
        if((orderBeer === waiterBeer) && (orderPizza === waiterPizza))
        {
            if(!this.isTableVisible())
            {
                if(!endLevel)
                {
                    notificationCenter.notify
                    (
                        new Notification
                        (
                            NotificationType.GameState,
                            NotificationAction.CreateTable,
                            null
                        )
                    );
                }
                
            }
        }
                
    }

    handleEndLevel()
    {

        level++;
        waiterBeer = 0;
        waiterPizza = 0;
        orderBeer = 0;
        orderPizza = 0;
        consumablesVelocity = consumablesVelocity + 0.02;
        endLevel = false;

     

        if(this.removeLevelMessage() || level === 1)
        {
            this.initializeLevelMessage();
        }
        

        if(level === 1)
        {
            this.consumables.initializeConsumablesStart();
        }
        if((level >=  3) && (level <= 5))
        {
            this.consumables.initializeConsumables();
        }
        
        this.getRandomOrder();
    }
    
    getRandomOrder()
    {    
        for(let i = 0; i < level; i++)
        {
            if(Math.floor(Math.random() * 2))
            {
                orderBeer++;     
            }
            else
            {
                orderPizza++;     
            }
        }
    }

    isRemoveTable()
    {
        const removeTables = this.objectManager.get(ActorType.Interactable);

        if (removeTables == null) return;

        if((waiterBeer === 0) && (waiterPizza === 0))
        {
            // Loop through the list of pickup sprites
            for (let i = 0; i < removeTables.length; i++) 
            {
             const removeTable = removeTables[i];

                this.notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.Sprite,    // Type
                        NotificationAction.RemoveFirst,  // Action
                        [removeTable]                   
                    )
                );
            }

        }
    }
    
    
    isTableVisible()
    {
        const tables = this.objectManager.get(ActorType.Interactable);
        
        if (tables == null) return false;

        if (tables.length === 0) 
        { 
            return false;
        }
        else 
        {    
            return true;
        }
    }

    createTable()
    {
        let transform;
        let artist;
        let sprite;
    
        artist = new AnimatedSpriteArtist
        (
            context,                                        // Context
            1,
            GameData.TABLE_ANIMATION_DATA            // Animation data
        );
    
        transform = new Transform2D
        (
            new Vector2
            (
                this.setTablesPositonX(),
                574
            ),                                              // Translation
            0,                                              // Rotation
            new Vector2(1.5, 2),                                    // Scale
            Vector2.Zero,                                   // Origin
            artist.getBoundingBoxByTakeName("Table"),  // Dimensions
            0
        );
    
        sprite = new Sprite
        (
            "Table",
            transform,
            ActorType.Interactable,
            CollisionType.Collidable,
            StatusType.Updated | StatusType.Drawn,
            artist,
            1,          // Scroll speed multiplier
            1           // Layer depth
        );
    
            // Set sprite take
            artist.setTake("Table");

            // Add to object manager
            objectManager.add(sprite);    


               
        }


        setTablesPositonX()
        {
            if(playerCurrentPositionX + GameData.WAITER_WIDTH < canvas.clientWidth / 2)
            {
                return canvas.clientWidth - 108;
            }
            else if(playerCurrentPositionX  >= canvas.clientWidth / 2)
            {
                return 250;
            }
            
        }
    
removeLevelMessage()
{
    const LevelMessages = this.objectManager.get(ActorType.LevelMessage);
    
    if (LevelMessages == null) return false;
   
        // Loop through the list of pickup sprites
        for (let i = 0; i < LevelMessages.length; i++) 
        {
            const LevelMessage = LevelMessages[i];

            this.notificationCenter.notify
            (
                new Notification
                (
                    NotificationType.Sprite,    // Type
                    NotificationAction.RemoveFirst,  // Action
                    [LevelMessage]                   
                )
            );
        }

        return true;
}

        

initializeLevelMessage()
{
    let transform;
    let artist;
    let sprite;

    transform = new Transform2D
    (
        new Vector2
        (
            canvas.clientWidth / 2, 
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
        this.getMessage(),                  // Text
        FontType.InformationOrder,     // Font Type
        Color.White,                    // Color
        TextAlignType.Left,             // Text Align
        250,                            // Max Width
        true                            // Fixed Position
    );

    sprite = new Sprite
    (
        "Waiter Beer",
        transform,
        ActorType.LevelMessage,
        CollisionType.NotCollidable,
        StatusType.Updated | StatusType.Drawn,
        artist,
        1,
        1
    );

    // Add sprite to object manager
    objectManager.add(sprite);
} 


getMessage()
{


        switch (level) 
        {

            case 1:
                message = LevelName.LevelOne;
                break;

            case 2:
                message = LevelName.LevelTwo;
                break;

            case 3:
                message = LevelName.LevelThree;
                break;

            case 4:
                message = LevelName.LevelFour;
                break;
 
            case 5:
                message = LevelName.LevelFive;
                break;
                
            case 6:
                message = LevelName.LevelSix;
                break;
                
            case 7:
                message = LevelName.LevelSeven;
                break;
                
            case 8:
                message = LevelName.LevelEight;
                break;
                
            case 9:
                message = LevelName.LevelNine;
                break;
            
            case 10:
                message = LevelName.LevelTen;
            break;

            case 11:
                message = LevelName.LevelEleven;
            break;
        }

        if(level > 11)
        {
            message = LevelName.LevelEleven;
        }

        return message;

}

    // Create a function that will start our interval timer when called
    startIntervalTimer() 
    {
        // Start a timer
        // Store a handle to the timer that we create
        this.intervalTimer = setInterval(this.intervalFunction(), this.intervalTime);
        console.log("Interval timer has started!");
    }

    // Create a function that will be called when our interval timer expires
    intervalFunction() 
    {
        console.log("Interval timer has elapsed!");
        this.stopIntervalTimer() ;
    }

    // Create a function that will stop our interval timer when called
    stopIntervalTimer() 
    {

        // Stop the interval timer
        clearInterval(this.intervalTimer);
        console.log("Interval timer has been stoppped!");
    }


    
}
