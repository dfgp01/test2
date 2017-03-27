/**
 * 事件基类
 */
Event = cc.Class.extend({
	type : 0,
	sender : null
});

/**
 * 监听器基类
 */
EventListener = cc.Class.extend({
	execute : function(event){}
});