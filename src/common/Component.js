/**
 * 动作组件父类抽象
 */
Component = cc.Class.extend({
	name : "component",
	priority : 0,
	//克隆对象接口而已
	clone : function(){		cc.log("看到这一句说明你还没重写Component.clone接口 name:" + this.name);	},
	//重置数据
	reset : function(){		cc.log("看到这一句说明你还没重写Component.reset接口 name:" + this.name);		},
	//新的初始化实例
	newInstance : function(){		cc.log("看到这一句说明你还没重写Component.newInstance接口 name:" + this.name);		},
	
	//以下是生命周期函数，即组件逻辑
	init : function(data){},
	start : function(unitComponent){},
	update : function(dt, unitComponent){},
	end : function(unitComponent){}
});