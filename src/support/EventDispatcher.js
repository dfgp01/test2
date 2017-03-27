/**
 * 事件管理器
 */
EventDispatcher = {
	listeners : {},
	evtQuene : [],
	
	addEventListener : function(type, listener){
		var nodeList = this.listeners[type];
		if(!nodeList){
			nodeList = [];
			this.listeners[type] = nodeList;
		}
		nodeList.push(listener);
	},
	
	send : function(evt){
		evtQuene.push(evt);
	},
	
	process : function(){
		var evt = null;
		var nodeList = null;
		while(evtQuene.length > 0){
			evt = evtQuene.shift();
			nodeList = this.listeners[type];
			if(!nodeList){
				continue;
			}
			for(var i in nodeList){
				nodeList[i].execute(evt);
			}
		}
	}
};