/**
 * 核心系统-动画播放
 */
AnimateSystem = ActionSystem.extend({
	
	//这个方法暂时用不上
	start : function(gameObj, actionCom){
		gameObj.viewCom.frameIndex = 0;
		gameObj.viewCom.sprite.setSpriteFrame(this.animateCom.frames[0]);
	},
	update : function(dt, gameObj, actionCom){
		//冷却计时
		if(gameObj.viewCom.animaDelayCount < gameObj.viewCom.animaDelay){
			gameObj.viewCom.animaDelayCount += dt;
			return;
		}
		gameObj.viewCom.animaDelayCount = 0;
		//播放动画
		if(gameObj.actionsCom.frameIndex < actionCom.frames.length){
			gameObj.viewCom.sprite.setSpriteFrame(actionCom.frames[gameObj.actionsCom.frameIndex]);
			gameObj.actionsCom.frameIndex++;
		}
		else{
			gameObj.actionsCom.endFlag = true;
		}
	}
});

/**
* 核心系统-动画循环播放
*/
LoopAnimateSystem = ActionSystem.extend({
	start : function(unit, actionCom){
		unit.actionsCom.actions.frameIndex = 0;
		unit.viewCom.sprite.setSpriteFrame(actionCom.frames[0]);
	},
	update : function(dt, unit, actionCom){
		//冷却计时
		if(unit.viewCom.animaDelayCount < unit.viewCom.animaDelay){
			unit.viewCom.animaDelayCount += dt;
			return;
		}
		unit.viewCom.animaDelayCount = 0;
		//播放动画
		if(unit.actionsCom.frameIndex >= actionCom.frames.length){
			unit.actionsCom.frameIndex = 0;
		}
		unit.viewCom.sprite.setSpriteFrame(actionCom.frames[unit.actionsCom.frameIndex]);
		unit.actionsCom.frameIndex++;
	}
});