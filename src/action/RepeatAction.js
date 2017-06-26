/**
 * 重复执行动作
 */
RepeatAction = ActionState.extend({
	action : null,
	count : 0,

	start : function(unit){
		//this._super(unit);
		this.getCacheValue(unit).count = 0;
		this.action.start(unit);
	},

	update : function(dt, unit){
		//this._super(dt, unit);
		if(this.action.checkEnd(unit)){
			var cache = this.getCacheValue(unit);
			if(cache.count < this.count){
				cache.count++;
				this.action.start(unit);
			}
		}else{
			this.action.update(dt, unit);
		}
	},
	
	checkEnd : function(unit){
		return this.getCacheValue(unit).count > this.count;
	}
});

var rptActVldt = null;
RepeatAction.prototype.create = function(data, actionManager){
	if(!rptActVldt){
		//初始化添加验证
		rptActVldt = [Validator.create("name", "string", true, 1, 50),
		            Validator.create("count", "int", true, 1, 99)];
		this.addType("repeatAction", function(val, label){
			return this.validateObject(val, mvVldt, label);
		});
	}
	if(!Validator.assertType(data, "repeatAction", "RepeatAction")){
		cc.log("RepeatAction.create error.");
		return null;
	}
	var rpt = new RepeatAction();
	rpt.name = data.name;
	rpt.count = data.count;
	if(data.action_ref){
		rpt.action = actionManager.getAction(data.action_ref);
	}else{
		rpt.action = ActionFactory.create(data.action);
	}
	return rpt;
};