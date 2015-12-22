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
		if(!ObjectUtil.checkNotNull(eventCallback,"name")){
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

/**
 * 事件响应类
 */
EventCallback = cc.Class.extend({
	name : "callback",
	response : function(content){	/**子类实现接口**/		}
});