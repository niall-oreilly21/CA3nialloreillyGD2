/**
 * 
 * 
 * @author Niall O' Reilly
 * @version 1.0
 * @class RandomGeneratorSideCharacters
 */
 
class RandomGeneratorSideCharacters 
{

    get sideCharactersArray() 
    {
        return this._sideCharactersArray;
    }

    get takeName() 
    {
        return this._takeName;
    }

    get x() 
    {
        return this._x;
    }

    get y() 
    {
        return this._y;
    }

    set sideCharactersArray(sideCharactersArray) 
    {
        this._sideCharactersArray = sideCharactersArray;
    }

    set takeName(takeName) 
    {
        this._takeName = takeName;
    }

    set x(x) 
    {
        this._x = x;
    }

    set y(y) 
    {
        this._y = y;
    }


    constructor
    (
        notificationCenter,
        objectManager
    ) 

    {
        this.notificationCenter = notificationCenter;
        this.objectManager = objectManager;
        this.sideCharactersArray = GameData.SIDE_CHARACTERS_NAMES;
        this.takeName = "";
        this.x = 0;
        this.y = 0;     
        this.textMessages = GameData.SIDE_CHARACTERS_MESSAGES;
    }
  

    setRandomPositionX()
    {
        if(Math.floor(Math.random() * 2))
        {
            return GameData.SIDE_CHARACTERS_X_POSITION_LEFT_SIDE;     
        }
        else
        {
            return GameData.SIDE_CHARACTERS_X_POSITION_RIGHT_SIDE;     
        }
    }

    
    setRandomTakeName()
    {
        //https://www.kirupa.com/html5/picking_random_item_from_array.htm
        this.randomCharacterIndex = Math.floor(Math.random() * this.sideCharactersArray.length)
        return this.sideCharactersArray[this.randomCharacterIndex]

    }

    generateRandomCharacterSprite()
    {
        this.initilizeGameSideCharacter();
        this.initializeSpeechBubble();
        this.setTimer();
    }


    initilizeGameSideCharacter()
    {
        let transform;
        let artist;
        let sprite;

        this.takeName = this.setRandomTakeName();
        this.x = this.setRandomPositionX();
        this.y = Math.floor(Math.random() * 350) + 100;  
        artist = new AnimatedSpriteArtist
        (
            context,                                                // Context
            1,                                                      // Alpha
            GameData.SIDE_CHARACTERS_ANIMATION                          // Animation Data
        );

        // Set animation
        artist.setTake(this.takeName);

        transform = new Transform2D
        (
            new Vector2(this.x, this.y),                                        // Translation
            GameData.SIDE_CHARACTERS.rotation,                         // Rotation
            GameData.SIDE_CHARACTERS.scale,                            // Scale
            GameData.SIDE_CHARACTERS.origin,                          // Origin
            artist.getBoundingBoxByTakeName(this.takeName),                // Dimensions
            GameData.SIDE_CHARACTERS.explodeBoundingBoxInPixels       // Explode By
        );
         

        sprite = new Sprite
        (
            this.takeName,                                               // ID
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
    }


    getSpeechBubbleSpriteSheet()
    {
        if(this.x === GameData.SIDE_CHARACTERS_X_POSITION_LEFT_SIDE)
        {
            return GameData.SPEECH_BUBBLE_LEFT_SIDE; 
        }
        else
        {
            return GameData.SPEECH_BUBBLE_RIGHT_SIDE; 
        }
    }

    getSpeechBubblePositionX()
    {
        if(this.x === GameData.SIDE_CHARACTERS_X_POSITION_RIGHT_SIDE)
        {
            return this.x - 280; 
        }
        else
        {
            return this.x; 
        }
    }

    initializeSpeechBubble()
    {
        let transform;
        let artist;
        let sprite;

        let x = this.getSpeechBubblePositionX();
        let y = this.y - 50;
        artist = new SpriteArtist
        (
            context,                                                // Context
            2,                                                      // Alpha
            this.getSpeechBubbleSpriteSheet(),
            GameData.SPEECH_BUBBLE.sourcePosition,
            GameData.SPEECH_BUBBLE.sourceDimensions                       // Animation Data
        );

        transform = new Transform2D
        (
            new Vector2(x, y),
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
            GameData.SPEECH_BUBBLE.actorType,                                       // ActorType
            GameData.SPEECH_BUBBLE.collisionType,                               // CollisionType
            StatusType.Updated | StatusType.Drawn,                  // StatusType
            artist,                                                 // Artist
            1,                                                      // ScrollSpeedMultipler
            1                                                       // LayerDepth
        );

        // Add sprite to object manager
        this.objectManager.add(sprite);

        this.initializeSpeechBubbleText(x, y);

    } 
    
    initializeSpeechBubbleText(x, y)
    {
        let transform;
        let artist;
        let sprite;
        let message = this.textMessages[this.randomCharacterIndex][Math.floor(Math.random() * this.textMessages[this.randomCharacterIndex].length)]


        transform = new Transform2D
        (
            new Vector2
            (
                x + 20, 
                y + 10
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
            message,                  // Text
            FontType.InformationOrder,     // Font Type
            Color.Orange,                    // Color
            TextAlignType.Left,             // Text Align
            250,                            // Max Width
            false                            // Fixed Position
        );

        sprite = new Sprite
        (
            "Order Pizza",
            transform,
            ActorType.SideCharacter,
            CollisionType.NotCollidable,
            StatusType.Updated | StatusType.Drawn,
            artist,
            1,
            1
        );

        // Add sprite to object manager
        objectManager.add(sprite);

    } 

    setTimer()
    {
        const SideCharacterDetails = this.objectManager.get(ActorType.SideCharacter);

        // If enemies is null, exit the function
        if (SideCharacterDetails == null) return;

        for (let i = 0; i < SideCharacterDetails.length; i++) 
        {

            setTimeout(() => 
            {
                this.notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.Sprite,    // Type
                        NotificationAction.RemoveAllByType,  // Action
                        [ActorType.SideCharacter]                    // Arguments
                        
                    )
                );
            },
            3000)
        }

    }   
}

    
    