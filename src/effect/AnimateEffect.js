/**
 * 	动画播放策略
 */

AnimateEffect = Effect.extend({
	name : "normalAnimate",
	run : function(unit){
		unit.body.setSpriteFrame(
				unit.currAction.frames[unit.frameIndex]);
		unit.frameIndex++;
		if(unit.frameIndex > unit.currAction.frames.length-1){
			//unit.currState.nextAct();
			//this.owner.frameIndex = 0;
			return false;
		}
		return true;
	}
});

LoopAnimateEffect = Effect.extend({
	name : "loopAnimate",
	run : function(unit){
		unit.body.setSpriteFrame(
				unit.currAction.frames[unit.frameIndex]);
		unit.frameIndex++;
		if(unit.frameIndex > unit.currAction.frames.length-1){
			unit.frameIndex = 0;
		}
		return true;
	}
});

StopAtLastEffect = Effect.extend({
	name : "stopAtLastAnimate",
	run : function(unit){
		
	}
});