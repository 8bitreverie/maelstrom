var INTRO = {
  level: null,
  init: function() {

    this.level       = new Level("intro");
    this.level.music = "music/death.mp3";

    /***************************************************************
     * Ui text for second level death screen
     ***************************************************************/
    var introName = new GameObject();
    introName.behaviour = function () {

      //TODO: Make this dynamic calculation
      this.position.x = 45;
      this.position.y = 125;

      this.uiText = "Asteroids";

      this.level.engineRef.globals.score = 0;
      this.level.engineRef.globals.lives = 3;

      if(Key.isDown(Key.SPACE)){
        this.level.engineRef.loadLevel("main");
      }

    };
    introName.isUI = true;

    var introPressSpace = new GameObject();
    introPressSpace.behaviour = function () {

      //TODO: Make this dynamic calculation
      this.position.x = 45;
      this.position.y = 145;

      this.uiText = "Press Space To Play!";

      this.level.engineRef.globals.score = 0;
      this.level.engineRef.globals.lives = 3;

      if(Key.isDown(Key.SPACE)){
        this.level.engineRef.loadLevel("main");
      }

    };
    introPressSpace.isUI = true;


    this.level.gameObjects = [introName,introPressSpace];
  },
};
INTRO.init();
