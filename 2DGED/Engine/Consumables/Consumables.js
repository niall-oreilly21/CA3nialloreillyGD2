/**
 * 
 * 
 * @author Niall O' Reilly
 * @version 1.0
 * @class Consumables
 */
 

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

    getRandomNextConsumableTake(sprite)
    {

        if(Math.floor(Math.random() * 2))
        {
           sprite.artist.setTake("Pizza");
        }
        else
        {
            sprite.artist.setTake("Drink"); 
        }
    }

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
                Math.floor(Math.random() * (canvas.clientWidth)) + 250,
                Math.floor(-Math.random() * 400)
            ),                                              // Translation
            0,                                              // Rotation
            new Vector2(0.2, 0.2),                          // Scale
            Vector2.Zero,                                   // Origin
            artist.getBoundingBoxByTakeName("Pizza"),  // Dimensions
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
            1,          // Scroll speed multiplier
            1           // Layer depth
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
                    consumablesVelocity
                )
                
            );
    
            // Set sprite take
            this.getRandomNextConsumableTake(sprite);
    
            // Add to object manager
            this.objectManager.add(sprite);
    }

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
                    Math.floor(Math.random() * (canvas.clientWidth)) + 250,
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
                    consumablesVelocity
                )
                
            );

            // Set sprite take
            this.getRandomNextConsumableTake(spriteClone);

            // Add to object manager
            this.objectManager.add(spriteClone);
        }
    }

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