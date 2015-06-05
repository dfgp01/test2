/**
 * 		播放组件
 */

PlayComponent = Component.extend({
	update : function(unit, dt){
		//播放动画
		if(unit.frameIndex < unit.currAction.frames.length){
			unit.body.setSpriteFrame(unit.currAction.frames[unit.frameIndex]);
			unit.frameIndex++;
		}else{
			unit.currAction.nextAct(unit);
		}
	}
});