/**
 * 用于创建单位模板及组件的工厂类
 */
GameObjectFactory = {
		
	/**
	 * 初始化人物模板
	 */
	createCharacter : function(data){
		if(!Validator.assertType(data, "character", "character")){
			cc.log("createCharacter error.");
			return null;
		}
		var template = Template.create(data);
		var asm = new ActionStateManager();
		template.actionStateManager = asm;
		this._addActAndChkProp(template, Action.create(data.stand));
		if(data.walk){
			this._addActAndChkProp(template, Action.create(data.walk));
		}
		if(data.hit){
			this._addActAndChkProp(template, Action.create(data.hit));
		}
		//this.buildCommand(template.actions);
		ObjectManager.templates[template.name] = template;
		return template;
	},

	_addActAndChkProp : function(template, action){
		var asm = template.actionStateManager;
		asm.registered(action);
		template.checkProperty(action);
		return;
	},
	
	_createCollide : function(data){
		var p = new CollideProperty();
		p.targets = {};
		p.rect = [0,0,0,0];
		return p;
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