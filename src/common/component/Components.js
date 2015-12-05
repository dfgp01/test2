/**
 * 		用于定义公共组件
 * 		Hugo-Fu 2015.11.11	
 */

/**
 * 组件父类
 */
Component = cc.Class.extend({
	name : null,
	ownerId : 0,
	clone : function(){		cc.log("看到这一句说明你还没重写Component.clone接口");		},	//克隆对象接口而已
	reset : function(){		cc.log("看到这一句说明你还没重写Component.reset接口");		}	//重置数据
});

/**
 * 物体运动组件
 */
MotionComponent = Component.extend({
	name : "motion",
	speedFactor : 1,	//速度系数
	vx : 0,					//vx,vy,vh 代表方向向量
	vy : 0,
	vh : 0,
	dx : 0,					//dx,dy,dh 代表移动增量
	dy : 0,
	dh : 0,
	maxDx : 0,
	maxDy : 0,
	maxDh : 0,
	clone : function(){
		var com = new MotionComponent();
		com.speedFactor = this.speedFactor;
		com.vx = this.vx;
		com.vy = this.vy;
		com.vh = this.vh;
		com.dx = this.dx;
		com.dy = this.dy;
		com.dh = this.dh;
		com.maxDx = this.maxDx;
		com.maxDy = this.maxDy;
		com.maxDh = this.maxDh;
		return com;
	}
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
	type : 0,
	clone : function(){
		var com = new AnimateComponent();
		com.frames = this.frames;
		com.type = this.type;
		return com;
	}
});
