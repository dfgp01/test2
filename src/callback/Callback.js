
UnitCallback = cc.Class.extend({
	name : "unit",
	callback : function(evt, callbackFunc){
		//模板模式的callback
	},
	
	/**
	 * 所有具有攻击能力的Action都会执行这个callback
	 */
	hit : function(content){
		var targetIds = content.targets;
		for(var i in targetIds){
			var msg = MsgTemplate.hurt(content.source, targets[i]);
			Service.sendMsg(Constant.MsgType.Unit.HURT, msg);
		}
	},
	
	/**
	 * 所有可以被攻击的单位都会有这个callback
	 */
	hurt : function(content){
		var target = Service.findObj(content.target);
		if(source.active && target.active){
			
		}
	}
});
