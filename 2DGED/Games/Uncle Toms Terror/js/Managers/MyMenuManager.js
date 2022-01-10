class MyMenuManager extends MenuManager {

    constructor(id, notificationCenter, keyboardManager) {

        super(id);

        this.notificationCenter = notificationCenter;
        this.keyboardManager = keyboardManager;

        this.initialize();

        // Register this object for notifications
        this.registerForNotifications();
    }

    registerForNotifications() {

        // When a 'menu' event fires, call the 'handleMenuNotification' function of 'this' object
        this.notificationCenter.register(
            NotificationType.Menu,
            this,
            this.handleMenuNotification
        );
    }

    handleMenuNotification(notification) 
    {

        switch (notification.notificationAction) 
        {

            case NotificationAction.ShowMenuChanged:
                this.showMenu(notification.notificationArguments[0]);
                break;

            case NotificationAction.ShowPauseMenuChanged:
                this.showPauseMenu(notification.notificationArguments[0]);
                break;
            
            case NotificationAction.ShowGameOverMenuChanged:
                this.showGameOverMenu(notification.notificationArguments[0]);
                break;
            
            

            default:
            break;
        }
    }

    showPauseMenu(statusType) 
    {

        if (statusType != 0) 
        {
            $('#pause_menu').hide();
            $('#pause_menu').addClass('hidden');
            
        }

        else 
        {
            $('#pause_menu').show();
            $('#pause_menu').removeClass('hidden');
        
            notificationCenter.notify
            (
                new Notification
                (
                    NotificationType.Sound,
                    NotificationAction.Pause,
                    ["kick_start_my_heart"]
            
                )
        
            );
    
        }
    }

    showGameOverMenu(statusType) 
    {

        if (statusType != 0) 
        {
            $('#game_over_menu').hide();
            $('#game_over_menu').addClass('hidden');
            
        }

        else 
        {
            $('#game_over_menu').show();
            $('#game_over_menu').removeClass('hidden');
        
            notificationCenter.notify
            (
                new Notification
                (
                    NotificationType.Sound,
                    NotificationAction.Pause,
                    ["kick_start_my_heart"]
            
                )
        
            );
    
        }
    }
    showMenu(statusType) {
      
        // Check out the initialize function of this class. In it, we create a 'Menu' notification
        // whenever the play button is pressed. This notification has an action of ShowMenuChanged,
        // and an argument of [StatusType.Updated | StatusType.Drawn]. The handleMenuNotification 
        // function of this class is registered to the 'Menu' event. So, it will be called whenever
        // a 'Menu' notification is created. In the handleMenuNotification, we call this showMenu
        // function if the notification's action is of type 'ShowMenuChanged'. We also pass through 
        // the parameters that were added to the notification - [StatusType.Updated | StatusType.Drawn] 
        // in our case.

        // So, the statusType that is passed to this function will ultimately be [StatusType.Updated |
        // StatusType.Drawn] (or simply '3', if we work it out). 

        // This means, that when the user presses the 'play' button, a ShowMenuChanged notification is
        // created, which ultimately tells this function to hide the menu. On the other hand, we could
        // tell this notification to show the menu, by creating another ShowMenuChanged notification, but
        // by passing through a StatusType of off.

        // The reason why we use [StatusType.Drawn | StatusType.Updated] to turn off the menu, and 
        // [StatusType.Off] to turn on the menu, is because the same notification is sent to the
        // object manager, which ultimately tells it to start Updating and Drawing if the menu is
        // turned off, or to stop Updating and Drawing if the menu is turned on. Here we see how
        // one notification may be used to control multiple separate elements.

        // If we created an event to tell the ObjectManager to draw and update,
        // then it means we want the game to run i.e. hide the menu
        if (statusType != 0) 
        {
            $('#main_menu').hide();
        }

        else {

            $('#main_menu').show();
        }
        
    }

    initialize() {

        // TO DO: Please make sure to hide any other menus that you have created

      
        // Hide the control menu
        $('#control_menu').hide();
        $('#control_menu').addClass('hidden');

        $('#pause_menu').hide();
        $('#pause_menu').addClass('hidden');

        $('#audio_menu').hide();
        $('#audio_menu').addClass('hidden');

        $('#about_menu').hide();
        $('#about_menu').addClass('hidden');

        $('#game_over_menu').hide();
        $('#game_over_menu').addClass('hidden');

        // Hide the YOUR_MENU menu
        // $('#YOUR_MENU_ID').hide();
        // $('#YOUR_MENU_ID').addClass('hidden');

        // If the play button is clicked
        $('.play').click(function () {

            // Hide the menu
            //$('#main_menu').hide();

            // Send a notification to update and draw the game
            notificationCenter.notify(
                new Notification(
                    NotificationType.Menu,
                    NotificationAction.ShowMenuChanged,
                    [StatusType.Updated | StatusType.Drawn]
                )
            );

            notificationCenter.notify(
                new Notification(
                    NotificationType.Reset,
                    NotificationAction.StartTimer,
                    [null]
                )
            );

            notificationCenter.notify(
                new Notification(
                    NotificationType.Sound,
                    NotificationAction.Play,
                    ["kick_start_my_heart"]
                )
            );
    
       
        });

        $('.unpauseGame').click(function () 
        {


            notificationCenter.notify(
                new Notification(
                    NotificationType.Menu,
                    NotificationAction.ShowPauseMenuChanged,
                    [StatusType.Updated | StatusType.Drawn]
                )
            );

            // Send a notification to update and draw the game
            notificationCenter.notify(
                new Notification(
                    NotificationType.Sound,
                    NotificationAction.UnPause,
                    ["kick_start_my_heart"]
                )
            );

            notificationCenter.notify(
                new Notification(
                    NotificationType.Reset,
                    NotificationAction.StartTimer,
                    [null]
                )
            );

       
        });

        $('.exitGame').click(function () 
        {

            $('#pause_menu').hide();
            $('#pause_menu').addClass('hidden');


            notificationCenter.notify(
                new Notification(
                    NotificationType.Reset,
                    NotificationAction.ResetGame,
                    [null]
                )
            );
        });
    


        // If the audio button is clicked
        // Or more specifically - if an element which has
        // the audio class is clicked
        $('#audio_button').click(function () {


            document.getElementById("isBackgroundAudioTurnedOn").checked = (localStorage.isBackgroundAudioTurnedOn === "true");
            document.getElementById("isOtherAudioTurnedOn").checked = (localStorage.isOtherAudioTurnedOn === "true");

            // Do something...
            $('#audio_menu').show();
            $('#audio_menu').removeClass('hidden');
            
            // Hint: Send a notification to toggle the audio on/off
        });

        $('.about').click(function () 
        {

            $('#about_menu').show();
            $('#about_menu').removeClass('hidden');

        });

        // If the control button is clicked
        $('.control').click(function () {

            // Show control menu
            $('#control_menu').show();
            $('#control_menu').removeClass('hidden');
        });

        $('.switchNonDiegeticSounds').click(function () 
        {
         
            let checkbox = document.getElementById('isBackgroundAudioTurnedOn');
            
            // Show control menu
            checkbox.addEventListener('change', audio => 
            {           
                localStorage.isBackgroundAudioTurnedOn = checkbox.checked;
                document.getElementById("isBackgroundAudioTurnedOn").checked = checkbox.checked;

                if (audio.target.checked) 
                {
                    notificationCenter.notify
                    (
                        new Notification
                        (
                            NotificationType.Sound,
                            NotificationAction.SetVolume,
                            [AudioType.Background, 1]
                        )
                    );
                } 
                else 
                {
                    notificationCenter.notify
                    (
                        new Notification
                        (
                            NotificationType.Sound,
                            NotificationAction.SetVolume,
                            [AudioType.Background, 0]
                        )
                    );
                }

            });
        });


        $('.switchDiegeticSounds').click(function () 
        {
           
            let checkbox = document.getElementById('isOtherAudioTurnedOn');

            checkbox.addEventListener('change', audio => 
            {
                localStorage.isOtherAudioTurnedOn = checkbox.checked;
                document.getElementById("isOtherAudioTurnedOn").checked = checkbox.checked;

                if(audio.target.checked)
                {
                    
                    notificationCenter.notify
                    (
                        new Notification
                        (
                            NotificationType.Sound,
                            NotificationAction.SetVolume,
                            [AudioType.DiegeticSounds, 1]
                        )
                    );
                    
                } 
                else 
                {
                    notificationCenter.notify
                    (
                        new Notification
                        (
                            NotificationType.Sound,
                            NotificationAction.SetVolume,
                            [AudioType.DiegeticSounds, 0]
                        )
                    );
                }

            });
        });
    }

    

    update(gameTime) {

        // TO DO: Add code to listen for a 'pause key' press, and show/hide the menu accordingly
    }
}