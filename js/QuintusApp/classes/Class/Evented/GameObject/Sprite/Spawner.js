// ## Spawner
Q.Sprite.extend('Spawner', {
	init: function(p) {
		this._super();
	},
	step: function(p) {
		if (Math.random() * 100 < 1) {
			this.stage.insert(new Q.Enemy({
				x: Math.random() * 1000,
				y: -200
			}));
		}
	}

});