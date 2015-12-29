/**
 * 		用于Action中的组件
 * 		Hugo-Fu 2015.11.11	
 **/

/**
 * 动作运动组件
 */
ActionMotionComponent = Component.extend({
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

/**
 * 可蓄力动作组件
 */
ChargeComponent = Component.extend({
	rate : 1,
	currRate : 0,
	maxAddition : 1
});

/**
 * 	动作-碰撞数据组件
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