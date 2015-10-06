/**
 * 工厂类，用于建造游戏组件。
 */
Factory = {

		/**
		 * 创建一个动作节点，并存到模板中
		 */
		createActionState : function(data, template){
			if(!this.checkActionRight(data)){
				return null;
			}
			var actionState = new ActionState();
			//actionState.init(data);
			actionState.name = data.name;
			//设置key和默认key
			if(Util.checkIsString(data,"key")){
				actionState.key = data.key;
			}else{
				actionState.key = Constant.DIRECT_CHILDNODE;
			}
			
			//初始化动画组件
			var animateComponent = new AnimateComponent();
			var list = [];
			for(var i in data.animate.frames){
				var frame = cc.spriteFrameCache.getSpriteFrame(data.animate.frames[i]);
				if(frame){
					list.push(frame);
				}else{
					cc.log("action:" + data.name + " frame:" + data.animate.frames[i] + " not found");
					return null;
				}
			}
			animateComponent.frames = list;
			if(Util.checkIsInt(data, "type")){
				animateComponent.type = parseInt(data.animate.type);
			}else{
				animateComponent.type = 0;
			}
			this.buildAnimateSys(animateComponent, actionState);
			
			//初始化动作系统
			this.buildActionSys(data, actionState);
			template.actionsCom.actions[actionState.name] = actionState;
			return actionState;
		},
		
		/**
		 * 动画逻辑系统组件
		 */
		buildAnimateSys : function(animateComponent, action){
			var animateSystem = null;
			switch(animateComponent.type){
			case Constant.ANIMATE_TYPE.NORMAL:
				animateSystem = new AnimateSystem();
				break;
			case Constant.ANIMATE_TYPE.LOOP:
				animateSystem = new LoopAnimateSystem();
				break;
			default :
				animateSystem = new AnimateSystem();
				break;
			}
			animateSystem.animateCom = animateComponent;
			action.animateSystem = animateSystem;
		},
		
		/**
		 * 动作逻辑系统组件
		 */
		buildActionSys : function(data, action){
			var code = data.featureCode;
			if(code & Constant.ActionFeature.MOTION && Util.checkNotNull(data, "motion", true)){
				var motionCom = new MotionComponent();
				//数据上的增量是每秒移动的距离，这里要换算成每帧移动的距离
				motionCom.dx = data.motion.dx * Service.GameSetting.logicTick;
				motionCom.dy = data.motion.dy * Service.GameSetting.logicTick;
				var motionSystem = new MotionSystem();
				motionSystem.motionCom = motionCom;
				action.addSystem(motionSystem);
			}
		},
		
		/**
		 * 创建一个单位模板
		 */
		createUnitTemplate : function(data){
			
			if(!this.checkUnitRight(data)){
				return null;
			}

			var unitTemplate = new UnitTemplate();
			unitTemplate.init(data);

			return unitTemplate;
		},
		
		/**
		 * 补充人物的动作系统
		 */
		buildCharacterActionSys : function(template){
			var standAct = template.actionsCom.actions.stand;
			if(standAct){
				//增加人物空闲时的控制系统
				var idle = new StandActionSystem();
				standAct.addSystem(standAct);
			}
			var walkAct = template.actionsCom.actions.walk;
			if(walkAct){
				//增加人物走路时的控制系统和速度系统
				var walkSys = new WalkSystem();
				var walkingMotion = WalkingMotionSystem();
				walkAct.addSystem(walkSys);
				walkAct.addSystemAfter("motionSystem", walkingMotion);
			}
			return;
		}
};

/**
 * 检查action是否满足可构建必要条件
 */
Factory.checkActionRight = function(data){
	
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "name", true) || !Util.checkIsInt(data, "featureCode", true)){
		cc.log("create ActionState error, lack of necessary data!");
		return false;
	}
	
	if(!Util.checkNotNull(data, "animate") && Util.checkArrayNull(data.animate, "frames")){
		cc.log("createActionState:" + data.name + " error, animate or animate.frames not found!");
		return false;
	}
	
	//一定要返回啊，被这个坑死了。
	return true;
}

/**
 * 检查unit是否满足可构建必要条件
 */
Factory.checkUnitRight = function(data){
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "res") || !Util.checkIsString(data, "name")){
		cc.log("create Unit error, lack of necessary data!");
		return false;
	}
	
	if(!Util.checkNotNull(data, "actions")){
		cc.log("create UnitTemplate error, must has actions.");
		return false;
	}
	
	//一定要返回啊，被这个坑死了。
	return true;
}