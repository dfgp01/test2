/**
 * 受击相关的系统逻辑
 * by Hugo-Fu 2015.12.31
 */

/**
 * 留着以后写
 */
HurtSystem = ActionSystem.extend({
	name : "hurt"
});

HurtPhaseSystem = ActionPhaseSystem.extend({
	name : "phase",
	ctor : function(){
		this._super();
		this.add(new HurtPhase1());
		this.add(new HurtPhase2());
	}
});

/**
 * 阶段1，后退硬直
 */
HurtPhase1 = ActionSystem.extend({
	name : "phase",
	
	start : function(obj, phaseCom){
		obj.coms.motion.dx += phaseCom.coms.motion.dx;
		EngineUtil.setFrame(obj, phaseCom.coms.animate.frames[0]);
		ComponentUtil.setTime(obj, phaseCom.coms.timer);
	},
	
	update : function(dt, obj, phaseCom){
		if(ComponentUtil.checkTimeout(obj, phaseCom.coms.timer)){
			obj.actions.endFlag = true;
		}
	}
});

/**
 * 阶段2，落地
 */
HurtPhase2 = ActionSystem.extend({
	name : "phase",
	
	start : function(obj, phaseCom){
		obj.coms.motion.dx += phaseCom.coms.motion.dx;
		obj.coms.motion.dy += phaseCom.coms.motion.dy;
		EngineUtil.setFrame(obj, phaseCom.coms.animate.frames[0]);
	},
	
	update : function(dt, obj, phaseCom){

		if(obj.coms.view.sprite.getPositionY() > obj.coms.view.z){
			//还在空中
			obj.coms.motion.dy += Service.GameSetting.gravity;
			EngineUtil.setFrame(obj, phaseCom.coms.animate.frames[0]);
		}else{
			//落地了
			obj.coms.view.sprite.setPosition(
				obj.coms.view.sprite.getPositionX(),
					obj.coms.view.z);
		}
	}
});

/**
 * 阶段3，躺着
 */
HurtPhase3 = ActionSystem.extend({
	name : "phase",
	
	start : function(obj, phaseCom){
		EngineUtil.setFrame(obj, phaseCom.coms.animate.frames[3]);
		ComponentUtil.setTime(obj, phaseCom.coms.timer);
	},
	
	update : function(dt, obj, phaseCom){
		if(ComponentUtil.checkTimeout(obj, phaseCom.coms.timer)){
			obj.actions.endFlag = true;
		}
	}
});