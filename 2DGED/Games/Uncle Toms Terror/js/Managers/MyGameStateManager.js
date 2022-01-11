/**
 * Stores, updates the wage in the game. 
 * Keeps tabs of the current order in the game and creates a table at the end of the order.
 * Generates the side characters in the game when a player falls.
 * Resets the level of the game and creates the next order.
 * Ends the game if the playes wage falls below 0.
 * @author Niall O' Reilly
 * @version 1.0
 * @class MyGameStateManager
 */
class MyGameStateManager extends GameStateManager 
{
    
    constructor(id, notificationCenter, objectManager) 
    {
        
        super(id);
        this.notificationCenter = notificationCenter;
        this.objectManager = objectManager;

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
        
        this.registerForNotifications();
    
    }

    registerForNotifications() 
    {
        this.notificationCenter.register
        (
            NotificationType.GameState, 
            this, 
            this.handleGameStateNotification
        );
    }


    handleGameStateNotification(notification) 
    {

        switch (notification.notificationAction) 
        {

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

            default:
                break;
        }
    }


    handleWage(value) 
    {
        wage = wage + value;
        waiterPizza = 0;
        waiterBeer = 0;

        //If the wage hits 0 or below then end the game
        if(wage <= 0)
        {
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
     
    }


    handleSideCharacter()
    {
        const SideCharacterDetails = this.objectManager.get(ActorType.SideCharacter);

        // If SideCharacterDetails is null or length is 0 then generate a new side charcter
        if (SideCharacterDetails == null || SideCharacterDetails.length === 0)
        {
            this.randomSideCharacter.generateRandomCharacterSprite();
        } 

       
    }

    update() 
    {    
        this.handleOrderComplete();
        this.isRemoveTable();
        
        //For the first order a new order has to be created
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
    }


    handleOrderComplete()
    {
        //If all the order details = 0 then exit the function
        if((orderBeer === 0) && (waiterBeer === 0) && (orderPizza === 0) && (waiterPizza === 0)) return;
        
        //If the order details match
        if((orderBeer === waiterBeer) && (orderPizza === waiterPizza))
        {
            //If the table is not visible the create it
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

    //Resets the level
    handleEndLevel()
    {
        level++;
        waiterBeer = 0;
        waiterPizza = 0;
        orderBeer = 0;
        orderPizza = 0;

        //Increase the consumable velecity
        consumablesVelocity = consumablesVelocity + 0.02;

        //Initialize the level tagline
        if(this.removeLevelMessage() || level === 1)
        {
            this.initializeLevelMessage();
        }
        
        //Initialize the level consumables
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
        //Genrates a random order for each round
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

        //If removeTables is null then exit the function
        if (removeTables == null) return;

        //If waiterBeer is 0 and waiterPizza is 0 then remove the table
        if((waiterBeer === 0) && (waiterPizza === 0))
        {
            // Loop through the list of Interactable sprites
            for (let i = 0; i < removeTables.length; i++) 
            {
             const removeTable = removeTables[i];

                this.notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.Sprite,   
                        NotificationAction.RemoveFirst,  
                        [removeTable]                   
                    )
                );
            }

        }
    }
    
    
    isTableVisible()
    {
        const tables = this.objectManager.get(ActorType.Interactable);
        
        //If tables is null the return false
        if (tables == null) return false;

        //If the tables lenght is 0 then return false
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
            context,                                          // Context
            1,
            GameData.TABLE_ANIMATION_DATA                     // Animation data
        );
    
        transform = new Transform2D
        (
            new Vector2
            (
                this.setTablesPositonX(),
                574
            ),                                              // Translation
            0,                                              // Rotation
            new Vector2(1.5, 2),                            // Scale
            Vector2.Zero,                                   // Origin
            artist.getBoundingBoxByTakeName("Table"),       // Dimensions
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
            1,          
            1          
        );
    
            // Set sprite take
            artist.setTake("Table");

            // Add to object manager
            this.objectManager.add(sprite);    
             
        }


        //Set the table positon to the furthest side away from the player
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
        
        //If LevelMessages is null then retrun false
        if (LevelMessages == null) return false;
    
            // Loop through the list of pickup sprites
            for (let i = 0; i < LevelMessages.length; i++) 
            {
                const LevelMessage = LevelMessages[i];

                this.notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.Sprite,    
                        NotificationAction.RemoveFirst,  
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
            this.getMessage(),              // Text
            FontType.InformationOrder,      // Font Type
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
        this.objectManager.add(sprite);
    } 

    //Selects the tagline day for the level
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
