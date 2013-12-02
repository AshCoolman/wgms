Q.UI.Text.extend( 'Clock', {
	init: function (props, defaultProps) {
		this._super(Q._extend({
		      label: "time: 0"
		    }, props, defaultProps));
		
		Q.state.on("change.time",this,"setTime");
	},
	setTime: function(time) {
		this.p.label = "time: " + time;
	}
});