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

        if ( this.y > View.height) {
          this.y = randomIntFromRange(0, 20);
          this.x = randomIntFromRange(0, View.width);
          this.vy = 0;
          this.width  = randomIntFromRange(2, 10);
          this.height = randomIntFromRange(2, 10);
        }

        var gravity = randomIntFromRange(0, .03);

        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;

    }

    enemiesArray[i].width  = randomIntFromRange(1, 10);
    enemiesArray[i].height = randomIntFromRange(1, 10);
    enemiesArray[i].x = randomIntFromRange(0, screenWidth);
    enemiesArray[i].y = 0;
    enemiesArray[i].vx = .01;
    enemiesArray[i].vy = -.01;
    enemiesArray[i].sprite = new Image();
    enemiesArray[i].sprite.src = 'sprites/enemy.bmp';
  }

  /* Create a player */
  var player = new GameObject();
  player.behaviour = function(){

      if (Key.isDown(Key.UP)) {
        if(this.y > 0 ) this.y--;
      }

      if (Key.isDown(Key.LEFT)) {
        if(this.x > 0) this.x--;
      }

      if (Key.isDown(Key.DOWN)) {
        if(this.y < (View.height - this.height)) this.y++;
      }

      if (Key.isDown(Key.RIGHT)) {
        if(this.x < (View.width - this.width)) this.x++;
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
