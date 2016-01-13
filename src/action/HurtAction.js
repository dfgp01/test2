/**
 * 	被击中后的动作（公共Action）
 * 		2016.01.12 暂时废置，改用下面的
 */
HurtActionTMP = ActionState.extend({
	name : "hurt",
	
	phaseCom : null,
	
	init : function(data){
		var group = new PhaseGroupComponent();
		//第一阶段，普通硬直
		var phase1 = new PhaseComponent();
		//普通后退
		var motion = new MotionComponent();
		motion.dx = Service.GameSetting.hitBack;
		motion.dy = 0;
		phase1.coms[motion.name] = motion;
		//普通硬直时间
		var timer = new ActionTimerComponent();
		timer.total = Service.GameSetting.stiffTimer;
		phase1.coms[timer.name] = timer;
		group.add(phase1);
		
		//第二阶段，倒地
		var phase2 = new PhaseComponent();
		//倒地向量
		motion = new UnitMotionComponent();
		motion.dx = Service.GameSetting.hitDownX;
		motion.dy = Service.GameSetting.hitDownY;
		phase2.coms[motion.name] = motion;
		//躺在地上的时间
		timer = new ActionTimerComponent();
		timer.total = Service.GameSetting.knockDownTimer;
		phase2.coms[timer.name] = timer;
		group.add(phase2);
		this.phaseCom = group;
		ActionUtil.addSystem(this, GameUtil.sys.action.hurt);
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

/**
 *  被击中后的动作（公共Action）
 */
HurtAction = ActionState.extend({
	name : "hurt",
	
	start : function(unit){
		var effectNames = unit.coms.hurt.effects
		if(effectNames){
			for(var i in effectNames){
				GameUtil.effects[effectNames].start(unit);
			}
		}
		this.end(unit);
		//unit.coms.hurt.type 值为0~7，分别有三个标志位：远程、倒地、位移
		//普通逻辑下只需要判断 倒地和位移
		//00 : 只是受击，无任何反应（霸体）
		//01 : 后退硬直，如果dx=0，则原地硬直
		//10 : 直接向下倒地
		if(unit.coms.hurt.type == Constant.HitType.NONE){
			return;
		}
		//倒地攻击或者unit处在空中
		if((unit.coms.hurt.type & Constant.HitType.KNOCK_DOWN) || unit.coms.motion.dy != 0){
			GameUtil.actions.hurt2.start(unit);
		}
		//平推攻击
		else{
			//没有位移的原地硬直
			if(unit.coms.motion.dx == 0){
				GameUtil.actions.hurt1.start(unit);
			}else{
				GameUtil.actions.hurt2.start(unit);
			}
		}
	},
	
	update : function(dt, obj){
		//理论上不会执行到这里
		cc.log("理论上不会执行这里");
	}
});

/**
 * 原地硬直
 */
HurtAction1 = ActionState.extend({
	name : "hurt1",
	timerCom : null,
	init : function(data){
		this.timerCom = new TimerComponent();
		this.timerCom.total = Service.GameSetting.stiffTime;
	},
	start : function(obj){
		
	}
});

/**
 * 平地击退
 */
HurtAction2 = ActionState.extend({
	name : "hurt2",
	motionCom : null,
	init : function(data){
		ActionUtil.addDirectChild(this, GameUtil.actions.hurt1);
	},
	start : function(unit){
		
	}
});

/**
 * 倒地、浮空攻击
 */
HurtAction3 = ActionState.extend({
	name : "hurt3",
	motionCom : null,
	init : function(data){
		ActionUtil.addDirectChild(this, GameUtil.actions.hurt4);
	},
});

/**
 * 躺下
 */
HurtAction4 = ActionState.extend({
	name : "hurt4",
	timerCom : null,
	init : function(data){
		
	}
});