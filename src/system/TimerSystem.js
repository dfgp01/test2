/**
 * 动作中需要用到计时功能的系统组件
 */
ActionTimerSystem = ActionComponentSystem.extend({
	timerCom : null,

	start : function(dt, unit){
		
	},
	update : function(dt, unit){
		this.timeProgressComponent.curTime += dt;
		if(this.timeProgressComponent.curTime > this.timeProgressComponent.curTime.second){
			this.end();
		}
	},
	end : function(dt, unit){
		this.timeProgressComponent.isStart = false;
		//抽象方法，子类必须实现
		this.afterTimer();
	}
});