/**
 * Moves the parent sprite based on keyboard input and detect collisions against platforms, pickups etc.
 * 
 * @author Niall O' Reilly based on Niall McGuinness
 * @version 1.0
 * @class PlayerMoveController
 */

class PlayerMoveController 
{

    constructor
    (
        notificationCenter,
        keyboardManager,
        orientationManager,
        touchScreenMananger,
        objectManager,
        moveKeys,
        runVelocity,
        jumpVelocity
    ) 

    {
        this.notificationCenter = notificationCenter;
        this.keyboardManager = keyboardManager;
        this.orientationManager = orientationManager;
        this.touchScreenMananger = touchScreenMananger;
        this.objectManager = objectManager;
        this.moveKeys = moveKeys;
        this.runVelocity = runVelocity;
        this.jumpVelocity = jumpVelocity;
        this.collidedWithPuddle = false;
        
        this.consumables = new Consumables
        (
            notificationCenter,
            keyboardManager,
            objectManager
        );
        
    }


    update(gameTime, parent) 
    {
        this.applyForces(gameTime, parent);
        this.checkCollisions(parent);
        this.handleInput(gameTime, parent);
        this.collidedWithPuddle = false;
        this.applyInput(parent);

        //Keeps track of the players current position
        playerCurrentPositionX = parent.transform.translation.x;
       
    }


    applyForces(gameTime, parent) 
    {  
        parent.body.applyGravity(gameTime);

        if (parent.body.onGround) 
        {      
            parent.body.applyFriction(gameTime);
        }
    }


    handleInput(gameTime, parent) 
    {    
        this.handleIdle(parent);
        this.handleMove(gameTime, parent);
        this.handleJump(gameTime, parent);        
    }


    handleIdle(parent)
    {
        if(!this.keyboardManager.isAnyKeyPressed() || this.orientationManager.isIdle())
        {
            if(parent.artist.isCurrentTakeName("Run Right") || parent.artist.isCurrentTakeName("Jump Right"))
            {
                parent.artist.setTake("Idle Right");
            }
            else if(parent.artist.isCurrentTakeName("Run Left") || parent.artist.isCurrentTakeName("Jump Left"))
            {
                parent.artist.setTake("Idle Left");
            }
        }
    }


    handleMove(gameTime, parent) 
    {
        // If the current take is fall right or fall left then the player can't move
        if ((parent.artist.isCurrentTakeName("Fall Right")) || (parent.artist.isCurrentTakeName("Fall Left"))) return;

        // If the move left key is pressed
        if (this.keyboardManager.isKeyDown(this.moveKeys[0]) || (this.orientationManager.isLeft())) 
        {
            // Add velocity to begin moving player left
            parent.body.setVelocityX(-this.runVelocity * gameTime.elapsedTimeInMs);  

            // Update the player's animation
            if (!this.keyboardManager.isKeyDown(this.moveKeys[2]) || (this.touchScreenMananger.touchPosition)) 
            {
                if (!parent.artist.isCurrentTakeName("Fall Left"))
                {
                    parent.artist.setTake("Run Left"); 
                }              
            }
        }
    
        // If the move right key is pressed
        else if (this.keyboardManager.isKeyDown(this.moveKeys[1]) || (this.orientationManager.isRight())) 
        {
            parent.body.setVelocityX(this.runVelocity * gameTime.elapsedTimeInMs);

            if (!this.keyboardManager.isKeyDown(this.moveKeys[2]) || (this.touchScreenMananger.touchPosition)) 
            {
                if (!parent.artist.isCurrentTakeName("Fall Right"))
                {
                    parent.artist.setTake("Run Right");
                }
            }
        }
        
    }


    handleJump(gameTime, parent) 
    {

        // If the player is already jumping, or if the player is
        // not on the ground, then don't allow the player to jump
        if (parent.body.jumping || !parent.body.onGround) return;

        // If the current take is fall right or fall left then the player can't jump
        if ((parent.artist.isCurrentTakeName("Fall Right")) || (parent.artist.isCurrentTakeName("Fall Left"))) return;

        //If the player is colliding with a puddle then they can't jump
        if(this.collidedWithPuddle) return;
        
        // If the jump key is pressed
        if (this.keyboardManager.isKeyDown(this.moveKeys[2]) || (this.touchScreenMananger.touchPosition)) 
        {

            // Update body variables
            parent.body.jumping = true;
            parent.body.onGround = false;

            // Apply velocity to begin moving the player up
            // This gives the effect of jumping 
            parent.body.setVelocityY(this.jumpVelocity * gameTime.elapsedTimeInMs);
        
            // If the move right key is pressed
            if (this.keyboardManager.isKeyDown(this.moveKeys[1]) || (this.orientationManager.isRight()))
            {
                parent.artist.setTake("Jump Right");   
            }
            // If the move left key is pressed
            else if(this.keyboardManager.isKeyDown(this.moveKeys[0]) || (this.orientationManager.isLeft()))
            {
                parent.artist.setTake("Jump Left");   
            }

            if(parent.artist.isCurrentTakeName("Run Right") || parent.artist.isCurrentTakeName("Idle Right"))
            {
                parent.artist.setTake("Jump Right");
            }

            else if(parent.artist.isCurrentTakeName("Run Left") || parent.artist.isCurrentTakeName("Idle Left"))
            {
                parent.artist.setTake("Jump Left");
            
            }

            // Create a jump sound notification
            notificationCenter.notify
            (
                new Notification
                (
                    NotificationType.Sound,
                    NotificationAction.Play,
                    ["jump"]
        
                )
            );

        }
        
    }


    checkCollisions(parent) 
    {
        parent.body.onGround = false;  
        this.handleOutOfBoundsCollision(parent);     
        this.handlePlatformCollision(parent);     
        this.handlePickupCollision(parent); 
        this.handleSpillageCollision(parent);          
        this.handleTableCollision(parent); 
    }


    handleOutOfBoundsCollision(parent) 
    {
        // If the player has left the top bounds of our canvas
        if (parent.transform.translation.x + GameData.WAITER_WIDTH >= canvas.clientWidth) 
        {
            parent.transform.translation.x = canvas.clientWidth - GameData.WAITER_WIDTH;
        }

        else if(parent.transform.translation.x <= 250)
        {
           parent.transform.translation.x = 251;
        }
        
    }

    handlePlatformCollision(parent) 
    {
        // Get a list of all the platform sprites that are stored
        // within the object manager
        const platforms = this.objectManager.get(ActorType.Platform);

        // If platforms is null, exit the function
        if (platforms == null) return;

        // Loop through the list of platform sprites        
        for (let i = 0; i < platforms.length; i++) 
        {

            // Store a reference to the current pickup sprite
            const platform = platforms[i];

            let collisionLocationType = Collision.GetCollisionLocationType
            (
                parent,
                platform
            );

            // If the player has landed on a platform
            if (collisionLocationType === CollisionLocationType.Bottom) 
            {
                // Update variables to represent their new state
                parent.body.onGround = true;
                parent.body.jumping = false;

                parent.body.setVelocityY(0);
            }

            // If the player has collided with a platform that is above
            // them
            if (collisionLocationType === CollisionLocationType.Top) 
            {

                // Update their velocity to move them downwards.
                // This will create a bounce effect, where it will look 
                // like the player is bouncing off the platform above
                parent.body.setVelocityY(this.jumpVelocity);
            }
        }
    }


    handlePickupCollision(parent) 
    {
        // Get a list of all the pickup sprites that are stored
        // within the object manager
        const pickups = this.objectManager.get(ActorType.Pickup);

        // If pickups is null, exit the function
        if (pickups == null) return;

        // If the current take is fall right or fall left then the player can't jump
        if ((parent.artist.isCurrentTakeName("Fall Right")) || (parent.artist.isCurrentTakeName("Fall Left"))) return;

        // Loop through the list of pickup sprites
        for (let i = 0; i < pickups.length; i++) {

            // Store a reference to the current pickup sprite
            const pickup = pickups[i];

            // We can use a simple collision check here to check if the player has collided
            // with the pickup sprite
            if (parent.transform.boundingBox.intersects(pickup.transform.boundingBox)) 
            {
                // If the pickup current take is pizza
                if(pickup.artist.isCurrentTakeName("Pizza"))
                {
                    if(waiterPizza != orderPizza)
                    {
                        //Add to the waiter pizza
                        waiterPizza++;
                    }
                    //Else set the falling animation
                    else 
                    {
                        if (parent.artist.isCurrentTakeName("Run Right") || parent.artist.isCurrentTakeName("Jump Right") || parent.artist.isCurrentTakeName("Idle Right") )
                        {
                            parent.artist.setTake("Fall Right");
                        } 

                        else if(parent.artist.isCurrentTakeName("Run Left") || parent.artist.isCurrentTakeName("Jump Left") || parent.artist.isCurrentTakeName("Idle Left") )
                        {
                            parent.artist.setTake("Fall Left");  
                                                          
                        }  
                       
                        //Play the splash sound
                        notificationCenter.notify
                        (
                            new Notification
                            (
                                NotificationType.Sound,
                                NotificationAction.Play,
                                ["splash"]
                            )
                        );

                        //Generate a random side character
                        notificationCenter.notify
                        (
                            new Notification
                            (
                                NotificationType.GameState,
                                NotificationAction.RandomGenerateSideCharacters,
                                null
                            )
                        );
                        
                        //Decrease the wage by €10
                        notificationCenter.notify
                        (
                            new Notification
                            (
                            NotificationType.GameState,
                            NotificationAction.Wage,
                            [-10]
                            )
                        );
                    }
                 
                }
                // If the pickup current take is beer
                else if(pickup.artist.isCurrentTakeName("Drink"))
                {
                    if(waiterBeer != orderBeer)
                    {
                        //add to the waiter berr
                        waiterBeer++;
                    }
                    //Else set the falling animation
                    else 
                    {
                        if (parent.artist.isCurrentTakeName("Run Right") || parent.artist.isCurrentTakeName("Jump Right") || parent.artist.isCurrentTakeName("Idle Right") )
                        {
                            parent.artist.setTake("Fall Right");
                        } 

                        else if(parent.artist.isCurrentTakeName("Run Left") || parent.artist.isCurrentTakeName("Jump Left") || parent.artist.isCurrentTakeName("Idle Left") )
                        {
                            parent.artist.setTake("Fall Left");  
                                                          
                        }  
                        
                        //Play the splash sound
                        notificationCenter.notify
                        (
                            new Notification
                            (
                                NotificationType.Sound,
                                NotificationAction.Play,
                                ["splash"]
                            )
                        );
                        
                        //Generate a random side character
                        notificationCenter.notify
                        (
                            new Notification
                            (
                                NotificationType.GameState,
                                NotificationAction.RandomGenerateSideCharacters,
                                null
                            )
                        );

                        //Decrease the wage by €10
                        notificationCenter.notify
                        (
                            new Notification
                            (
                            NotificationType.GameState,
                            NotificationAction.Wage,
                            [-10]
                            )
                        );  
                    }   
                }
    
                //Remove the consumable 
                notificationCenter.notify
                (
                    new Notification(
                        NotificationType.Sprite,
                        NotificationAction.Remove,
                        [pickup]
                    )
                );
            
                //Generate a new consumable
                this.consumables.initializeConsumables();
            }
        }
    }


    handleSpillageCollision(parent) 
    {

        // Get a list of all the spillage sprites that are stored within
        // the object mananger
        const puddles = this.objectManager.get(ActorType.Puddle);

        // If spillage is null, exit the function
        if (puddles == null) return;

        // Loop through the list of enemy sprites
        for (let i = 0; i < puddles.length; i++) 
        {

            // Store a reference to the current spillage sprite
            const puddle = puddles[i];

            // We can use a simple collision check here to check if the player has collided
            // with the spillage sprite
            if (parent.transform.boundingBox.intersects(puddle.transform.boundingBox)) 
            {
        
                this.collidedWithPuddle = true;

                //Sets the falling animation 
                if (parent.artist.isCurrentTakeName("Run Right") || parent.artist.isCurrentTakeName("Jump Right") || parent.artist.isCurrentTakeName("Idle Right") )
                {
                    parent.artist.setTake("Fall Right");
                } 

                else if(parent.artist.isCurrentTakeName("Run Left") || parent.artist.isCurrentTakeName("Jump Left") || parent.artist.isCurrentTakeName("Idle Left") )
                {
                    parent.artist.setTake("Fall Left");                                  
                } 

                //Removes the spliiage
                notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.Sprite,    
                        NotificationAction.RemoveFirst,  
                        [puddle]                   
                    )
                );
        
                //Generate a random side character
                notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.GameState,
                        NotificationAction.RandomGenerateSideCharacters,
                        null
                    )
                );

                //Decrease the wage by €10
                notificationCenter.notify
                (
                    new Notification
                    (
                    NotificationType.GameState,
                    NotificationAction.Wage,
                    [-10]
                    )
                );
                
                //Plays the splash sound
                notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.Sound,
                        NotificationAction.Play,
                        ["splash"]
                    )
                );
        
            }
        }
    } 


    handleTableCollision(parent) 
    {

        // Get a list of all the table sprites that are stored within
        // the object mananger
        const tables = this.objectManager.get(ActorType.Interactable);

        // If table is null, exit the function
        if (tables == null) return;
        
        if ((parent.artist.isCurrentTakeName("Fall Right")) || (parent.artist.isCurrentTakeName("Fall Left"))) return;

        // Loop through the list of table sprites
        for (let i = 0; i < tables.length; i++) 
        {

            // Store a reference to the current table sprite
            const table = tables[i];
            
            // We can use a simple collision check here to check if the player has collided
            // with the table sprite
            
            if (parent.transform.boundingBox.intersects(table.transform.boundingBox)) 
            {

                //Removes the table
                this.notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.Sprite,    
                        NotificationAction.RemoveFirst,  
                        [table]                    
                    )
                );
                
                //Plays the cha ching sound
                notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.Sound,
                        NotificationAction.Play,
                        ["cha_ching"]
                    )
                );

                //Increase the wage by €20
                notificationCenter.notify
                (
                    new Notification
                    (
                    NotificationType.GameState,
                    NotificationAction.Wage,
                    [20]
                    )
                );

                //Ends the leveland goes to the next order
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
    }


    applyInput(parent) {

        // If the x velocity value is very small
        if (Math.abs(parent.body.velocityX) <= Body.MIN_SPEED) 
        {
            // Then set the velocity to zero
            parent.body.setVelocityX(0);
        }

        // If the y velocity value is very small
        if (Math.abs(parent.body.velocityY) <= Body.MIN_SPEED) 
        {

            // Then set the velocity to zero
            parent.body.setVelocityY(0);
        }

        // It is important that we 'Zero' velocity valuees which are
        // very small, otherwise, it is likely that there will always
        // be some velocity being applied to the physics object, which
        // is often desireable

        // Use the values of the player's velocity to update the
        // translation of the player sprite

        // This is where the velocity is actually applied to the
        // player sprite - if we removed the below code, then the 
        // player would never move.

        parent.transform.translateBy
        (
            new Vector2
            (
                parent.body.velocityX,
                parent.body.velocityY
            )
        );
    }

}