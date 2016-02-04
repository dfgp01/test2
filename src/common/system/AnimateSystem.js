/**
 * 核心系统-动画播放
 */
AnimateSystemOld = ActionSystem.extend({
	
	name : "animate",
	
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

/**
 * 核心系统-动画播放，以下是新的
 */
AnimateSystem = ActionSystem.extend({
	name : "animate",
	system : null,
	ctor : function(){
		this.system = GameUtil.system.animate;
	},
	start : function(gameObj,animateCom){
		gameObj.coms.view.frameIndex = 0;
		gameObj.coms.view.delay = 0;
		gameObj.coms.view.animate = animateCom;
		EngineUtil.setFrame(gameObj.coms.view.sprite, animateCom.frames[0]);
	},
	update : function(dt, gameObj, animateCom){
		this.system.updateOnce(dt, gameObj.coms.view);
	}
});

/**
 * 给tile用的
 */
SimpleAnimateSystem = AnimateSystem.extend({
	start : function(gameObj,animateCom){
		gameObj.coms.view.animate = animateCom;
		this.system.addComponent(gameObj.coms.view);
	},
	update : function(dt, gameObj, animateCom){
		return;
	}
});

/**
 * 只有一帧的
 */
AnimateOneFrame = ActionSystem.extend({
	name : "animate",
	start : function(gameObj,animateCom){
		EngineUtil.setFrame(gameObj.coms.view.sprite, animateCom.frames[0]);
	}
});