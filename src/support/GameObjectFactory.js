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

	/**
	 * 初始化一个单位模板
	 */
	createTemplate : function(data){
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
	
	addActionAndProperty : function(actionStateManager, action){
		if(actionStateManager.registered(action)){
			if(action.components.length > 0){
				for(var i in action.components){
					var component = action.components[i];
					if(!template.propertys[component.name]){
						template.propertys[component.name] = this.createProperty(component.name);
					}
				}
			}
		}
		return;
	},
	
	createProperty : function(name, owner, data){
		var p = null;
		if(name=="actions"){
			p = new ActionsProperty();
			p.stacks = {};
		}else if(name=='move'){
			p = new MoveProperty();
			p.coefficient = DataUtil.checkIsNumber(data.coefficient) ? data.coefficient : p.coefficient;
		}else if(name=='command'){
			p = new CommandProperty();
		}else if(name=='view'){
			p = new ViewProperty();
			/*p.frameProperties = [];
			addFrameState(p, 1, owner);*/
		}else if(name=='collide'){
			p = this._createCollide(data);
		}else if(name=='hit'){
			p = new HitProperty();
			p.collide = this._createCollide(data);
		}
		p.owner = owner;
		return p;
	},
	
	cloneProperty : function(name, property, unit){
		var p = null;
		if(name=="actions"){
			p = new ActionsProperty();
			p.stacks = {};
		}else if(name=='move'){
			p = new MoveProperty();
			p.coefficient = property.coefficient;
		}else if(name=='command'){
			p = new CommandProperty();
		}else if(name=='view'){
			p = new ViewProperty();
			//p.frames = this.createFrameProperties();
			p.body = EngineUtil.newSprite();
		}else if(name=='collide'){
			p = this._createCollide(data, properties);
		}else if(name=='hit'){
			p = new HitProperty();
			p.collide = this._createCollide(data);
			p.body = unit.collide;
		}
		return p;
	},
	
	_createCollide : function(data){
		var p = new CollideProperty();
		p.targets = {};
		p.rect = [0,0,0,0];
		return p;
	}
	
	createGameObject : function(template){
		var unit = new GameObject();
		unit.id = template.nextId++
		unit.name = template.name;
		unit.template = template;
		unit.view = this.createProperty("view");
		//unit.view.body = EngineUtil.newSprite(template.frame);
		unit.view.owner = unit;
		unit.actions = this.createProperty("actions");
		unit.actions.owner = unit;
		unit.propertys = {};
		for(var i in template.propertys){
			var property = this.cloneProperty(template.propertys[i], unit);
			property.owner = unit;
			unit.propertys[property.name] = property;
		}
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