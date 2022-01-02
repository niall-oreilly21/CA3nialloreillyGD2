/**
 * Moves the parent sprite based on keyboard input and detect collisions against platforms, pickups etc.
 * 
 * @author Niall McGuinness
 * @version 1.0
 * @class ConsumableMoveController
 */
 class ConsumableMoveController {

 

    constructor(
        notificationCenter,
        keyboardManager,
        objectManager,
        jumpVelocity
    ) {
        this.notificationCenter = notificationCenter;
        this.keyboardManager = keyboardManager;
        this.objectManager = objectManager;
        this.jumpVelocity = jumpVelocity;
        this.consumables = new Comsumables();
    }

    update(gameTime, parent) 
    {
        this.applyForces(gameTime, parent);
        this.checkCollisions(parent);
        this.applyInput(parent);
    }

    applyForces(gameTime, parent) {

        // Apply basic physic forces to the
        // player sprite

        parent.body.applyGravity(gameTime);
        parent.body.setVelocityY(this.jumpVelocity * gameTime.elapsedTimeInMs);
        if (parent.body.onGround) {
            
            parent.body.applyFriction(gameTime);
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
       
    }

    handleOutOfBoundsCollision(parent) 
    {
        // If the bullet has left the top bounds of our canvas
        if (parent.transform.translation.x + GameData.WAITER_WIDTH >= canvas.clientWidth) 
        {
            parent.transform.translation.x = canvas.clientWidth - GameData.WAITER_WIDTH;
        
        }

        else if(parent.transform.translation.x <= 0)
        {
           parent.transform.translation.x = 1;
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

            // Determine what type of collision has occured (if any)
            // Ultimately, if a collision has taken place, this function will 
            // return the direction at which that collision took place, 
            // otherwise, it will return null

            // e.g.
            // CollisionLocationType.Left       if the player has collided with a platform to the left
            // CollisionLocationType.Right      if the player has collided with a platform to the right
            // CollisionLocationType.Bottom     if the player has collided with a platform below
            // CollisionLocationType.Top        if the player has collided with a platform above
            // null                             if no collision has taken place

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

                parent.body.setVelocityY(0);

                let positionX = parent.transform.translation.x
                let positionY = parent.transform.translation.y

                let dimensionY = parent.transform.originalDimensions.y
                let scale = parent.transform.scale.y
                
                this.notificationCenter.notify
                (
                    new Notification
                    (
                        NotificationType.Sprite,    // Type
                        NotificationAction.RemoveFirst,  // Action
                        [parent]                    // Arguments
                    )
                );

            this.consumables.initializePuddle(positionX, positionY, dimensionY, scale);
               this.consumables.initializeDrinksPickups(); 
                
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
