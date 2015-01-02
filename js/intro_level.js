(function() {

    var level       = new Level("intro");
    level.music = Assets.sounds["death-music"];

    /***************************************************************
     * Ui text for second level death screen
     ***************************************************************/
    var introName = new GameObject();
    introName.behaviour = function () {

      //BUG!!!: View should be available before anything else.
      //These need to be in the behavior to access the View.
      introName.width         = View.width;
      introName.height        = View.height;

      if(Key.isDown(Key.SPACE)){
        level.engineRef.loadLevel("main");
      }

    };

    introName.position.x    = 0;
    introName.position.y    = 0;
    introName.sprite        = Assets.images["intro"];

    //TODO: Make sure these settings do something.
    introName.sprite.width  = 100;
    introName.sprite.height = 100;

    var storyTextUI = new GameObject();
    storyTextUI.thisTime = 0.0;
    storyTextUI.lastTime = 1.0;
    storyTextUI["storyCounter"] = 0;
    storyTextUI["story"] = ["The Earth has been pulled from its orbit by a giant and mysterious planet.",
                            "It careens through space directly into the path of an asteroid belt.",
                            "Our greatest minds and our greatest efforts have produced a new space vehicle.",
                            "When destroyed, the ship collapses itself into a singularity.",
                            "This allows the ship to reappear in space-time, unscathed, 3.14 times.",
                            "The ship is equipped with a photon cannon, and you, our hero.",
                            "We have chosen you out of all of us. You are our last hope.",
                            "Our fate, our future rests in your hands.",
                            "Please (could not reconstruct message text[err 20])",
                            "Save us."];
    storyTextUI["getNextStoryPart"] = function(){

      if (this.storyCounter < this.story.length) {
        return this.story[this.storyCounter++];
      }else{
        return "";
      }

    }

    storyTextUI.behaviour = function () {

      this.position.x -= 1;

      /*Scroll off the screen to the left*/
      if(this.position.x < (this.uiText.length*6)*-1) {
        this.uiText = this.getNextStoryPart();
        this.position.x = 300;
      }

    };

    storyTextUI.isUI = true;
    storyTextUI.position.x = 300;
    storyTextUI.position.y = 201;
    storyTextUI.uiText = "<Incoming Message"

    level.gameObjects = [introName, storyTextUI];

    level.init();

})();
