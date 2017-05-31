/**
 * 连续序列动作，也称动作组或复合动作
 */
SequenceAction = ActionState.extend({
	actions : null,
	
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

var seqActVldt = null;
SequenceAction.prototype.create = function(data, actionManager){
	if(!seqActVldt){
		//初始化添加验证
		seqActVldt = [Validator.create("name", "string", true, 1, 50),
		            Validator.create("list", "array", true, 1, 99)];
		this.addType("sequenceAction", function(val, label){
			return Validator.validateObject(val, mvVldt, label);
		});
	}
	if(!Validator.assertType(data, "sequenceAction", "SequenceAction")){
		cc.log("SequenceAction.create error.");
		return null;
	}
	var seq = new SequenceAction();
	seq.name = data.name;
	seq.actions = [];
	for(var i=0; i<data.list.length; i++){
		if(data.list[i].action_ref){
			seq.actions[i] = actionManager.getAction(data.list[i].action_ref);
		}else{
			seq.actions[i] = ActionFactory.create(data.list[i]);
		}
	}
	return seq;
};