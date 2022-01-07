
class GameData 
{

  static AUDIO_CUE_ARRAY = 
  [
    new AudioCue("background", AudioType.Background, 1, 1, 0, true),
    new AudioCue("jump", AudioType.Move, 1, 1, 0, false),
    new AudioCue("boing", AudioType.All, 1, 1, 0, false),
    new AudioCue("game_over", AudioType.WinLose, 1, 1, 0, false),
    new AudioCue("splash", AudioType.WinLose, 1, 1, 0, false),
  ];

  static INITIAL_PLAYER_HEALTH = 5; 
  static BACKGROUND = document.getElementById("bar_background");
  static ORDER_DECORATOR = document.getElementById("order_decorator");
  static CLOCK = document.getElementById("clock");
  static UI = document.getElementById("ui_sprite_sheet");
  
  static SPEECH_BUBBLE =
  {
    id: "Speech Bubble",
    spriteSheet: document.getElementById("speech_bubble"),
    sourcePosition: Vector2.Zero,
    sourceDimensions: new Vector2(600, 410),
    rotation: 0,
    scale: new Vector2(2, 0.4),
    origin: Vector2.Zero,
    actorType: ActorType.Decorator,
    collisionType: CollisionType.NotCollidable,
    layerDepth: 0,
    explodeBoundingBoxInPixels: 0,
  }

 

  
  
  static PLATFORM_Y_DIMENSION = 668;

  static PLATFORM_DATA = 
  {
    id: "Platform",
    spriteSheet: document.getElementById("snailbait_jungle_tileset"),
    sourcePosition: new Vector2(0, 112),
    sourceDimensions: new Vector2(48, 48),
    rotation: 0,
    scale: Vector2.One,
    origin: Vector2.Zero,
    actorType: ActorType.Platform,
    collisionType: CollisionType.Collidable,
    layerDepth: 0,
    explodeBoundingBoxInPixels: -6,


    translationArray: 
    [

      /****************** Screen 1 *******************/

      // Floor
      new Vector2(250, this.PLATFORM_Y_DIMENSION),
      new Vector2(300, this.PLATFORM_Y_DIMENSION),
      new Vector2(350, this.PLATFORM_Y_DIMENSION),
      new Vector2(400, this.PLATFORM_Y_DIMENSION),
      new Vector2(450, this.PLATFORM_Y_DIMENSION),
      new Vector2(500, this.PLATFORM_Y_DIMENSION),
      new Vector2(550, this.PLATFORM_Y_DIMENSION),
      new Vector2(600, this.PLATFORM_Y_DIMENSION),
      new Vector2(650, this.PLATFORM_Y_DIMENSION),
      new Vector2(700, this.PLATFORM_Y_DIMENSION),
      new Vector2(750, this.PLATFORM_Y_DIMENSION),
      new Vector2(800, this.PLATFORM_Y_DIMENSION),
      new Vector2(850, this.PLATFORM_Y_DIMENSION),
      new Vector2(900, this.PLATFORM_Y_DIMENSION),
      new Vector2(950, this.PLATFORM_Y_DIMENSION),
      new Vector2(1000,this.PLATFORM_Y_DIMENSION),
      new Vector2(1050,this.PLATFORM_Y_DIMENSION),
      new Vector2(1100,this.PLATFORM_Y_DIMENSION),
      new Vector2(1150,this.PLATFORM_Y_DIMENSION)
    ]
  };


  

  static TABLE_ANIMATION_DATA = 
  {
    id: "Table Animation Data",
    spriteSheet: document.getElementById("table_sprite_sheet"),
    
    // Animations
    takes: 
    {

      // Animation 1
      "Table": 
      {

        frameRatePerSec: 10,
        
        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 0,

        boundingBoxDimensions: new Vector2(72, 48),

        frames: 
        [
          new Rect(12, 24, 72, 48)
        ]
      }
    }
  }


  static COMSUMABLES_ANIMATION_DATA = 
  {
    id: "Consumables Animation Data",
    spriteSheet: document.getElementById("consumables_sprite_sheet"),
    
    // Animations
    takes: 
    {

      // Animation 1
      "Drink": 
      {

        frameRatePerSec: 10,
        
        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 0,

        boundingBoxDimensions: new Vector2(280, 291),

        frames: 
        [
          new Rect(5, 23, 280, 291)
        ]
      },

      "Spillage": 
      {

        frameRatePerSec: 10,
        
        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 0,

        boundingBoxDimensions: new Vector2(263, 114),

        frames: 
        [
          new Rect(305, 198, 263, 114)
        ]
      },

      "Pizza": 
      {

        frameRatePerSec: 10,
        
        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 0,

        boundingBoxDimensions: new Vector2(295, 309),

        frames: 
        [
          new Rect(626, 12, 295, 309)
        ]
      }
    }
  };


  static WAITER_START_POSITION = new Vector2(330, 500);
  static WAITER_WIDTH = 132;
  static WAITER_HEIGHT = 138;
  static WAITER_FALL_RIGHT_Y_POSITION = 582;
  static WAITER_FALL_LEFT_Y_POSITION = 822;
  static WAITER_MOVE_KEYS = [Keys.ArrowLeft, Keys.ArrowRight, Keys.ArrowUp];
  static WAITER_WALK_VELOCITY = 0.3;
  static WAITER_JUMP_VELOCITY = -1.2;
 


  static WAITER_ANIMATION_DATA = 
  {

    id: "Runner Animation Data",
    spriteSheet: document.getElementById("waiter_sprite_sheet"),

    // Animations
    takes: 
    {

      // Animation 1
      "Idle Right": 
      {

        frameRatePerSec: 8,

        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 0,

        // Notice that I chose the largest of all the widths taken from the frames
        // array below
        boundingBoxDimensions: new Vector2(this.WAITER_WIDTH, this.WAITER_HEIGHT),

        frames: 
        [

          // This list of rects just represent the positions
          // and dimension of each individual animation frame
          // on the sprite sheet
          new Rect(246, 342, this.WAITER_WIDTH, this.WAITER_HEIGHT),   // Animation frame 1
        ]
      },

      "Idle Left": 
      {

        frameRatePerSec: 8,

        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 0,

        // Notice that I chose the largest of all the widths taken from the frames
        // array below
        boundingBoxDimensions: new Vector2(this.WAITER_WIDTH, this.WAITER_HEIGHT),

        frames: 
        [

          // This list of rects just represent the positions
          // and dimension of each individual animation frame
          // on the sprite sheet
          new Rect(1062, 342, this.WAITER_WIDTH, this.WAITER_HEIGHT),   // Animation frame 1
        ]
      },

      // Animation 3
      "Run Right": 
      {

        frameRatePerSec: 8,

        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 2,

        // Notice that I chose the largest of all the widths taken from the frames
        // array below
        boundingBoxDimensions: new Vector2(this.WAITER_WIDTH, this.WAITER_HEIGHT),

        frames: 
        [

          // This list of rects just represent the positions
          // and dimension of each individual animation frame
          // on the sprite sheet

          new Rect(0, 342, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(246, 342, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(486, 342, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
        ]
      },

      // Animation 2
      "Run Left": 
      {

        frameRatePerSec: 8,

        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 2,

        // Notice that I chose the largest of all the widths taken from the frames
        // array below
        boundingBoxDimensions: new Vector2(this.WAITER_WIDTH, this.WAITER_HEIGHT),

        frames: 
        [
          new Rect(822, 342, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(1062, 342, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(1302, 342, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
        ]
      },


      "Jump Right": 
      {

        frameRatePerSec: 8,

        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 2,

        // Notice that I chose the largest of all the widths taken from the frames
        // array below
        boundingBoxDimensions: new Vector2(this.WAITER_WIDTH, this.WAITER_HEIGHT),

        frames: [

          // This list of rects just represent the positions
          // and dimension of each individual animation frame
          // on the sprite sheet

          new Rect(0, 102, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(306, 0, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(588, 102, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
        ]
      },

      "Jump Left": 
      {

        frameRatePerSec: 8,

        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 2,

        // Notice that I chose the largest of all the widths taken from the frames
        // array below
        boundingBoxDimensions: new Vector2(this.WAITER_WIDTH, this.WAITER_HEIGHT),

        frames: [

          // This list of rects just represent the positions
          // and dimension of each individual animation frame
          // on the sprite sheet

          new Rect(822, 102,    this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(1002, 0,   this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(1200, 102, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
        ]
      },

      "Fall Right": 
      {

        frameRatePerSec: 8,

        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: 0,

        startFrameIndex: 0,
        endFrameIndex: 11,

        // Notice that I chose the largest of all the widths taken from the frames
        // array below
        boundingBoxDimensions: new Vector2(this.WAITER_WIDTH, this.WAITER_HEIGHT),

        frames: 
        [

          // This list of rects just represent the positions
          // and dimension of each individual animation frame
          // on the sprite sheet

          new Rect(0,   this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(240, this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(486, this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
          new Rect(726, this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(966, this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(486, this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
          new Rect(726, this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(966, this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(486, this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
          new Rect(726, this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(966, this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(1206,this.WAITER_FALL_RIGHT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
        ]
      },

      "Fall Left": 
      {

        frameRatePerSec: 8,

        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: 0,

        startFrameIndex: 0,
        endFrameIndex: 11,

        // Notice that I chose the largest of all the widths taken from the frames
        // array below
        boundingBoxDimensions: new Vector2(this.WAITER_WIDTH, this.WAITER_HEIGHT),

        frames: 
        [

          // This list of rects just represent the positions
          // and dimension of each individual animation frame
          // on the sprite sheet

          new Rect(108, this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(342, this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(576, this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
          new Rect(816, this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(1056,this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(576, this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
          new Rect(816, this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(1056,this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(576, this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
          new Rect(816, this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 1
          new Rect(1056,this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 2
          new Rect(1302,this.WAITER_FALL_LEFT_Y_POSITION, this.WAITER_WIDTH, this.WAITER_HEIGHT),// Animation frame 3
        ]
      },

    }
  };

  
  static SIDE_CHARACTERS_ANIMATION = 
  {

    id: "Side Characters Animation Data",
    spriteSheet: document.getElementById("side_characters_sprite_sheet"),

    // Animations
    takes: 
    {

      // Animation 1
      "The Legend": 
      {

        frameRatePerSec: 8,

        // -1 = Loop forever
        //  0 = Run once (no loop)
        //  N = Loop N times
        maxLoopCount: -1,

        startFrameIndex: 0,
        endFrameIndex: 1,

        boundingBoxDimensions: new Vector2(60, 90),
     
        frames: 
        [
          new Rect(18, 6, 60, 90),
          new Rect(126, 6, 60, 90)     // Animation frame 1
        ]
      },

         // Animation 1
         "Spud": 
         {
   
           frameRatePerSec: 8,
   
           // -1 = Loop forever
           //  0 = Run once (no loop)
           //  N = Loop N times
           maxLoopCount: -1,
   
           startFrameIndex: 0,
           endFrameIndex: 1,
   
           boundingBoxDimensions: new Vector2(60, 72),
        
           frames: 
           [
             new Rect(234, 12, 60, 72),
             new Rect(342, 12, 60, 72),     // Animation frame 1
           ]
         },

        // Animation 1
        "Cook": 
        {
  
          frameRatePerSec: 8,
  
          // -1 = Loop forever
          //  0 = Run once (no loop)
          //  N = Loop N times
          maxLoopCount: -1,
  
          startFrameIndex: 0,
          endFrameIndex: 1,
  
          boundingBoxDimensions: new Vector2(84, 84),
        
          frames: 
          [
            new Rect(6, 114, 84, 84),
            new Rect(114, 114, 84, 84),     // Animation frame 1
          ]
        },

        // Animation 1
        "Boss": 
        {
  
          frameRatePerSec: 8,
  
          // -1 = Loop forever
          //  0 = Run once (no loop)
          //  N = Loop N times
          maxLoopCount: -1,
  
          startFrameIndex: 0,
          endFrameIndex: 1,
  
          boundingBoxDimensions: new Vector2(60, 72),
        
          frames: 
          [
            new Rect(234, 120, 60, 72),
            new Rect(342, 120, 60, 72),     // Animation frame 1
          ]
        },

    }
  }
  
  static SIDE_CHARACTERS =
  {
    id: "Speech Bubble",
    spriteSheet: document.getElementById("speech_bubble"),
    sourcePosition: Vector2.Zero,
    sourceDimensions: new Vector2(600, 410),
    rotation: 0,
    scale: Vector2.One,
    origin: Vector2.Zero,
    actorType: ActorType.SideCharacter,
    collisionType: CollisionType.NotCollidable,
    scrollSpeedMultipler: 0,
    layerDepth: 0,
    explodeBoundingBoxInPixels: 0,
     
  }

  static SIDE_CHARACTERS_NAMES = [SideCharacterNames.TheLegend, SideCharacterNames.Spud, SideCharacterNames.CathyTheCook,SideCharacterNames.BossMan];
  static SIDE_CHARACTERS_X_POSITION_LEFT_SIDE;
  static SIDE_CHARACTERS_X_POSITION_RIGHT_SIDE;
}

