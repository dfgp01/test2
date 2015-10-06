/**
 * edit by Hugo-Fu
 * 2015.10.04
 */

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
	},

	changeAction : function(action){
		this.actionsCom.currAction.end(this);
		action.start(this);
		return;
	},
	
	//重置状态，在一个状态结束后调用
	resetActionState : function(){
		this.actionsCom.actions.stand.start(this);
	},
	
	nextAction : function(action){
		if(action.children && action.children[Constant.DIRECT_CHILDNODE]){
			this.changeAction(action.children[Constant.DIRECT_CHILDNODE]);
		}else{
			this.resetActionState();
		}
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