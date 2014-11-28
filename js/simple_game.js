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

    enemiesArray[i].behaviour = function(){

        var deltaTime = Time.deltaTime();

        if ( this.position.y > View.height) {
          this.position.y = randomIntFromRange(0, View.height);
          this.position.x = randomIntFromRange(0, View.width);
          this.velocity.y = randomIntFromRange(0.1, 5);
          this.width      = randomIntFromRange(2, 10);
          this.height     = randomIntFromRange(2, 10);
        }

        var gravity = randomIntFromRange(0.1, 5);

        this.position.y += this.velocity.y * deltaTime;
        this.velocity.y += gravity;

    }

    enemiesArray[i].width      = randomIntFromRange(1, 10);
    enemiesArray[i].height     = randomIntFromRange(1, 10);
    enemiesArray[i].position.x = randomIntFromRange(0, screenWidth);
    enemiesArray[i].position.y = 0;
    enemiesArray[i].velocity.x = 0;
    enemiesArray[i].velocity.y = randomIntFromRange(0.1, 5);
    enemiesArray[i].sprite     = new Image();
    enemiesArray[i].sprite.src = 'sprites/enemy.bmp';
  }

  /* Create a player */
  var player = new GameObject();
  player.behaviour = function(){

      var deltaTime = Time.deltaTime();
      var playerVelocity = 200 * deltaTime;

      if (Key.isDown(Key.UP)) {
        if(this.position.y > 0.0 ) {
          this.position.y -= 1 * playerVelocity;
        }
      }

      if (Key.isDown(Key.LEFT)) {
        if(this.position.x > 0.0) {
          this.position.x -= 1 * playerVelocity;
        }
      }

      if (Key.isDown(Key.DOWN)) {
        if(this.position.y < (View.height - this.height)){
          this.position.y += 1 * playerVelocity;
        }
      }

      if (Key.isDown(Key.RIGHT)) {
        if(this.position.x < (View.width - this.width)) {
          this.position.x += 1 * playerVelocity;
        }
      }
  };
  player.width = 20;
  player.height = 20;
  player.sprite = new Image(player.width, player.height);
  player.sprite.src = 'sprites/player.bmp';

  firstLevel.gameObjects = enemiesArray.concat(player);
  secondLevel.gameObjects = [];

  /* Construct and run the game engine */
  var myEngine = new Maelstrom(levelArray, screenWidth, screenHeight);
  myEngine.run();

})();
