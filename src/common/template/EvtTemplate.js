/**
 * 	事件数据模板
 */
EvtTemplate = {
	
	hit : function(source, hitCom, targets){
		var evt = {};
		evt.type = Constant.MsgType.Unit.HIT;
		evt.content = {};
		var ids = [];
		for(var i in targets){
			ids.push(targets[i].id);
		}
		evt.content.targetIds = ids;
		evt.content.sourceId = source.id;
		evt.content.type = hitCom.type;
		return evt;
	}
};