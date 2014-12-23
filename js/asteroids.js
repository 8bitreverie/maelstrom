/*
 * Asteroids game engine
 */
  var screenWidth  = 512;
  var screenHeight = 512;

  /* Load some levels */
  var levelArray  = [INTRO.level, MAIN.level, DEATH.level];

  /* Construct and run the game engine */
  var myEngine = new Maelstrom(levelArray, screenWidth, screenHeight);

  /*Configure some globals that will need to survive over levels*/
  myEngine.globals.score = 0;
  myEngine.globals.lives = 3;

  /*Set the canvas to use a custom font*/
  View.setFont("15px PressStart");

  /*Start the engine running*/
  myEngine.run();

