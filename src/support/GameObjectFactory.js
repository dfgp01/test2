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
		if(DataUtil.checkArrayNotNull(data.actions,"data.actions")){
			for(var i in data.actions){
				this.addActionAndProperty(template,
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
			for(var i in action.components){
				var component = action.components[i];
				if(!template.propertys[component.name]){
					template.propertys[component.name] = this.createProperty(component.name);
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
		unit.view.body = EngineUtil.newSprite(template.frame);
		unit.view.owner = unit;
		unit.actions = this.createProperty("actions");
		unit.actions.owner = unit;
		return unit;
	},
	
	buildCommand : function(actions){
		for(var i in actions){
			var act = actions[i];
			var cmd = act.findComponent("command");
			if(cmd && cmd.list){
				var actionList = [];
				for(var j in cmd.list){
					var actionName = cmd.list[j];
					if(!DataUtil.checkIsString(actionName)){
						cc.log("GameObjectFactory.buildCommand error. not a string.");
						return;
					}
					var action = actions[actionName];
					if(!action){
						cc.log("GameObjectFactory.buildCommand error. action:["+actionName+"] not found");
						return;
					}
					actionList.push(action);
				}
				cmd.build(actionList);
			}
		}
	}
}