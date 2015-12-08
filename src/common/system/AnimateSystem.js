/**
 * 核心系统-动画播放
 */
AnimateSystem = ActionSystem.extend({
	
	start : function(gameObj, animateCom){
		gameObj.coms.view.frameIndex = 0;
		gameObj.coms.view.delay = animateCom.delays[0];
		gameObj.coms.view.sprite.setSpriteFrame(animateCom.frames[0]);
	},
	update : function(dt, gameObj, animateCom){
		//冷却计时
		if(gameObj.coms.view.delay < animateCom.delays[gameObj.coms.view.frameIndex]){
			gameObj.coms.view.delay += dt;
			return;
		}
		gameObj.coms.view.delay -= animateCom.delays[gameObj.coms.view.frameIndex];
		gameObj.coms.view.frameIndex++;
		
		//播放动画
		if(gameObj.actionsCom.frameIndex < actionCom.frames.length){
			gameObj.viewCom.sprite.setSpriteFrame(actionCom.frames[gameObj.coms.view.frameIndex]);
		}
		else{
			gameObj.actions.endFlag = true;
		}
	}
});

/**
* 核心系统-动画循环播放
*/
LoopAnimateSystem = AnimateSystem.extend({

	update : function(dt, gameObj, animateCom){
		//冷却计时
		if(gameObj.coms.view.delay < animateCom.delays[gameObj.coms.view.frameIndex]){
			gameObj.coms.view.delay += dt;
			return;
		}
		gameObj.coms.view.delay = gameObj.coms.view.delay - animateCom.delays[gameObj.coms.view.frameIndex];
		gameObj.coms.view.frameIndex++;
		
		//播放动画
		if(gameObj.coms.view.frameIndex >= animateCom.frames.length){
			gameObj.coms.view.frameIndex = 0;
		}
		gameObj.coms.view.sprite.setSpriteFrame(animateCom.frames[gameObj.coms.view.frameIndex]);
	}
});