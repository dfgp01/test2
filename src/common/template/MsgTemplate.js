
MsgTemplate = {

	/**
	 * source : 发起的unit对象
	 * hitCom :
	 * targets : 目标unit对象数组
	 */
	hit : function(source, hitCom, targets){
		var msg = {};
		msg.source = sourceObj.name + sourceObj.id;
		msg.type = hitCom.type;
		var targetIds = [];
		for(var i in targets){
			targetIds[i] = targets[i].name + targets[i].id;
		}
		msg.targets = targets;
		return msg;
	},
	
	hurt : function(source, targetId){
		var msg = {};
		msg.sourceId = source.id;
		msg.type = source.type;
		msg.targetId = targetId;
		return msg;
	}
}