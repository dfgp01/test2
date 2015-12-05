/**
*	CreateBy Hugo-Fu 2015.12.05
*/
GameUtil = {
		
		/**
		 * 生成碰撞标示码
		 * @param obj
		 * @param mask
		 */
		collideMask : function(mask){
			var mask  = 0;
			if(mask & Collide.Target.ENEMY){
				//和全阵营码进行与运算取反可标出敌对阵营
				mask  = mask | ~(obj.group.mask & Constant.Group.ALL_FACTION_MASK);
			}
		},
		
		initSystem : function(){
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
			Service.Container.groups[Constant.Group.PLAYER.index] = new Group(Constant.Group.PLAYER);
			Service.Container.groups[Constant.Group.FACTION1.index] = new Group(Constant.Group.FACTION1);
			Service.Container.groups[Constant.Group.FACTION2.index] = new Group(Constant.Group.FACTION2);
			Service.Container.groups[Constant.Group.FACTION3.index] = new Group(Constant.Group.FACTION3);
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
				Factory.buildCharacterActionSys(unitTemplate.actions.names);
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
		}
};

/**
 * 队伍
 * 		写在这里算了，懒得再搞多个JS文件
 */
Group = cc.Class.extend({
	name : "group",
	list : null,
	index : -1,
	mask : -1,

	ctor : function(data){
		if(data){
			this.index = data.index;
			this.msk = data.mask;
		}
		this.list = [];
	},
	
	add : function(obj){
		this.list.push(obj);
		obj.group = this.index;
	},
	
	remove : function(obj){
		if(this.list.length > 0){
			for(var i in this.list){
				if(this.list[i].id == obj.id){
					this.list.splice(i, 1);		//删除该位置上的对象
					break;
				}
			}
		}
	}
	
});