/**
 * 事件管理器
 */
EventDispatcher = {
	listeners : {},
	evtQuene : [],
	
	/**
	 * 仅用于JS方式创建监听器
	 */
	createEventListener : function(func){
		var listener = new EventListener();
		listener.execute = func;
	},
	
	addEventListener : function(type, listener){
		var nodeList = this.listeners[type];
		if(!nodeList){
			nodeList = [];
			this.listeners[type] = nodeList;
		}
		if(listener==Function){
			listener = this.createEventListener(listener);
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
	},
	
	_inputEvents = [];
	getInputEvent : function(subType, command){
		var evt = this._inputEvents.length > 0 ? this._inputEvents.pop() : new InputEvent();
		evt.subType = subType;
		evt.command = command;
		return evt;
	}
};