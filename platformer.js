// # Quintus platformer example
//
// [Run the example](../examples/platformer/index.html)
// WARNING: this game must be run from a non-file:// url
// as it loads a level json file.
//
// This is the example from the website homepage, it consists
// a simple, non-animated platformer with some enemies and a 
// target for the player.
window.addEventListener("load",function() {

// Set up an instance of the Quintus engine  and include
// the Sprites, Scenes, Input and 2D module. The 2D module
// includes the `TileLayer` class as well as the `2d` componet.

// ({ imagePath: "/assets/images/" });
// imagePath: "images/",
// audioPath: "audio/",
// dataPath:  "data/",

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        // Maximize this game to whatever the size of the browser is
        .setup({ maximize: true })
        // And turn on default input controls and touch input (for UI)
        .controls().touch()

Q.LEFT = 'left';
Q.RIGHT= 'right';
Q.LEFT_DIR = 1;
Q.RIGHT_DIR= -1;
Q.PLR = SPRITE_DATA.player;
Q.NME = SPRITE_DATA.enemy;
Q.DIES_IN_VOID = 'diesInVoid';
Q.frames = function (str) {
	var arr = [],
		words = str.split(','),
		word,
		range;

	//Add individual number strings, and break down number ranges
	for (var w=0; w < words.length; w++) {
		word = words[w];
		range = word.split('-');
		if (range.length == 2) {
			if ( range[0] <= range[1]) {
				for (var r = parseInt(range[0]); r <= parseInt(range[1]); r++) 	arr.push(r);
			} else {
				for (var r = parseInt(range[0]); r >= parseInt(range[1]); r--) arr.push(r);
			}
		} else {
			arr.push(parseInt(word));
		}
	}
	console.log('frames', str, arr)
	return arr;
};
		
		

Q.Sprite.extend('SmarterSprite', {
	init: function(props,defaultProps) {
		this._super(Q._extend({
        	vx: 0,
        	vy: 0,
        	ax: 0,
        	ay: 0,
			smarterSpriteFlags:[]
      },props),defaultProps);
		this.add('animation, 2d');
	},

	step: function (dt) {
		if(this.p.direction == Q.LEFT)
            this.p.flip = 'x';
        else /*if(this.p.direction == Q.RIGHT)*/ 
            this.p.flip = false;                    
		this.setAnimation();
		this.doFlags();
	},
	
	doFlags: function () {
		var p = this.p,
			flags = p.smarterSpriteFlags;
	
		if (flags.indexOf(Q.DIES_IN_VOID) != -1) {
			if (p.y > 1000) {
				this.destroy();
				Q.stageScene("endGame",1, { label: "You fell into the void" });
			}
		}
	},
	setAnimation: function () {
	
		if (this.p.vy < 0 && this.animation != 'jumpup') 
			this.play('jumpup');
		else if (Math.abs(this.p.vy) > 0 && this.animation != 'jumpdn')
			this.play('jumpdn');
		else if (this.p.vx == 0 && this.animation != 'idle') 
			this.play('idle');
		else if (Math.abs(this.p.vx) > 0 && this.animation != 'run')
			this.play('run');
		
	}
});

Q.SmarterSprite.extend( 'Player', {
	init: function (p) {
		this._super(p, {
			sprite: 'player',
			sheet: 'player'
		});
		this.p.smarterSpriteFlags.push( Q.DIES_IN_VOID);
		this.add('2d, platformerControls');
		this.on('hit', this, 'collision');
		Q.input.on("action",this,"doAction");
		this.play('idle');
	},
	
	doAction: function ()  {
		//Test if Touching...
	},
	
	collision: function (col) {
		var maxCol = 3, collided = false;
		this.p.hit = false;
		while((collided = this.stage.search(this)) && maxCol > 0) {
			if(collided) {
				this.p.hit = true;
				this.p.x -= collided.separate[0];
				this.p.y -= collided.separate[1];
			}
			maxCol--;
		}
	},
	
	step: function (dt) {
		this._super(dt);
		this.stage.collide(this);
	}
});

// ## Spawner
Q.Sprite.extend('Spawner', {
	init: function (p) {
		this._super();
	},
	step: function (p) {
		if (Math.random() * 100 < 1) {
			this.stage.insert(new Q.Enemy({ x: Math.random() *1000, y: -200 }));
		}
	}
	
});

// ## Tower Sprite
// Sprites can be simple, the Tower sprite just sets a custom sprite sheet
Q.Sprite.extend("Tower", {
  init: function(p) {
    this._super(p, { sheet: 'tower' });
  }
});

// ## Enemy Sprite
// Create the Enemy class to add in some baddies
Q.SmarterSprite.extend("Enemy",{
  init: function(p) {
    this._super(p, { sheet: 'enemy', sprite:'enemy', vx: 100 });
	this.p.vx = 100;
	this.p.smarterSpriteFlags.push( Q.DIES_IN_VOID);
    this.add('2d, aiBounce');
    this.on("bump.left,bump.right,bump.bottom",function(collision) {
      if(collision.obj.isA("Player")) { 
        Q.stageScene("endGame",1, { label: "You bumped into enemy" }); 
        collision.obj.destroy();
      }
    });
    this.on("bump.top",function(collision) {
      if(collision.obj.isA("Player")) { 
        this.destroy();
        collision.obj.p.vy = -300;
      }
    });
  }
});

// ## Level1 scene
// Create a new scene called level 1
Q.scene("level1",function(stage) {

  // Add in a repeater for a little parallax action
  stage.insert(new Q.Repeater({ asset: "background-wall.png", speedX: 0.5, speedY: 0.5 }));

  // Add in a tile layer, and make it the collision layer
  stage.collisionLayer(new Q.TileLayer({
                             dataAsset: 'level.tmx', //level.json
                             sheet:     'tiles' })); //png image


var spawner = stage.insert(new Q.Spawner());

  // Create the player and add them to the stage
  var player = stage.insert(new Q.Player({x:300}));

  // Give the stage a moveable viewport and tell it
  // to follow the player.
  stage.add("viewport").follow(player);

  // Add in a couple of enemies
  stage.insert(new Q.Enemy({ x: 700, y: 0 }));
  stage.insert(new Q.Enemy({ x: 800, y: 0 }));

  // Finally add in the tower goal
  stage.insert(new Q.Tower({ x: 180, y: 50 }));
});

// To display a game over / game won popup box, 
// create a endGame scene that takes in a `label` option
// to control the displayed message.
Q.scene('endGame',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label: "Play Again" }))         
  var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                   label: stage.options.label }));
  // When the button is clicked, clear all the stages
  // and restart the game.
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  });

  // Expand the container to visibily fit it's contents
  // (with a padding of 20 pixels)
  container.fit(20);
});

// ## Asset Loading and Game Launch
// Q.load can be called at any time to load additional assets
// assets that are already loaded will be skipped
// The callback will be triggered when everything is loaded
Q.load(['sprites.png', 'sprites.json', 'level.tmx', 'tiles.png', 'background-wall.png', 'braid.png', Q.PLR.file, Q.NME.file].join(', '), function() {
	Q.compileSheets("sprites.png","sprites.json");
	Q.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
	Q.sheet('enemy', Q.NME.file, { tilew: Q.NME.tilew, tileh: Q.NME.tileh });
	Q.sheet('player', Q.PLR.file, { tilew: Q.PLR.tilew, tileh: Q.PLR.tileh });
	Q.animations('player', {
		run: {frames: Q.frames(Q.PLR.run), rate: 1/15},
		idle: {frames: Q.frames(Q.PLR.idle)},
		jumpup: {frames: Q.frames(Q.PLR.jumpup)},
		jumpdn: {frames: Q.frames(Q.PLR.jumpdn)}
	});
	
	Q.animations('enemy', {
		run: {frames: Q.frames(Q.NME.run), rate: 1/15},
		idle: {frames: Q.frames(Q.NME.idle)},
		jumpup: {frames: Q.frames(Q.NME.jumpup)},
		jumpdn: {frames: Q.frames(Q.NME.jumpdn)}
	});
	
	Q.stageScene("level1");
});


});
