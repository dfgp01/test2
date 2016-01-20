/**
 * 封装引擎API
 */

EngineUtil = {
	
	setFrame : function(sprite, frame){
		sprite.setSpriteFrame(frame);
	},
	
	setFrameByName : function(sprite, frameName){
		var frame = cc.spriteFrameCache.getSpriteFrame(frameName);
		if(frame){
			sprite.setSpriteFrame(frame);
		}else{
			cc.log("EngineUtil.setFrameByName error. frame:" + frameName + " not found~!");
		}
	},
	
	setPosition : function(sprite, motionCom){
		//setPosition()里面有绘制命令
		//这里要使用getPositionX()而不是getPosition().x这种，因为翻查源码发现，getPosition()是会有new操作的。
		sprite.setPosition(
			sprite.getPositionX() + motionCom.dx,
			sprite.getPositionY() + motionCom.dy);
	}
	
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