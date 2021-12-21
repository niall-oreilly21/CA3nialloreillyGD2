/**
 * Stores, updates, and changes game state in my specific game e.g. Snailbait.
 * @author
 * @version 1.0
 * @class MyGameStateManager
 */
class MyGameStateManager extends GameStateManager {

    get playerHealth() {
        return this._playerHealth;
    }
    get playerAmmo() {
        return this._playerAmmo;
    }
    get inventory() {
        return this._inventory;
    }

    set playerHealth(value) {
        this._playerHealth = value;
    }
    set playerAmmo(value) {
        this._playerAmmo = value;
    }
    set inventory(value) {
        this._inventory = value;
    }

    constructor(id, notificationCenter, initialPlayerHealth, initialPlayerAmmo) {
        
        super(id);

        this.notificationCenter = notificationCenter;

        this.playerHealth = initialPlayerHealth;
        this.playerAmmo = initialPlayerAmmo;

        this.inventory = [];
        
        this.registerForNotifications();
    }

    registerForNotifications() {
        this.notificationCenter.register(
            NotificationType.GameState, 
            this, 
            this.handleGameStateNotification
        );
    }

    handleGameStateNotification(notification) {

        switch (notification.notificationAction) {

            case NotificationAction.Health:
                this.handleHealthStateChange(notification.notificationArguments);
                break;

            case NotificationAction.Inventory:
                this.handleInventoryStateChange(notification.notificationArguments);
                break;

            case NotificationAction.Ammo:
                this.handleAmmoStateChange(notification.notificationArguments);
                break;

            // Add more cases here...

            default:
                break;
        }
    }

    handleHealthStateChange(argArray) {
        console.log(argArray);

        // Add your own code here...
        // Maybe update a health variable?
        // Maybe update a UI element?
    }

    handleInventoryStateChange(argArray) {
        console.log(argArray);

        // Add your code here...
        // Maybe update an inventory array?
        // Maybe update a UI element
    }

    handleAmmoStateChange(argArray) {
        console.log(argArray);

        // Add your code here...
        // Maybe update an ammo variable?
        // Maybe update a UI element?
    }

    update(gameTime) {

        // Add your code here...
        
        // For example, every update(), we could check the player's health. If
        // the player's health is <= 0, then we can create a notification...

        // Play a sound?
        // Pause the game?
        // Play the 'player death' animation?
        // Remove the player sprite from the game?
        // Show the win/lose screen?

        // How could we have these events fire one after each other, rather
        // than all at the same time? Hint: use timers.
    }
}