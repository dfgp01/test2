/**
 * 初始化相关的代码都丢到这
 */
Initializer = {

		/**
		 * 初始化游戏全局参数
		 */
		initGobalParam : function(){
			//引力设置
			var motionCom = new MotionComponent();
			motionCom.dy = GameSetting.gravity;
			motionCom.maxDy = GameSetting.maxGravity;
			Service.Gobal.gravityCom = motionCom;

			//被击中相关设置
			motionCom = new MotionComponent();
			motionCom.dx = GameSetting.hitBack;
			Service.Gobal.hitBackMotion = motionCom;
			var timerCom = new TimerComponent();
			timerCom.total = GameSetting.stiffTime;
			Service.Gobal.stiffTimer = timerCom;

			motionCom = new MotionComponent();
			motionCom.dx = GameSetting.hitDownX;
			motionCom.dy = GameSetting.hitDownY;
			Service.Gobal.hitDownMotion = motionCom;
			timerCom = new TimerComponent();
			timerCom.total = GameSetting.knockDownTime;
			Service.Gobal.stiffDownTimer = timerCom;
		},
		
		/**
		 * 初始化组件逻辑系统
		 */
		initSystem : function(){
			//初始化通用动作系统组件
			this.systems.act.normalAnimate = new AnimateSystem();
			this.systems.act.loopAnimate = new LoopAnimateSystem();
			this.systems.act.stand = new StandActionSystem();
			this.systems.act.walk = new WalkMotionSystem();
			this.systems.act.motion  = new MotionSystem();
			this.systems.act.hurt = new HurtSystem();

			//初始化主系统
			this.systems.sys.main = new MainSystem();
			this.systems.sys.player = new PlayerSystem();
			this.systems.sys.motion = new MotionRunSystem();
			this.systems.sys.action = new ActionRunSystem();
			this.systems.sys.EvtMsg = new EventMessageSystem();
			var mainSystem = this.systems.sys.main;
			mainSystem.addSystem(this.systems.sys.player);
			mainSystem.addSystem(this.systems.sys.motion);
			mainSystem.addSystem(this.systems.sys.action);
			mainSystem.addSystem(this.systems.sys.EvtMsg);
		},
		
		/**
		 * 一般伤害动作定义
		 */
		initHurtAction : function(){
			var action = Factory.createCustomAction(HurtAction);
			this.actions.hurt = action;
		},

		/**
		 * 单位组定义
		 */
		initGroup : function(){
			//逻辑，至少初始化三个组：block,team1,team2，index分别为0 1 2
			// teamMask = 2的group.length次方-2
			//因为：group[0]=block。假设有三个组，index为 1 2 3，teamMask应该为 1110，block组需要自己实现相应逻辑
			
			var group = null;
			var teamCharacterMask = 0;		//用于计算敌对阵营的
			for(var i=0; i<groupsData; i++){
				group = new Group(groupsData[i].type, groupsData[i].name);
				group.index = Service.Container.groups.length;	//index是Container.group[]中的下标
				group.mask = Math.pow(2, group.index);			//2的index次方就是mask值
				Service.Container.groups.push(group);
				if(group.type == Constant.Group.TYPE_CHARACTER){
					teamCharacterMask = teamCharacterMask | group.mask;
					group = new Group(Constant.Group.TYPE_BULLET, groupsData[i].name + "_bullet");
					group.index = Service.Container.groups.length;
					group.mask = Math.pow(2, group.index);
					Service.Container.groups.push(group);
				}
			}
			Service.Container.teamMask = teamCharacterMask;
		},

		/**
		 * 初始化单位的构建模板
		 */
		initUnitTemplate : function(data){

			//必要性检查
			if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data, "name")){
				cc.log("create Character error, lack of necessary data! data is null or no name.");
				return;
			}
			if(!DataUtil.checkIsArray(data, "actions")){
				cc.log("create Character error, must has actions!");
				return;
			}

			cc.log("initial unit template......");
			var unitTemplate = Factory.createUnitTemplate(data);

			cc.log("initial actions data......");
			for(var i in data.actions){
				var act = Factory.createActionState(data.actions[i]);
				unitTemplate.actions.names[act.name] = act;
			}

			//默认第一个action就是初始动作
			var firstActName = data.actions[0].name;
			unitTemplate.firstAct = unitTemplate.actions.names[firstActName];

			//根据不同种类的游戏对象补充各自的动作系统
			switch(unitTemplate.type){
			case Constant.GameObject.Type.MONSTER :
			case Constant.GameObject.Type.HERO :
				this.buildCharacterActionSys(unitTemplate.actions.names);
				break;
			default:
				break;
			}

			if(!DataUtil.checkArrayNull(data, "actLamda")){
				cc.log("initial action & skill link relationship......");
				for(var i in data.actLamda){
					cc.log("  initial : " + data.actLamda[i]);
					ActionUtil.linkForExpress(data.actLamda[i], unitTemplate.actions.names);
				}
				//检测闭环
				ActionUtil.treeMap([], unitTemplate.actions.names, "");
				cc.log(" lamda express finish.");
			}
			Service.Container.templates[unitTemplate.name] = unitTemplate;
		},
		
		/**
		 * 构建动作逻辑系统组件
		 */
		buildActionSys : function(data, action){

			if(DataUtil.checkNotNull(data, "motion")){
				var motionCom = new ActionMotionComponent();
				motionCom.init(data.motion);
				action.coms[motionCom.name] = motionCom;
				ActionUtil.addSystem(action, this.systems.act.motion);
			}

			if(DataUtil.checkNotNull(data, "collide")){
				var collideCom = new ActionCollideComponent();
				collideCom.init(data.collide);
				action.coms[collideCom.name] = collideCom;
				ActionUtil.addSystem(action, this.systems.act.collide);
			}

			if(DataUtil.checkNotNull(data, "animate")){
				this.buildAnimateSys(data.animate, action);
			}

			if(DataUtil.checkNotNull(data, "attack")){

			}
		},

		/**
		 * 构建动画逻辑系统组件
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
				animateComponent.delays = [];
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
				system = this.systems.act.normalAnimate;
				break;
			case Constant.ANIMATE_TYPE.LOOP:
				system = this.systems.act.loopAnimate;
				break;
			default :
				system = this.systems.act.normalAnimate;
			break;
			}
			action.coms.animate = animateComponent;
			ActionUtil.addSystem(action, system);
		},
		
		/**
		 * 补充人物的动作系统
		 */
		buildCharacterActionSys : function(actions){
			var standAct = actions.stand;
			if(standAct){
				//增加人物空闲时的控制系统
				ActionUtil.addSystem(standAct, this.systems.act.stand);
			}
			var walkAct = actions.walk;
			if(walkAct){
				//将角色的一般运动系统改为受速度系数影响的运动系统
				ActionUtil.replaceSystem(walkAct, "motion", this.systems.act.walk);
			}
			return;
		},
}
