/**
 * 
 * 
 * @author Niall O' Reilly
 * @version 1.0
 * @class Artist
 */
 
class Comsumables 
{

    initializeDrinksPickups() 
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
                Math.floor(Math.random() * (canvas.clientWidth - 56)),
                Math.floor(-Math.random() * 1000)
            ),                                              // Translation
            0,                                              // Rotation
            new Vector2(0.2, 0.2),                                    // Scale
            Vector2.Zero,                                   // Origin
            artist.getBoundingBoxByTakeName("Drink"),  // Dimensions
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
                    GameData.CONSUMABLE_VELOCITY
                )
                
            );
    
            // Set sprite take
            this.getRandomNextConsumableTake(sprite);
            
    
            // Add to object manager
            objectManager.add(sprite);
        
    }

    getRandomNextConsumableTake(sprite)
    {
        let spriteNumber = Math.floor(Math.random() * 2);

        if(spriteNumber === 0)
        {
            return sprite.artist.setTake("Pizza");
        }
        else
        {
            return sprite.artist.setTake("Drink"); 
        }
    }

    initializePuddle(positionX, positionY, dimensionY, scale)
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
    
        artist.setTake("Puddle");
        transform = new Transform2D
        (
          
            new Vector2(positionX, positionY + (dimensionY - 114) * scale),
            0,
            new Vector2(0.2, 0.2),
            Vector2.Zero,
            artist.getBoundingBoxByTakeName("Puddle"),
            0
        );
    
        sprite = new MoveableSprite
        (
            "Puddle",
            transform,
            ActorType.Puddle,
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
    
}   