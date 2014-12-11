/*
 * Execute the following anonymous function ()(); when this
 * script is loaded. This will create a closure to protect
 * some functions and variables from colliding with other
 * similarly named variables in the global scope.
 *
 * Then explicitly expose some of the functions to the window
 * object of the Browser Object Model (BOM).
 *
 * http://blogs.msdn.com/b/simonince/archive/2010/01/04/
 * closure-exposure-a-javascript-scope-trick.aspx
 * http://helephant.com/2008/10/17/javascript-closures/
 */
(function(){

  var screenWidth  = 512;
  var screenHeight = 512;

  function toDegrees(angle) {
    return angle * (180/Math.PI);
  }

  function toRadians(angle) {
    return angle * (Math.PI/180);
  }

  function randomFloatFromRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randomIntFromRange(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  /* Create some levels */
  var firstLevel  = new Level("main");
  var secondLevel = new Level("death");
  var levelArray  = [firstLevel, secondLevel];

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
    this.uiText = "Score: " + this.level.engineRef.globals.score;
  };
  scoreUI.isUI = true;
  scoreUI.position.x = 10;
  scoreUI.position.y = 10;

  /*********************************************************************
  * Lives
  ********************************************************************/
  var livesUI = new GameObject();
  livesUI.behaviour = function () {
    this.uiText = "Lives: " + this.level.engineRef.globals.lives;
  };
  livesUI.isUI = true;
  livesUI.position.x = 210;
  livesUI.position.y = 10;

  /*********************************************************************
   * Asteroids
   *********************************************************************/
  /* "this" parameter will point to the asteroid gameobject when
     the function is called */
  var asteroidBehaviour = function(){

        var scaleX = Math.cos(this.direction);
        var scaleY = Math.sin(this.direction);
        var deltaTime = Time.deltaTime();
        var reset = false;

        if(this.collidingWith === bulletName) {

          /*Update score and reset asteroid*/
          this.level.engineRef.globals.score++;
          this.collidingWith = "";
          reset = true;
        }

        //Reset
        //When they go off the screen position them back on the screen
        if ( this.position.y > View.height ||
             this.position.x > View.width  ||
             reset ) {

          this.direction = toRadians(randomIntFromRange(70,90));
          this.speed = randomIntFromRange(1,3);
          scaleX = Math.cos(this.direction);
          scaleY = Math.sin(this.direction);

          //position at top edge
          //TODO: re-work to come from any edge
          this.position.y = 0;
          this.position.x = randomIntFromRange(0, View.width);
          this.speed      = randomIntFromRange(1,3);
          this.velocity.x = 0;
          this.velocity.y = 0;

          this.width      = randomIntFromRange(6, 10);
          this.height     = randomIntFromRange(6, 10);
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

  /*Make asteroidCount asteroids*/
  for(var i=0;i <= asteroidCount; i++) {

    asteroidArray[i] = new GameObject();

    /*This is the bahavior of each enemy it gets called each tick*/
    asteroidArray[i].behaviour = asteroidBehaviour;

    //TODO: Move this into an init()
    asteroidArray[i].sprite         = new Image();
    asteroidArray[i].sprite.src     = 'sprites/enemy.bmp';
    asteroidArray[i].direction      = toRadians(randomIntFromRange(70,90));
    asteroidArray[i].speed          = randomIntFromRange(1,2);
    asteroidArray[i].position.y     = randomIntFromRange(0,screenHeight);;
    asteroidArray[i].position.x     = randomIntFromRange(0,screenWidth);

    asteroidArray[i].width          = randomIntFromRange(6, 10);
    asteroidArray[i].height         = randomIntFromRange(6, 10);
    asteroidArray[i].canCollideWith = [playerName, bulletName];
    asteroidArray[i].name           = asteroidName;
    asteroidArray[i].rotateSpeed    = randomFloatFromRange(0.001,0.005);
    asteroidArray[i].setColliderRadius();
  }

  /*********************************************************************
   * Player
   *********************************************************************/
  var player = new GameObject();
  player.behaviour = function(){

      /*Has n sconds passed since last check*/
      this.thisTime += Time.deltaTime();

      /*Did we just die by colliding with an asteroid?*/
      if((this.collidingWith === asteroidName) &&
         ((this.thisTime - this.lastTime) >= 1)) {

        this.lastTime = this.thisTime;
        this.level.engineRef.globals.lives-=1;
        this.collidingWith = "";

        if(this.level.engineRef.globals.lives == 0) {
          /*End game*/
          console.log("Load level goes here.");
          this.level.engineRef.LoadLevel("NAME");
        }

        /*Reset the position of the ship*/
        this.position.x = View.height/2;
        this.position.y = View.height/2;
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
      if(Key.isDown(Key.SPACE) && ((this.thisTime - this.lastTime) >= 1)){

        this.lastTime = this.thisTime;

      /*********************************************************
       * Bullet
       *********************************************************/
        var bullet = new GameObject();
        bullet.behaviour = function(){

          /*Delete bullet if it collides with asteroid*/
          if(this.collidingWith === asteroidName) {
            this.die();
          }

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

        bullet.width = 5;
        bullet.height = 5;
        bullet.position.x = this.position.x;
        bullet.position.y = this.position.y;
        bullet.rotation   = this.rotation;
        bullet.velocity.x = this.velocity.x;
        bullet.velocity.y = this.velocity.y;
        bullet.sprite = new Image(bullet.width, bullet.height);
        bullet.sprite.src = 'sprites/player.bmp';
        bullet.speed = this.speed + 0.2;;
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

  };

  player.width = 10;
  player.height = 10;
  player.position.x = 250;
  player.position.y = 250;
  player.sprite = new Image(player.width, player.height);
  player.sprite.src = 'sprites/player.bmp';
  player.applyThrust = false;
  player.speed = 0.1;
  player.turnSpeed = 0.0005;
  player.canCollideWith = [asteroidName];
  player.name = playerName;
  player.setColliderRadius();
  player.thisTime = 0;
  player.lastTime = 0;
  firstLevel.gameObjects = asteroidArray;
  firstLevel.gameObjects = firstLevel.gameObjects.concat(player)
  firstLevel.gameObjects = firstLevel.gameObjects.concat(scoreUI);
  firstLevel.gameObjects = firstLevel.gameObjects.concat(livesUI);
  secondLevel.gameObjects = [];

  /* Construct and run the game engine */
  var myEngine = new Maelstrom(levelArray, screenWidth, screenHeight);

  /*Configure some globals that will need to survive over levels*/
  myEngine.globals.score = 0;
  myEngine.globals.lives = 3;

  /*Start the engine running*/
  myEngine.run();

})();
