/**
 * 初始化相关的代码都丢到这
 */
Initializer = {

	/**
	 * 初始化游戏全局参数
	 */
	initGobalParam : function(){
		//引力设置
		/*Service.Gobal.gravity = GameObjectFactory.createProperty("move", {dz:GameSetting.gravity, maxDz:GameSetting.maxGravity});
		Service.Gobal.logicTick = GameSetting.logicTick;
		Service.Gobal.renderTick = GameSetting.renderTick;*/
		
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
