/**
 * 	计时组件（Buff持续，技能冷却等组件用）
 */

//此组件为独有组件
TimeProgressComponent = Component.extend({
	time : 0,
	isGoingOn : false,		//状态判断，以后换个属性名
	update : function(dt){
		//时间累加判断，修改状态
	}
});