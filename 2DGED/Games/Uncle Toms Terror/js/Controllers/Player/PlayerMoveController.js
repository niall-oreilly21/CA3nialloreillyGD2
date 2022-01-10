/**
 * Moves the parent sprite based on keyboard input and detect collisions against platforms, pickups etc.
 * 
 * @author Niall McGuinness
 * @version 1.0
 * @class PlayerMoveController
 */

class PlayerMoveController {
 
    
    constructor(
        notificationCenter,
        keyboardManager,
        objectManager,
        moveKeys,
        runVelocity,
        jumpVelocity
    ) {
        this.notificationCenter = notificationCenter;
        this.keyboardManager = keyboardManager;
        this.objectManager = objectManager;

        this.moveKeys = moveKeys;
        this.runVelocity = runVelocity;
        this.jumpVelocity = jumpVelocity;
        
        this.consumables = new Consumables
        (
            notificationCenter,
            keyboardManager,
            objectManager
        );
        this.collidedWithPuddle = false;
    }

    update(gameTime, parent) 
    {
        this.applyForces(gameTime, parent);
        this.checkCollisions(parent);
        this.handleInput(gameTime, parent);
        this.collidedWithPuddle = false;
        this.applyInput(parent);
        playerCurrentPositionX = parent.transform.translation.x;
       
    }

    applyForces(gameTime, parent) {

        // Apply basic physic forces to the
        // player sprite
        
        parent.body.applyGravity(gameTime);

        if (parent.body.onGround) {
            
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
        if(!this.keyboardManager.isAnyKeyPressed())
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

    handleMove(gameTime, parent) {

        
        
        // If the move left key is pressed
        if ((parent.artist.isCurrentTakeName("Fall Right")) || (parent.artist.isCurrentTakeName("Fall Left"))) return;


            if (this.keyboardManager.isKeyDown(this.moveKeys[0])) 
            {
                // Add velocity to begin moving player left
                parent.body.setVelocityX(-this.runVelocity * gameTime.elapsedTimeInMs);  

                // Update the player's animation
                if (!this.keyboardManager.isKeyDown(this.moveKeys[2])) 
                {
    
                        parent.artist.setTake("Run Left");
                    
                }
            }
        
            // If the move right key is pressed
            else if (this.keyboardManager.isKeyDown(this.moveKeys[1])) 
            {

                // Add velocity to begin moving the player right
                // if (parent.artist.isCurrentTakeName("Fall Left"))
                // {
                //     parent.body.setVelocityX(0);
                // }
                // else
                // {
                    parent.body.setVelocityX(this.runVelocity * gameTime.elapsedTimeInMs);
                
                //}
            
            
                // Update the player's animation
                if (!this.keyboardManager.isKeyDown(this.moveKeys[2])) 
                {
                    if (!parent.artist.isCurrentTakeName("Fall Right"))
                    {
                        parent.artist.setTake("Run Right");
                    }
                }
            }
        
    }

    // UPDATE JUMP 
    handleJump(gameTime, parent) {

        // If the player is already jumping, or if the player is
        // not on the ground, then don't allow the player to jump
      
        if (parent.body.jumping || !parent.body.onGround) return;

        // If the jump key is pressed
        if ((parent.artist.isCurrentTakeName("Fall Right")) || (parent.artist.isCurrentTakeName("Fall Left"))) return;


        if(this.collidedWithPuddle) return;
        
            if (this.keyboardManager.isKeyDown(this.moveKeys[2])) 
            {

                // Update body variables
                parent.body.jumping = true;
                parent.body.onGround = false;

                // Apply velocity to begin moving the player up
                // This gives the effect of jumping 
                
                parent.body.setVelocityY(this.jumpVelocity * gameTime.elapsedTimeInMs);
            
                if (this.keyboardManager.isKeyDown(this.moveKeys[1]))
                {
                    parent.artist.setTake("Jump Right");   
                }

                else if(this.keyboardManager.isKeyDown(this.moveKeys[0]))
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
                notificationCenter.notify(
                    new Notification(
                        NotificationType.Sound,
                        NotificationAction.Play,
                        ["jump"]
                        
                    )
                );

            }
        
    }

    checkCollisions(parent) {

        // Assume that the play is not on the ground - i.e., 
        // assume that they are falling. We will update this
        // value in handlePlatformCollision function if the
        // player is currently colliding with a platform that
        // is below them (i.e., if they are on the ground)
        parent.body.onGround = false;

       
       this.handleOutOfBoundsCollision(parent);
        
        this.handlePlatformCollision(parent);
        
        this.handlePickupCollision(parent);
     
        this.handleEnemyCollision(parent);    
        
        this.handleTableCollision(parent); 
    }

    

    handleOutOfBoundsCollision(parent) 
    {
        // If the bullet has left the top bounds of our canvas
        if (parent.transform.translation.x + GameData.WAITER_WIDTH >= canvas.clientWidth) 
        {
            parent.transform.translation.x = canvas.clientWidth - GameData.WAITER_WIDTH;
        
        }

        else if(parent.transform.translation.x <= 250)
        {
           parent.transform.translation.x = 251;
        }
        
    }

    handlePlatformCollision(parent) {
        // Get a list of all the platform sprites that are stored
        // within the object manager
        const platforms = this.objectManager.get(ActorType.Platform);

        // If platforms is null, exit the function
        if (platforms == null) return;

        // Loop through the list of platform sprites        
        for (let i = 0; i < platforms.length; i++) {

            // Store a reference to the current pickup sprite
            const platform = platforms[i];

          
            let collisionLocationType = Collision.GetCollisionLocationType(
                parent,
                platform
            );


            // If the player has landed on a platform
            if (collisionLocationType === CollisionLocationType.Bottom) {

                // Update variables to represent their new state
                parent.body.onGround = true;
                parent.body.jumping = false;

                parent.body.setVelocityY(0);
            }

            // If the player has collided with a platform that is above
            // them
            if (collisionLocationType === CollisionLocationType.Top) {

                // Update their velocity to move them downwards.
                // This will create a bounce effect, where it will look 
                // like the player is bouncing off the platform above
                parent.body.setVelocityY(this.jumpVelocity);
            }
        }
    }

    handlePickupCollision(parent) {

        // Get a list of all the pickup sprites that are stored
        // within the object manager
        const pickups = this.objectManager.get(ActorType.Pickup);

        // If pickups is null, exit the function
        if (pickups == null) return;

        if ((parent.artist.isCurrentTakeName("Fall Right")) || (parent.artist.isCurrentTakeName("Fall Left"))) return;

  

        // Loop through the list of pickup sprites
        for (let i = 0; i < pickups.length; i++) {

            // Store a reference to the current pickup sprite
            const pickup = pickups[i];

            // We can use a simple collision check here to check if the player has collided
            // with the pickup sprite
            if (parent.transform.boundingBox.intersects(pickup.transform.boundingBox)) 
            {

                // If the player has collided with a pickup, do something...
                if(pickup.artist.isCurrentTakeName("Pizza"))
                {
                    if(waiterPizza != orderPizza)
                    {
                        waiterPizza++;
                    }
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
                       
                        notificationCenter.notify
                        (
                            new Notification
                            (
                                NotificationType.Sound,
                                NotificationAction.Play,
                                ["splash"]
                            )
                        );

                        notificationCenter.notify
                        (
                            new Notification
                            (
                                NotificationType.GameState,
                                NotificationAction.RandomGenerateSideCharacters,
                                null
                            )
                        );
                        

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
                else if(pickup.artist.isCurrentTakeName("Drink"))
                {
                    if(waiterBeer != orderBeer)
                    {
                        waiterBeer++;
                    }
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
                        
                        notificationCenter.notify
                        (
                            new Notification
                            (
                                NotificationType.Sound,
                                NotificationAction.Play,
                                ["splash"]
                            )
                        );
                        
                        notificationCenter.notify
                        (
                            new Notification
                            (
                                NotificationType.GameState,
                                NotificationAction.RandomGenerateSideCharacters,
                                null
                            )
                        );

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
    
                // Create a notification that will ultimately remove
                // the pickup sprite
                notificationCenter.notify(
                    new Notification(
                        NotificationType.Sprite,
                        NotificationAction.Remove,
                        [pickup]
                    )
                );

                this.consumables.initializeConsumables();
            }
        }
    }

    handleEnemyCollision(parent) 
    {

        // Get a list of all the enemy sprites that are stored within
        // the object mananger
        const puddles = this.objectManager.get(ActorType.Puddle);

        // If enemies is null, exit the function
        if (puddles == null) return;

        // Loop through the list of enemy sprites
        for (let i = 0; i < puddles.length; i++) 
        {

            // Store a reference to the current enemy sprite
            const puddle = puddles[i];

            // We can use a simple collision check here to check if the player has collided
            // with the enemy sprite
                if (parent.transform.boundingBox.intersects(puddle.transform.boundingBox)) 
                {
                        this.collidedWithPuddle = true;
                        if (parent.artist.isCurrentTakeName("Run Right") || parent.artist.isCurrentTakeName("Jump Right") || parent.artist.isCurrentTakeName("Idle Right") )
                        {
                            parent.artist.setTake("Fall Right");
                        } 

                        else if(parent.artist.isCurrentTakeName("Run Left") || parent.artist.isCurrentTakeName("Jump Left") || parent.artist.isCurrentTakeName("Idle Left") )
                        {
                            parent.artist.setTake("Fall Left");                                  
                        } 

                        notificationCenter.notify
                        (
                            new Notification
                            (
                                NotificationType.Sprite,    // Type
                                NotificationAction.RemoveFirst,  // Action
                                [puddle]                    // Arguments
                            )
                        );
              
                        notificationCenter.notify
                        (
                            new Notification
                            (
                                NotificationType.GameState,
                                NotificationAction.RandomGenerateSideCharacters,
                                null
                            )
                        );

                        notificationCenter.notify
                        (
                            new Notification
                            (
                            NotificationType.GameState,
                            NotificationAction.Wage,
                            [-10]
                            )
                        );
                        
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

            // Get a list of all the enemy sprites that are stored within
            // the object mananger
            const tables = this.objectManager.get(ActorType.Interactable);

            // If enemies is null, exit the function
            if (tables == null) return;
            
            if ((parent.artist.isCurrentTakeName("Fall Right")) || (parent.artist.isCurrentTakeName("Fall Left"))) return;

            // Loop through the list of enemy sprites
            for (let i = 0; i < tables.length; i++) 
            {
    
                // Store a reference to the current enemy sprite
                const table = tables[i];
              
                // We can use a simple collision check here to check if the player has collided
                // with the enemy sprite
                
                    if (parent.transform.boundingBox.intersects(table.transform.boundingBox)) 
                    {

                            this.notificationCenter.notify
                            (
                                new Notification
                                (
                                    NotificationType.Sprite,    // Type
                                    NotificationAction.RemoveFirst,  // Action
                                    [table]                    // Arguments
                                )
                            );
                           
                            notificationCenter.notify(
                                new Notification(
                                    NotificationType.Sound,
                                    NotificationAction.Play,
                                    ["cha_ching"]
                                )
                            );

                            notificationCenter.notify
                            (
                                new Notification
                                (
                                NotificationType.GameState,
                                NotificationAction.Wage,
                                [15]
                                )
                            );

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
        if (Math.abs(parent.body.velocityX) <= Body.MIN_SPEED) {

            // Then set the velocity to zero
            parent.body.setVelocityX(0);
        }

        // If the y velocity value is very small
        if (Math.abs(parent.body.velocityY) <= Body.MIN_SPEED) {

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

        parent.transform.translateBy(
            new Vector2(
                parent.body.velocityX,
                parent.body.velocityY
            )
        );
    }

    equals(other) {

        // TO DO...
        throw "Not Yet Implemented";
    }

    toString() {

        // TO DO...
        throw "Not Yet Implemented";
    }

    clone() {

        // TO DO...
        throw "Not Yet Implemented";
    }

}