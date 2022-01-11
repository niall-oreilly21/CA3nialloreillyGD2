/**
 * Moves the parent sprite based on keyboard input and detect collisions against platforms and the player
 * 
 * @author Niall O' Reilly based on Niall McGuinness
 * @version 1.0
 * @class ConsumableMoveController
 */

class ConsumableMoveController 
{

    constructor
    (
        notificationCenter,
        keyboardManager,
        objectManager,
        velocity
    ) 
    
    {
        this.notificationCenter = notificationCenter;
        this.keyboardManager = keyboardManager;
        this.objectManager = objectManager;
        this.velocity = velocity;
        
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
        this.applyInput(parent);
    }


    applyForces(gameTime, parent) 
    {
        parent.body.applyGravity(gameTime);
        parent.body.setVelocityY(this.velocity * gameTime.elapsedTimeInMs);
        
        if (parent.body.onGround) 
        {
            
            parent.body.applyFriction(gameTime);
        }
    }


    checkCollisions(parent) 
    {
        parent.body.onGround = false;

        this.handleOutOfBoundsCollision(parent);
        
        this.handlePlatformCollision(parent);
        
    }


    handleOutOfBoundsCollision(parent) 
    {
        if (parent.transform.translation.x + 60  >= canvas.clientWidth) 
        {
            parent.transform.translation.x = canvas.clientWidth - 60;
        
        }

        else if(parent.transform.translation.x <= 0)
        {
            parent.transform.translation.x = 1;
        }    
    }


    handlePlatformCollision(parent) 
    {
        const platforms = this.objectManager.get(ActorType.Platform);

        if (platforms == null) return;
        
        for (let i = 0; i < platforms.length; i++) 
        {

            const platform = platforms[i];

            let collisionLocationType = Collision.GetCollisionLocationType
            (
                parent,
                platform
            );


            if (collisionLocationType === CollisionLocationType.Bottom) 
            {
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
                        NotificationType.Sprite,    
                        NotificationAction.RemoveFirst,  
                        [parent]                    
                    )
                );

                //Creates a new cosnumable object when another cosumable object hits the ground
                this.consumables.initializeConsumables();

                const puddles = this.objectManager.get(ActorType.Puddle);

                if(puddles == null)
                {
                    return this.consumables.initializeSpillage(positionX, positionY, dimensionY, scale);
                }
            
                if(puddles.length < 3)
                {
                    this.consumables.initializeSpillage(positionX, positionY, dimensionY, scale);
                }
   
            }

        }
    }


    applyInput(parent) 
    {

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
            new Vector2(
                parent.body.velocityX,
                parent.body.velocityY
            )
        );
    }

}
