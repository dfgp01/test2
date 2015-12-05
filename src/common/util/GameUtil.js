/**
*	CreateBy Hugo-Fu 2015.12.05
*/
GameUtil = {
		
		initAction : function(){
			//初始化通用动作系统组件
			Service.Container.animateSystems.normal = new AnimateSystem();
			Service.Container.animateSystems.loop = new LoopAnimateSystem();
			Service.Container.actionSystems.stand = new StandActionSystem();
			Service.Container.actionSystems.walk = new WalkMotionSystem();
			Service.Container.actionSystems.motion  = new MotionSystem();
			
			//初始化主系统
			var mainSystem = new MainSystem();
			mainSystem.addSystem(new PlayerSystem());
			mainSystem.addSystem(new ActionRunSystem());
			mainSystem.addSystem(new AnimateRunSystem());
			mainSystem.addSystem(new MotionRunSystem());
			Service.mainSystem = mainSystem;
		},
		
		initGroup : function(){
			Service.Container.groups[Constant.Group.PLAYER.index] = new Group(Constant.Group.PLAYER.index, Constant.Group.PLAYER.mask);
			Service.Container.groups[Constant.Group.FACTION1.index] = new Group(Constant.Group.FACTION1.index, Constant.Group.FACTION1.mask);
			Service.Container.groups[Constant.Group.FACTION2.index] = new Group(Constant.Group.FACTION2.index, Constant.Group.FACTION2.mask);
			Service.Container.groups[Constant.Group.FACTION3.index] = new Group(Constant.Group.FACTION3.index, Constant.Group.FACTION3.mask);
			Service.Container.groups[Constant.Group.BLOCK.index] = new Group(Constant.Group.BLOCK.index, Constant.Group.BLOCK.mask);
		},
		
		/**
		 * 初始化单位的构建模板
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
			Service.Container.templates[unitTemplate.name] = unitTemplate;
		}
}