/**
 * edit by Hugo-Fu
 * 2015.03.09
 */

Unit = cc.Class.extend({
	id:null,
	name : null,
	body:null,				//cc.Sprite类型
	group : 0,				//hex 0001 or 0010 ...
	
	unitType : 1,		//0无敌，1普通(一般人物)，2伪霸体(对远程攻击霸体)，3霸体(对全部攻击霸体)，4不倒地(精灵类，对所有攻击都只向后退)
	bodyState : 0,		//中毒、出血、灼伤等		1010 binary
	actionState : 0,		//动作状态，空中、倒地、晕倒等		1010 binary	0=普通站立（行走等地上状态）
	
	hp : 0,
	en : 0,
	strength : 0,
	defense : 0,
	speed : 0,

	isActive:false,		//use for obj-pool
	isDead:false,			//use for main-logic,dead not eq to non-active
	act_tag:null,			//这个不知干嘛的
	
	actions : null,				//用于索引，key为action.name值
	actionStates : null,		//树结构 状态节点，key为action.key值
	currAction : null,			//当前action的引用
	frameIndex : -1,

	init : function(data){
		this.name = data.name;
		this.res = data.res;
		this.actionStateNodes = {};
		this.actions = {};
	},
	
	run : function(dt){
		// 未来版本可能要把动画播放单独提出来，因为涉及到每个单位的速率问题
		// this.currAction.play(this);
		
		this.currAction.run(dt);
		this.runFuncState();
	},
	
	runAction : function(action){
		this.currAction.end(this);
		action.start(this);
	},
	
	addState : function(state){
		this.actionStates[state.key] = state;
		this.addToNodes(state);
	},
	
	//添加到索引，方便查找，主逻辑一般不会用到nodes节点处理
	addToNodes : function(state){
		this.actions[state.name] = state;
	},
	
	//重置状态，在一个状态结束后调用
	updateState : function(){
		this.currAction.end();
		this.currAction = this.actionStateNodes[constant.state.IDLE];
	},
	
	//击中时调用
	hit : function(){
		
	},
	
	//被击时调用
	hurt : function(unit, data){
		for(var i=0; i< this.hurtFunc.length; i++){
			this.hurtFunc[i].run(unit, data);
		}
		// run hurtstate
	}
});

Character = Unit.extend({
	keepFlag : false,		//蓄力标记
});

FlyObject = Unit.extend({
	owner : null
});