/**
 * 初始化相关的代码都丢到这
 */
Initializer = {

	/**
	 * 初始化游戏全局参数
	 */
	initGobalParam : function(){
		//引力设置
		var motionCom = new ActionMoveComponent();
		motionCom.dy = GameSetting.gravity;
		motionCom.maxDy = GameSetting.maxGravity;
		Service.Gobal.gravity = motionCom;

		//被击中相关设置
		motionCom = new ActionMoveComponent();
		motionCom.dx = GameSetting.hitBack;
		Service.Gobal.hitBackMotion = motionCom;
		var timerCom = new TimerComponent();
		timerCom.total = GameSetting.stiffTime;
		Service.Gobal.stiffTimer = timerCom;

		motionCom = new ActionMoveComponent();
		motionCom.dx = GameSetting.hitDownX;
		motionCom.dy = GameSetting.hitDownY;
		Service.Gobal.hitDownMotion = motionCom;
		timerCom = new TimerComponent();
		timerCom.total = GameSetting.knockDownTime;
		Service.Gobal.stiffDownTimer = timerCom;
		
		//逻辑帧、渲染帧的FPS
		Service.Gobal.logicTick = GameSetting.logicTick;
		Service.Gobal.renderTick = GameSetting.renderTick;
	},
	
	/**
	 * 单位组定义
	 */
	initGroup : function(){
		//逻辑，至少初始化三个组：block,team1,team2，index分别为0 1 2
		// teamMask = 2的group.length次方-2
		//因为：group[0]=block。假设有三个组，index为 1 2 3，teamMask应该为 1110，block组需要自己实现相应逻辑
		
		var group = null;
		var teamCharacterMask = 6;		//用于计算敌对阵营的  0110
		var block = new Group();
		block.attr({name:"block",type:0,index:0});
		Service.Container.groups.push(group);
		var team1 = new Group();
		team1.attr({name:"team1",type:0,index:1});
		Service.Container.groups.push(team1);
		var team2 = new Group();
		team2.attr({name:"team2",type:0,index:2});
		Service.Container.groups.push(team2);
		
		/*for(var i=0; i<groupsData; i++){
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
		}*/
		Service.Container.teamMask = teamCharacterMask;
	},

	/**
	 * 初始化单位的构建模板（待删，或待改进）
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

		cc.log("initial unit template, name:" + data.name);
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
	 * 初始化人物
	 */
	initCharacter : function(data){
		//人物必须要有stand动作
		if(!data.stand){
			cc.log("initCharacter error. stand action is necessary.");
			return null;
		}
		var template = GameObjectFactory.createTemplate(data);
		template.actions.start = ObjectManager.actions.start[Constant.GAMEOBJECT_CHARACTER];
		template.actions.stand = ActionFactory.createStandAction(data.stand);
		template.actions.walk = ActionFactory.createWalkAction(data.walk);
		
		/**
		 * 统一构建template的组件
		 */
		var keys = {};
		var action = null;
		for(var i in template.actions){
			action = template.actions[i];
			for(var kName in action.coms){
				if(!keys[kName]){
					keys[kName] = kName;
				}
			}
			//顺便初始化切换组件
			/*if(action.coms.switchable){
				var k = action.coms.switchable.keys;
				var name = null;
				for(var cmd in k){
					name = k[cmd];
					if(template.actions[name]){
						k[cmd] = template.actions[name];
						//未完。。。
					}else{
						cc.log("build switchable error. action:"+name+" not found.");
						return;
					}
				}
			}*/
		}
		this._buildTemplateComponents(keys, template);
		ObjectManager.templates[template.name] = template;
		return;
	},
	
	_buildTemplateComponents : function(keys, template){
		if(keys.command){
			template.coms.command = GameObjectFactory.createCommand(null);
		}
		if(keys.move){
			template.coms.move = GameObjectFactory.createMove(data.move);
		}
		if(keys.hit){
			template.coms.hit = GameObjectFactory.createHit(data.hit);
		}
	}
}
