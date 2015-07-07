/**
 * 核心系统-动画播放
 */
AnimateSystem = ActionSystem.extend({
	//AnimateComponent
	animateCom : null,
	start : function(unit, dt){
		unit.actions.frameIndex = 0;
	},
	update : function(unit, dt){		//待定
		//播放动画
		if(unit.actions.frameIndex < this.animateCom.frames.length){
			unit.viewCom.sprite.setSpriteFrame(this.animateCom.frames[unit.actions.frameIndex]);
			unit.actions.frameIndex++;
		}
	}
});

/**
* 核心系统-动画循环播放
*/
LoopAnimateSystem = ActionSystem.extend({
	animateCom : null,
	start : function(unit, dt){
		unit.actions.frameIndex = 0;
	},
	update : function(unit, dt){
		//播放动画
		if(unit.actions.frameIndex >= this.animateCom.frames.length){
			unit.actions.frameIndex = 0;
		}
		unit.viewCom.sprite.setSpriteFrame(this.animateCom.frames[unit.actions.frameIndex]);
		unit.actions.frameIndex++;
	}
});