/**
 * 单位接收输入指令事件
 */
UnitInputEvent = Event.extend({
	type : EventConstant.UNIT_INPUT,
	inputType : 0,
	value : 0
});