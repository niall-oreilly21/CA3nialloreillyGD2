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
                this.handleWage(notification.notificationArguments[0]);
                break;

            case NotificationAction.RandomGenerateSideCharacters:
                this.handleSideCharacter();
                break;

            case NotificationAction.CreateTable:
                this.createTable();
                break;

            case NotificationAction.EndLevel:
            this.handleEndLevel();
                break;
            // Add more cases here...

            default:
                break;
        }
    }

    handleWage(value) 
    {
        wage = wage + value;
        waiterPizza = 0;
        waiterBeer = 0;
        // Add your own code here...
        // Maybe update a health variable?
        // Maybe update a UI element?

        if(wage <= 0)
        {
            notificationCenter.notify(
                new Notification
                (
                    NotificationType.Menu,
                    NotificationAction.ShowGameOverMenuChanged,
                    [StatusType.Off]
                )
            );

        }
     
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
            
            if(level === 0)
            {
                notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.GameState,
                        NotificationAction.EndLevel,
                        null
                    )
                ); 
            
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

    handleEndLevel()
    {
        level++;
        waiterBeer = 0;
        waiterPizza = 0;
        orderBeer = 0;
        orderPizza = 0;
        consumablesVelocity = consumablesVelocity + 0.02;

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


    
}
