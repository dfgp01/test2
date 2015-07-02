/**
 * 工厂类，用于建造游戏组件。
 */
Factory = {

		/**
		 * 创建一个动作节点，并存到模板中
		 */
		createActionState : function(data, template){
			if(!checkActionRight(data)){
				return null;
			}
			var actionState = new ActionState();
			//actionState.init(data);
			actionState.name = data.name;

			actionState.animateCom = new AnimateComponent();
			if(Util.checkIsString(data,"action")){
				var actRef = template.actions[data.action];
				if(actRef){
					actionState.animateCom.frames = actRef.animateCom.frames;
				}else{
					cc.log("createActionState error, action:[" + data.action + "] not found!");
					return null;
				}
			}

			if(!Util.checkArrayNull(data, "frames")){
				//cc.log("createActionState error, frames is null~!");
				var list = [];
				for(var i in data.frames){
					var frame = cc.spriteFrameCache.getSpriteFrame(data.frames[i]);
					if(frame){
						list.push(frame);
					}else{
						cc.log("action:" + data.name + " frame:" + data.frames[i] + " not found");
						return null;
					}
				}
				actionState.animateCom.frames = list;
			}
			
			this.buildAnimateSys(data, actionState);
			this.buildActionSys(data, actionState);
			template.actions[actionState.name] = actionState;
			return actionState;
		},
		
		/**
		 * 动画逻辑组件
		 */
		buildAnimateSys : function(action){
			if(Util.checkIsInt(data, "animateType")){
				actionState.animateCom.type = data.animateType;
			}else{
				actionState.animateCom.type = 0;
			}
			switch(actionState.animateCom.type){
			case Constant.ANIMATE_TYPE.NORMAL:
				var sys = new AnimateSystem();
				sys.animateCom = action.animateCom;
				action.animateSys = sys;
				break;
			case Constant.ANIMATE_TYPE.LOOP:
				var sys = new LoopAnimateSystem();
				sys.animateCom = action.animateCom;
				action.animateSys = sys;
				break;
			}
		},
		
		/**
		 * 动作逻辑组件
		 */
		buildActionSys : function(data, action){
			if(Util.checkIsInt(data, "type")){
				actionState.type = data.type;
			}else{
				actionState.type = 0;
			}
			switch(data.type){
			case Constant.ACTION_TYPE.IDLE:
				var idle = new IdleActionSystem();
				action.addSystem(idle);
				break;
			case Constant.ACTION_TYPE.WALK:
				var walk = new WalkActionSystem();
				action.addSystem(walk);
				break;
			default:
				break;
			}
		},
		
		/**
		 * 创建一个Unit
		 */
		createUnitTemplate : function(data){
			
			if(!this.checkUnitRight(data)){
				return null;
			}

			var unitTemplate = new UnitTemplate();
			unitTemplate.name = data.name;

			//unitTemplate.viewCom :  = new ViewComponent();
			unitTemplate.hitCom = new HitPropertiesComponent();
			unitTemplate.hurtCom = new HurtPropertiesComponent();
			unitTemplate.speedCom = new SpeedComponent();
			unitTemplate.actionsCom = new ActionsComponent();
			unitTemplate.actionsCom.firstFrame = data.firstFrame;

			return unitTemplate;
		}
};

/**
 * 检查action是否满足可构建必要条件
 */
Factory.checkActionRight = function(data){
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "name", true) || !Util.checkIsInt(data, "state", true) || !Util.checkIsInt(data, "type", true)){
		cc.log("create ActionState error, lack of necessary data!");
		return false;
	}
	
	if(!Util.checkIsString(data,"action") && Util.checkArrayNull(data, "frames")){
		cc.log("createActionState:" + data.name + " error, action or frames has one at lease!");
		return false;
	}
}

/**
 * 检查unit是否满足可构建必要条件
 */
Factory.checkUnitRight = function(data){
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "name")){
		cc.log("create Unit error, lack of necessary data!");
		return false;
	}
	
	if(!Util.checkIsString(data, "firstFrame")){
		cc.log("create UnitTemplate error, must has firstFrame.");
		return false;
	}
	
	if(!Util.checkNotNull(data, "actions")){
		cc.log("create UnitTemplate error, must has actions.");
		return false;
	}
}