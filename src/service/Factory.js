/**
 * 工厂类，用于建造游戏组件。
 */
Factory = {

		/**
		 * 创建一个单位模板
		 */
		createUnitTemplate : function(data){

			if(!Util.checkNotNull(data) || !Util.checkIsString(data, "res") || !Util.checkIsString(data, "name")){
				cc.log("create Unit error, lack of necessary data!");
				return null;
			}
			if(!Util.checkIsInt(data, "type")){
				cc.log("create UnitTemplate error, field:type must int.");
				return null;
			}
			if(!Util.checkNotNull(data, "actions")){
				cc.log("create UnitTemplate error, must has actions.");
				return null;
			}

			var unitTemplate = new UnitTemplate();
			unitTemplate.init(data);

			return unitTemplate;
		},

		/**
		 * 创建一个动作节点，并存到模板中
		 */
		createActionState : function(data, template){
			
			if(!Util.checkNotNull(data) || !Util.checkIsString(data, "name", true)){
				cc.log("create ActionState error, lack of necessary data!");
				return null;
			}

			if(!Util.checkNotNull(data, "animate") && Util.checkArrayNull(data.animate, "frames")){
				cc.log("createActionState:" + data.name + " error, animate or animate.frames not found!");
				return null;
			}
			
			var actionState = new ActionState();
			actionState.name = data.name;
			actionState.systemList = [];
			actionState.coms = {};
			cc.log("creating action:[" + data.name + "].");
			
			//设置key和默认key
			if(Util.checkIsString(data,"key")){
				actionState.key = data.key;
			}else{
				actionState.key = Constant.DIRECT_CHILDNODE;
			}
			
			if(Util.checkIsInt(data,"state")){
				actionState.state = data.state;
			}else{
				actionState.state = 0;
			}
			
			
			//初始化动画组件系统
			this.buildAnimateSys(data.animate, actionState);
			
			//初始化动作组件系统
			this.buildActionSys(data, actionState);
			
			template.actionsCom.actions[actionState.name] = actionState;
			return actionState;
		},
		
		/**
		 * 动画逻辑系统组件
		 */
		buildAnimateSys : function(animate, action){
			var animateComponent = new AnimateComponent();
			var list = [];
			for(var i in animate.frames){
				var frame = cc.spriteFrameCache.getSpriteFrame(animate.frames[i]);
				if(frame){
					list.push(frame);
				}else{
					cc.log("action:" + action.name + " frame:" + animate.frames[i] + " not found");
					return null;
				}
			}
			animateComponent.frames = list;
			
			if(Util.checkIsInt(animate, "type")){
				animateComponent.type = parseInt(animate.type);
			}else{
				animateComponent.type = 0;
			}

			var animateSystem = null;
			switch(animateComponent.type){
			case Constant.ANIMATE_TYPE.NORMAL:
				animateSystem = Service.Container.animateSystems.normal;
				break;
			case Constant.ANIMATE_TYPE.LOOP:
				animateSystem = Service.Container.animateSystems.loop;
				break;
			default :
				animateSystem = Service.Container.animateSystems.normal;
				break;
			}
			action.coms.animate = animateComponent;
			action.animateSystem = animateSystem;
		},
		
		/**
		 * 动作逻辑系统组件
		 */
		buildActionSys : function(data, action){
			var code = 0;
			if(Util.checkIsInt(data, "featureCode")){
				code = data.featureCode;
			}
			if(Util.checkNotNull(data, "motion")){
				var motionCom = new MotionComponent();
				//数据上的增量是每秒移动的距离
				motionCom.dx = data.motion.dx;
				motionCom.dy = data.motion.dy;
				action.coms[motionCom.name] = motionCom;
				action.addSystem(
						Service.Container.actionSystems.motion);
			}
			if(Util.checkNotNull(data, "attack")){
				
			}
		},
		
		/**
		 * 补充人物的动作系统
		 */
		buildCharacterActionSys : function(actions){
			var standAct = actions.stand;
			if(standAct){
				//增加人物空闲时的控制系统
				standAct.addSystem(Service.Container.actionSystems.stand);
			}
			var walkAct = actions.walk;
			if(walkAct){
				//将角色的一般运动系统改为受速度系数影响的运动系统
				walkAct.replaceSystem("motion", Service.Container.actionSystems.walk);
			}
			return;
		}
		
};