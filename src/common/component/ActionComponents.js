/**
 * 		用于Action中的组件
 * 		Hugo-Fu 2015.11.11	
 **/

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
	ctor : function(){
		this.frames = [];
		this.delays = [];
	},
	newInstance : function(){
		var com = new AnimateComponent();
		com.frames = [];
		com.delays = [];
		com.type = 0;
		return com;
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

/**
 * 每帧移动一次的组件
 */
MovePerFrameComponent = Component.extend({
	name : "motion",
	list : null,
	ctor : function(){
		this.list = [];
	},
	add : function(motionCom){
		this.list.push(motionCom);
	}
});