/**
 * 	事件数据模板
 */
EvtTemplate = {
	
	/**
	 * 攻击发起事件
	 */
	hit : function(source, hitCom, targets){
		var evt = {};
		evt.type = Constant.MsgType.Unit.HIT;
		evt.content = {};
		evt.content.targets = targets;
		evt.content.source = source;
		evt.content.hitCom = hitCom;
		return evt;
	},

	hitMap : function(content){
		var source = content.source;
		var hitCom = content.hitCom;
		var map = {};
		map.source = source;
		map.damage = source.coms.hit.gongjili * (hitCom.damage / 100);
		map.type = hitCom.type;
		if(source.type == Constant.Unit.Type.CHARACTER){
			var buffIds = source.coms.buff.hit
			for(var i in buffIds){
				//buff叠加逻辑
			}
		}
	}
};