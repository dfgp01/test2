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
				actionState.key = "-";
			}
			actionState.animateCom = new AnimateComponent();
			if(Util.checkIsString(data,"action")){
				var actRef = template.actionsCom.actions[data.action];
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
			template.actionsCom.actions[actionState.name] = actionState;
			return actionState;
		},
		
		/**
		 * 动画逻辑组件
		 */
		buildAnimateSys : function(data, action){
			if(Util.checkIsInt(data, "animateType")){
				action.animateCom.type = data.animateType;
			}else{
				action.animateCom.type = 0;
			}
			switch(action.animateCom.type){
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
				action.type = data.type;
			}else{
				action.type = 0;
			}
			switch(data.type){
			case Constant.ACTION_TYPE.STAND:
				var idle = new StandActionSystem();
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
			unitTemplate.speedCom = new SpeedPropertiesComponent();
			
			unitTemplate.actionsCom = new ActionsComponent();
			unitTemplate.actionsCom.actions = {};
			
			unitTemplate.actionsCom.firstFrame = data.firstFrame;

			return unitTemplate;
		}
};

/**
 * 检查action是否满足可构建必要条件
 */
Factory.checkActionRight = function(data){
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "name", true)){
		cc.log("create ActionState error, lack of necessary data!");
		return false;
	}
	
	if(!Util.checkIsString(data,"action") && Util.checkArrayNull(data, "frames")){
		cc.log("createActionState:" + data.name + " error, action or frames has one at lease!");
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
	
	if(!Util.checkIsString(data, "firstFrame")){
		cc.log("create UnitTemplate error, must has firstFrame.");
		return false;
	}
	
	if(!Util.checkNotNull(data, "actions")){
		cc.log("create UnitTemplate error, must has actions.");
		return false;
	}
	return true;
}