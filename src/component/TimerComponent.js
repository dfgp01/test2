/**
 * 	计时组件（Buff持续，技能冷却等地方使用）
 * 		基类只存储总时长
 */
TimerComponent = Component.extend({
	inteval : 0,		//用于每隔一段时间触发的
	total : 0	//总时长
});