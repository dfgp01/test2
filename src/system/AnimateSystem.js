AnimateSystem = ActionComponentSystem.extend({
	//AnimateComponent
	animateCom : null,
	start : function(dt, unit){
		unit.actions.frameIndex = 0;
	},
	update : function(unit, dt){		//待定
		//播放动画
		if(unit.actions.frameIndex < this.animateCom.frames.length){
			unit.body.setSpriteFrame(this.animateCom.frames[unit.actions.frameIndex]);
			unit.actions.frameIndex++;
		}
	},
	end : function(dt, unit){}
});