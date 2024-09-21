class Character {
	constructor(spriteImage,x,y) {
		this.sprite = spriteImage
		this.xAdjust = this.sprite.width/2;
		this.yAdjust = this.sprite.height/2;
		
		this.x = x;
		this.y = y;
		this.xSpeed = 0;
		this.ySpeed = 0;
		
		this.radius = 50;
	}
	
	async load() {
        return await this.loaded;
      }
	
	move(){
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		this.bounceIfOutOfBounds();
	}
	
	isWithinRadius(character){
		const dx = this.x - character.x;
		const dy = this.y - character.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance < 2*this.radius;
	}
	
	bounceIfOutOfBounds(){
		if (this.x-this.radius < 0) { 
			this.x = this.radius; this.xSpeed *= -1;
		}
		else if (this.x+this.radius > 512) {
			this.x = 512-this.radius; this.xSpeed *= -1;
		}
		
		if (this.y-this.radius < 0) { 
			this.y = this.radius; this.ySpeed *= -1;
		}
		else if (this.y+this.radius > 512) {
			this.y = 512-this.radius; this.ySpeed *= -1;
		}
	}

}

class Game {
  constructor(canvas,loader) {
    this.canvas = canvas.getContext("2d");
	this.controller = createController();
	this.gameOver = false;
	this.tickSpeed = 4;
	this.noOfTicks = 0;
	
	this.loader = loader;
	
	this.background = getRandom(loader.assets["backgrounds"]);
	
	this.player = new Character(getRandom(loader.assets["player"]),5,0);
	this.enemy = new Character(getRandom(loader.assets["enemy"]),390,400);
	
  }
  
  async start() {
	  // set game up to start
	  this.randomiseBackground();
	  this.setCharacterPositions();
	  this.canvas.drawImage(this.loader.assets["start"][0], 0, 0)
	  await this.sleep(1000)
	  
	  this.startLoop = setInterval(() => {
		  var skip = this.getPlayerMove(this.player);
		  if (skip) {
			clearInterval(this.startLoop); // Stop the game loop if game is over
			this.startGameLoop();
		  }
		}, this.tickSpeed);
  }
  
  async lostGame() {
	  // draw final page
	  this.canvas.drawImage(this.loader.assets["lose"][0], 0, 0)
	  this.canvas.font = "21px Garamond, serif"
	  this.canvas.fillStyle = "yellow";
	  this.canvas.fillText(fancyTimeFormat(this.getSecondsRun()),275,168); 
	  await this.sleep(2000)
	  
	  this.startLoop = setInterval(() => {
		  var skip = this.getPlayerMove(this.player);
		  if (skip) {
			clearInterval(this.startLoop); // Stop the game loop if game is over
			this.start();
		  }
		}, this.tickSpeed);
  }
  
  async startGameLoop() {
	  this.gameLoop = setInterval(() => {
		  this.gameTick();
		  if (this.gameOver) {
			clearInterval(this.gameLoop); // Stop the game loop if game is over
			this.lostGame()
		  }
		}, this.tickSpeed);
	  
  }
  
  refreshScreen(){
	  this.resetScreen();
	  
	  this.drawTimer();
	  // draw each sprite
	  this.drawPlayer();
	  this.drawEnemy();
  }
  
  gameTick(){
	  this.noOfTicks += 1;
	  // get character moves
	  this.getPlayerMove();
	  this.getEnemyMove();
	  
	  //detect collision
	  this.checkForCharacterCollisions();
	  
	  // move each player
	  this.player.move();
	  this.enemy.move();
	  
	  //draw scene 
	  this.refreshScreen()
  }
  
  drawCharacter(character){
	  var x = character.x-character.xAdjust;
	  var y = character.y-character.yAdjust
	  this.canvas.drawImage(character.sprite, x, y);
	  
  }
  
  drawPlayer(){ this.drawCharacter(this.player) }
  drawEnemy(){ this.drawCharacter(this.enemy) }
  
  drawTimer(){ 
	var totalSeconds = this.getSecondsRun()
	
	this.canvas.drawImage(loader.assets["clock"][0], 200, 0);
	this.canvas.font = "20px Arial"
	this.canvas.fillStyle = "red";
	this.canvas.fillText(fancyTimeFormat(totalSeconds),211,32); 
	
	}
	
	getSecondsRun(){
		var ticksPerSecond = 1000/this.tickSpeed;
		var totalSeconds = this.noOfTicks/ticksPerSecond
		return totalSeconds
	}
  
  resetScreen(){
	  this.canvas.drawImage(this.background, 0, 0)
  }
  
  randomiseBackground(){
	  this.background = getRandom(loader.assets["backgrounds"]);
  }
  
  setCharacterPositions(){
	  this.player = new Character(getRandom(loader.assets["player"]),5,0);
	  this.enemy = new Character(getRandom(loader.assets["enemy"]),390,400);
  }
  
  sleep(ms = 0) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  checkForCharacterCollisions(){
	this.gameOver = this.player.isWithinRadius(this.enemy);
  }
  
  getPlayerMove(){
	  return this.controller.movePlayer(this.player);
  }
  
  getEnemyMove(){
	  const speedMult = 0.00001;
	  
	  const dx = this.player.x - this.enemy.x; // Difference in x
	  const dy = this.player.y - this.enemy.y; // Difference in y
	  const distance = Math.sqrt(dx * dx + dy * dy);
	  
	  this.enemy.xSpeed += dx*speedMult
	  this.enemy.ySpeed += dy*speedMult
  }
  
}

class JoystickController{
	constructor() {
		this.joy = new JoyStick('gaming');
		var speedModifier = 0.02
		this.maxSpeed = 4
		
		this.directionToMovement = {"N":[0,-speedModifier],"NE":[speedModifier,-speedModifier],
								"E":[speedModifier,0],"SE":[speedModifier,speedModifier],
								"S":[0,speedModifier],"SW":[-speedModifier,speedModifier],
								"W":[-speedModifier,0],"NW":[-speedModifier,-speedModifier],
								"C":[0,0]}
	}
	
	movePlayer(player){
		var direction = this.joy.GetDir();
		var vector = this.directionToMovement[direction]
		
		player.xSpeed = this.accelerate(player.xSpeed, vector[0]);
		player.ySpeed = this.accelerate(player.ySpeed, vector[1]);
		
		return direction != "C";
	}
	
	accelerate(speed,modifier){
		return Math.max(-this.maxSpeed, Math.min(this.maxSpeed, speed + modifier));
	}

}
class KeyboardController{
	constructor() {
		// remove joystick
		document.getElementById("gaming").style.display ="none"
		
		this.keys = {}; // Object to track key states

		// Add event listeners for keydown and keyup
		window.addEventListener("keydown", (event) => {
		  this.keys[event.key] = true; // Mark key as pressed
		});
		window.addEventListener("keyup", (event) => {
		  this.keys[event.key] = false; // Mark key as released
		});
	}
	
	movePlayer(player){
		var speedModifier = 0.02
		var maxSpeed = 4
		var moved = false;
		if (this.keys['w']) {
		  moved = true;
		  player.ySpeed -= speedModifier
		  player.ySpeed = Math.max(player.ySpeed, -maxSpeed)
		}
		if (this.keys['s']) {
		  moved = true;
		  player.ySpeed += speedModifier
		  player.ySpeed = Math.min(player.ySpeed, maxSpeed)
		}
		if (this.keys['a']) {
		  moved = true;
		  player.xSpeed -= speedModifier
		  player.xSpeed = Math.max(player.xSpeed, -maxSpeed)
		}
		if (this.keys['d']) {
		  moved = true;
		  player.xSpeed += speedModifier
		  player.xSpeed = Math.min(player.xSpeed, maxSpeed)
		}
		return moved;
		
	}
	
}

function createController(){
	if (isMobile()){ return new JoystickController; }
	else { return new KeyboardController(); }
}

function fixCanvas(canvas,window){
	const context = canvas.getContext('2d');
			
	const screenWidth = window.innerWidth;
	const screenHeight = window.innerHeight;
	
	const canvasAspectRatio = canvas.width / canvas.height;
	const screenAspectRatio = screenWidth / screenHeight;
	
	if (screenAspectRatio > canvasAspectRatio) {
		// Screen is wider than the canvas aspect ratio, scale by height
		canvas.style.height = `${screenHeight}px`;
		canvas.style.width = `${screenHeight * canvasAspectRatio}px`;
	} else {
		// Screen is taller or equal in aspect ratio, scale by width
		canvas.style.width = `${screenWidth}px`;
		canvas.style.height = `${screenWidth / canvasAspectRatio}px`;
	}
	
	canvas.style.marginLeft = "auto";
	canvas.style.marginRight = "auto";
	
}

function getRandom(list){
	var item = list[Math.floor(Math.random()*list.length)];
	return item
}

function fancyTimeFormat(duration) {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs.toFixed(3);

  return ret;
}

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}