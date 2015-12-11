
Callback = {

	_callback : function(evt, callbackFunc){
		//模板模式的callback
	},
	
	/**
	 * 所有具有攻击能力的Action都会执行这个callback
	 */
	hit : function(content){
		var hitMap = EvtTemplate.hitMap(content.source, content.hitCom);
		var targets = content.targets;
		for(var i in targets){
			var resultMap = EvtTemplate.resultMap(targets[i], hitMap);
			if(resultMap.damage > 0){
				//有效攻击
				//发起击中事件和被击事件
			}
			//Service.sendMsg(Constant.MsgType.Unit.HURT, msg);
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
}
