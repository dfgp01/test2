/**
 * 工厂类，用于建造游戏组件。
 */
Factory = {

		/**
		 * 创建一个单位模板（旧方法，待删）
		 */
		createUnitTemplate : function(data){

			//必要性检查
			// !DataUtil.checkIsString(data, "res") 这个检查不应该写在这里，应该有个统一的资源表要填
			if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data, "name")){
				cc.log("create Unit error, lack of necessary data! data is null or noname.");
				return null;
			}
			//这个也不是必须的
			if(!DataUtil.checkNotNull(data, "actions")){
				cc.log("create UnitTemplate error, must has actions.");
				return null;
			}

			var unitTemplate = new UnitTemplate();
			unitTemplate.name = data.name;
			unitTemplate.availableList = [];
			unitTemplate.coms = {};
			
			//其他初始化操作，通常是子类实现
			unitTemplate.init(data);

			return unitTemplate;
		},
		
		/**
		 * 创建地图元素，中立组
		 *  tile,block,animate等
		 */
		createTile : function(data){
			var template = this.createGameObjectTemplate(data);
			var action = ActionUtil.getCommonAction("tileStart");
			template.actions.start = action;
			if(DataUtil.checkIsInt(data,"block") && data.block==Constant.BOOLEAN_TRUE){
				//判断有没有rect，。没有就用自身sprite的包围盒，这个暂时不做，默认用sprite的
			}
			return template;
		},
		
		/**
		 * 创建人物
		 */
		createCharacter : function(data){
			//人物必须要有stand动作
			if(!data.stand){
				cc.log("Factory.createCharacter error. stand action is necessary.");
				return null;
			}
			var template = this.createGameObjectTemplate(data);
			var action = ActionUtil.actions.characterStart;
			trmplate.actions[action.name] = action;
			
			//人物必须要有运动组件
			var motionCom = new UnitMotionComponent();
			template.coms[motionCom.name] = motionCom;
			
			//伤害组件
			if(DataUtil.checkNotNull(data,"hurt"){
				action = ActionUtil.actions.characterHurt();
				action.init(data, template);
			}
			//其他动作
			if(!DataUtil.checkArrayNull(data,"actions")){
				for(var i in data.actions){
					this.createAction(data.actions[i],template);
				}
			}
		},
		
		/**
		 * 创建自定义的action子类
		 */
		createCustomAction : function(data, actClass){
			var action = new actClass();
			//子类自行初始化coms和systems
			action.init(data);
			return action;
		}
};

/**
 * 创建一个单位模板
 */
Factory.createGameObjectTemplate = function(data){
	if(!DataUtil.checkIsString(data,"name",true)){
		cc.log("Factory.createGameObjectTemplate error. data or name is null.");
		return null;
	}
	var template = new GameObjectTemplate();
	template.name = data.name;
	template.frame = EngineUtil.getFrame(data.frame);
	template.availableList = [];
	template.coms = {};
	template.actions = new ActionsComponent();
	
	/*//根据交互类型创建不同的游戏对象
	if(DataUtil.checkIsInt(data,"interact")){
		var type=data.interact.type;
		switch(type){
		case Constant.GameObject.Interact.BLOCK:
			template = this.createBlock(data, template);
			break;
		case Constant.GameObject.Interact.UNIT:
			template = this.createUnit(data, template);
			break;
		}
	}else{
		//没有交互类型的当作静态tile处理
		template = this.createTile(data, template);
	}*/
	template.init(data);
	return template;
};

/**
 * 创建一个动作节点
 * param
 * 	data 	 数据DNA
 * 	template 单位模板
 * 	actClass action的子类，可为空
 */
Factory.createAction = function(data, template){
	if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data, "name", true)){
		cc.log("create ActionState error, lack of necessary data!");
		return null;
	}
	cc.log("info: creating action:[" + data.name + "].");
	var actionState = new ActionState();
	actionState.name = data.name;
	actionState.coms = {};
	actionState.systemList = [];
	actionState.init(data);
	//初始化动作组件系统
	ActionUtil.buildComponentSystem(data, actionState);
	
	//设置key
	//actionState.key = DataUtil.checkIsString(data,"key") == true ? data.key : Constant.DIRECT_CHILDNODE;
	//设置状态
	//actionState.state = DataUtil.checkIsInt(data,"state") == true ? data.state : 0;
	return actionState;
};