/**
 * 连续序列动作，也称动作组或复合动作
 */
SequenceAction = ActionState.extend({
	name : "sequence",
	actions : null,

	init : function(data){
		this.actions = [];
	},
	
	start : function(unit){
		var stackInfo = getStackInfo(unit);
		stackInfo.index = 0;
		this._super(unit);
		this.actions[0].start(unit);
	},

	update : function(dt, unit){
		this._super(dt, unit);
		var stackInfo = getStackInfo(unit);
		this.actions[stackInfo.index].update(dt, unit);
		if(unit.actions.endFlag){
			stackInfo.index++;
			if(stackInfo.index < this.actions.length){
				this.actions[stack.index].start(unit);
			}
		}
	}
});