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
	
	start : function(unit){
		//首先判断phase
		unit.actions.phase = unit.coms.hurt.type - 1;
		this._super(unit);
	},
	
	update : function(dt, unit){
		
	}
});