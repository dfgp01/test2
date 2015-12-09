/**
 * 工厂类，用于建造游戏组件。
 */
Factory = {

		/**
		 * 创建一个单位模板
		 */
		createUnitTemplate : function(data){

			//必要性检查
			// !DataUtil.checkIsString(data, "res") 这个检查不应该写在这里，应该有个统一的资源表要填
			if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data, "name")){
				cc.log("create Unit error, lack of necessary data! data is null or noname.");
				return null;
			}
			if(!DataUtil.checkIsInt(data, "type")){
				cc.log("create UnitTemplate error, field:type must int.");
				return null;
			}
			if(!DataUtil.checkNotNull(data, "actions")){
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
			
			if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data, "name", true)){
				cc.log("create ActionState error, lack of necessary data!");
				return null;
			}

			if(!DataUtil.checkNotNull(data, "animate") && DataUtil.checkArrayNull(data.animate, "frames")){
				cc.log("createActionState:" + data.name + " error, animate or animate.frames not found!");
				return null;
			}
			
			var actionState = new ActionState();
			actionState.name = data.name;
			actionState.systemList = [];
			actionState.coms = {};
			cc.log("creating action:[" + data.name + "].");
			
			//设置key
			actionState.key = DataUtil.checkIsString(data,"key") == true ? data.key : Constant.DIRECT_CHILDNODE;
			//设置状态
			actionState.state = DataUtil.checkIsInt(data,"state") == true ? data.state : 0;
			
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
			var animateComponent = new AnimateComponent().newInstance();
			var frameList = [];
			for(var i in animate.frames){
				var frame = cc.spriteFrameCache.getSpriteFrame(animate.frames[i]);
				if(frame){
					frameList.push(frame);
				}else{
					cc.log("action:" + action.name + " frame:" + animate.frames[i] + " not found");
					return null;
				}
			}
			animateComponent.frames = frameList;
			
			//设置每帧延时
			if(!DataUtil.checkArrayNull(animate,"delays")){
				if(animate.delays.length != frameList.length){
					cc.log("animate.delays 数组和frame数量不对等.");
					return null;
				}
				for(var i=0; i<animate.delays.length; i++){
					animateComponent.delays.push(animate.delays[i]);
				}
			}else{
				for(var i=0; i<frameList.length; i++){
					//设置默认动画帧时长
					animateComponent.delays.push(
							Service.GameSetting.frameTick);
				}
			}

			animateComponent.type = DataUtil.checkIsInt(animate, "type") == true ? parseInt(animate.type) : 0;
			action.coms.animate = animateComponent;
			
			var system;
			switch(animateComponent.type){
			case Constant.ANIMATE_TYPE.NORMAL:
				system = Service.Container.animateSystems.normal;
				break;
			case Constant.ANIMATE_TYPE.LOOP:
				system = Service.Container.animateSystems.loop;
				break;
			default :
				system = Service.Container.animateSystems.normal;
				break;
			}
			action.coms.animate = animateComponent;
			ActionUtil.addSystem(action, system);
		},
		
		/**
		 * 动作逻辑系统组件
		 */
		buildActionSys : function(data, action){
			var code = 0;
			if(DataUtil.checkIsInt(data, "featureCode")){
				code = data.featureCode;
			}
			if(DataUtil.checkNotNull(data, "motion")){
				var motionCom = new MotionComponent();
				//数据上的增量是每秒移动的距离
				motionCom.dx = data.motion.dx;
				motionCom.dy = data.motion.dy;
				action.coms[motionCom.name] = motionCom;
				ActionUtil.addSystem(action,
						Service.Container.actionSystems.motion);
			}
			if(DataUtil.checkNotNull(data, "attack")){
				
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