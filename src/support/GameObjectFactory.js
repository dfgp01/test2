/**
 * 用于创建单位模板及组件的工厂类
 */
GameObjectFactory = {

	/**
	 * 初始化一个单位模板
	 */
	createTemplate : function(data){
		if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data.name)){
			cc.log("createTemplate error, lack of necessary data!");
			return null;
		}
		var template = new GameObjectTemplate();
		template.name = data.name;
		template.frame = EngineUtil.getFrame(data.frame);
		template.availableList = [];
		template.propertys = {};
		template.actions = {};
		template.init(data);
		if(DataUtil.checkArrayNotNullForLog(data.actions,"data.actions")){
			var action = null;
			for(var i in data.actions){
				action = this.createAction(data.actions[i]);
				template.actions[action.name] = action;
				if(action.components.length > 0){
					for(var component in action.components){
						this._addProperty(template, component.name);
					}
				}
			}
		}
		return template;
	},
	
	addProperty : function(template, name){
		if(!template.propertys.name){
			if(name=='move'){
				template.propertys.move = new MoveProperty();
			}
		}
	}
	
	createMove : function(data){
		/*var move = new UnitMoveComponent();
		if(data && DataUtil.checkIsNumber(data, "coefficient")){
			move.coefficient = data.coefficient;
		}
		return move;*/
	}
}