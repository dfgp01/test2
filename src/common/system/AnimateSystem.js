/**
 * 核心系统-动画播放
 */
AnimateSystem = ActionSystem.extend({
	
	start : function(gameObj, animateCom){
		gameObj.coms.view.frameIndex = 0;
		gameObj.coms.view.delay = animateCom.delay[0];
		gameObj.viewCom.sprite.setSpriteFrame(this.animateCom.frames[0]);
	},
	update : function(dt, gameObj, animateCom){
		//冷却计时
		if(gameObj.coms.view.delay < animateCom.delay[gameObj.actionsCom.frameIndex]){
			gameObj.coms.view.delay += dt;
			return;
		}
		gameObj.coms.view.delay -= animateCom.delay[gameObj.actionsCom.frameIndex];
		gameObj.actionsCom.frameIndex++;
		
		//播放动画
		if(gameObj.actionsCom.frameIndex < actionCom.frames.length){
			gameObj.viewCom.sprite.setSpriteFrame(actionCom.frames[gameObj.actionsCom.frameIndex]);
		}
		else{
			gameObj.actionsCom.endFlag = true;
		}
	}
});

/**
* 核心系统-动画循环播放
*/
LoopAnimateSystem = AnimateSystem.extend({

	update : function(dt, unit, animateCom){
		//冷却计时
		if(gameObj.coms.view.delay < animateCom.delay[gameObj.actionsCom.frameIndex]){
			gameObj.coms.view.delay += dt;
			return;
		}
		gameObj.coms.view.delay -= animateCom.delay[gameObj.actionsCom.frameIndex];
		gameObj.actionsCom.frameIndex++;
		
		//播放动画
		if(unit.coms.view.frameIndex >= animateCom.frames.length){
			unit.coms.view.frameIndex = 0;
		}
		unit.coms.view.sprite.setSpriteFrame(animateCom.frames[unit.coms.view.frameIndex]);
		unit.coms.view.frameIndex++;
	}
});