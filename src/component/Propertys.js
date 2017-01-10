/**
 * 		定义游戏单位中的各种属性组件
 * 		Hugo-Fu 2017.01.06
 */

/**
 * 	GameObject/Unit 对象属性集抽象类
 */
Property = cc.Class.extend({
	name : "property",
	owner : null,		//所属unit
	prev : null,		//前驱指针
	next : null,		//后驱指针
	init : function(data){}	//初始化函数，注意data对象可能是空的，必须做好判断
});

/**
 *  可视元素组件
 */
ViewProperty = Property.extend({
	name : "view",
	title : "unname",			//显示的名字
	frameIndex : 0,
	interval : 0,
	body : null,			//cc.Sprite的引用
	frame : null,			//cc.SpriteFrame的引用

	z : 0,					//在地上的Y值，用于空中状态落地判断
	vx : 1,					//面向，1为右边，-1为左边，用于渲染
	dx : 0,					//x偏移量，用于渲染
	dy : 0,					//y偏移量，用于渲染
	
	init : function(){
		this.body = EngineUtil.newSprite();
		this.z = 0;
	}
});

/**
 * 动作管理组件
 */
ActionsProperty = Property.extend({
	name : "actions",
	current : null,			//当前action引用
	endFlag : false,
	next : null,
	state : 0,				//动作状态，空中、倒地、晕倒等		1010 binary	0=普通站立（行走等地上状态）
	stacks : null,			//map<name, stackInfo>结构
	
	init : function(data){
		this.endFlag = false;
		this.next = null;
		this.state = 0;
		this.stacks = {};
	}
});

/**
 * 单位运动组件
 */
MoveProperty = Property.extend({
	name : "move",
	coefficient : 1,		//速度比例系数
	dx : 0,					//dx,dy,dz 代表移动增量
	dy : 0,
	dz : 0,

	init : function(data){
		if(data){
			this.coefficient = data.coefficient;
		}
	}
});

/**
 * 单位的攻击组件
 */
HitProperty = Property.extend({
	name : "hit",
	hit : null,			//当前action.hit的引用
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
HurtComponent = Property.extend({
	name : "hurt",
	hp : 0,
	defence : 0,		//防御值
	type : 1,		//0无敌，1普通(一般人物)，2伪霸体(对远程攻击霸体)，3霸体(对全部攻击霸体)，4不倒地(精灵类，对所有攻击都只向后退)
	effects : null,
	
	ctor : function(){
		this.effects = {};
	}
});

/**
 * 单位的碰撞组件
 */
UnitCollideComponent = Property.extend({
	name : "collide",
	collide : null,		//action.collide的引用
	total : 0,			//记录一共碰撞了多少unit
	targets : null,		//本次中招的人记录在这里 -_-0
	cost : null,		//之前中招的人记录在这里 -_-0，以id为key，value存什么都可以，用于检测是否重复计算碰撞
	flag : false,		//是否已碰撞成功，撞到一个也算
	
	ctor : function(){
		this.targets = [];
		this.cost = {};
		return this;
	}
});

/**
 * 单位状态存储组件
 * 	stateIds 存储buff和其他状态的信息，key为effect.name，effect分别分布在hitCom,hurtCom和stateCom.timer中
 */
UnitStateComponent = Property.extend({
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
MasterComponent = Property.extend({
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

/**
 * 指令输入组件
 */
CommandProperty = Property.extend({
	name : "command",
	direction : 0,
	attack : 0,
	jump : 0,
	comboKey : 0
});
