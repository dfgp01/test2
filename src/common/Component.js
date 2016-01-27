/**
 * 		用于定义公共组件
 * 		Hugo-Fu 2015.11.11	
 */

/**
 * 组件父类
 */
Component = cc.Class.extend({
	name : "noName",
	owner : null,		//所属unit
	prev : null,		//用于链表结构的前指针
	next : null,		//用于链表结构的后指针
	//克隆对象接口而已
	clone : function(){		cc.log("看到这一句说明你还没重写Component.clone接口 name:" + this.name);	},
	//重置数据
	reset : function(){		cc.log("看到这一句说明你还没重写Component.reset接口 name:" + this.name);		},
	//新的初始化实例
	newInstance : function(){		cc.log("看到这一句说明你还没重写Component.newInstance接口 name:" + this.name);		}
});

/**
 * 	计时组件（Buff持续，技能冷却等地方使用）
 * 		基类只存储总时长
 */
TimerComponent = Component.extend({
	start : 0,	//开始计时标记,通常是Unit用
	dt : 0,		//用于每隔一段时间触发的
	toal : 0	//总时长
});

/**
 * 动作运动组件
 */
MotionComponent = Component.extend({
	name : "motion",
	dx : 0,					//dx,dy,dz 代表移动增量
	dy : 0,
	dz : 0,
	maxDx : 0,
	maxDy : 0,
	maxDz : 0,
	clone : function(){
		var com = new ActionMotionComponent();
		com.dx = this.dx;
		com.dy = this.dy;
		com.dz = this.dz;
		com.maxDx = this.maxDx;
		com.maxDy = this.maxDy;
		com.maxDz = this.maxDz;
		return com;
	},
	
	init : function(data){
		//数据上的增量是每秒移动的距离
		this.dx = data.dx;
		this.dy = data.dy;
	}
});
