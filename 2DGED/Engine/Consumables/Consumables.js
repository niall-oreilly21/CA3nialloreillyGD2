/**
 * Stores and generates pizzas, beers and spilage sprites
 * This is a unique class for Uncle Tom's Terror.
 * 
 * @author Niall O' Reilly
 * @version 1.0
 * @class Consumables
 */
 
 let lastSelectedTake = "";
 let lastSelectedTakeCount = 0;

class Consumables 
{
    constructor
    (
        notificationCenter,
        keyboardManager,
        objectManager,
    ) 

    {
        this.notificationCenter = notificationCenter;
        this.keyboardManager = keyboardManager;
        this.objectManager = objectManager;   
    }


    /**
     * Gets a random consumable take for a inputted sprite.
     * 
     * @param {*} sprite 
     */
    getRandomNextConsumableTake(sprite)
    {

       if(Math.floor(Math.random() * 2))
        {
            sprite.artist.setTake("Pizza");
            
            if(lastSelectedTake === "Pizza")
            {
                lastSelectedTakeCount++;

                //If the lastSelectedTakeCount for pizza is = 4 then the take is set to drink(beer) 
                if(lastSelectedTakeCount === 4)
                {
                    sprite.artist.setTake("Drink"); 
                    lastSelectedTake = "Drink";
                    lastSelectedTakeCount = 1;
                }
           }
           else
           {
                lastSelectedTake = "Pizza";
                lastSelectedTakeCount = 1;
           }  
        }
        else
        {
            sprite.artist.setTake("Drink"); 
        
            if(lastSelectedTake === "Drink")
            {
                lastSelectedTakeCount++;
                
                //If the lastSelectedTakeCount for pizza is = 4 then the take is set to drink(beer) 
                if(lastSelectedTakeCount === 4)
                {
                    sprite.artist.setTake("Pizza"); 
                    lastSelectedTake = "Pizza";
                    lastSelectedTakeCount = 1;
                }
            }
            else
            {
                lastSelectedTake = "Drink";
                lastSelectedTakeCount = 1;
            }
        }
    }


     /**
     * initialize a random pizza or beer sprite.
     * 
     */
    initializeConsumables() 
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
                //Postion on the x axis is between 250 and the canvas width
                Math.floor(Math.random() * (canvas.clientWidth)) + 250,

                //Postion on the y axis is between 250 and the canvas width
                Math.floor(-Math.random() * 400)
            ),                                              
            0,                                              // Rotation
            new Vector2(0.2, 0.2),                          // Scale
            Vector2.Zero,                                   // Origin
            artist.getBoundingBoxByTakeName("Pizza"),       // Dimensions
            0
        );

        sprite = new MoveableSprite
        (
            "Consumable",
    
            transform,
            ActorType.Pickup,
            CollisionType.Collidable,
            StatusType.Updated | StatusType.Drawn,
            artist,
            1,          
            1           
        );
    
        sprite.body.maximumSpeed = 3;
        sprite.body.friction = FrictionType.Low;
        sprite.body.gravity = GravityType.Weak;
     
            sprite.attachController
            (
                new ConsumableMoveController
                (
                    notificationCenter,
                    keyboardManager,
                    objectManager,

                    //The consumables velocity is increased every new level
                    consumablesVelocity
                )
                
            );
    
            // Set sprite take
            this.getRandomNextConsumableTake(sprite);
    
            // Add to object manager
            this.objectManager.add(sprite);
    }


    /**
     * initialize two random consumables either pizza or beer sprite.
     * 
     */
    initializeConsumablesStart()
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
                0,
                0
            ),                                              // Translation
            0,                                              // Rotation
            new Vector2(0.2, 0.2),                                    // Scale
            Vector2.Zero,                                   // Origin
            artist.getBoundingBoxByTakeName("Drink"),  // Dimensions
            0
        );
        
        sprite = new MoveableSprite
        (
            "Consumables",
            transform,
            ActorType.Pickup,
            CollisionType.Collidable,
            StatusType.Updated | StatusType.Drawn,
            artist,
            1,          // Scroll speed multiplier
            1           // Layer depth
        );
    
        sprite.body.maximumSpeed = 3;
        sprite.body.friction = FrictionType.Low;
        sprite.body.gravity = GravityType.Weak;

        let spriteClone = null;

        // Create 5 pickup sprites
        for (let i = 0; i < 2; i++) 
        {
            
            // Clone sprite
            spriteClone = sprite.clone();

            // Update ID
            spriteClone.id = spriteClone.id + " " + i;

            // Translate sprite
            spriteClone.transform.translateBy
            (
                new Vector2
                (
                    //Postion on the x axis is between 250 and the canvas width
                    Math.floor(Math.random() * (canvas.clientWidth)) + 250,

                    //Postion on the y axis is between 250 and the canvas width
                    Math.floor(-Math.random() * 400)
                )
            );
            
            spriteClone.attachController
            (
                new ConsumableMoveController
                (
                    notificationCenter,
                    keyboardManager,
                    objectManager,

                    //The consumables velocity is increased every new level
                    consumablesVelocity
                )
                
            );

            // Set sprite take
            this.getRandomNextConsumableTake(spriteClone);

            // Add to object manager
            this.objectManager.add(spriteClone);
        }
    }


     /**
     * Generates a spillage object which is based on the postion, scale and dimension of the pizza or beer that hit the floor.
     * 
     * @param {*} positionX 
     * @param {*} positionY 
     * @param {*} dimensionY 
     * @param {*} scale 
     */
    initializeSpillage(positionX, positionY, dimensionY, scale)
    {
    
        let transform;
        let artist;
        let sprite;
    
        artist = new AnimatedSpriteArtist
        (
            context,
            1,
            GameData.COMSUMABLES_ANIMATION_DATA
        );
    
        transform = new Transform2D
        (
          
            new Vector2(positionX, positionY + (dimensionY - 114) * scale),
            0,
            new Vector2(0.2, 0.2),
            Vector2.Zero,
            artist.getBoundingBoxByTakeName("Spillage"),
            0
        );
    
        sprite = new Sprite
        (
            "Spillage",
            transform,
            ActorType.Puddle,
            CollisionType.Collidable,
            StatusType.Updated | StatusType.Drawn,
            artist,
            1,
            1
        );
    
        artist.setTake("Spillage");
        // Add enemy to object manager
        this.objectManager.add(sprite);


         /**
         * Sets a timer of 3 seconds to remove the spillage sprite after it is created.
         * 
         */
        setTimeout(() => 
        {
            this.notificationCenter.notify
            (
                new Notification
                (
                    NotificationType.Sprite,    // Type
                    NotificationAction.RemoveFirst,  // Action
                    [sprite]                    // Arguments
                    
                )
            );
        },
        3000)
            
     }

    
    
}   