"use strict"
var c;
var ctx;
var pause = false;
var fps = 60;
var gameTimer = undefined;
var loading = false;

var allGameOver = false;

var player;

var ast = [];

var scoreMan;
var roundMan;

const minHeight = 500;
const minWidth = 500;

window.onload = function(){

  c = document.getElementById("canvas");
  ctx = c.getContext("2d");

  c.width = window.innerWidth;
  c.height = window.innerHeight;

  player = new Player("White", 0);
  scoreMan = new ScoreManager();
  roundMan = new RoundManager();



  (function(){

    var onEachFrame;

    if(window.requestAnimationFrame != undefined){

      onEachFrame = function(cb){

        var _cb = function(){
          if(!pause){
            cb();
            window.requestAnimationFrame(_cb);
          }
        }
        _cb();

      }

    } else if(window.mozRequestAnimationFrame != undefined){

      onEachFrame = function(cb){

        var _cb = function(){
          if(!pause){
            cb();
            window.mozRequestAnimationFrame(_cb);
          }
        }
        _cb();

      }

    } else {

      onEachFrame = function(cb){

        var _cb = function(){
          gameTimer = setInterval(cb, 1000 / fps);
        }
        _cb();

      }

    }

    window.onEachFrame = onEachFrame;
  })();
  window.onEachFrame(update);

}

window.onkeyup = function(e){

  if(e.code == "ArrowUp" || e.code == "Space" || e.code == "ArrowLeft" || e.code == "ArrowRight" || e.code == "ArrowDown"){
    if(player != undefined){
      if(!loading){
        player.updateDir(e.code, false);
      }
    }
  }

}

window.onkeydown = function(e){

  if(e.code == "ArrowUp" || e.code == "Space" || e.code == "ArrowLeft" || e.code == "ArrowRight" || e.code == "ArrowDown"){
    if(player != undefined){
      if(!loading){
        player.updateDir(e.code, true);
      }
    }
  }

  if(!loading){
    if(e.key == "Escape"){
      if(pause){
        update();
        pause = false;
        window.onEachFrame(update);
      } else {
        pause = true;
        if(gameTimer != undefined){
          clearInterval(gameTimer);
        }
      }
    }
  }

}

function updateAll(){

  roundMan.update();
  player.update();

  for(var i = 0; i < player.lasers.length; i++){
    player.lasers[i].update();
  }

  for(var i = 0; i < ast.length; i++){
    ast[i].update();
  }

  scoreMan.update();

}
function renderAll(){

  player.render();
  for(var i = 0; i < player.lasers.length; i++){
    player.lasers[i].render();
  }

  for(var i = 0; i < ast.length; i++){
    ast[i].render();
  }

  scoreMan.render();
  roundMan.render();

}
var update = (function(){

  var loops = 0;
  var fpsTicks = 1000 / fps;
  var maxFpsSkip = 100;
  var nextGameTick = Date.now();

  return function(){

    loops = 0;

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    if(c.width < minWidth){
      c.width = minWidth;
    }
    if(c.height < minHeight){
      c.height = minHeight;
    }

    if(!pause){

      while(Date.now() > nextGameTick && loops < maxFpsSkip){

        // Updating
        updateAll();

        nextGameTick += fpsTicks;
        loops++;

        loading = true;

      }

      if(Date.now() < nextGameTick){
        loading = false;
      }

    } else {

      nextGameTick = Date.now();

    }

    // Rendering
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, c.width, c.height);
    renderAll();

  }

})();

/***
 *    $$$$$$$\  $$\
 *    $$  __$$\ $$ |
 *    $$ |  $$ |$$ | $$$$$$\  $$\   $$\  $$$$$$\   $$$$$$\
 *    $$$$$$$  |$$ | \____$$\ $$ |  $$ |$$  __$$\ $$  __$$\
 *    $$  ____/ $$ | $$$$$$$ |$$ |  $$ |$$$$$$$$ |$$ |  \__|
 *    $$ |      $$ |$$  __$$ |$$ |  $$ |$$   ____|$$ |
 *    $$ |      $$ |\$$$$$$$ |\$$$$$$$ |\$$$$$$$\ $$ |
 *    \__|      \__| \_______| \____$$ | \_______|\__|
 *                            $$\   $$ |
 *                            \$$$$$$  |
 *                             \______/
 */

var minimalDistance = 200;

/**
 * @method Making the laser
 */
function makeLaser(id){
  player.lasers.push(new Laser(player.pos, player.heading, player.height, player.lasers.length, id));
}

/**
 * @method Changing the isShooting variable
 */
function changeIsShooting(){
  player.isShooting = false;
}

function findPlayerArray(pos){
  for(var i = 0; i < player.length; i++){
    if(pos.x == player[i].pos.x && pos.y == player[i].pos.y){
      return i;
    }
  }
}

/**
 * @method Respawns the player
 */
function resetPlayer(respawn/*, pos*/){

  // var index = findPlayerArray(pos);
  var done = false;

  // for(var i = 0; i < ast.length; i++){
  //
  //   if(Math.distance(player[index].pos.x, player[index].pos.y, ast[i].pos.x, ast[i].pos.y) <= minimalDistance){
  //
  //     player[index].crashed = false;
  //     player[index].pos = Math.createVector(respawn.pos.x, respawn.pos.y);
  //     player[index].vel = Math.createVector(respawn.vel.x, respawn.vel.y);
  //     player[index].heading = respawn.heading;
  //     player[index].lasers = [];
  //     player[index].respawn.lifeFrame = false;
  //     player[index].curAlpha = 1;
  //     player[index].needRespawn = false;
  //     player[index].respawn.curLaserC = 0;
  //     player[index].shooting = false;
  //     player[index].shootingDelayB = false;
  //     player[index].shootingDelayFrame = 0;
  //     done = true;
  //     break;
  //   }
  //
  // }

  for(var i = 0; i < ast.length; i++){

    if(Math.distance(respawn.pos.x, respawn.pos.y, ast[i].pos.x, ast[i].pos.y) <= minimalDistance){

      player.needRespawn = true;

      done = true;
    }

  }

  if(!done){

    player.crashed = false;
    player.pos = Math.createVector(respawn.pos.x, respawn.pos.y);
    player.vel = Math.createVector(respawn.vel.x, respawn.vel.y);
    player.heading = respawn.heading;
    player.lasers = [];
    player.respawn.lifeFrame = 0;
    player.respawn.curLaserC = 0;
    player.shooting = false;
    player.curAlpha = 1;
    player.needRespawn = false;
    player.shootingDelayB = false;
    player.shootingDelayFrame = 0;

  }

}

/***
 *    $$\
 *    $$ |
 *    $$ |      $$$$$$\   $$$$$$$\  $$$$$$\   $$$$$$\
 *    $$ |      \____$$\ $$  _____|$$  __$$\ $$  __$$\
 *    $$ |      $$$$$$$ |\$$$$$$\  $$$$$$$$ |$$ |  \__|
 *    $$ |     $$  __$$ | \____$$\ $$   ____|$$ |
 *    $$$$$$$$\\$$$$$$$ |$$$$$$$  |\$$$$$$$\ $$ |
 *    \________|\_______|\_______/  \_______|\__|
 */

/**
 * @method Removes the laser from the lasers array
 */
function deleteLaser(id){
  player.lasers.splice(id, 1);
  for(var i = 0; i < player.lasers.length; i++){
    player.lasers[i].updateId(id);
  }
}


/***
 *     $$$$$$\              $$\                                   $$\       $$\
 *    $$  __$$\             $$ |                                  \__|      $$ |
 *    $$ /  $$ | $$$$$$$\ $$$$$$\    $$$$$$\   $$$$$$\   $$$$$$\  $$\  $$$$$$$ |
 *    $$$$$$$$ |$$  _____|\_$$  _|  $$  __$$\ $$  __$$\ $$  __$$\ $$ |$$  __$$ |
 *    $$  __$$ |\$$$$$$\    $$ |    $$$$$$$$ |$$ |  \__|$$ /  $$ |$$ |$$ /  $$ |
 *    $$ |  $$ | \____$$\   $$ |$$\ $$   ____|$$ |      $$ |  $$ |$$ |$$ |  $$ |
 *    $$ |  $$ |$$$$$$$  |  \$$$$  |\$$$$$$$\ $$ |      \$$$$$$  |$$ |\$$$$$$$ |
 *    \__|  \__|\_______/    \____/  \_______|\__|       \______/ \__| \_______|
 */

var minRadius = 15;

/**
 * @method gets the index of the asteroid in the array
 * @return {Number} i Index
 */
function getAsteroid(pos){
  for(var i = 0; i < ast.length; i++){
    if(ast[i].pos.x == pos.x && ast[i].pos.y == pos.y){
      return i;
    }
  }
}

/**
 * @method Removes ths asteroid from the ast array
 */
function deleteAsteroid(i){
  ast.splice(i, 1);
}

/**
 * @method Makes asteroids and adds it to the ast array
 */
function makeAsteroid(pos){

  var index = getAsteroid(pos);
  var minRadi = ast[index].minRadius;
  var maxRadi = ast[index].maxRadius;
  deleteAsteroid(index);

  var off = 0.8;
  var temp = [];

  var times = Math.randomFloat(0, 1) <= 0.3 ? 3 : 2;

  for(var i = 0; i < times; i++){

    var maxR = Math.randomFloat(minRadi, maxRadi * off);
    var minR = Math.randomFloat(minRadius * off, minRadi);
    if(minR > minRadius){
      temp.push(new Asteroid(pos, minR, maxR));
    }

  }

  for(var i = 0; i < temp.length; i++){
    ast.push(temp[i]);
  }

}


function Asteroid(pos, minRad, maxRad, index){

  if(pos == undefined){
    this.pos = Math.createVector(c.width / 2, c.height / 2);
  } else {
    this.pos = {
      x: pos.x,
      y: pos.y
    };
  }

  this.crashed = false;

  this.minSpeed = 0.5;
  this.maxSpeed = 2;
  this.speed = Math.randomFloat(this.minSpeed, this.maxSpeed);

  this.heading = Math.randomFloat(0, Math.radians(360));

  if(minRad == undefined){
    this.minRadius = 25;
    this.maxRadius = 150;
  } else {
    this.minRadius = minRad;
    this.maxRadius = maxRad;
  }
  this.points = [];
  var addVal = Math.radians(45);
  for(var angle = 0; angle <= Math.PI * 2; angle += addVal){

    var dist = Math.randomFloat(this.minRadius, this.maxRadius);

    if(angle + addVal > Math.PI * 2){
      this.points.push({
        x: this.points[0].x,
        y: this.points[0].y
      });
    } else {
      this.points.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist
      });
    }

  }

  this.farPoints = {
    left: 0,
    right: 0,
    down: 0,
    up: 0
  };
  for(var i = 0; i < this.points.length; i++){

    // Right
    if(this.points[i].x > this.farPoints.right){
      this.farPoints.right = this.points[i].x;
    }

    // left
    if(this.points[i].x < this.farPoints.left){
      this.farPoints.left = Math.abs(this.points[i].x);
    }

    // Down
    if(this.points[i].y > this.farPoints.down){
      this.farPoints.down = this.points[i].y;
    }

    // Up
    if(this.points[i].y < this.farPoints.up){
      this.farPoints.up = Math.abs(this.points[i].y);
    }

  }

  this.render = function(){

    ctx.strokeStyle = "White";

    ctx.beginPath();
    for(var i = 0; i < this.points.length; i++){

      if(i == 0){
        ctx.moveTo(this.pos.x + this.points[i].x, this.pos.y + this.points[i].y);
      } else {
        ctx.lineTo(this.pos.x + this.points[i].x, this.pos.y + this.points[i].y);
      }

    }
    ctx.stroke();

  }

  this.checkOutWindow = function(){

    var offset = 1.25;

    if(this.pos.x - this.farPoints.right * offset > c.width){
      this.pos.x = 0 - this.farPoints.right;
    } else if(this.pos.x + this.farPoints.right < 0){
      this.pos.x = c.width + this.farPoints.right;
    }

    if(this.pos.y - this.farPoints.down * offset > c.height){
      this.pos.y = 0 - this.farPoints.down;
    } else if(this.pos.y + this.farPoints.down < 0){
      this.pos.y = c.height + this.farPoints.down * offset;
    }

  }

  this.checkCollision = function(target){

    for(var i = 0; i < this.points.length; i++){

      var point = {
        x: this.pos.x + this.points[i].x,
        y: this.pos.y + this.points[i].y
      };

      if(i + 1 == this.points.length){

        var nextPoint = {
          x: this.pos.x + this.points[0].x,
          y: this.pos.y + this.points[0].y
        };

      } else {

        var nextPoint = {
          x: this.pos.x + this.points[i + 1].x,
          y: this.pos.y + this.points[i + 1].y
        };

      }

      var angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
      var angleDist = 8;
      var dir = {
        x: Math.cos(angle) * angleDist,
        y: Math.sin(angle) * angleDist
      };

      var collDist = angleDist / 2;
      if(nextPoint.x > point.x){

        while(nextPoint.x > point.x){

          if(Math.distance(point.x, point.y, target.x, target.y) <= collDist){
            return true;
          }

          point.x += dir.x;
          point.y += dir.y;
        }

      } else {

        while(nextPoint.x < point.x){

          if(Math.distance(point.x, point.y, target.x, target.y) <= collDist){
            return true;
          }

          point.x += dir.x;
          point.y += dir.y;
        }

      }

    }

    return false;
  }

  this.updatePos = function(){

    this.checkOutWindow();

    var x = Math.cos(this.heading) * this.speed;
    var y = Math.sin(this.heading) * this.speed;

    this.pos.x += x;
    this.pos.y += y;

  }

  this.crashedF = function(){

  }

  this.update = function(){

    if(!this.crashed){
      this.updatePos();
    } else {
      makeAsteroid(this.pos);
    }

  }

}


function Laser(pos, heading, playerHeight, id, playerId){

  this.speed = 3;

  this.test = 0;

  this.playerId = playerId;
  this.id = id;

  this.heading = heading - Math.radians(90);

  this.height = 25;
  this.width = 2;

  this.lifeTime = 93; // In fames (It should be 1.5 sec)
  this.lifeFrame = 0;

  this.pos = Math.createVector(pos.x + Math.cos(this.heading) * playerHeight, pos.y + Math.sin(this.heading) * playerHeight);

  this.render = function(){

    ctx.save();

    ctx.strokeStyle = "White";
    ctx.lineWidth = this.width;

    ctx.beginPath();
    ctx.moveTo(this.pos.x, this.pos.y);
    ctx.lineTo(this.pos.x + Math.cos(this.heading) * this.height, this.pos.y + Math.sin(this.heading) * this.height);
    ctx.stroke();

    ctx.restore();

  }

  this.updatePos = function(){

    this.checkCollision();
    this.checkOutWindow();

    this.pos.x += Math.cos(this.heading) * this.speed;
    this.pos.y += Math.sin(this.heading) * this.speed;

  }

  this.updateId = function(id){

    for(var i = 0; i < player.lasers.length; i++){
      if(this.pos.x == player.lasers[i].pos.x && this.pos.y == player.lasers[i].pos.y){
        this.id = i;
        break;
      }
    }

  }

  this.timerDone = function(){
    deleteLaser(this.id);
  }

  this.checkOutWindow = function(){

    if(this.pos.x + this.height < 0){
      this.pos.x = c.width + this.height;
    } else if(this.pos.x - this.height > c.width){
      this.pos.x = 0 - this.height;
    }

    if(this.pos.y + this.height < 0){
      this.pos.y = c.height + this.height;
    } else if(this.pos.y - this.height > c.height){
      this.pos.y = 0 - this.height;
    }

  }

  this.checkCollision = function(){

    var point = {
      x: this.pos.x,
      y: this.pos.y
    };

    var nextPoint = {
      x: this.pos.x + Math.cos(this.heading) * this.height,
      y: this.pos.y + Math.sin(this.heading) * this.height
    };

    var angleDist = 2;
    var dir = {
      x: Math.cos(this.heading) * angleDist,
      y: Math.sin(this.heading) * angleDist
    };

    var coll = {
      state: false,
      index: undefined
    };

    if(nextPoint.x > point.x){

      while(nextPoint.x > point.x){

        for(var i = 0; i < ast.length; i++){

          if(ast[i].checkCollision(point)){
            coll.state = true;
            coll.index = i;
          }

        }

        if(coll.state){
          break;
        }

        point.x += dir.x;
        point.y += dir.y;
      }

    } else {

      while(nextPoint.x < point.x){

        for(var i = 0; i < ast.length; i++){

          if(ast[i].checkCollision(point)){
            coll.state = true;
            coll.index = i;
          }

        }

        if(coll.state){
          break;
        }

        point.x += dir.x;
        point.y += dir.y;
      }

    }

    if(coll.state){
      ast[coll.index].crashed = true;
      deleteLaser(this.id);

      scoreMan.updateScore(this.playerId, "hit");
    }

  }

  this.update = function(){

    if(this.lifeFrame >= this.lifeTime){
      this.timerDone();
    } else {

      this.updatePos();

      this.lifeFrame++;
    }

  }

}


function Player(color, id){

  this.pos = Math.createVector(c.width / 2, c.height / 2);

  this.id = id;

  this.dirs = Math.createDirections("2d");
  this.dirs.down = undefined;

  this.vel = Math.createVector(0, 0);
  this.deAcc = 0.98;
  this.speed = 0.3;

  this.heading = Math.radians(0);
  this.turnSpeed = Math.radians(3.5);

  this.height = 20;

  this.lasers = [];
  this.shooting = false;
  this.shootingLifeTime = 25; // In frames (Should be 400 ms)
  this.shootingFrame = this.shootingLifeTime;
  this.lasersC = 2;
  this.curLaserC = 0;
  this.shootingDelay = 50 // In frames (Should be 2.5 sec)
  this.shootingDelayFrame = 0;
  this.shootingDelayB = false;

  this.pointsAngle = [];

  this.needRespawn = false;
  this.deAlpha = 0.90;
  this.curAlpha = 1;
  this.crashed = false;
  this.respawn = {
    lifeTime: 62,  // In frames (Should be 1 sec)
    pos: Math.createVector(this.pos.x, this.pos.y),
    vel: Math.createVector(0, 0),
    heading: this.heading,
    lifeFrame: 0
  };

  this.color = color;

  this.updateDir = function(dir, b){

    if(dir == "ArrowUp"){
      this.dirs.up = b;
    } else if(dir == "Space" || dir == "ArrowDown"){
      if(!this.shooting){
        this.dirs.shoot = b;
      }
    } else if(dir == "ArrowLeft"){
      this.dirs.left = b;
    } else if(dir == "ArrowRight"){
      this.dirs.right = b;
    }

  }

  this.updatePos = function(){

    this.updateHeading();
    this.checkCollision();

    if(this.dirs.up){

      var x = Math.cos(this.heading - Math.radians(90)) * this.speed;
      var y = Math.sin(this.heading - Math.radians(90)) * this.speed;

      this.vel.x += x;
      this.vel.y += y;

    }

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.vel.x *= this.deAcc;
    this.vel.y *= this.deAcc;

    this.checkOutWindow();

  }

  this.checkOutWindow = function(){

    if(this.pos.x + this.height * 1.75 < 0){
      this.pos.x = c.width + this.height;
    } else if(this.pos.x - this.height * 1.75 > c.width){
      this.pos.x = 0 - this.height;
    }

    if(this.pos.y + this.height * 1.75 < 0){
      this.pos.y = c.height + this.height;
    } else if(this.pos.y - this.height * 1.75 > c.height){
      this.pos.y = 0 - this.height;
    }

  }

  this.updateHeading = function(){

    if(this.dirs.right){
      this.heading += this.turnSpeed;
    } else if(this.dirs.left){
      this.heading -= this.turnSpeed;
    }

  }

  this.updatePoints = function(){

    this.points = [
      {
        x: this.pos.x - this.height,
        y: this.pos.y + this.height
      },
      {
        x: this.pos.x + this.height,
        y: this.pos.y + this.height
      },
      {
        x: this.pos.x,
        y: this.pos.y - this.height
      }
    ];

  }

  this.updateShoot = function(){

    if(this.dirs.shoot){

      this.shooting = true;
      this.dirs.shoot = false;

    }

  }

  this.makeLaser = function(){

    if(this.curLaserC > this.lasersC){

      this.shootingFrame = this.shootingLifeTime;

      this.curLaserC = 0;

      this.shootingDelayB = true;

    } else {

      makeLaser(this.id);

      this.shootingFrame = 0;
      this.curLaserC++;

    }

  }

  this.checkCollision = function(){

    for(var i = 0; i < this.pointsAngle.length; i++){

      var point = {
        x: this.pos.x + this.pointsAngle[i].x,
        y: this.pos.y + this.pointsAngle[i].y
      };

      if(i + 1 == this.pointsAngle.length){

        var nextPoint = {
          x: this.pos.x + this.pointsAngle[0].x,
          y: this.pos.y + this.pointsAngle[0].y
        };

      } else {

        var nextPoint = {
          x: this.pos.x + this.pointsAngle[i + 1].x,
          y: this.pos.y + this.pointsAngle[i + 1].y
        };

      }

      var angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
      var angleDist = 2;
      var dir = {
        x: Math.cos(angle) * angleDist,
        y: Math.sin(angle) * angleDist
      };

      var done = false;
      if(nextPoint.x > point.x){

        while(nextPoint.x > point.x){

          for(var j = 0; j < ast.length; j++){

            if(ast[j].checkCollision(point)){
              this.gameOver();
              done = true;
              break;
            }

          }

          if(done){
            break;
          }

          point.x += dir.x;
          point.y += dir.y;
        }

      } else {

        while(nextPoint.x < point.x){

          for(var j = 0; j < ast.length; j++){

            if(ast[j].checkCollision(point)){
              this.gameOver();
              done = true;
              break;
            }

          }

          if(done){
            break;
          }

          point.x += dir.x;
          point.y += dir.y;
        }

      }

    }

  }

  this.gameOver = function(){

    if(!this.crashed){
      scoreMan.updateScore(this.id, "crush");
    }

    this.crashed = true;
  }

  this.renderCrash = function(){

    ctx.save();

    this.curAlpha *= this.deAlpha;
    ctx.globalAlpha = this.curAlpha;
    ctx.strokeStyle = this.color;

    ctx.beginPath();

    var x = this.pointsAngle[0].x + Math.cos(Math.radians(90) + this.heading) * this.respawn.lifeFrame;
    var y = this.pointsAngle[0].y + Math.sin(Math.radians(90) + this.heading) * this.respawn.lifeFrame;
    ctx.moveTo(this.pos.x + x, this.pos.y + y);

    x = this.pointsAngle[1].x + Math.cos(Math.radians(90) + this.heading) * this.respawn.lifeFrame;
    y = this.pointsAngle[1].y + Math.sin(Math.radians(90) + this.heading) * this.respawn.lifeFrame;
    ctx.lineTo(this.pos.x + x, this.pos.y + y);

    ctx.stroke();


    ctx.beginPath();

    x = this.pointsAngle[1].x + Math.cos(Math.radians(-60) + this.heading) * this.respawn.lifeFrame;
    y = this.pointsAngle[1].y + Math.sin(Math.radians(-60) + this.heading) * this.respawn.lifeFrame;
    ctx.moveTo(this.pos.x + x, this.pos.y + y);

    x = this.pointsAngle[2].x + Math.cos(Math.radians(-60) + this.heading) * this.respawn.lifeFrame;
    y = this.pointsAngle[2].y + Math.sin(Math.radians(-60) + this.heading) * this.respawn.lifeFrame;
    ctx.lineTo(this.pos.x + x, this.pos.y + y);

    ctx.stroke();


    ctx.beginPath();

    x = this.pointsAngle[2].x + Math.cos(Math.radians(-120) + this.heading) * this.respawn.lifeFrame;
    y = this.pointsAngle[2].y + Math.sin(Math.radians(-120) + this.heading) * this.respawn.lifeFrame;
    ctx.moveTo(this.pos.x + x, this.pos.y + y);

    x = this.pointsAngle[0].x + Math.cos(Math.radians(-120) + this.heading) * this.respawn.lifeFrame;
    y = this.pointsAngle[0].y + Math.sin(Math.radians(-120) + this.heading) * this.respawn.lifeFrame;
    ctx.lineTo(this.pos.x + x, this.pos.y + y);

    ctx.stroke();

    ctx.restore();
    ctx.globalAlpha = 1;

  }

  this.renderNormal = function(){

    for(var i = 0; i < this.points.length; i++){

      var angle = Math.atan2(this.points[i].y - this.pos.y, this.points[i].x - this.pos.x) + this.heading;

      this.pointsAngle[i] = {
        x: Math.cos(angle) * this.height,
        y: Math.sin(angle) * this.height
      };

    }

    ctx.strokeStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(this.pos.x + this.pointsAngle[0].x, this.pos.y + this.pointsAngle[0].y);
    ctx.lineTo(this.pos.x + this.pointsAngle[1].x, this.pos.y + this.pointsAngle[1].y);
    ctx.lineTo(this.pos.x + this.pointsAngle[2].x, this.pos.y + this.pointsAngle[2].y);
    ctx.lineTo(this.pos.x + this.pointsAngle[0].x, this.pos.y + this.pointsAngle[0].y);
    ctx.stroke();

  }

  this.render = function(){

    if(!this.crashed){
      this.renderNormal();
    } else {
      this.renderCrash();
    }

  }

  this.update = function(){

    if(!this.crashed){
      this.updatePoints();
      this.updateShoot();

      if(this.shooting){

        if(!this.shootingDelayB){

          this.shootingFrame++;

          if(this.shootingFrame >= this.shootingLifeTime){
            this.makeLaser();
          }

        } else {

          if(this.shootingDelayFrame >= this.shootingDelay){

            this.shooting = false;
            this.shootingDelayB = false;
            this.shootingDelayFrame = 0;

          } else {
            this.shootingDelayFrame++;
          }

        }

      }

      this.updatePos();
    } else {

      if(allGameOver){

        this.respawn.lifeFrame++;

      } else {

        if(this.respawn.lifeFrame >= this.respawn.lifeTime){
          resetPlayer(this.respawn);
        }

        this.respawn.lifeFrame++;

        if(this.needRespawn){
          resetPlayer(this.respawn);
        }

      }

    }

  }

}


function RoundManager(){

  this.astC = 4;

  this.round = 1;

  this.wait = 150;
  this.waitFrame = 0;

  this.str = "Round: ";

  this.startRound = function(){

    for(var i = 0; i < this.astC * this.round; i++){
      ast.push(new Asteroid(this.makePos()));
    }

  }

  this.makePos = function(){

    var randomF = Math.randomFloat(0, 1);

    var minOffset = 150 * (minWidth / c.width * 0.8);
    var maxOffset = 250 * (minHeight / c.height * 0.8);

    if(randomF <= 0.25){ // Up

      var position = Math.createVector(Math.randomFloat(0, c.width), 0 + Math.randomFloat(minOffset, maxOffset));

    } else if(randomF <= 0.5){ // Down

      var position = Math.createVector(Math.randomFloat(0, c.width), c.height - Math.randomFloat(minOffset, maxOffset));

    } else if(randomF <= 0.75){ // Left

      var position = Math.createVector(0 + Math.randomFloat(minOffset, maxOffset), Math.randomFloat(0, c.height));

    } else { // Right

      var position = Math.createVector(c.width - Math.randomFloat(minOffset, maxOffset), Math.randomFloat(0, c.height));

    }

    return position;
  }

  this.render = function(){

    ctx.font = "20px monospace";
    ctx.fillStyle = "White";

    var width = ctx.measureText(this.str + (this.round - 1).toString()).width;

    var pos = Math.createVector(c.width / 2 - width / 2, c.height / 20);

    ctx.fillText(this.str + (this.round - 1).toString(), pos.x, pos.y);

  }

  this.update = function(){

    if(ast[0] == undefined){

      if(this.round == 1){

        this.startRound();

        this.round++;

      } else {

        if(this.waitFrame >= this.wait){
          this.startRound();
          this.round++;
          this.waitFrame = 0;
        } else {
          this.waitFrame++;
        }

      }



    }

  }

}


function ScoreManager(){

  this.scores = [];

  this.scores = [{
    score: 0,
    lives: 3
  }];
  // for(var i = 0; i < player.length; i++){
  //   this.scores[i] = {
  //     score: 0,
  //     lives: 1
  //   };
  // }

  this.offset = 100;
  this.pos = [
    { // Player 1
      x: c.width / 20,
      y: c.height / 20
    },

    { // Player 2
      x: c.width - c.width / 20 - this.offset,
      y: c.height / 20
    },

    { // Player 3
      x: c.width / 20,
      y: c.height - c.height / 20
    },

    { // Player 4
      x: c.width - c.width / 20 - this.offset,
      y: c.height - c.height / 20
    }
  ];

  this.str = "Points: ";
  this.str1 = "Lives: ";

  this.height = 20;

  this.render = function(){

    ctx.font = "20px monospace";
    for(var i = 0; i < this.scores.length; i++){

      // ctx.fillStyle = player[i].color;
      ctx.fillStyle = "White";

      ctx.fillText(this.str + this.scores[i].score, this.pos[i].x, this.pos[i].y);
      ctx.fillText(this.str1 + this.scores[i].lives, this.pos[i].x, this.pos[i].y + this.height);

    }

    if(allGameOver){

      ctx.font = "20px monospace";

      var str = "Game Over";
      var width = ctx.measureText(str).width;

      ctx.fillText(str, c.width / 2 - width / 2, c.height / 2);

    }

  }

  this.update = function(){

    for(var i = 0; i < this.scores.length; i++){

      if(this.scores[i].lives != 0){
        allGameOver = false;
        break;
      }

      allGameOver = true;
    }

  }

  this.updateScore = function(play, state){

    if(state == "hit"){
      this.scores[play].score += 5;
    } else if(state == "crush"){
      this.scores[play].score -= 1;
      this.scores[play].lives--;
    }

  }

}
