var MAIN = {
  level: null,
  init: function() {

    /*Precache resources*/
    Cache.loadImage("asteroid", "sprites/enemy.bmp");
    Cache.loadImage("bullet", "sprites/player.bmp");
    Cache.loadImage("player", "sprites/player.bmp");
    Cache.loadImage("explosion", "sprites/explode.bmp");
    Cache.loadSound("asteroid-smash","sounds/smash.wav");
    Cache.loadSound("player-explode","sounds/explode.wav");
    Cache.loadSound("lazer","sounds/laser.wav");

    this.level   = new Level("main");
    this.level.music = "music/main.mp3";

    /* Create n asteroids */
    var asteroidCount = 12;
    var asteroidArray = new Array(asteroidCount);

    var asteroidName  = "asteroid";
    var playerName    = "player";
    var bulletName    = "bullet";

    /*********************************************************************
     * Score
     ********************************************************************/
    var scoreUI = new GameObject();
    scoreUI.behaviour = function () {
      this.uiText = "Dead: " + this.level.engineRef.globals.score;
    };
    scoreUI.isUI = true;
    scoreUI.position.x = 10;
    scoreUI.position.y = 10;

    /*********************************************************************
    * Lives
    ********************************************************************/
    var livesUI = new GameObject();
    livesUI.behaviour = function () {
      this.uiText = "Ships: " + this.level.engineRef.globals.lives;
    };
    livesUI.isUI = true;
    livesUI.position.x = 190;
    livesUI.position.y = 10;

    /**********************************************************************
     * Radio messages
     **********************************************************************/
    var radioUI = new GameObject();

    /*
     * I know that this is dire, but it is an attempt to give backstory to
     * the original, which was analogous to the myth of sisyphus.
     *
     * Populous emotions:
     * denial, anger, bargaining, depression and acceptance.
     */
    var denial   = ["Our hero will save us!", "WE WILL PREVAIL!",
                    "Nothing can stop us", "ONWARD!"];

    var anger    = ["THEY SHOULD HAVE SENT ANOTHER!",
                    "YOU CANT HELP US!",
                    "YOU FAILED US!",
                    "NOOO ANYONE BUT YOU!",
                    "FAILURE!"];

    var bargain  = ["Please Help us!","You are our only hope!","PLEASE and thank you!",
                    "Please...we are sending love!",
                    "All our wealth is yours."];

    var depress = [ "...very sad...","...no hope...","so tired...",
                    "...worse than expected.", "unyielding...."];

    var accept  = ["Happiness can exist only in acceptance.",
                   "Everything happens for a reason.",
                   "We cannot change fate."];

    radioUI.thisTime = 0.0;
    radioUI.lastTime = 1.0;

    radioUI.behaviour = function () {

      var deathToll = this.level.engineRef.globals.score;

      var rate = deathToll * 0.000000001;

      /*The delay between message should be relative to the number
       * of remaining people*/
      this.thisTime += Time.deltaTime();

      if ((this.thisTime - this.lastTime) <= rate) {
        return;
      }

      this.lastTime = this.thisTime;

      var message = "";


      if (deathToll < 10000000) {
          message = denial[Math.floor(Math.random()  * denial.length)];
      } else if (deathToll < 100000000) {
          message = anger[Math.floor(Math.random()   * anger.length)];
      } else if (deathToll < 1000000000) {
          message = bargain[Math.floor(Math.random() * bargain.length)];
      } else if (deathToll < 3000000000) {
          message = depress[Math.floor(Math.random() * depress.length)];
      } else if (deathToll < 5000000000) {
          message = accept[Math.floor(Math.random()  * accept.length)];
      } else {
          message = "...(static noise)..." ;
      }

      this.uiText = "msg: " + message;
    };
    radioUI.isUI = true;
    radioUI.position.x = 10;
    radioUI.position.y = 250;

    /*********************************************************************
     * Asteroids
     *********************************************************************/
    /* "this" parameter will point to the asteroid gameobject when
       the function is called */
    var asteroidOnCollide = function(collidingWith){

      if(collidingWith.name === bulletName) {

        /*Reset asteroid*/
        this.reset();
        Sound.playOnce(Cache.sounds["asteroid-smash"]);

      }

    }

    var asteroidBehaviour = function(){

          var scaleX = Math.cos(this.direction);
          var scaleY = Math.sin(this.direction);
          var deltaTime = Time.deltaTime();
          var reset = false;

          //Reset
          //When they go off the screen position them back on the screen
          if ( this.position.y > View.height ||
               this.position.x > View.width  ||
               reset ) {

            /*If the asteroids went off the bottom of the screen
             *they smashed into the planet, inc the dead counter
             *and if > everyone end the game.
             */
            if(this.position.y > View.height) {
              this.level.engineRef.globals.score += Utils.randomIntFromRange(70,1000000);
              if(this.level.engineRef.globals.score >= 7000000000) {
                this.level.engineRef.loadLevel("death");
              }
            }

            this.direction = Utils.toRadians(Utils.randomIntFromRange(70,90));
            this.speed = Utils.randomIntFromRange(1,3);
            scaleX = Math.cos(this.direction);
            scaleY = Math.sin(this.direction);

            //position at top edge
            //TODO: re-work to come from any edge
            this.position.y = 0;
            this.position.x = Utils.randomIntFromRange(0, View.width);
            this.speed      = Utils.randomIntFromRange(1,3);
            this.velocity.x = 0;
            this.velocity.y = 0;

            this.width      = Utils.randomIntFromRange(6, 10);
            this.height     = Utils.randomIntFromRange(6, 10);
            this.rotation = 0;
          }

          //Update velocity
          this.velocity.x = (this.speed * scaleX);
          this.velocity.y = (this.speed * scaleY);

          //Move
          this.position.y += this.velocity.y;// * deltaTime;
          this.position.x += this.velocity.x;// * deltaTime;

          //Rotation
          this.rotation += this.rotateSpeed;

      };

    var asteroidReset = function() {
      this.direction  = Utils.toRadians(Utils.randomIntFromRange(70,90));
      this.speed      = Utils.randomIntFromRange(1,3);
      this.position.y = 0;
      this.position.x = Utils.randomIntFromRange(0, View.width);
      this.speed      = Utils.randomIntFromRange(1,3);
      this.velocity.x = 0;
      this.velocity.y = 0;
    };

    /*Make asteroidCount asteroids*/
    for(var i=0;i <= asteroidCount; i++) {

      asteroidArray[i] = new GameObject();

      /*This is the bahavior of each enemy it gets called each tick*/
      asteroidArray[i].behaviour = asteroidBehaviour;
      asteroidArray[i].onCollide = asteroidOnCollide;
      asteroidArray[i].reset     = asteroidReset;

      //TODO: Move this into an init()
      asteroidArray[i].sprite         = Cache.images["asteroid"];
      asteroidArray[i].direction      = Utils.toRadians(Utils.randomIntFromRange(70,90));
      asteroidArray[i].speed          = Utils.randomIntFromRange(1,2);
      asteroidArray[i].position.y     = Utils.randomIntFromRange(0,View.width);;
      asteroidArray[i].position.x     = Utils.randomIntFromRange(0,View.height);

      asteroidArray[i].width          = Utils.randomIntFromRange(6, 10);
      asteroidArray[i].height         = Utils.randomIntFromRange(6, 10);
      asteroidArray[i].canCollideWith = [playerName, bulletName];
      asteroidArray[i].name           = asteroidName;
      asteroidArray[i].rotateSpeed    = Utils.randomFloatFromRange(0.001,0.005);
      asteroidArray[i].setColliderRadius();

    }

    /*********************************************************************
     * Player
     *********************************************************************/
    var player = new GameObject();

    player.reset = function() {

        this.sprite = Cache.images["player"];
        this.isTempDead = false;
        this.position.x = View.height/2;
        this.position.y = View.height/2;
        this.lastTime = this.thisTime;

    };

    player.onCollide = function(collidingWith) {

        /* Did we just die by colliding with an asteroid?
         * And was it at least 1 second since the last collision?
         */
        if((collidingWith.name === asteroidName) &&
           ((this.thisTime - this.lastTime) >= 2)) {

          /*Make the ship explode and stop*/
          Sound.playOnce(Cache.sounds["player-explode"]);
          this.sprite = Cache.images["explosion"];
          this.isTempDead = true;
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.level.engineRef.globals.lives-=1;
          this.lastTime = this.thisTime;

          /*End game, reset this level and load the next one.*/
          if(this.level.engineRef.globals.lives <= 0) {
            this.level.engineRef.loadLevel("death");
          }

        }

    };

    player.behaviour = function(){

        /*Has n sconds passed since last check*/
        this.thisTime += Time.deltaTime();


        /*
         * Reset the sprite of the ship from explosion to ship
         * and place the ship back in the middle of the screen.
         */
        if(this.isTempDead && ((this.thisTime - this.lastTime) >= 0.5)) {

          /*Respawn the ship in the centre of the screen.*/
          this.sprite = Cache.images["player"];
          //this.speed = this.originalSpeed;
          this.isTempDead = false;
          this.position.x = View.height/2;
          this.position.y = View.height/2;
          this.lastTime = this.thisTime;

        }

        if(Key.isDown(Key.UP)){
          this.applyThrust = true;
        }else{
          this.applyThrust = false;
        }

        if(Key.isDown(Key.LEFT)){
          this.rotation += this.turnSpeed * -1;
        }

        if(Key.isDown(Key.RIGHT)){
          this.rotation += this.turnSpeed * 1;
        }

        /*Only allow the player to fire every second*/
        if(Key.isDown(Key.SPACE) && ((this.thisTime - this.lastTime) >= 0.5)){

          this.lastTime = this.thisTime;

          //TODO: Find a better way to do this
          Sound.playOnce(Cache.sounds["lazer"]);

        /*********************************************************
         * Bullet
         *********************************************************/
          var bullet = new GameObject();
          bullet.behaviour = function(){

            this.velocity.x += Math.cos((this.rotation/Math.PI*180)) * this.speed;
            this.velocity.y += Math.sin((this.rotation/Math.PI*180)) * this.speed;
            this.position.x -= this.velocity.x;
            this.position.y -= this.velocity.y;

            /*Delete bullet if goes off screen*/
            if (this.position.x >= View.height ||
                this.position.x <= 0 ||
                this.position.y >= View.width ||
                this.position.y <= 0 ) {

                this.die();

            }

          }

          /*Delete bullet if it collides with asteroid*/
          bullet.onCollide = function(collidingWith) {

            if(collidingWith.name === asteroidName) {
              this.die();
            }
          }

          bullet.width = 5;
          bullet.height = 5;
          bullet.position.x = this.position.x;
          bullet.position.y = this.position.y;
          bullet.rotation   = this.rotation;
          bullet.velocity.x = this.velocity.x;
          bullet.velocity.y = this.velocity.y;
          bullet.sprite = Cache.images["bullet"];
          bullet.sprite.width  = bullet.width;
          bullet.sprite.height = bullet.height;
          bullet.speed = this.speed + 0.2;
          bullet.canCollideWith = [asteroidName];
          bullet.name = bulletName;
          this.level.gameObjects.push(bullet);

        }

        /*Ship must stay inside the view*/
        if(this.position.x < this.width){
          this.position.x = View.width;
        }

        if(this.position.x > View.width){
          this.position.x = this.width;
        }

        if(this.position.y < this.height){
          this.position.y = View.height;
        }

        if(this.position.y > View.height){
          this.position.y = this.height;
        }

        if(!this.isTempDead) {

          /*Change the veolicity based on the rotation*/
          if(this.applyThrust){
            this.velocity.x += Math.cos((this.rotation/Math.PI*180)) * this.speed;
            this.velocity.y += Math.sin((this.rotation/Math.PI*180)) * this.speed;
          }

          /* apply friction */
          this.velocity.x *= 0.98;
          this.velocity.y *= 0.98;

          /* apply velocities */
          this.position.x -= this.velocity.x;
          this.position.y -= this.velocity.y;

        }
    };

    player.width = 10;
    player.height = 10;
    player.position.x = 250;
    player.position.y = 250;
    player.sprite = Cache.images["player"];
    player.sprite.width = player.width;
    player.sprite.height = player.height;
    player.applyThrust = false;
    player.speed = 0.1;
    player.turnSpeed = 0.0005;
    player.canCollideWith = [asteroidName];
    player.name = playerName;
    player.setColliderRadius();
    player.thisTime = 0;
    player.lastTime = 0;

    this.level.gameObjects = asteroidArray;
    this.level.gameObjects = this.level.gameObjects.concat(player)
    this.level.gameObjects = this.level.gameObjects.concat(scoreUI);
    this.level.gameObjects = this.level.gameObjects.concat(livesUI);
    this.level.gameObjects = this.level.gameObjects.concat(radioUI);


  },

};
MAIN.init();
