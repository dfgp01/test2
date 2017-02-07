/**
 * 初始化相关的代码都丢到这
 */
Initializer = {

	/**
	 * 初始化游戏全局参数
	 */
	initGobalParam : function(){
		//引力设置
		Service.Gobal.gravity = GameObjectFactory.createProperty("move", {dy:GameSetting.gravity, maxDy:GameSetting.maxGravity});
		Service.Gobal.logicTick = GameSetting.logicTick;
		Service.Gobal.renderTick = GameSetting.renderTick;
		
		//被击中相关设置
		/*motionCom = new ActionMoveComponent();
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
		Service.Gobal.stiffDownTimer = timerCom;*/
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
	 * 初始化人物
	 */
	initCharacter : function(data){
		//人物必须要有stand动作
		if(!data.stand){
			cc.log("initCharacter error. stand action is necessary.");
			return null;
		}
		var template = GameObjectFactory.createTemplate(data);
		var action = ObjectManager.actions.boot[Constant.GAMEOBJECT_CHARACTER];
		template.actions.boot = action;
		
		GameObjectFactory.addActionAndProperty(
			template, ActionFactory.createStandAction(data.stand, template.actions));
		if(data.walk){
			GameObjectFactory.addActionAndProperty(
				template, ActionFactory.createWalkAction(data.walk, template.actions));
		}
		if(data.hit){
			GameObjectFactory.addActionAndProperty(
				template, ActionFactory.createHitAction(data.hit, template.actions));
		}
		GameObjectFactory.buildCommand(template.actions);
		ObjectManager.templates[template.name] = template;
		return template;
	}
}
