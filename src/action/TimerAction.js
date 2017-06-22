/**
 * 定时器动作，经过指定时间后运行，需要子类实现逻辑。
 */
TimerAction = Action.extend({

	timeout : 0,
	
	start : function(unit){
		
	},

	update : function(dt, unit){
		if(unit.dt >= this.dt){
			return;
		}
		unit.dt += dt;
		if(unit.dt >= this.dt){
			this.onTimeout(unit);
		}
	},
	
	/**
	 * 子类实现逻辑
	 */
	onTimeout : function(unit){}
});