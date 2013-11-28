// ## Enemy Sprite
// Create the Enemy class to add in some baddies
Q.SmarterSprite.extend("Enemy", {
	init: function(p) {
		this._super(p, {
			sheet: 'enemy',
			sprite: 'enemy',
			vx: 100
		});
		this.p.vx = 100;
		this.p.smarterSpriteFlags.push(Q.DIES_IN_VOID);
		this.add('2d, aiBounce');
		this.on("bump.left", function(collision, event) {
			if (collision.obj.isA("Player")) {
				console.log('left', collision, event)
				Q.stageScene("endGame", 1, {
					label: "You bumped into enemy left"
				});
				collision.obj.destroy();
			}
		});

		this.on("bump.right", function(collision, event) {
			if (collision.obj.isA("Player")) {
				console.log('right', collision, event)
				Q.stageScene("endGame", 1, {
					label: "You bumped into enemy right"
				});
				collision.obj.destroy();
			}
		});

		this.on("bump.bottom", function(collision, event) {
			if (collision.obj.isA("Player")) {
				console.log('bottom', collision, event)
				Q.stageScene("endGame", 1, {
					label: "You bumped into enemy bottom"
				});
				collision.obj.destroy();
			}
		});
		this.on("bump.top", function(collision) {
			if (collision.obj.isA("Player")) {
				this.destroy();
				collision.obj.doStomp(collision);
			}
		});
	}
});