/**
 * 		用于Action中的组件
 * 		Hugo-Fu 2016.03.03	last-edit
 **/

/**
 * 	动画组件
 */
AnimateComponent = Component.extend({
	name : "animate",
	frames : null,
	intervals : null,
	type : 0
});

/**
 * 可切换动作的组件
 */
SwitchableComponent = Component.extend({
	name : "switchable",
	keys : null,
	ctor : function(){
		this.keys = {};
	}
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
 * 	动作-碰撞数据组件，待删
 */
ActionCollideComponent = Component.extend({
	rect : null,			//矩形框
	maxNum : 0,		//最大碰撞数
	mask : 0,			//目标
	
	ctor : function(){
		this.rect = [];
	},
	
	init : function(data){
		this.rect = DataUtil.copyArray(data.rect);
		this.maxNum = data.maxNum;
		this.mask = data.mask;
	}
});

HitComponent = Component.extend({
	damage : 0,
	type : 0
});

/**
 * 阶段型组件
 */
PhaseComponent = Component.extend({
	name : "phase",
	list : null,		//GroupComponent对象
	
	ctor : function(){
		this.list = [];
	},
	add : function(groupCom){
		this.list.push(groupCom);
	}
});

/**
 * 组合型组件
 */
GroupComponent = Component.extend({
	name : "group",
	coms : null,
	ctor : function(){
		this.coms = {};
	},
	add : function(com){
		this.coms[com.name] = com;
	}
});

/**
 * 动作运动组件
 */
ActionMoveComponent = Component.extend({
	name : "move",
	dx : 0,					//dx,dy,dz 代表移动增量
	dy : 0,
	dz : 0,
	maxDx : 0,			//这三个代表最高速度
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
	}
});

ActionCommandComponent = Component.extend({
	name : "command",
	type : 0,
	table : null
});