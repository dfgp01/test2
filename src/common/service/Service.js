/**
 * 公共服务组件，提供大部分常用的业务接口
 * edit by Hugo-Fu 2015.06.26
 */

Service = {

	//游戏经过时间
	gameTime : 0,
	
	//上一帧剩下的时间数，实际上是小数，取余运算时用整数进行。
	remainDt : 0.0000,
	
	//主循环最外层系统
	mainSystem : null,
	
	//消息系统
	eventDispatchSystem : null,
	
	/**
	 * 游戏经过时间递增
	 */
	gameTimeAfter : function(dt){
		this.gameTime += dt;
	},
	
	logicTick : function(){
		return this.GameSetting.logicTick;
	},
	
	/**
	 * 得到所有单位列表
	 */
	getAllObjects : function(){
		return this.Container.objList;
	},
	
	/**
	 * 根据名称和id号的联合串获取缓存中的对象
	 */
	findObj : function(nameId){
		return this.Container.units[nameId];
	},
	
	/**
	 * 	从指定模板中创建新对象
	 */
	createObj : function(tempName, group){
		var tmp = this.Container.templates[tempName];
		if(!tmp){
			cc.log("template: " + tempName + " not found!");
			return null;
		}else{
			var obj = tmp.getNewInstance();
			obj.active = true;
			if(!this.Container.units[obj.id]){
				//如果缓存内没有此单位，则加入
				this.Container.units[obj.id] = obj;
			}
			obj.actionsCom.firstAct.start(obj);
			this.Container.objList.push(obj);
			obj.group = group;
			return obj;
		}
	},
	
	/**
	 * 初始化单位设置，构建对象
	 */
	initUnitTemplate : function(data){
		
		//必要性检查
		if(!ObjectUtil.checkNotNull(data) || !ObjectUtil.checkIsString(data, "name")){
			cc.log("create Character error, lack of necessary data! data is null or no name.");
			return;
		}
		if(!ObjectUtil.checkIsArray(data, "actions")){
			cc.log("create Character error, must has actions!");
			return;
		}
		
		cc.log("initial unit template......");
		var unitTemplate = Factory.createUnitTemplate(data);
		this.Container.templates[unitTemplate.name] = unitTemplate;
		
		cc.log("initial actions data......");
		for(var i in data.actions){
			var act = Factory.createActionState(data.actions[i]);
			unitTemplate.actionsCom.actions[act.name] = act;
		}
		
		//默认第一个action就是初始动作
		var firstActName = data.actions[0].name;
		unitTemplate.actionsCom.firstAct = unitTemplate.actionsCom.actions[firstActName];
		
		//根据不同种类的游戏对象补充各自的动作系统
		switch(unitTemplate.type){
		case Constant.GameObjectType.MONSTER :
		case Constant.GameObjectType.HERO :
			Factory.buildCharacterActionSys(unitTemplate.actionsCom.actions);
			break;
		default:
			break;
		}
		
		if(!ObjectUtil.checkArrayNull(data, "actLamda")){
			cc.log("initial action & skill link relationship......");
			for(var i in data.actLamda){
				cc.log("  initial : " + data.actLamda[i]);
				ActionUtil.linkForExpress(data.actLamda[i], unitTemplate.actionsCom.actions);
			}
			//临时临时
			var li = ActionUtil.findByNames(data.baseAct, unitTemplate.actionsCom.actions);
			for(var i in li){
				unitTemplate.actionsCom.baseAct[li[i].name] = li[i];
			}
			//ActionUtil.childrenShow(unitTemplate.actionsCom.actions);
			ActionUtil.treeMap([], unitTemplate.actionsCom.baseAct, "");
			cc.log(" lamda express finish.");
		}
	},
	
	/**
	 * 初始化玩家配置
	 */
	initPlayer : function(){
		if(!ObjectUtil.checkIsString(playerData, "unit")){
			return;
		}
		this.Container.player.character = Service.createObj(playerData.unit, Constant.UnitGroup.PLAYER);
	},
	
	/**
	 * 获取玩家信息
	 */
	getPlayer : function(){
		return this.Container.player;
	},
	
	/**
	 * 初始化通用动作系统组件
	 */
	initActionSystem : function(){
		Service.Container.animateSystems.normal = new AnimateSystem();
		Service.Container.animateSystems.loop = new LoopAnimateSystem();
		Service.Container.actionSystems.stand = new StandActionSystem();
		Service.Container.actionSystems.walk = new WalkMotionSystem();
		Service.Container.actionSystems.motion  = new MotionSystem();
	},
	
	/**
	 * 初始化主系统
	 */
	initSystem : function(){
		var mainSystem = new MainSystem();
		mainSystem.addSystem(new PlayerSystem());
		mainSystem.addSystem(new ActionRunSystem());
		mainSystem.addSystem(new AnimateRunSystem());
		mainSystem.addSystem(new MotionRunSystem());
		mainSystem.start();
		this.mainSystem = mainSystem;
	},
	
	getActionSystem : function(name){
		return this.Container.actionSystems[name];
	},
	
	getAnimateSystem : function(name){
		return this.Container.animateSystems[name];
	},
	
	//加入到 消息/事件 列表中，等待执行
	dispatchEvent : function(evt){
		this.eventDispatchSystem.addEvent(evt);
	},
	
	/**
	 * 全局数据容器，存储所有游戏对象，用于数据共享，方便对象间的访问
	 */
	Container : {

			//动作动画系统单例存储
			actionSystems : {},
			animateSystems : {},
		
			//玩家数据
			player : {
				character : null,
				score : 0
			},
			
			//存储单位缓存、以name+id作为索引，如：monster1,monster2
			units : {},

			frames : {},		//存储帧
			actions : {},		//存储动作组件
			data : {},			//存储原始数据

			objList : [],			//存储所有单位
			groups : [],		//存储单位组信息，里面是个二维数组，每元素是一个组，里面存储一个list

			templates : {}		//存储已初始化的原始数据的模板
	},
	
	/**
	 * 全局游戏设置
	 */
	GameSetting : {

			framerate : 60,				//cocos2d默认fps是60
			logicTick : 0.0333,			//逻辑帧fps:30
			animateTick : 0.0416,		//动画帧fps:24

			gravity : -2,				//一般重力，一些组件可设置自定义重力
			maxGravity : -10,			//最大引力

			//单位移动时，Y轴与X轴的相对速度比
			unitSpeedFactor : {
				walkX : 1,
				walkY : 0.618,
				//runX : 2,
				//runY : 1.6,
				airX : 0.9,
				airY : 0.8
			}
	}

};
