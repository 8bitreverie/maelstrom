(function() {


    var level = new Level("death");
    level.music = Assets.sounds["death-music"];

    /***************************************************************
     * Ui text for second level death screen
     ***************************************************************/
    var deathScreenUI = new GameObject();
    deathScreenUI.behaviour = function () {


      this.thisTime += Time.deltaTime();

      if ((this.thisTime - this.lastTime) <= 0.1) {
        return;
      }

      this.lastTime = this.thisTime;

      var canvas = document.getElementsByTagName("canvas");
      var color  = this.currentColor-=3;

      //Shrink and vanish
      if(this.currentColor<0) {
        var size = this.size-=1;

        var canvas = document.getElementsByTagName("canvas");
        for (var i = 0; i < canvas.length; i++) {

          if(size <= 0)
            canvas[i].style.display = "none";

          canvas[i].width  = size;
          canvas[i].height = size;

        }
      }

      //Set color
      for (var i = 0; i < canvas.length; i++) {
        canvas[i].style.backgroundColor = "rgb("+color+","+color+","+color+")";
      }

      //TODO: Make this dynamic calculation
      this.position.x = 55;
      this.position.y = 250;

      this.uiText = "Hold Space To Continue To Live!";

      level.engineRef.globals.score = 0;
      level.engineRef.globals.lives = 3;

      if(Key.isDown(Key.SPACE)){
        this.currentColor=0xff;
        //level.engineRef.loadLevel("main");
        //TODO: Adjust music volume/fx
      }

    };

    deathScreenUI.thisTime = 0.0;
    deathScreenUI.lastTime = 0.1;
    deathScreenUI.currentColor = 0xff;
    deathScreenUI.size = 512;
    deathScreenUI.isUI     = true;
    level.gameObjects = [deathScreenUI];

    level.init();

})();
