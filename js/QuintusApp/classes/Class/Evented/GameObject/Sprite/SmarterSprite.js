Q.Sprite.extend('SmarterSprite', {
	init: function(props, defaultProps) {
		this._super(Q._extend({
			vx: 0,
			vy: 0,
			ax: 0,
			ay: 0,
			smarterSpriteFlags: []
		}, props), defaultProps);
		this.add('animation, 2d');
	},

	step: function(dt) {
		if (this.p.direction == Q.LEFT) this.p.flip = 'x';
		else /*if(this.p.direction == Q.RIGHT)*/
		this.p.flip = false;
		this.setAnimation();
		this.doFlags();
		this.p.oldvy = this.p.vy;
		if (this.p.isSuperBounce) {
			this.p.isSuperBounce = false;
		}
	},

	doStomp: function(col) {
		var bouncev = Math.min(-300, -this.p.oldvy * 0.65);
		this.p.vy = bouncev;
		if (bouncev != -300) {
			console.log('super stomp', bouncev);
			this.p.isSuperBounce = true;
			console.log(this.stage.viewport);
			this.stage.viewport.offsetY = -20;
			setTimeout(function(me) {
				return function() {
					me.stage.viewport.offsetY = 0;
				}
			}(this), 80);

		}
	},

	collision: function(col) {
		console.log('player col')
		this._super(col);
	},

	doFlags: function() {
		var p = this.p,
			flags = p.smarterSpriteFlags;

		if (flags.indexOf(Q.DIES_IN_VOID) != -1) {
			if (p.y > 1000) {
				this.destroy();
				Q.stageScene("endGame", 1, {
					label: "You fell into the void"
				});
			}
		}
	},
	setAnimation: function() {

		if (this.p.vy < 0 && this.animation != 'jumpup') this.play('jumpup');
		else if (Math.abs(this.p.vy) > 0 && this.animation != 'jumpdn') this.play('jumpdn');
		else if (this.p.vx == 0 && this.animation != 'idle') this.play('idle');
		else if (Math.abs(this.p.vx) > 0 && this.animation != 'run') this.play('run');

	}
});