/**
 * 动作组件父类抽象
 */
Component = cc.Class.extend({
	name : null,
	priority : 0,
	
	//以下是生命周期函数，即组件逻辑
	init : function(data){},
	start : function(unitComponent){},
	update : function(dt, unitComponent){},
	end : function(unitComponent){}
});