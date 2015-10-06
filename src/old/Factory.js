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

			//动画系统
			var animateSystem = null;
			if(Util.checkIsInt(data.animate, "type") && parseInt(data.animate.type) == 1){
				animateSystem = new LoopAnimateSystem();
			}else{
				animateSystem = new AnimateSystem();
			}
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
			animateSystem.animateCom = animateComponent;
			actionState.animateSystem = animateSystem;
			
			template.actionsCom.actions[actionState.name] = actionState;
			return actionState;
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
		}
};

/**
 * 检查action是否满足可构建必要条件
 */
Factory.checkActionRight = function(data){
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "name") || !Util.checkIsInt(data, "state")){
		cc.log("create ActionState error, lack of necessary data!");
		return false;
	}
	
	if(!Util.checkNotNull(data, "animate") && Util.checkArrayNull(data.animate, "frames")){
		cc.log("createActionState:" + data.name + " error, animate or animate.frames not found!");
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
	
	/*if(!Util.checkIsString(data, "firstFrame")){
		cc.log("create UnitTemplate error, must has firstFrame.");
		return false;
	}*/
	
	if(!Util.checkNotNull(data, "actions")){
		cc.log("create UnitTemplate error, must has actions.");
		return false;
	}
}