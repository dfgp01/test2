/**
 * 	事件数据模板
 */
EvtTemplate = {
	
	/**
	 * 攻击事件
	 */
	hit : function(source, hitCom, targets){
		var evt = {};
		evt.type = Constant.MsgType.Unit.HIT;
		evt.content = {};
		evt.content.targets = targets;
		evt.content.source = source;
		evt.content.hitCom = hitCom;
		return evt;
	}
};