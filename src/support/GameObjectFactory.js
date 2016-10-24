/**
 * 用于创建单位模板及组件的工厂类
 */
GameObjectFactory = {

	/**
	 * 初始化一个单位模板
	 */
	createTemplate : function(data){
		if(!DataUtil.checkIsString(data,"name",true)){
			cc.log("createTemplate error. data or name is null.");
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
		return template;
	},
	
	createMove : function(data){
		var move = new UnitMoveComponent();
		if(data && DataUtil.checkIsNumber(data, "coefficient")){
			move.coefficient = data.coefficient;
		}
		return move;
	}
}