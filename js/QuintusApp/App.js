var Q = window.Q = Quintus().include("Sprites, Scenes, Input, 2D, Anim, Touch, UI");

window.addEventListener("load", function() {

	// Set up an instance of the Quintus engine  and include
	// the Sprites, Scenes, Input and 2D module. The 2D module
	// includes the `TileLayer` class as well as the `2d` componet.
	// ({ imagePath: "/assets/images/" });
	// imagePath: "images/",
	// audioPath: "audio/",
	// dataPath:  "data/",
	//Q = Q || {},
	
	window.Q.setup({maximize: true}).controls().touch();
	
	window.Q.load(['sprites.png', 'sprites.json', 'level.tmx', 'tiles.png', 'background-wall.png', 'braid.png', Q.PLR.file, Q.NME.file].join(', '), function() {
		Q.compileSheets("sprites.png", "sprites.json");
		Q.sheet("tiles", "tiles.png", {
			tilew: 32,
			tileh: 32
		});
		Q.sheet('enemy', Q.NME.file, {
			tilew: Q.NME.tilew,
			tileh: Q.NME.tileh
		});
		Q.sheet('player', Q.PLR.file, {
			tilew: Q.PLR.tilew,
			tileh: Q.PLR.tileh
		});
		Q.animations('player', {
			run: {
				frames: Q.frames(Q.PLR.run),
				rate: 1 / 15
			},
			idle: {
				frames: Q.frames(Q.PLR.idle)
			},
			jumpup: {
				frames: Q.frames(Q.PLR.jumpup)
			},
			jumpdn: {
				frames: Q.frames(Q.PLR.jumpdn)
			}
		});

		Q.animations('enemy', {
			run: {
				frames: Q.frames(Q.NME.run),
				rate: 1 / 15
			},
			idle: {
				frames: Q.frames(Q.NME.idle)
			},
			jumpup: {
				frames: Q.frames(Q.NME.jumpup)
			},
			jumpdn: {
				frames: Q.frames(Q.NME.jumpdn)
			}
		});

		Q.stageScene("level1");
	});
	

});