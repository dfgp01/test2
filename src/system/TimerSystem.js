/**
 * 单位需要用到计时功能的系统组件
 * 	如BUFF时长
 */
ActionTimerSystem = System.extend({
	timerCom : null,

	start : function(unit){
		
	},
	update : function(dt, unit){
		this.timeProgressComponent.curTime += dt;
		if(this.timeProgressComponent.curTime > this.timeProgressComponent.curTime.second){
			this.end();
		}
	},
	end : function(unit){
		//抽象方法，子类必须实现
		this.afterTimer();
	}
});