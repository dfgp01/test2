/**
 * 连续序列动作，也称动作组或复合动作
 */
SequenceAction = ActionState.extend({
	name : "sequence",
	actions : null,
	repeat : 0,
	
	start : function(unit){
		this._super(unit);
		unit.actions.repeat[this.name] = 0;
		this.actions[0].start(unit);
	},

	createStack : function(){
		var stack = new Object();
		stack.name = this.name;
		stack.index = 0;
		stack.repeat = 0;
		stack.isEnd = false;
		return stack;
	}
});