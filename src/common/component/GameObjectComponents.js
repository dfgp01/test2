/**
 * 		用于游戏单位中的组件
 * 		Hugo-Fu 2015.11.11	
 */

/**
 *  可视元素组件
 */
ViewComponent = Component.extend({
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
	ctor : function(){
		this.sprite = new cc.Sprite();
		this.z = 0;
		this.frameIndex = 0;
		this.delay = 0;
		this.displayName = "unit";
		return this;
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
	ctor : function(){
		this.repeatFlag = 0;
		this.endFlag = false;
		this.phase = 0;
		this.current = null;
		this.next = null,
		this.names = {};
		this.state = 0;
		return this;
	}
});

/**
 * 单位运动组件
 */
UnitMotionComponent = Component.extend({
	name : "motion",
	speedFactor : 1,	//速度系数
	vx : 0,					//vx,vy,vz 代表方向向量
	vy : 0,
	vz : 0,
	dx : 0,					//dx,dy,dz 代表移动增量
	dy : 0,
	dz : 0,
	maxDx : 0,
	maxDy : 0,
	maxDz : 0,
	clone : function(){
		var com = new UnitMotionComponent();
		com.speedFactor = this.speedFactor;
		com.vx = this.vx;
		com.vy = this.vy;
		com.vz = this.vz;
		com.dx = this.dx;
		com.dy = this.dy;
		com.dz = this.dz;
		com.maxDx = this.maxDx;
		com.maxDy = this.maxDy;
		com.maxDz = this.maxDz;
		return com;
	}
});

/**
 * 单位的攻击组件
 */
UnitHitComponent = Component.extend({
	name : "hit",
	strength : 0,
	critical : 0,		//暴击
	speedFactor : 0,	//攻击速度
	effects : null,
	
	ctor : function(){
		this.effects = {};
	}
});

/**
 * 单位的挨打组件
 */
UnitHurtComponent = Component.extend({
	name : "hurt",
	hp : 0,
	defence : 0,		//防御值
	bodyType : 1,		//0无敌，1普通(一般人物)，2伪霸体(对远程攻击霸体)，3霸体(对全部攻击霸体)，4不倒地(精灵类，对所有攻击都只向后退)
	effects : null,
	
	ctor : function(){
		this.effects = {};
	}
});

/**
 * 单位的碰撞组件
 */
UnitCollideComponent = Component.extend({
	name : "collide",
	mask : 0,
	rect : null,		//cc.rect矩阵对象
	total : 0,			//记录一共碰撞了多少unit
	targets : null,		//本次中招的人记录在这里 -_-0
	cost : null,		//之前中招的人记录在这里 -_-0，以id为key，value存什么都可以，用于检测是否重复计算碰撞
	flag : false,		//是否已碰撞成功，撞到一个也算
	
	ctor : function(){
		this.mask = 0;
		this.targets = [];
		this.cost = {};
		return this;
	},
	
	newInstance : function(){
		var com = new CollidePropertiesComponent();
		com.mask = 0;
		com.targets = [];
		com.cost = {};
		return com;
	}
});

/**
 * 单位状态存储组件
 * 	stateIds 存储buff和其他状态的信息，key为effect.name，effect分别分布在hitCom,hurtCom和stateCom.timer中
 */
UnitStateComponent = Component.extend({
	stateIds : null,
	timer : null,
	
	ctor : function(){
		this.stateIds = {};
		this.timer = {};
	}
});

/**
*	单位从属关系组件
*	用于召唤兽和子弹之类
*/
MasterComponent = Component.extend({
	name : "master",
	top : null,			//顶级所属
	parent : null,		//上一级所属
	
	clone : function(){
		var com = new MasterComponent();
		com.top = this.top;
		com.parent = this.parent;
		return com;
	},
	
	newInstance : function(){
		var com = new MasterComponent();
		com.top = null;
		com.parent = null;
		return com;
	}
});