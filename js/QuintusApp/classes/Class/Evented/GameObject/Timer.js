Q.UI.Text.extend( 'Timer', {
	init: function (props, defaultProps) {
		this._super(Q._extend({
				interval: null
		    }, props, defaultProps));
	},

	start: function() {
		var now, 
			startTime = new Date();
			me = this;

		function setTime(seconds) {
			Q.state.set('time', seconds);
		}
	
		function updateTime() {
			now = new Date();
			var timeDiff = Math.abs(now.getTime() - startTime.getTime());
			var diffSeconds = Math.ceil(timeDiff / 1000);
			setTime(diffSeconds);
		}
	
		this.p.interval = setInterval( function () {
			return function () {
				updateTime();
			}
		}(), 1000);
		
		
		setTime(0);
	},
	
	pause: function () {
		clearInterval(this.p.interval);
	}
});