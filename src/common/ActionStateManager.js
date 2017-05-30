/**
 * 动作状态机管理
 */
ActionStateManager = cc.Class.extend({
	
	map : null,
	
	enter : function(unit){},
	
	/**
	 * 注册action-子状态，添加进map管理
	 */
	registered : function(action){
		if(!this.map){
			this.map = {};
		}
		if(!action || !action.id){
			cc.log("registered error. action or id is null.");
			return;
		}
		if(this.map[action.id]){
			cc.log("registered error. action id:"+action.id+" exists.");
			return;
		}
		this.map[action.id] = action;
		return;
	},
	
	getAction : function(id){
		if(!id){
			cc.log("getAction error. id is null.");
			return null;
		}
		var action = this.map[id];
		if(!action){
			cc.log("getAction error. can't find id:"+id+".");
			return null;
		}
		return action;
	}
});