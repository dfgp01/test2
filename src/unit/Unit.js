/**
 * edit by Hugo-Fu
 * 2015.06.18
 */

GameObject = cc.Class.extend({
	id : null,
	name : null,
	group : 0,
	
});

Unit = GameObject.extend({
	
	viewCom : null,
	hitCom : null,
	hurtCom : null,
	speedCom : null,
	actionsCom : null,	

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

UnitTemplate = cc.Class.extend({
	name : null,
	hitCom : null,
	hurtCom : null,
	speedCom : null,
	actionsCom : null,	
	getNewInstance : function(){
		var unit = Service.popUnitFromPool();
		if(unit == null){
			unit = new Unit();
			unit.viewCom = new ViewComponent();
			unit.viewCom.sprite = new cc.Sprite("#" + this.actionsCom.firstFrame);
			//....
		}
		unit.viewCom.sprite.setFrame
		unit.hitCom.strength = this.hitCom.strength;
		unit.hitCom.attSpeedFactor = this.hitCom.attSpeedFactor;
		//....
		return unit;
	}
});
}