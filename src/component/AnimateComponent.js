/**
 * 		播放组件
 */

AnimateComponent = Component.extend({
	frames : null,
	playType : 0,
	speedFactor : 1
});

AnimateSystem = System.extend({
	animateCom : null,	//AnimateComponent
	start : function(){},
	update : function(dt){		//待定
		//播放动画
		if(unit.frameIndex < unit.currAction.frames.length){
			unit.body.setSpriteFrame(unit.currAction.frames[unit.frameIndex]);
			unit.frameIndex++;
		}else{
			unit.currAction.nextAct(unit);
		}
	},
	end : function(){}
})