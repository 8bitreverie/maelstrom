/**********************************************
 *GameObject class
 **********************************************/
function GameObject () {
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.width = 0;
  this.height = 0;
  this.angle = 0;
  this.quadrant = 0;
  this.layer = 0
  this.collides = true;
  this.collidingWith = [];
  this.sprites = [];
  this.isGarbage = false;
  this.behaviour = undefined;
  this.name = "";
}

GameObject.prototype.setBehaviour = function(behaviour) {
  this.behavior = behaviour;
};

GameObject.prototype.update = function() {
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

  for (i, len; i < len; i++) {
    this.gameObjects[i].update();
  }

};

Level.prototype.render = function() {

  var currentGameObject;
  var i = 0, len = this.gameObjects.length;

  for (i, len; i < len; i++) {

    currentGameObject = this.gameObjects[i];

    this.view.drawImage(currentGameObject.sprite,
                        currentGameObject.x,
                        currentGameObject.y,
                        currentGameObject.width,
                        currentGameObject.height);
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

  View.init(this.viewWidth, this.viewHeight);
  window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
  window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

};

Maelstrom.prototype.run= function() {

  var thisEngine = this;

  console.log("Starting engine...");

  thisEngine.init();

  this.levelArray[this.currentLevel].init();

  function gameLoop() {

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
  init: function(width, height) {
    this.canvas = this.doc.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
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

/*
 * Audio goes here
 */
