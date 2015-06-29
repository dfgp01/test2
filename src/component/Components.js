//--------------------- 动作层 --------------------
/**
 * 组件父类
 */
Component = cc.Class.extend({
	name : null,
	clone : function(){}	//克隆对象接口而已
});

/**
 * 	动画组件
 */
AnimateComponent = Component.extend({
	frames : null,
	animateType : 0,
	speedFactor : 1
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
	sprite : null
});

/**
 * 动作管理组件
 */
ActionsComponent = Component.extend({
	frameIndex : 0,
	firstAct : null,
	currAction : null,
	actions : null,
	cmdTree : null,	//树结构 状态节点，key为action.key值
	state : 0				//动作状态，空中、倒地、晕倒等		1010 binary	0=普通站立（行走等地上状态）
});

/**
 * 可攻击属性组件
 */
HitPropertiesComponent = Component.exend({
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
	isDead:false
});

/**
 * 速度控制组件
 */
SpeedComponent = Component.extend({
	speed : 0,
	currSpeed : 0,
	maxSpeed : 10
});

//--------------------- 公共层 --------------------
/**
 * 可移动组件
 */
MotionComponent = Component.extend({
	vx : 0,
	vy : 0,
	speedFactor : 1
});

/**
 * 	计时组件（Buff持续，技能冷却等组件用）
 */
TimerComponent = Component.extend({
	second : 0,
	currTime : 0,
	isStart : false
});