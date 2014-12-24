/*
 * Asteroids game engine
 */
  var screenWidth  = 512;
  var screenHeight = 512;

  /*Set the canvas to use a custom font*/
  View.setFont("23px Trench");

  /*Initialize the screen for rendering*/
  View.init(screenWidth, screenHeight);

  /* Construct and run the game engine */
  var myEngine = new Maelstrom();

  /* Load some levels */
  var levelArray  = [INTRO.level, MAIN.level, DEATH.level];

  myEngine.addLevels(levelArray);

  /*Configure some globals that will need to survive over levels*/
  myEngine.globals.score = 0;
  myEngine.globals.lives = 3;

  /*Start the engine running*/
  myEngine.run();

