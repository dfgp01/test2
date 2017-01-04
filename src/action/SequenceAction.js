/**
 * 连续序列动作，也称动作组或复合动作
 */
SequenceAction = ActionState.extend({
	name : "sequence",
	actions : null,
	repeat : 0,

	init : function(data){
		this.actions = [];
	},
	
	start : function(unit){
		this._super(unit);
		var stack = ObjectManager.getActionStackInfo(this);
		stack.action = this;
		unit.actions.seqStack.table[this.name] = stack;
		unit.actions.seqStack.list.push(stack);
		this.actions[0].start(unit);
	},

	update : function(dt, unit){
		this._super(dt, unit);
		var stack = unit.actions.seqStack.table[this.name];
		var action = this.actions[stack.index];
		action.update(dt, unit);
		if(unit.actions.endFlag){
			stack.index++;
			if(this.actions.length < stack.index){
				action = this.actions[stack.index];
				action.start(unit);
			}else{
				if(stack.repeat < this.repeat){
					stack.repeat++;
					stack.index = 0;
					action = this.actions[stack.index];
					action.start(unit);
				}else{
					this.end(unit);
				}
			}
		}
	}
});