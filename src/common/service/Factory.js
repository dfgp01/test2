/**
 * 工厂类，用于建造游戏组件。
 */
Factory = {
		
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
		 * 初始化一个单位模板
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
		}
};