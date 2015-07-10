/**
 * edit by Hugo-Fu
 * 2015.06.18
 */

GameObject = cc.Class.extend({
	id : null,
	name : null,
	group : 0
});

Unit = GameObject.extend({
	
	viewCom : null,
	hitCom : null,
	hurtCom : null,
	speedCom : null,
	motionCom : null,
	actionsCom : null,
	
	/**
	 * 准备切换动作，在action.run运行完毕后
	 */
	preparedChangeAction : function(name){
		this.actionsCom.nextAction = this.actionsCom.actions[name];
	}

	changeAction : function(action){
		this.currAction.end(this);
		action.start(this);
		return;
	},
	
	//重置状态，在一个状态结束后调用
	resetActionState : function(){
		this.actionsCom.actions.stand.start(this);
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