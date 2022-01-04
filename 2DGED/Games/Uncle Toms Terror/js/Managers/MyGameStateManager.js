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
    get playerAmmo() {
        return this._playerAmmo;
    }
    get inventory() {
        return this._inventory;
    }

    set playerHealth(value) {
        this._playerHealth = value;
    }
    set playerAmmo(value) {
        this._playerAmmo = value;
    }
    set inventory(value) {
        this._inventory = value;
    }

    constructor(id, notificationCenter, objectManager, initialPlayerHealth, initialPlayerAmmo) {
        
        super(id);

        this.notificationCenter = notificationCenter;
        this.objectManager = objectManager;
        this.playerHealth = initialPlayerHealth;
        this.playerAmmo = initialPlayerAmmo;

        this.inventory = [];
        
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

            // Add more cases here...

            default:
                break;
        }
    }

    handleHealthStateChange(argArray) {
        console.log(argArray);

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

    handleAmmoStateChange(argArray) {
        console.log(argArray);

        // Add your code here...
        // Maybe update an ammo variable?
        // Maybe update a UI element?
    }

    update(gameTime) 
    {
            this.handleOrderComplete();
            this.isTableVisible();
           
        
            
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
            if(!isTableVisible)
            {
                this.createTable();
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
        isTableVisible = false;
        consumablesVelocity = consumablesVelocity + 0.05;
        endLevel = false;
        this.consumables.initializeDrinksPickups();
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
    
    isTableVisible()
    {
        const tables = this.objectManager.get(ActorType.Interactable);
        
        if (tables == null) return;

        if (tables.length === 0) 
        { 
            isTableVisible = false;
        }
        else
        {    
            isTableVisible = true;
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
            if(playerCurrentPositionX < canvas.clientWidth / 2)
            {
                return canvas.clientWidth - 108;
            }
            else if(playerCurrentPositionX >= canvas.clientWidth / 2)
            {
                return 0;
            }
            
        }
    
    
}