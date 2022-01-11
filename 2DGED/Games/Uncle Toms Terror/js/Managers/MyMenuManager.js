/**
 * Stores and updates menus in Uncle Tom's Terror.
 * 
 * @author Niall O' Reilly 
 * @version 1.0
 * @class MyMenuManager
 */

class MyMenuManager extends MenuManager 
{

    constructor(id, notificationCenter, keyboardManager) 
    {
        super(id);
        this.notificationCenter = notificationCenter;
        this.keyboardManager = keyboardManager;
        this.initialize();

        //Register this object for notifications
        this.registerForNotifications();
    }


    registerForNotifications() 
    {

        this.notificationCenter.register
        (
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
        
            //Send a notification to pause the background music
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
            //Writes the highest wage to the game over menu html 
            highestWage.innerHTML = "\u20AC" + localStorage.topWage;

            //Writes the players final wage to the game over menu html 
            if(wage <= 0)
            {
                playersWage.innerHTML = "\u20AC" + 0;
            }
            else
            {
                playersWage.innerHTML = "\u20AC" + wage;
            }
            
            $('#game_over_menu').show();
            $('#game_over_menu').removeClass('hidden');
        
            //Send a notification to pause the background music
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

    showMenu(statusType)
    {
        if (statusType != 0) 
        {
            $('#main_menu').hide();
        }

        else {

            $('#main_menu').show();
        }
        
    }

    initialize() {
    
        //Hide the control menu
        $('#control_menu').hide();
        $('#control_menu').addClass('hidden');

        // Hide the pause menu
        $('#pause_menu').hide();
        $('#pause_menu').addClass('hidden');

        // Hide the pause menu
        $('#audio_menu').hide();
        $('#audio_menu').addClass('hidden');

        // Hide the about menu
        $('#about_menu').hide();
        $('#about_menu').addClass('hidden');

        // Hide the game over menu
        $('#game_over_menu').hide();
        $('#game_over_menu').addClass('hidden');


        // If the play button is clicked
        $('.play').click(function () 
        {

            //Send a notification to update and draw the game
            notificationCenter.notify
            (
                new Notification
                (
                    NotificationType.Menu,
                    NotificationAction.ShowMenuChanged,
                    [StatusType.Updated | StatusType.Drawn]
                )
            );

            //Send a notification to reset the timer for the game
            notificationCenter.notify
            (
                new Notification
                (
                    NotificationType.Reset,
                    NotificationAction.StartTimer,
                    [null]
                )
            );

            //Send a notification to play the background music
            notificationCenter.notify
            (
                new Notification
                (
                    NotificationType.Sound,
                    NotificationAction.Play,
                    ["kick_start_my_heart"]
                )
            );
    
        });


        $('.unpauseGame').click(function () 
        {

            //Send a notification to update and draw the game
            notificationCenter.notify
            (
                new Notification(
                    NotificationType.Menu,
                    NotificationAction.ShowPauseMenuChanged,
                    [StatusType.Updated | StatusType.Drawn]
                )
            );

            //Send a notification to unpause the background music
            notificationCenter.notify
            (
                new Notification(
                    NotificationType.Sound,
                    NotificationAction.UnPause,
                    ["kick_start_my_heart"]
                )
            );

            //Send a notification to reset the timer for the game
            notificationCenter.notify
            (
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

            //Send a notification to reset the game
            notificationCenter.notify
            (
                new Notification(
                    NotificationType.Reset,
                    NotificationAction.ResetGame,
                    [null]
                )
            );
        });
    

        $('#audio_button').click(function () 
        {
            //Sets up the localStorages for the toggle audio switches
            document.getElementById("isBackgroundAudioTurnedOn").checked = (localStorage.isBackgroundAudioTurnedOn === "true");
            document.getElementById("isOtherAudioTurnedOn").checked = (localStorage.isOtherAudioTurnedOn === "true");

            $('#audio_menu').show();
            $('#audio_menu').removeClass('hidden');

        });


        $('.about').click(function () 
        {
            $('#about_menu').show();
            $('#about_menu').removeClass('hidden');

        });


        $('.control').click(function () 
        {
            $('#control_menu').show();
            $('#control_menu').removeClass('hidden');
        });


        $('.switchNonDiegeticSounds').click(function () 
        {
         
            let checkbox = document.getElementById('isBackgroundAudioTurnedOn');
            
            //Event listener checks for a change of state with the toggle switch
            checkbox.addEventListener('change', audio => 
            {           
                localStorage.isBackgroundAudioTurnedOn = checkbox.checked;
                document.getElementById("isBackgroundAudioTurnedOn").checked = checkbox.checked;

                if (audio.target.checked) 
                {
                    //Turns the volume on for the background music
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
                    //Turns the volume off for the background music
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

            //Event listener checks for a change of state with the toggle switch
            checkbox.addEventListener('change', audio => 
            {
                localStorage.isOtherAudioTurnedOn = checkbox.checked;
                document.getElementById("isOtherAudioTurnedOn").checked = checkbox.checked;

                if(audio.target.checked)
                {
                    
                    //Turns the volume on for diegetic sounds
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
                    //Turns the volume off for diegetic sounds
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

}