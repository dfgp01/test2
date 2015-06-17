/**
 * 		播放组件
 */

AnimateComponent = Component.extend({
	frames : null,
	playType : 0,
	speedFactor : 1
});

AnimateSystem = ActionSystem.extend({
	animateCom : null,	//AnimateComponent
	start : function(){},
	update : function(unit, dt){		//待定
		//播放动画
		if(unit.frameIndex < unit.currAction.frames.length){
			unit.body.setSpriteFrame(unit.currAction.frames[unit.frameIndex]);
			unit.frameIndex++;
		}
	},
	end : function(){}
})