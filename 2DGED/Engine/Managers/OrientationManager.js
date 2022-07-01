
let frontToBack = 0;

class OrientationManager 
{

    constructor(id) 
    {
        this.id = id;

        this.moveDirection = 0 // 0 == no, 1 == left, 2 == right


        window.addEventListener("deviceorientation", function(event) 
        {
            // // alpha: rotation around z-axis
            // var rotateDegrees = event.alpha;
            // // gamma: left to right
            // var leftToRight = event.gamma;
            // beta: front back motion
            frontToBack = event.beta;

            if(frontToBack < 0)
            {
                this.moveDirection = 1;

            } 
            else if(frontToBack > 0)
            {
                this.moveDirection = 2

            }
            else
            {
                this.moveDirection = 0
            }   
       
            
        }, true);
    }

    getMoveDirection()
    {
        return this.moveDirection
    }

     /**
     * Returns true if the key corresponding to the code is pressed
     * @param {Number} code
     * @returns {Boolean} True if pressed, otherwise false
     */
    isLeft() 
    {
        if (frontToBack < 0) 
        {
            return true;
          
        }
        else 
        {
            return false;
        }
    }

    isRight() 
    {
        
        if (frontToBack > 0) 
        {
            return true;
        }
        else 
        {
            return false;
        }
    }

    isIdle()
    {
        if (frontToBack === 0) 
        {
            return true;
        }
        else 
        {
            return false;
        }
    }
}