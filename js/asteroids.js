/*
 * Asteroids game engine
 */
  var screenWidth  = 512;
  var screenHeight = 512;

  /* Load assets */
  Assets.loadImage("asteroid", "sprites/enemy.bmp");
  Assets.loadImage("bullet", "sprites/player.bmp");
  Assets.loadImage("player", "sprites/player.bmp");
  Assets.loadImage("shield", "sprites/player_shield.bmp");
  Assets.loadImage("explosion", "sprites/explode.bmp");
  Assets.loadImage("intro", "sprites/intro_screen.png");

  Assets.loadSound("asteroid-smash", "sounds/smash.wav");
  Assets.loadSound("player-explode", "sounds/explode.wav");
  Assets.loadSound("lazer", "sounds/laser.mp3");
  Assets.loadSound("main-music", "music/main_theme.mp3");
  Assets.loadSound("thruster", "sounds/thrusters.wav");
  Assets.loadSound("death-music", "music/death.mp3");

  Assets.loadFont("trench", "fonts/trench100free.otf");

  /* Construct and run the game engine */
  var myEngine = new Maelstrom();

  /* Load some levels */
  var levelScriptArray  = ["js/intro_level.js",
                           "js/main_level.js",
                           "js/death_level.js"];

  myEngine.addLevelScripts(levelScriptArray);

  /*Set the canvas to use a custom font*/
  View.setFont("23px Trench");

  /*Initialize the screen for rendering*/
  View.init(screenWidth, screenHeight);

  /*Configure some globals that will need to survive over levels*/
  myEngine.globals.score = 0;
  myEngine.globals.lives = 3;

  /*Start the engine running*/
  myEngine.run();
