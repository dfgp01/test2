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
		var template = this.createTemplate(data);
		var asm = new ActionStateManager();
		asm.init();
		template.actionStateManager = asm;
		
		this.addActionAndProperty(asm, ActionFactory.createStandAction(data.stand));
		if(data.walk){
			this.addActionAndProperty(asm, ActionFactory.createWalkAction(data.walk));
		}
		if(data.hit){
			this.addActionAndProperty(asm, ActionFactory.createHitAction(data.hit));
		}
		//this.buildCommand(template.actions);
		ObjectManager.templates[template.name] = template;
		return template;
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