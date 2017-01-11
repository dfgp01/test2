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
		template.init(data);
		//动作集合
		if(DataUtil.checkArrayNotNullForLog(data.actions,"data.actions")){
			for(var i in data.actions){
				this.addActionAndProperty(
						ActionFactory.createAction(
								data.actions[i]));
			}
		}
		//初始化属性
		return template;
	},
	
	addActionAndProperty : function(template, action){
		template.actions[action.name] = action;
		if(action.components.length > 0){
			for(var component in action.components){
				if(!template.propertys[component.name]){
					template.propertys[component.name] = createProperty(component.name);
				}
			}
		}
		return;
	},
	
	createProperty : function(name, data){
		var p = null;
		if(name=="actions"){
			p = new ActionsProperty();
		}else if(name=='move'){
			p = new MoveProperty();
		}else if(name=='command'){
			p = new CommandProperty();
		}else if(name=='view'){
			p = new ViewProperty();
		}
		p.init(data);
		return p;
	},
	
	createGameObject : function(template){
		var unit = new GameObject();
		unit.id = template.nextId++
		unit.name = template.name;
		unit.propertys = {};
		unit.template = template;
		for(var i in template.propertys){
			var name = template.propertys[i].name;
			var property = this.createProperty(name);
			property.owner = unit;
			property.prev = null;
			property.next = null;
			unit.propertys[property.name] = property;
		}
		unit.view = this.createProperty("view");
		unit.view.owner = unit;
		unit.actions = this.createProperty("actions");
		unit.actions.owner = unit;
		return unit;
	}
}