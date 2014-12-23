var DEATH = {
    level: null,
    init: function() {

    this.level = new Level("death");
    this.level.music = "music/death.mp3";

    /***************************************************************
     * Ui text for second level death screen
     ***************************************************************/
    var deathScreenUI = new GameObject();
    deathScreenUI.behaviour = function () {

      var score = this.level.engineRef.globals.score;

      //TODO: Make this dynamic calculation
      this.position.x = 45;
      this.position.y = 125;

      this.uiText = "You scored:" + score;
      this.uiText += "\n Press Space To Play Again!";

      this.level.engineRef.globals.score = 0;
      this.level.engineRef.globals.lives = 3;

      if(Key.isDown(Key.SPACE)){
        this.level.engineRef.loadLevel("main");
      }

    };
    deathScreenUI.isUI = true;
    this.level.gameObjects = [deathScreenUI];
  },
};
DEATH.init();
