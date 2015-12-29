/**
 * 封装引擎API
 */

EngineUtil = {
	
	getRectWithNode : function(node, rectData){
		var rectSource = node.getBoundingBox();
		return cc.rect(
				rectSource.x + rectData[0],
				rectSource.y + rectData[1],
				rectData[2],rectData[3]);
	},
	
	/**
	 * 碰撞检测（矩形和现实对象的包围盒）
	 */
	checkCollide : function(rect, viewCom){
		return cc.rectIntersectsRect(rect, viewCom.sprite.getBoundingBox());
	},
	
	/**
	 * 发送事件、消息
	 */
	dispatch : function(evt){
		cc.eventManager.dispatchCustomEvent(evt.type, evt.content);
	},
	
	addListener : function(name, callback){
		cc.eventManager.addCustomListener(name, callback);
	}
};