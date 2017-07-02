/**
 * 连续序列动作，也称动作组或复合动作
 */
SequenceAction = Action.extend({
	actions : null,
	
	start : function(unit){
		//this._super(unit);
		this.getCacheValue(unit).index = 0;
		this.actions[0].start(unit);
	},

	update : function(dt, unit){
		//this._super(dt, unit);
		var cache = this.getCacheValue(unit);
		if(this.actions[cache.index].checkEnd(unit)){
			cache.index++;
			if(index < this.actions.length){
				this.actions[cache.index].start(unit);
			}
		}else{
			this.actions[cache.index].update(dt, unit);
		}
	},
	
	checkEnd : function(unit){
		return this.getCacheValue(unit).index >= this.actions.length;
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