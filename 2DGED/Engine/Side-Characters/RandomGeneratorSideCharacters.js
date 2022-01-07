/**
 * 
 * 
 * @author Niall O' Reilly
 * @version 1.0
 * @class RandomGeneratorSideCharacters
 */
 
class RandomGeneratorSideCharacters 
{
    constructor
    (
        notificationCenter,
        objectManager
    ) 

    {
        this.notificationCenter = notificationCenter;
        this.objectManager = objectManager;
        this.sidecharactersArray = GameData.SIDE_CHARACTERS_NAMES;
        this.xPostion = 0;
        this.yPositon = 0;      
    }

    getRandomSprite()
    {
        let randomNumber = 1  //Math.floor(Math.random() * 4) + 1;

                this.initilizeGameSideCharacter(265, Math.round(Math.random() * 350) + 100,"The Legend");

                console.log(this.sidecharactersArray[0]);
    }


    initilizeGameSideCharacter(x, y, takeName)
    {
        let transform;
        let artist;
        let sprite;

        artist = new AnimatedSpriteArtist
        (
            context,                                                // Context
            1,                                                      // Alpha
            GameData.SIDE_CHARACTERS_ANIMATION                          // Animation Data
        );

        // Set animation
        artist.setTake(takeName);

        transform = new Transform2D
        (
            new Vector2(x,y),                                        // Translation
            GameData.SIDE_CHARACTERS.rotation,                         // Rotation
            GameData.SIDE_CHARACTERS.scale,                            // Scale
            GameData.SIDE_CHARACTERS.origin,                          // Origin
            artist.getBoundingBoxByTakeName(takeName),                // Dimensions
            GameData.SIDE_CHARACTERS.explodeBoundingBoxInPixels       // Explode By
        );
         

        sprite = new Sprite
        (
            takeName,                                               // ID
            transform,                                              // Transform
            GameData.SIDE_CHARACTERS.actorType,                     // ActorType
            GameData.SIDE_CHARACTERS.collisionType,                 // CollisionType
            StatusType.Updated | StatusType.Drawn,                  // StatusType
            artist,                                                 // Artist
            GameData.SIDE_CHARACTERS.scrollSpeedMultipler,          // ScrollSpeedMultipler
            GameData.SIDE_CHARACTERS.LayerDepth                     // LayerDepth
        );

        // Add sprite to object manager
        this.objectManager.add(sprite);

        console.log("x", x)
        this.initializeSpeechBubble(x, y)
    }


    initializeSpeechBubble(x, y)
    {
        let transform;
        let artist;
        let sprite;

        artist = new SpriteArtist
        (
            context,                                                // Context
            2,                                                      // Alpha
            GameData.SPEECH_BUBBLE.spriteSheet,
            GameData.SPEECH_BUBBLE.sourcePosition,
            GameData.SPEECH_BUBBLE.sourceDimensions                       // Animation Data
        );

        transform = new Transform2D
        (
            new Vector2(x,y-50),
            GameData.SPEECH_BUBBLE.rotation,
            GameData.SPEECH_BUBBLE.scale,
            GameData.SPEECH_BUBBLE.origin,
            GameData.SPEECH_BUBBLE.sourceDimensions,
            GameData.SPEECH_BUBBLE.explodeBoundingBoxInPixels                                                    // Explode By
        );
         
        
        sprite = new Sprite
        (
            GameData.SPEECH_BUBBLE.id,                                               // ID
            transform,                                              // Transform
            GameData.SPEECH_BUBBLE.ActorType,                                       // ActorType
            GameData.SPEECH_BUBBLE.CollisionType,                               // CollisionType
            StatusType.Updated | StatusType.Drawn,                  // StatusType
            artist,                                                 // Artist
            1,                                                      // ScrollSpeedMultipler
            1                                                       // LayerDepth
        );

        // Add sprite to object manager
        this.objectManager.add(sprite);

    }       
}

    
    