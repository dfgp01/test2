/**
 * edit by Hugo-Fu
 * 2015.03.09
 */

Unit = cc.Class.extend({
	id:null,
	name : null,
	body:null,			//cc.Sprite类型
	group : "1D",		//hex 1111
	mask : "1C",
	property : null,	//base{hp,money...} skill{sk1,sk2}

	state : 0,
	isActive:false,		//use for obj-pool
	isDead:false,			//use for main-logic,dead not eq to non-active
	act_tag:null,		//0000
	
	actions : null,				//用于索引
	actionStates : null,		//树结构 状态节点
	currAction : null,
	frameIndex : -1,
	
	ctor : function(data){
		data && this.init(data);
	},
	init : function(data){
		this.name = data.name;
		this.res = data.res;
		this.actionStateNodes = {};
		this.actions = {};
	},
	run : function(dt){
		this.currAction.run(dt);
	},
	changeAction : function(newAction){
		this.currAction.end();
		newAction.start();
	},
	
	addState : function(state){
		this.stateNodes[state.key] = state;
		this.addToNodes(state);
	},
	
	//添加到索引，方便查找，主逻辑一般不会用到nodes节点处理
	addToNodes : function(state){
		this.actions[state.name] = state;
		state.owner = this;
	},
	
	//重置状态，在一个状态结束后调用
	updateState : function(){
		this.currAction.end();
		this.currAction = this.actionStateNodes[constant.state.IDLE];
	}
});

Character = Unit.extend({
	keepFlag : false,		//蓄力标记
});

FlyObject = Unit.extend({
	owner : null
});