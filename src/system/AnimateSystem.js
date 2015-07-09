/**
 * 核心系统-动画播放
 */
AnimateSystem = ActionSystem.extend({
	
	//引用对应action的animateCom
	animateCom : null,
	
	//这个方法暂时用不上
	start : function(unit, dt){
		unit.actionsCom.actions.frameIndex = 0;
	},
	update : function(unit, dt){
		//播放动画
		if(unit.actionsCom.frameIndex < this.animateCom.frames.length){
			unit.viewCom.sprite.setSpriteFrame(this.animateCom.frames[unit.actionsCom.frameIndex]);
			unit.actionsCom.frameIndex++;
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
		cc.log(unit.actionsCom.frameIndex + "," + dt);
		//播放动画
		if(unit.actionsCom.frameIndex >= this.animateCom.frames.length){
			unit.actionsCom.frameIndex = 0;
		}
		unit.viewCom.sprite.setSpriteFrame(this.animateCom.frames[unit.actionsCom.frameIndex]);
		unit.actionsCom.frameIndex++;
	}
});