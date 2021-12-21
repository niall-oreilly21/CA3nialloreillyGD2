class ClickableObjectController {

    /**
     * Constructs a clickable object controller, which checks to see if a mouse click took place
     * inside of a 
     * @param {MouseManager} mouseManager 
     * @param {Function} callbackFunction  
     */
    constructor(mouseManager, callbackFunction) {
        this.mouseManager = mouseManager;
        this.callbackFunction = callbackFunction;
    }

    update(gameTime, parent) {

        // The below code checks to see if the mouse has been clicked.
        // It then creates a mouse click position Rect object, which represents
        // the position at which the mouse was clicked. It then checks to see
        // if the mouse click took place within the bounds of the object that
        // this controller is attached to. If so, the callback function (which 
        // is initialized in the constructor) is executed.

        // For example, this will allow us to check if the user has clicked on 
        // the pause button.

        // If the mouse has been clicked (i.e., if the click position 
        // is not null)
        if (this.mouseManager.clickPosition) {

            // Create a new Rect object, which has a width of 1 and height of 1,
            // to represent the pixel at which the mouse was clicked
            const mouseClickPosition = new Rect(
                this.mouseManager.clickPosition.x,
                this.mouseManager.clickPosition.y,
                1,                                      // Width
                1                                       // Height
            );

            // Use the Rect object to check if the mouse click took place
            // inside of the sprite that this controller is attached to
            if (parent.transform.boundingBox.contains(mouseClickPosition)) {

                // If the click took place on the parent object, call the
                // callback function
                this.callbackFunction();
            }
        }
    }
}