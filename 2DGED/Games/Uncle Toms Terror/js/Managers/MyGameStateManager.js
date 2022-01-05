/**
 * Stores, updates, and changes game state in my specific game e.g. Snailbait.
 * @author
 * @version 1.0
 * @class MyGameStateManager
 */
class MyGameStateManager extends GameStateManager {
    
    get playerHealth() {
        return this._playerHealth;
    }

    set playerHealth(value) {
        this._playerHealth = value;
    }


    constructor(id, notificationCenter, objectManager, initialPlayerHealth) {
        
        super(id);

        this.notificationCenter = notificationCenter;
        this.objectManager = objectManager;
        this.playerHealth = initialPlayerHealth;
        //level = 0;
        
        this.registerForNotifications();
        this.consumables = new Consumables();
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

            case NotificationAction.Health:
                this.handleHealthStateChange(notification.notificationArguments);
                break;

            case NotificationAction.Inventory:
                this.handleInventoryStateChange(notification.notificationArguments);
                break;

            case NotificationAction.Ammo:
                this.handleAmmoStateChange(notification.notificationArguments);
                break;

            case NotificationAction.Level:
                this.handlelevelStateChange(notification.notificationArguments);
                break;

            // Add more cases here...

            default:
                break;
        }
    }

    handleHealthStateChange(value) 
    {
        this.playerHealth = this.playerHealth  + value;
        waiterPizza = 0;
        waiterBeer = 0;
        // Add your own code here...
        // Maybe update a health variable?
        // Maybe update a UI element?
    }

    handleInventoryStateChange(argArray) {
        console.log(argArray);

        // Add your code here...
        // Maybe update an inventory array?
        // Maybe update a UI element
    }

    handleLevelStateChange(value) 
    {
        level + value;

        // Add your code here...
        // Maybe update an ammo variable?
        // Maybe update a UI element?
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
                this.createTable();
            }
        }
                
    }

    handleEndLevel()
    {
        // this.notificationCenter.notify
        // (
        //     new Notification
        //     (
        //         NotificationType.GameState,            
        //         NotificationAction.handleLevelStateChange, 
        //         [1]                
        //     )
        // );
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
            this.consumables.initializeConsumables();
        }
        if((level >=  3) && (level <= 5))
        {
            this.consumables.initializeDrinksPickups();
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
        
            sprite = new MoveableSprite
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
        
            sprite.body.maximumSpeed = 0;
            sprite.body.friction = FrictionType.Normal;
            sprite.body.gravity = GravityType.Normal;
        
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
   
    console.log(LevelMessages)
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
