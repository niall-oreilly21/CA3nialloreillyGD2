
// let touchX = 0;
// let touchY = 0;

//     let touchHandler = function(event) {
      
//         if (event.touches && event.touches[0])
//         {
//             touchX = event.touches[0].clientX;
//             touchY = event.touches[0].clientY;
//         }
//         else if (event.originalEvent && event.originalEvent.changedTouches[0]) 
//         {
//             touchX = event.originalEvent.changedTouches[0].clientX;
//             touchY = event.originalEvent.changedTouches[0].clientY;
//         } 
//         else if (event.clientX && event.clientY) 
//         {
//             touchX = event.clientX;
//             touchY = event.clientY;
//         }
       
//       }
      
//       window.addEventListener('touchstart', touchHandler, false);
//       window.addEventListener('touchmove', touchHandler, false);
//       window.addEventListener('touchend', touchHandler, false);

class MyUIManager extends UIManager 
{

    constructor(id, notificationCenter, objectManager, mouseManager, touchScreenManager) 
    {

        super(id);

        this.notificationCenter = notificationCenter;
        this.objectManager = objectManager;
        this.mouseManager = mouseManager;
        this.touchScreenManager = touchScreenManager;

        this.registerForNotifications();
    }

    registerForNotifications() {

        // When a 'ui' event fires, call the 'handleUINotification' function 
        // of 'this' object
        this.notificationCenter.register(
            NotificationType.UI,
            this,
            this.handleUINotification
        );
    }


      

    /**
     * 
     * @param {GameTime} gameTime 
     */
    update(gameTime) 
    {

        // The below code checks to see if the mouse has been clicked.
        // It then extracts all of the HUD sprites from the object manager.
        // Next, it loops through the list of HUD sprites, and checks to see 
        // if the mouse click took place on top of any HUD sprite. If so,
        // some action is performed.

        // For example, this will allow us to check if the user has clicked on 
        // the pause button.

        // If the mouse has been clicked (i.e., if the click position 
        // is not null)
        if (this.mouseManager.clickPosition) 
        {

            // Get a list of all the HUD sprites that are stored
            // within the object manager
            const hudSprites = objectManager.get(ActorType.HUD);

            // Loop through the list of HUD sprites
            for (let i = 0; i < hudSprites.length; i++) {

                // Store a reference to the current HUD sprite
                const hudSprite = hudSprites[i];

                // Create a new Rect object, with a width of 1 and height of 1
                // to represent the pixel at which the mouse was clicked
                const mouseClickPosition = new Rect(
                    this.mouseManager.clickPosition.x,
                    this.mouseManager.clickPosition.y,
                    1,                                      // Width
                    1                                       // Height
                );

                // Use the rect object to check if the mouse click took place
                // inside of the hudSprite
                if (hudSprite.transform.boundingBox.contains(mouseClickPosition)) 
                {
                    // TO DO: Your code here...

                    // If the user clicks the pause button...
                    // If the user clicks the menu button...
                    // If the user clicks the flip gravity button...

                    if (hudSprite.id === "Pause Button") 
                    {
                        //Shoes the pause menu
                        notificationCenter.notify
                        (
                            new Notification(
                                NotificationType.Menu,
                                NotificationAction.ShowPauseMenuChanged,
                                [StatusType.Off]
                            )
                        );

                        //Pauses the timer in the game
                        notificationCenter.notify
                        (
                            new Notification(
                                NotificationType.Reset,
                                NotificationAction.PauseTimer,
                                [null]
                            )
                        );
                        
                        //console.log("You clicked the pause button!");
                    }

                    if (hudSprite.id === "Exit Button") {
                        
                    }
                }
            }
        }

        if(this.touchScreenManager.touchPosition)
        {

           
            const hudSpritesTouch = objectManager.get(ActorType.HUD);

            // Loop through the list of HUD sprites
            for (let i = 0; i < hudSpritesTouch.length; i++) 
            {

                // Store a reference to the current HUD sprite
                const hudSprite = hudSpritesTouch[i];

                const touchPosition = new Rect
                (
                    this.touchScreenManager.touchPosition.x,
                    this.touchScreenManager.touchPosition.y,
                    1,                                      // Width
                    1                                       // Height
                );
      
                // Use the rect object to check if the mouse click took place
                // inside of the hudSprite
                if (hudSprite.transform.boundingBox.contains(touchPosition)) 
                {
                    // TO DO: Your code here...

                    // If the user clicks the pause button...
                    // If the user clicks the menu button...
                    // If the user clicks the flip gravity button...

                    if (hudSprite.id === "Pause Button") 
                    {
                        
                        //Shoes the pause menu
                        notificationCenter.notify
                        (
                            new Notification(
                                NotificationType.Menu,
                                NotificationAction.ShowPauseMenuChanged,
                                [StatusType.Off]
                            )
                        );

                        //Pauses the timer in the game
                        notificationCenter.notify
                        (
                            new Notification(
                                NotificationType.Reset,
                                NotificationAction.PauseTimer,
                                [null]
                            )
                        );
                        
                        //console.log("You clicked the pause button!");
                    }

                    if (hudSprite.id === "Exit Button") {
                        
                    }
                }
            }
        }
    }
}


