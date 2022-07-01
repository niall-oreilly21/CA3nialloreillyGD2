class TouchScreenManager 
{

    get id() {
        return this._id;
    }
    get touchPosition() {
        return this._touchPosition;
    }

    set id(value) {
        this._id = value;
    }
    set touchPosition(value) {
        this._touchPosition = value;
    }

    constructor(id) 
    {
        
        this.id = id;

        this.touchPosition = null;

        window.addEventListener("touchstart", (event) => 
        {
            
            this.touchPosition = new Vector2
            (
                event.touches[0].clientX,
                event.touches[0].clientY
            );

        }, false);


        window.addEventListener("touchend", (event) => 
        {
            
            this.touchPosition = null;

        },false);
    }

 
}

