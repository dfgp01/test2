/**
 * 重复执行动作
 */
RepeatAction = ActionState.extend({
	name : "repeat",
	action : null,
	repeat : 0,
	
	init : function(data){
		this.action = data.action;
		this.input = this.action.input;
	},
	
	start : function(unit){
		var stackInfo = getStackInfo(unit);
		stackInfo.repeat = 0;
		this._super(unit);
		this.action.start(unit);
	},

	update : function(dt, unit){
		this._super(dt, unit);
		this.action.update(dt, unit);
		if(unit.actions.endFlag){
			var stackInfo = getStackInfo(unit);
			if(stackInfo.repeat < this.repeat){
				stackInfo.repeat++;
				this.action.start(unit);
			}
		}
	}
});