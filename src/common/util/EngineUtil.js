/**
 * 
 */

EngineUtil = {
	
	getRectWithNode : function(node, rectData){
		var rectSource = node.getBoundingBox();
		return cc.rect(
				rectSource.x + rectData[0],
				rectSource.y + rectData[1],
				rectData[2],rectData[3]);
	},
	
	checkCollide : function(rect, viewCom){
		return cc.rectIntersectsRect(rect, viewCom.sprite.getBoundingBox());
	}
};