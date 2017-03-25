/**
 * 连续序列动作，也称动作组或复合动作
 */
CommandSequenceAction = ActionState.extend({
	name : "sequence",
	actions : null,

	init : function(data){
		this.actions = data.actions;
		this.input = this.actions[0].input;
	},
	
	start : function(unit){
		var stackInfo = getStackInfo(unit);
		stackInfo.index = 0;
		this._super(unit);
		this.actions[0].start(unit);
	},

	//判断是否可转入下一动作
	//1.action到达后摇阶段且输入正确指令
	//2.action.endFlag == true
	//3.index<length-1
	update : function(dt, unit){
		this._super(dt, unit);
		var stackInfo = getStackInfo(unit);
		this.actions[stackInfo.index].update(dt, unit);
		if(unit.actions.endFlag){
			stackInfo.index++;
			if(stackInfo.index < this.actions.length){
				this.actions[stack.index].start(unit);
			}
			return;
		}
	}
});