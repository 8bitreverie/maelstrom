/**********************************************
 *GameObject class
 **********************************************/
function GameObject () {
  this.position = {x:0, y:0};
  this.velocity = {x:0, y:0};
  this.width = 0.0;
  this.height = 0.0;
  this.rotation = 0; //TODO: rename this to rotation torque
  this.quadrant = 0;
  this.layer = 0;
  this.collides = true;
  this.canCollideWith = [];
  this.collidingWith = ""; //TODO: Make it capable of multicollision
  this.sprites = [];
  this.isGarbage = false;
  this.behaviour = undefined;
  this.init = function(){};
  this.name = "";
  this.speed = 0.0;
  this.rotateSpeed = 0.01;
  this.direction = 0;
}

GameObject.prototype.setBehaviour = function(behaviour) {
  this.behavior = behaviour;
};

GameObject.prototype.update = function() {

  /*Update the game object quadrant*/
  if(this.position.x > View.wMidpoint) { /*right*/

    if(this.position.y > View.hMidpoint){
      this.quadrant = 3;/*bottom*/
    }else{
      this.quadrant = 1;/*top*/
    }

  }else{ /*left*/

    if(this.position.y > View.hMidpoint) {
      this.quadrant = 2;/*bottom*/
    }else{
      this.quadrant = 0;/*top*/
    }
  }

  /*Execute the game object behaviour*/
  this.behaviour();

};

/**********************************************
 *Level class
 **********************************************/
function Level (name) {
  this.name = name;
  this.backgroundImg = "";
  this.gameObjects = [];
  this.view = null;
}

Level.prototype.init = function() {
  console.log( "Loading level " + this.name);
  this.view = View.context;
};

Level.prototype.update = function() {

  var i = 0, len = this.gameObjects.length;
  var y = 0;
  var targetGameObject;
  var currentGameObject;

  /*Check collisions*/
  for (i=0; i < len; i++) {

    for(y=0; y < len; y++) {

      if(i===y) /*cannot collide with self*/
        break;

      currentGameObject = this.gameObjects[i];

      if(!currentGameObject.collides)
        break;

      targetGameObject = this.gameObjects[y];

      if(!targetGameObject.collides)
        break;
      if(currentGameObject.layer !== targetGameObject.layer)
        break;
      if(currentGameObject.quadrant !== targetGameObject.quadrant)
        break;
      if(currentGameObject.canCollideWith.indexOf(targetGameObject.name) < 0)
        break; /*can these gameobjects collide by name?*/

      /*The gameobjects can collide, do expensive detection now*/
      if(this.detectsCollisionBetween(currentGameObject,
                                      targetGameObject)){

           currentGameObject.collidingWith = targetGameObject.name;
           targetGameObject.collidingWith  = currentGameObject.name;
        }

    }
  }

  /*Update game object state and behaviour*/
  for (i=0; i < len; i++) {
    this.gameObjects[i].update();
  }


};

Level.prototype.detectsCollisionBetween = function(gameObject1, gameObject2) {
  return true;
}

Level.prototype.render = function() {

  var currentGameObject;
  var i = 0, len = this.gameObjects.length;

  for (i, len; i < len; i++) {

    currentGameObject = this.gameObjects[i];

    this.view.save();

    this.view.translate(currentGameObject.position.x+currentGameObject.width/2,
                        currentGameObject.position.y+currentGameObject.height/2);

    //Yes, we have to rotate the entire view.
    this.view.rotate(currentGameObject.rotation/Math.PI*180);

    this.view.drawImage(currentGameObject.sprite,
                        -currentGameObject.width/2,
                        -currentGameObject.height/2,
                        currentGameObject.width,
                        currentGameObject.height);


    this.view.restore();
  }

};

/***********************************************
 * Engine class
 **********************************************/
function Maelstrom(levelArray, width, height) {

  this.viewWidth  = width ? width : 256 ;
  this.viewHeight = height ? height : 256;
  this.levelArray = levelArray;
  this.currentLevel = 0;

};

Maelstrom.prototype.init = function() {

  Time.init();
  View.init(this.viewWidth, this.viewHeight);
  Sound.load("sounds/test.mp3");
  window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
  window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

};

Maelstrom.prototype.run= function() {

  var thisEngine = this;

  console.log("Starting engine...");

  thisEngine.init();

  this.levelArray[this.currentLevel].init();

  function gameLoop() {

    Time.update();
    View.context.clearRect( 0, 0, View.canvas.width, View.canvas.height);
    thisEngine.levelArray[thisEngine.currentLevel].update();
    thisEngine.levelArray[thisEngine.currentLevel].render();

    requestAnimationFrame(gameLoop);

  }

  requestAnimationFrame(gameLoop);

  console.log("Ending engine...");


};

/*
 * A more intuitive abstraction for the canvas dom object
 */
var View = {
  doc: document,
  win: window,
  canvas: null,
  context: null,
  width: 0,
  height: 0,
  wMidpoint: 0,
  hMidpoint: 0,
  init: function(width, height) {
    this.canvas = this.doc.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.wMidpoint = width/2;
    this.hMidpoint = height/2;
    this.doc.body.appendChild(this.canvas);
  }
}

/*
 * Keyboard input class
 * http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
 */
var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

/* Use Date.now() because it is faster than new */
var Time = {

  _currentTime: 0,
  _lastTime: 0,
  _deltaTime: 0,
  _timeScale: 1000.0,

  init: function() {
    this._currentTime = Date.now();
    this._lastTime = this._currentTime;
  },

  update: function() {
    this._currentTime = Date.now();
    this._deltaTime = this._currentTime - this._lastTime;
    this._lastTime  = this._currentTime;
  },

  deltaTime: function() {
    return this._deltaTime/this._timeScale;
  }
};

/*
 * Audio goes here
 * http://www.html5rocks.com/en/tutorials/webaudio/intro/
 * TODO: Refactor this, choose where the sound stuff should go
 */
var Sound = {
  load: function(url) {
    var soundBuffer = null;

    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var onError = function(){};
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        var source    = context.createBufferSource(); // creates a sound source
        source.buffer = buffer;                       // tell the source which sound to play
        source.loop = true;
        source.connect(context.destination);          // connect the source to the context's destination
        source.start(0);                              // play the source now
      }, onError);
    }
    request.send();
  }

}
