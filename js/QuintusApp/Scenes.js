// ## Level1 scene
// Create a new scene called level 1
Q.scene("level1", function(stage) {

	// Add in a repeater for a little parallax action
	stage.insert(new Q.Repeater({
		asset: "background-wall.png",
		speedX: 0.5,
		speedY: 0.5
	}));

	// Add in a tile layer, and make it the collision layer
	stage.collisionLayer(new Q.TileLayer({
		dataAsset: 'level.tmx',
		//level.json
		sheet: 'tiles'
	})); //png image

	//var spawner = stage.insert(new Q.Spawner());
	// Create the player and add them to the stage
	var player = stage.insert(new Q.Player({
		x: 740,
		y: -140
	}));

	// Give the stage a moveable viewport and tell it
	// to follow the player.
	stage.add("viewport").follow(player);

	// Add in a couple of enemies
	stage.insert(new Q.Enemy({
		x: 760,
		y: 30,
		vx: 0,
		gravity: 0.5
	}));
	stage.insert(new Q.Enemy({
		x: 430,
		y: -100,
		vx: 0,
		gravity: 0.5
	}));

	// Finally add in the tower goal
	stage.insert(new Q.Tower({
		x: 180,
		y: 50
	}));
});

// To display a game over / game won popup box, 
// create a endGame scene that takes in a `label` option
// to control the displayed message.
Q.scene('endGame', function(stage) {
	var container = stage.insert(new Q.UI.Container({
		x: Q.width / 2,
		y: Q.height / 2,
		fill: "rgba(0,0,0,0.5)"
	}));

	var button = container.insert(new Q.UI.Button({
		x: 0,
		y: 0,
		fill: "#CCCCCC",
		label: "Play Again"
	}))
	var label = container.insert(new Q.UI.Text({
		x: 10,
		y: -10 - button.p.h,
		label: stage.options.label
	}));
	// When the button is clicked, clear all the stages
	// and restart the game.
	button.on("click", function() {
		Q.clearStages();
		Q.stageScene('level1');
	});

	// Expand the container to visibily fit it's contents
	// (with a padding of 20 pixels)
	container.fit(20);
});