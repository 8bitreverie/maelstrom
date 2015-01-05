/*
 * Asteroids game engine
 */
  var screenWidth  = 512;
  var screenHeight = 512;

  /* Load assets */
  Assets.Font("trench", "fonts/trench100free.otf");

  Assets.Image("asteroid", "sprites/enemy.bmp");
  Assets.Image("bullet", "sprites/player.bmp");
  Assets.Image("player", "sprites/player.bmp");
  Assets.Image("shield", "sprites/player_shield.bmp");
  Assets.Image("explosion", "sprites/explode.bmp");
  Assets.Image("intro", "sprites/intro_screen.png");

  Assets.Sound("asteroid-smash", "sounds/smash.wav");
  Assets.Sound("player-explode", "sounds/explode.wav");
  Assets.Sound("lazer", "sounds/laser.mp3");
  Assets.Sound("main-music", "music/main_theme.mp3");
  Assets.Sound("thruster", "sounds/thrusters.wav");
  Assets.Sound("death-music", "music/death.mp3");

  /*Initialize the screen for rendering*/
  View.init(screenWidth, screenHeight);

  Assets.Load();

  /* Construct and run the game engine */
  var myEngine = new Maelstrom();

  /* Load some levels */
  var levelScriptArray  = ["js/intro_level.js",
                           "js/main_level.js",
                           "js/death_level.js"];

  myEngine.addLevelScripts(levelScriptArray);

  /*Configure some globals that will need to survive over levels*/
  myEngine.globals.score = 0;
  myEngine.globals.lives = 3;

  /*Start the engine running if all the assets are loaded*/
  var assetsLoadedCheckTimer = setInterval(function(){
      if(Assets.allLoaded) {

        /*Set the canvas to use a custom font*/
        View.setFont("23px Trench");
        myEngine.run();
        clearInterval(assetsLoadedCheckTimer);

      }
    }, 1000);

