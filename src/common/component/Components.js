/**
 * 		用于定义公共组件
 * 		Hugo-Fu 2015.11.11	
 */

/**
 * 组件父类
 */
Component = cc.Class.extend({
	name : "noName",
	ownerId : 0,
	//克隆对象接口而已
	clone : function(){		cc.log("看到这一句说明你还没重写Component.clone接口 name:" + this.name);	},
	//重置数据
	reset : function(){		cc.log("看到这一句说明你还没重写Component.reset接口 name:" + this.name);		},
	//新的初始化实例
	newInstance : function(){		cc.log("看到这一句说明你还没重写Component.newInstance接口 name:" + this.name);		}
});

/**
 * 	计时组件（Buff持续，技能冷却等组件用）
 */
TimerComponent = Component.extend({
	second : 0,
	currTime : 0
});

/**
 * 	动画组件
 */
AnimateComponent = Component.extend({
	name : "animate",
	frames : null,
	delays : null,
	type : 0,
	clone : function(){
		var com = new AnimateComponent();
		com.frames = this.frames;
		com.dalays = this.delays;
		com.type = this.type;
		return com;
	},
	newInstance : function(){
		var com = new AnimateComponent();
		com.frames = [];
		com.delays = [];
		com.type = 0;
		return com;
	}
});
