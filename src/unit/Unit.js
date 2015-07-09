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
	
	changeAction : function(name){
		this.currAction.end(this);
		this.actionsCom.actions[name].start(this);
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