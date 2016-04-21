/**
 * 事件基类定义
 */
Event = cc.Class.extend({
	type : 0,
	source : null,
	data : null
});

/**
 * 事件响应处理
 */
EventCallback = cc.Class.extend({
	response : function(event){	/**子类实现接口**/		}
});

/**
 * 事件调度器，分发器
 */
EventScheduler = cc.Class.extend({
	name : "sheduler",
	types : null,
	
	ctor : function(){
		this.types = {};
	},
	
	addListener : function(eventCallback){
		if(!DataUtil.checkNotNull(eventCallback,"name")){
			cc.log("EventScheduler.addListener error, no name.");
		}
		var list = this.types[eventCallback.name];
		if(!list){
			list = [];
			this.types[eventCallback.name] = list;
		}
		list.push(eventCallback);
	},

	//主方法
	callback : function(evt){
		var list = this.types[evt.type];
		if(list){
			for(var i in list){
				list[i].response(evt.content);
			}
		}
	}
});