//--------------------- 动作层 --------------------
/**
 * 组件父类
 */
Component = cc.Class.extend({
	name : null,
	ownerId : 0,
	clone : function(){},	//克隆对象接口而已
	reset : function(){}		//重置数据
});

/**
 * 可蓄力动作组件
 */
ChargeComponent = Component.extend({
	rate : 1,
	currRate : 0,
	maxAddition : 1
});

/**
 * 	碰撞数据组件
 */
CollideComponent = Component.extend({
	rect : null,
	target : 0,
	type : 0
});

/**
 * 击中后的效果组件
 */
HittedComponent = Component.extend({
	effectList : null
});

//--------------------- 单位层 --------------------
/**
 * 
 */
ViewComponent = Component.extend({
	//animaDelay : 0.1,
	//animaDelayCount : 0,
	groundY : 0,			//在地上的Y值，用于空中状态落地判断
	sprite : null
});

/**
 * 动作管理组件
 */
ActionsComponent = Component.extend({
	name : "actions",
	frameIndex : 0,
	repeatFlag : 0,
	endFlag : false,
	firstAct : null,
	currAction : null,
	actions : null,
	nodes : null,			//动作状态节点，树状存储，key为action.key值
	state : 0,				//动作状态，空中、倒地、晕倒等		1010 binary	0=普通站立（行走等地上状态）
	clone : function(){
		var com = new ActionsComponent();
		com.frameIndex = this.frameIndex;
		com.repeatFlag = this.repeatFlag;
		com.endFlag = this.endFlag;
		com.firstAct = this.firstAct;
		com.currAction = this.currAction;
		com.actions = this.actions;
		com.nodes = this.nodes;
		com.state = this.state;
	}
});

/**
 * 可攻击属性组件
 */
HitPropertiesComponent = Component.extend({
	strength : 0,
	attSpeedFactor : 0
});

/**
 * 可被攻击属性组件
 */
HurtPropertiesComponent = Component.extend({
	healthPoint : 0,
	maxHealthPoint : 0,
	defence : 0,
	bodyType : 1,		//0无敌，1普通(一般人物)，2伪霸体(对远程攻击霸体)，3霸体(对全部攻击霸体)，4不倒地(精灵类，对所有攻击都只向后退)
	bodyState : 0,		//中毒、出血、灼伤等		1010 binary
	isDead : 0				//0=未死，1=已死
});

/**
 * 速度属性组件
 * 所有属性值为系数，基础数在action中的motionCom中定义
 */
SpeedPropertiesComponent = Component.extend({
	factor : 0,
	currFactor : 0,
	maxFactor : 3,
});

//--------------------- 公共层 --------------------

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