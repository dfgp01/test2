/**
 * 工厂类，用于建造游戏组件。
 */
Factory = {

		/**
		 * 创建一个单位模板
		 */
		createUnitTemplate : function(data){

			//必要性检查
			// !ObjectUtil.checkIsString(data, "res") 这个检查不应该写在这里，应该有个统一的资源表要填
			if(!ObjectUtil.checkNotNull(data) || !ObjectUtil.checkIsString(data, "name")){
				cc.log("create Unit error, lack of necessary data! data is null or noname.");
				return null;
			}
			if(!ObjectUtil.checkIsInt(data, "type")){
				cc.log("create UnitTemplate error, field:type must int.");
				return null;
			}
			if(!ObjectUtil.checkNotNull(data, "actions")){
				cc.log("create UnitTemplate error, must has actions.");
				return null;
			}

			var unitTemplate = new UnitTemplate();
			unitTemplate.init(data);

			return unitTemplate;
		},

		/**
		 * 创建一个动作节点
		 */
		createActionState : function(data, template){
			
			if(!ObjectUtil.checkNotNull(data) || !ObjectUtil.checkIsString(data, "name", true)){
				cc.log("create ActionState error, lack of necessary data!");
				return null;
			}

			if(!ObjectUtil.checkNotNull(data, "animate") && ObjectUtil.checkArrayNull(data.animate, "frames")){
				cc.log("createActionState:" + data.name + " error, animate or animate.frames not found!");
				return null;
			}
			
			var actionState = new ActionState();
			actionState.name = data.name;
			actionState.systemList = [];
			actionState.coms = {};
			cc.log("creating action:[" + data.name + "].");
			
			//设置key
			actionState.key = ObjectUtil.checkIsString(data,"key") == true ? data.key : Constant.DIRECT_CHILDNODE;
			//设置状态
			actionState.state = ObjectUtil.checkIsInt(data,"state") == true ? data.state : 0;
			
			//初始化动画组件系统
			this.buildAnimateSys(data.animate, actionState);
			//初始化动作组件系统
			this.buildActionSys(data, actionState);

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
			animateComponent.type = ObjectUtil.checkIsInt(animate, "type") == true ? parseInt(animate.type) : 0;
			action.coms.animate = animateComponent;
			
			switch(animateComponent.type){
			case Constant.ANIMATE_TYPE.NORMAL:
				action.animateSystem = Service.Container.animateSystems.normal;
				break;
			case Constant.ANIMATE_TYPE.LOOP:
				action.animateSystem = Service.Container.animateSystems.loop;
				break;
			default :
				action.animateSystem = Service.Container.animateSystems.normal;
				break;
			}
			action.coms.animate = animateComponent;
		},
		
		/**
		 * 动作逻辑系统组件
		 */
		buildActionSys : function(data, action){
			var code = 0;
			if(ObjectUtil.checkIsInt(data, "featureCode")){
				code = data.featureCode;
			}
			if(ObjectUtil.checkNotNull(data, "motion")){
				var motionCom = new MotionComponent();
				//数据上的增量是每秒移动的距离
				motionCom.dx = data.motion.dx;
				motionCom.dy = data.motion.dy;
				action.coms[motionCom.name] = motionCom;
				ActionUtil.addSystem(action,
						Service.Container.actionSystems.motion);
			}
			if(ObjectUtil.checkNotNull(data, "attack")){
				
			}
		},
		
		/**
		 * 补充人物的动作系统
		 */
		buildCharacterActionSys : function(actions){
			var standAct = actions.stand;
			if(standAct){
				//增加人物空闲时的控制系统
				ActionUtil.addSystem(standAct, Service.Container.actionSystems.stand);
			}
			var walkAct = actions.walk;
			if(walkAct){
				//将角色的一般运动系统改为受速度系数影响的运动系统
				ActionUtil.replaceSystem(walkAct, "motion", Service.Container.actionSystems.walk);
			}
			return;
		}
		
};