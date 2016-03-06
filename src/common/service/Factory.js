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
		 * 创建一个动作节点
		 * param
		 * 	data 	 数据DNA
		 * 	actClass  ActionState的子类，可缺省
		 *  2016.03.05 有改动，详见 ActionState.init()注释
		 */
		createAction : function(data){
			if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data, "name", true)){
				cc.log("create ActionState error, lack of necessary data!");
				return null;
			}
			//cc.log("info: creating action:[" + data.name + "].");
			var actionState = new ActionState();
			actionState.name = data.name;
			//actionState.coms = {};
			//actionState.systemList = [];
			actionState.init(data);
			//初始化动作组件系统
			//ActionUtil.bulidComponentSystem(data, actionState);
			return actionState;
		},
		
		/**
		 * 创建一个单位模板
		 */
		createGameObjectTemplate : function(data){
			if(!DataUtil.checkIsString(data,"name",true)){
				cc.log("Factory.createGameObjectTemplate error. data or name is null.");
				return null;
			}
			var template = new GameObjectTemplate();
			template.name = data.name;
			template.frame = EngineUtil.getFrame(data.frame);
			template.availableList = [];
			template.coms = {};
			template.actions = {};
			template.init(data);
			if(!DataUtil.checkArrayNull(data,"actions")){
				var action = null;
				for(var i in data.actions){
					action = this.createAction(data.actions[i]);
					template.actions[action.name] = action;
				}
			}
			//template.coms.view = new ViewComponent();
			return template;
		},
		
		/**
		 * 创建动作组件
		 */
		createActionComponent : function(data){
			if(!DataUtil.checkIsString(data, "name")){
				cc.log("Factory.createActionComponent error. no name.");
				return null;
			}
			if(data.name == Constant.COMPONENT_ANIMATE){
				return ComponentUtil.createActionAnimate(data);
			}else if(data.name == Constant.COMPONENT_MOTION){
				return ComponentUtil.createActionMotion(data);
			}else if(data.name == Constant.COMPONENT_HIT){
				return ComponentUtil.createActionHit(data);
			}
		}
};