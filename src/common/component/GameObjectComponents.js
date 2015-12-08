/**
 * 		用于游戏单位中的组件
 * 		Hugo-Fu 2015.11.11	
 */

/**
 *  可视元素组件
 */
ViewComponent = Component.extend({
	//animaDelay : 0.1,
	//animaDelayCount : 0,
	z : 0,			//在地上的Y值，用于空中状态落地判断
	frameIndex : 0,
	delay : 0,
	displayName : "unit",	//显示的名字
	sprite : null,
	
	clone : function(){
		var com = new ViewComponent();
		com.sprite = new cc.Sprite();
		com.z = this.z;
		com.frameIndex = this.frameIndex;
		com.delay = this.delay;
		com.displayName = this.displayName;
		return com;
	},
	newInstance : function(){
		var com = new ViewComponent();
		com.sprite = new cc.Sprite();
		com.z = 0;
		com.frameIndex = 0;
		com.delay = 0;
		com.displayName = "unit";
		return com;
	}
});

/**
 * 动作管理组件
 */
ActionsComponent = Component.extend({
	name : "actions",
	repeatFlag : 0,
	endFlag : false,
	phase : 0,
	current : null,
	next : null,
	names : null,			//Action索引
	state : 0,				//动作状态，空中、倒地、晕倒等		1010 binary	0=普通站立（行走等地上状态）
	clone : function(){
		var com = new ActionsComponent();
		com.repeatFlag = this.repeatFlag;
		com.endFlag = this.endFlag;
		com.phase = this.phase;
		com.current = this.current;
		com.next = this.next;
		com.names = this.names;
		com.state = this.state;
		return com;
	},
	newInstance : function(){
		var com = new ActionsComponent();
		com.repeatFlag = 0;
		com.endFlag = false;
		com.phase = 0;
		com.current = null;
		com.next = null,
		com.names = {};
		com.state = 0;
		return com;
	}
});

/**
 * 可攻击属性组件
 */
HitPropertiesComponent = Component.extend({
	strength : 0,
	speedFactor : 0
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
	effects : null
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

CollidePropertiesComponent = Component.extend({
	name : "collide",
	mask : 0,
	targets : null
});