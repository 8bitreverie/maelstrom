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

  function randomIntFromRange(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  /* Create some levels */
  var firstLevel  = new Level("main");
  var secondLevel = new Level("death");
  var levelArray = [firstLevel, secondLevel];

  /* Create n enemies */
  var enemyCount = screenWidth;
  var enemiesArray = new Array(enemyCount);

  for(var i=0;i <= enemyCount; i++) {

    enemiesArray[i] = new GameObject();

    enemiesArray[i].name = "enemy"+i;

    /*This is the bahavior of each enemy it gets called each tick*/
    enemiesArray[i].behaviour = function(){

        var scaleX = Math.cos(this.direction);
        var scaleY = Math.sin(this.direction);
        var deltaTime = Time.deltaTime();

        //Reset
        //When they go off the screen position them back on the screen
        if ( this.position.y > View.height ||
             this.position.x > View.width  ) {

          this.direction = toRadians(randomIntFromRange(70,90));
          this.speed = randomIntFromRange(1,10);
          scaleX = Math.cos(this.direction);
          scaleY = Math.sin(this.direction);

          //position at top edge
          //TODO: re-work to come from any edge
          this.position.y = 0;//randomIntFromRange(0, View.height);
          this.position.x = randomIntFromRange(0, View.width);
          this.speed      = randomIntFromRange(1,3);
          this.velocity.x = 0;
          this.velocity.y = 0;

          this.width      = randomIntFromRange(2, 10);
          this.height     = randomIntFromRange(2, 10);

        }

        //Update velocity
        this.velocity.x = (this.speed * scaleX);
        this.velocity.y = (this.speed * scaleY);

        //Move
        this.position.y += this.velocity.y;// * deltaTime;
        this.position.x += this.velocity.x;// * deltaTime;

        //Rotation
        this.rotation += (Math.PI*2)/60;

    }

    //TODO: Move this into an init()
    enemiesArray[i].sprite     = new Image();
    enemiesArray[i].sprite.src = 'sprites/enemy.bmp';
    enemiesArray[i].direction  = toRadians(randomIntFromRange(70,90));
    enemiesArray[i].speed      = randomIntFromRange(1,3);
    enemiesArray[i].position.y = 0;//randomIntFromRange(0, View.height);
    enemiesArray[i].position.x = randomIntFromRange(0, View.width);

    enemiesArray[i].width      = randomIntFromRange(2, 20);
    enemiesArray[i].height     = randomIntFromRange(2, 20);
  }

  /* Create a player */
  var player = new GameObject();
  player.behaviour = function(){

      var deltaTime = Time.deltaTime();

      if (Key.isDown(Key.UP)) {
        this.applyThrust = true;
      }else{
        this.applyThrust = false;
      }

      if (Key.isDown(Key.LEFT)) {
        this.rotation += this.turnSpeed * -1;
      }

      if (Key.isDown(Key.RIGHT)) {
        this.rotation += this.turnSpeed * 1;
      }

      /*Stay inside the view*/
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

      if(this.applyThrust){
        this.velocity.x += Math.cos((this.rotation/Math.PI*180)) * this.speed;
        this.velocity.y += Math.sin((this.rotation/Math.PI*180)) * this.speed;
      }

      // apply friction
      this.velocity.x *= 0.98;
      this.velocity.y *= 0.98;

      // apply velocities
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

  firstLevel.gameObjects = enemiesArray.concat(player);
  secondLevel.gameObjects = [];

  /* Construct and run the game engine */
  var myEngine = new Maelstrom(levelArray, screenWidth, screenHeight);
  myEngine.run();

})();
