/**
 * 事件管理器
 */
EventManager = {
	listeners : {},
	idleQuene : [],
	evtQuene : [],
	
	addListener : function(type, func){
		var nodeList = this.listeners[type];
		if(!nodeList){
			nodeList = new linkList();
			this.listeners[type] = nodeList;
		}
		//这样写是为了以后方便移植别的语言（尤其是面向接口编程的语言）
		var listener = new EventListener();
		listener.execute = func;
		nodeList.append(listener);
	},
	
	send : function(type, evt0){
		var evt = this.idleQuene.length > 0 ? this.idleQuene.pop() : new Event();
		evt.type = parseInt(type / 100) * 100;
		evt.subType = type;
		evt.sender = sender;
		evt.args = args;
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
			this.idleQuene.push(evt);
		}
	},
	
	_inputEvents : [],
	getInputEvent : function(subType, command){
		var evt = this._inputEvents.length > 0 ? this._inputEvents.pop() : new InputEvent();
		evt.subType = subType;
		evt.command = command;
		return evt;
	}
};