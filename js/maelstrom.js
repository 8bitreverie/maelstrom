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
  this.onCollide = function(collidingWith){}
  this.colliderRadius = 0;
  this.sprites = [];
  this.isGarbage = false;
  this.behaviour = undefined;
  this.reset = function(){};
  this.name = "";
  this.speed = 0.0;
  this.rotateSpeed = 0.01;
  this.direction = 0;
  this.level = null;
  this.isDead = false;
  this.isTempDead = false;
  this.age = 0;
  this.isUI = false;
  this.uiText = "";
}

GameObject.prototype.init = function(level) {
  this.level = level;
};

GameObject.prototype.setBehaviour = function(behaviour) {
  this.behavior = behaviour;
};

GameObject.prototype.update = function(myLevel) {

  /*Execute the game object behaviour*/
  this.behaviour(myLevel);

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

};

GameObject.prototype.setColliderRadius = function() {

  if(this.width > this.height) {
      this.colliderRadius = this.width;
  }else{
      this.colliderRadius = this.height;
  }

};

GameObject.prototype.die = function() {

  this.isDead = true;

};

/**********************************************
 * Utils class
 **********************************************/
var Utils = {

  toDegrees: function(angle) {
    return angle * (180/Math.PI);
  },

  toRadians: function(angle) {
    return angle * (Math.PI/180);
  },

  randomFloatFromRange: function(min, max) {
    return Math.random() * (max - min) + min;
  },

  randomIntFromRange: function (min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

};

/**********************************************
 *Level class
 **********************************************/
function Level(name) {

  this.name = name;
  this.isLoaded = false;
  this.backgroundImg = "";
  this.gameObjects = [];
  this.view = null;
  this.maxGarbage = 30;
  this.garbageCount = 0;
  this.engineRef = null;
  this.music = null;

}

Level.prototype.init = function(engineReference) {

  console.log( "Loading level " + this.name);
  this.engineRef = engineReference;
  this.view = View.context;

};

Level.prototype.garbageCollect = function() {

  this.gameObjects = this.gameObjects.filter(function(go){
    if(go.isDead) {
      delete go;
    }else{
      return go;
    }
  });

  this.garbageSize = 0;

}

/*When a new level is loaded, this calls the
 *gameObject reset function on all of the
 *existing level gameObjects
 */
Level.prototype.reset = function() {

  var i = 0, len = this.gameObjects.length;

  for (i=0; i < len; i++) {
    this.gameObjects[i].reset();
  }

}

Level.prototype.update = function() {

  var i = 0, len = this.gameObjects.length;
  var y = 0;
  var targetGameObject;
  var currentGameObject;
  var thisLevel = this;

  for (i=0; i < len; i++) {

    /*Ensure GO is bound to the level*/
    if(this.gameObjects[i].level === null) {
      this.gameObjects[i].level = thisLevel;
    }

    /*Update the game object state.*/
    this.gameObjects[i].update();

    if(this.gameObjects[i].isDead) {
      this.garbageCount++;
    }

    /*Check collisions*/
    for(y=0; y < this.gameObjects.length; y++) {

      if(i===y) /*cannot collide with self*/
        break;

      currentGameObject = this.gameObjects[i];

      if(currentGameObject.isUI)
        break;

      if(!currentGameObject.collides)
        break;

      targetGameObject = this.gameObjects[y];

      if(!targetGameObject.collides)
        break;

      if(currentGameObject.layer !== targetGameObject.layer)
        break;

      //Bug: Quadrant update/detection is not functioning correctly
      //if(currentGameObject.quadrant != targetGameObject.quadrant)
      //  break;

      if(currentGameObject.canCollideWith.indexOf(targetGameObject.name) < 0)
        break; /*can these gameobjects collide by name?*/

      /*The gameobjects can collide, do expensive detection now*/
      if(this.detectsCollisionBetween(currentGameObject,
                                      targetGameObject)){
           currentGameObject.onCollide(targetGameObject);
           targetGameObject.onCollide(currentGameObject);
      }

    }
  }

  /*Clean up "dead" game objects*/
  if( this.garbageCount >= this.maxGarbage ) {
    this.garbageCollect();
  }

};

Level.prototype.detectsCollisionBetween = function(gameObject1, gameObject2) {
  var dx = (gameObject1.position.x + gameObject1.colliderRadius) -
           (gameObject2.position.x + gameObject2.colliderRadius);


  var dy = (gameObject1.position.y + gameObject1.colliderRadius) -
           (gameObject2.position.y + gameObject2.colliderRadius);

  var distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < (gameObject1.colliderRadius + gameObject2.colliderRadius)) {
    return true;
  }else{
    return false;
  }
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

    if(!currentGameObject.isUI) {

      this.view.drawImage(currentGameObject.sprite,
                          -currentGameObject.width/2,
                          -currentGameObject.height/2,
                          currentGameObject.width,
                          currentGameObject.height);

    }else{

      this.view.fillText(currentGameObject.uiText,
                         currentGameObject.position.x,
                         currentGameObject.position.y);
    }

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

  /*Because these have to survive over level loads*/
  this.globals = {};

};

Maelstrom.prototype.init = function() {

  Sound.init();
  Time.init();
  View.init(this.viewWidth, this.viewHeight);
  this.currentLevel = 0;
  window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
  window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

};

Maelstrom.prototype.run= function() {

  var thisEngine = this;
  console.log("Starting engine...");

  thisEngine.init();

  /*initialize the levels*/
  this.levelArray.forEach(
    function initializeLevels(level) { level.init(thisEngine); }
  );

  this.loadLevel(this.levelArray[0].name);

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
 * This method handles loading new levels. This looks
 * like a screen transition to the player.
 */
Maelstrom.prototype.loadLevel = function(name) {

  /*Call reset on the gameobjects in the current loaded level*/
  this.levelArray[this.currentLevel].reset();

  var oldMusic = this.levelArray[this.currentLevel].music;

  if(Sound.isPlaying(oldMusic)) {
    Sound.stopLoop(oldMusic);
  }

  /*Change the running level*/
  this.currentLevel = this.getLevelIndexFromName(name);

  Sound.playLoop(this.levelArray[this.currentLevel].music);

  if(this.currentLevel < 0) {
    console.log("Failed to find level " + name);
    throw "loadLevel Failed";
  }

};

Maelstrom.prototype.getLevelIndexFromName = function(name) {

  for(var i = 0; i < this.levelArray.length; i++) {
    if(this.levelArray[i].name === name) {
      return i;
    }
  }
  return -1;
}

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
  uiTextColor: "black",
  uiFont: "",

  init: function(width, height) {
    this.canvas = this.doc.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.wMidpoint = width/2;
    this.hMidpoint = height/2;
    this.context.font = this.uiFont;
    this.doc.body.appendChild(this.canvas);
  },

  setFont: function(fontName) {
    this.uiFont = fontName;
  },

};

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
  SPACE: 32,

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
 * Audio handlers go here
 * http://www.html5rocks.com/en/tutorials/webaudio/intro/
 */
var Sound = {
  context: null,
  bufferLoader: null,
  sounds: {},

  init: function() {
    this.context = new AudioContext();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  },

  stopLoop: function(name) {
    console.log("stopLoop: " + name);
    this.sounds[name].stop();
    this.sounds[name].isPlaying = false;
  },

  isPlaying: function(name) {
    if(!this.sounds[name]) {
      return false;
    }else{
      return this.sounds[name].isPlaying;
    }
  },

  pauseLoop: function(name) {
    this.sounds[name].pause();
    this.sounds[name].isPlaying = false;
  },

  playLoop: function(name) {
    console.log("playLoop: " + name);
    this._playSound(name, true);
  },

  printDetails: function(name) {
    if(!this.sounds[name]) {
      console.log(name+" is not buffered.");
    }else{
      console.log(this.sounds[name]);
    }
  },

  playOnce: function(name) {
    this._playSound(name, false);
  },

  _playSound: function (name, isLoop) {

    this.sounds[name] = this.context.createBufferSource();
    this._createBuffer(name,name);
    this.sounds[name].connect(this.context.destination);
    if(isLoop)
      this.sounds[name].loop = true;
    this.sounds[name].start(0);
    if(isLoop)
      this.sounds[name].isPlaying = true;

  },

  _createBuffer: function(url, name) {

    var soundBuffer = null;
    var onError = function(){};
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    var thisSoundEngine = this;

    // Decode asynchronously
    request.onload = function() {

      thisSoundEngine.context.decodeAudioData(request.response, function(buffer) {

        thisSoundEngine.sounds[name].buffer = buffer;

      }, onError);
    }
    request.send();
  },

  playWav: function(sound) {
        sound.load();
        sound.play();
        sound.currentTime=0;
  }

}

/*
 * Cache for holding game resources
 *
 */
var Cache = {

  loaded : false,
  sounds : {},
  images : {},

  isLoaded : function() {
    this.loaded = true;
  },

  loadSound: function(soundName, soundPath){
    this.sounds[soundName] = soundPath;
  },

  loadImage: function(imageName, imagePath) {
    this.images[imageName] = new Image();
    this.images[imageName].src = imagePath;
    this.images[imageName].onload = this.isLoaded();
    while(!this.loaded) { }
    console.log("Loaded image resource:" + imagePath);
    loaded = false;
  }

}

/* Buffer loader
 * http://www.html5rocks.com/en/tutorials/webaudio/intro/#toc-abstract
 */
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
