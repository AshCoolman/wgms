Q.SmarterSprite.extend('Player', {
	init: function(p) {
		this._super(p, {
			sprite: 'player',
			sheet: 'player'
		});
		this.p.smarterSpriteFlags.push(Q.DIES_IN_VOID);
		this.add('2d, platformerControls');
		this.on('hit', this, 'collision');
		Q.input.on("action", this, "doAction");
		this.play('idle');
	},

	doAction: function() {
		//Test if Touching...
	},

	collision: function(col) {
		var maxCol = 3,
			collided = false;
		this.p.hit = false;
		while ((collided = this.stage.search(this)) && maxCol > 0) {
			if (collided) {
				this.p.hit = true;
				this.p.x -= collided.separate[0];
				this.p.y -= collided.separate[1];
			}
			maxCol--;
		}
	},

	step: function(dt) {
		this._super(dt);
		this.stage.collide(this);
	}
});