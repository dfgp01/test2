/**
 * 	击中目标后调用
 */
HurtAction = ActionState.extend({
	name : "hurt",
	
	phaseCom : null,
	
	init : function(data){
		var group = new PhaseGroupComponent();
		var phase1 = new PhaseComponent();
		var motion = new MotionComponent();
		motion.dx = Service.GameSetting.hitBack;
		motion.dy = 0;
		phase1.coms.motion = motion;
		var phase2 = new PhaseComponent();
		motion = new UnitMotionComponent();
		motion.dx = Service.GameSetting.hitDownX;
		motion.dy = Service.GameSetting.hitDownY;
		phase2.coms.motion = motion;
		group.add(phase1);
		group.add(phase2);
		this.phaseCom = group;
	},
	
	/**
	 * 逻辑：	1.轮询unit.coms.hurt.effects
	 * 		2.确定phase
	 * 		3.轮询systemList/effectList
	 */
	start : function(unit){
		var effectNames = unit.coms.hurt.effects
		if(effectNames){
			for(var i in effectNames){
				GameUtil.effects[effectNames].start(unit);
			}
		}
		var type = unit.coms.hurt.type;
		if(type == Constant.HitType.NONE){
			//无任何受击动作，当中可能是被effectNames里面的逻辑过滤了，如霸体判定
			unit.actions.phase = -1;
		}else if(type & Constant.HitType.KNOCK_DOWN){
			//倒地攻击
			unit.actions.phase = 1;
		}else{
			//普通硬直攻击，但要判断unit.dy，如果处在空中，就是倒地攻击
			if(unit.coms.motion.dy != 0){
				unit.actions.phase = 1;
			}else{
				unit.actions.phase = 0;
			}
		}
		this._super(unit);
	}
});