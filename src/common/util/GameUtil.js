/**
*	只是用来堆放很啰嗦的代码的地方
*	CreateBy Hugo-Fu 2015.12.05
*/
GameUtil = {
		
		//系统组件缓存
		systems : {
			sys : {
				main : null,
				player : null,
				motion : null,
				action : null,
			},
			act : {
				normalAnimate : null,
				loopAnimate : null,
				stand : null,
				walk : null,
				motion : null
			}
		},
		
		//效果逻辑缓存{id:class}
		effect : {
			
		},
		
		runEffect : function(obj, id){
			this.effect[id].update(obj);
		},
		
		/**
		 * 生成碰撞标示码
		 * @param obj
		 * @param mask
		 */
		collideMask : function(group){
			var mask  = 0;
			if(mask & Collide.Target.ENEMY){
				//和全阵营码进行与运算取反可标出敌对阵营
				mask  = mask | ~(obj.group.mask & Constant.Group.ALL_FACTION_MASK);
			}
		},
		
		initSystem : function(){
			//初始化通用动作系统组件
			this.systems.act.normalAnimate = new AnimateSystem();
			this.systems.act.loopAnimate = new LoopAnimateSystem();
			this.systems.act.stand = new StandActionSystem();
			this.systems.act.walk = new WalkMotionSystem();
			this.systems.act.motion  = new MotionSystem();
			
			//初始化主系统
			this.systems.sys.main = new MainSystem();
			this.systems.sys.player = new PlayerSystem();
			this.systems.sys.motion = new MotionRunSystem();
			this.systems.sys.action = new ActionRunSystem();
			var mainSystem = this.systems.sys.main;
			mainSystem.addSystem(this.systems.sys.player);
			mainSystem.addSystem(this.systems.sys.motion);
			mainSystem.addSystem(this.systems.sys.action);
		},
		
		initGroup : function(){
			Service.Container.groups[Constant.Group.TEAM1.index] = new Group(Constant.Group.TEAM1);
			Service.Container.groups[Constant.Group.TEAM2.index] = new Group(Constant.Group.TEAM2);
			Service.Container.groups[Constant.Group.TEAM3.index] = new Group(Constant.Group.TEAM3);
			Service.Container.groups[Constant.Group.BLOCK.index] = new Group(Constant.Group.BLOCK);
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
		 * 动作逻辑系统组件
		 */
		buildActionSys : function(data, action){
			
			if(DataUtil.checkNotNull(data, "motion")){
				var motionCom = new MotionComponent();
				//数据上的增量是每秒移动的距离
				motionCom.dx = data.motion.dx;
				motionCom.dy = data.motion.dy;
				action.coms[motionCom.name] = motionCom;
				ActionUtil.addSystem(action,
						this.systems.act.motion);
			}
			
			if(DataUtil.checkNotNull(data, "animate")){
				this.buildAnimateSys(data.animate, action);
			}
			
			if(DataUtil.checkNotNull(data, "attack")){
				
			}
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
		
		/**
		 * 随机化系统的设想，涉及爆率、暴击值等功能
		 * 		例：57%的暴击是如何实现的呢？
		 * 		传统的想法：100个元素，57个1,43个0，打乱，然后随机取1,。但这样设计频繁创建问题。
		 * 		现解决方案：
		 * 		9x9 乘法表？
		 * 		[1,1,1,1,1,1,1,1,1,1]
		 * 		[1,1,1,1,1,1,1,1,1,0]
		 * 		[1,1,1,1,1,1,1,1,0,0]
		 * 		[1,1,1,1,1,1,1,0,0,0]		如此类推，一共10个组，最高组10个1，最低组10个0，
		 * 
		 * 		内参数：ranInt，随机生成100个，0~9，作为索引J，用完重新生成
		 * 		外参数：seek，如57，则 57 / 10 - 1 = 4，作为索引I，第I行拥有5个1和5个0，使用ranInt定位，几率五五开
		 * 		所以，百分比的个位数几乎是忽悠的，如果需要精确，可创造 100x100数组，占内存 40000byte
		 */
		random : function(seek){
			//待实现
		}
};
