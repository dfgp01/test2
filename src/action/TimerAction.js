/**
 * 定时器动作，经过指定时间后运行。
 */
TimerAction = Action.extend({

	timeout : 0,
	
	action : null,
	
	start : function(unit){
		this.getCacheValue(unit).timeout = 0;
	},

	update : function(dt, unit){
		var cache = this.getCacheValue(unit);
		cache.timeout += dt;
		if(cache.timeout >= this.timeout){
			this.action.start(unit);
		}
	},
	
	checkEnd : function(unit){
		return this.getCacheValue(unit).timeout >= this.timeout;
	}
});