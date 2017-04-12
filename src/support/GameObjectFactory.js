/**
 * 用于创建单位模板及组件的工厂类
 */
GameObjectFactory = {
		
	/**
	 * 初始化人物模板
	 */
	createCharacter : function(data){
		//人物必须要有stand动作
		if(!data.stand){
			cc.log("initCharacter error. stand action is necessary.");
			return null;
		}
		var template = this.createTemplate(data);
		var action = ObjectManager.actions.boot[Constant.GAMEOBJECT_CHARACTER];
		template.actions.boot = action;
		
		this.addActionAndProperty(
			template, ActionFactory.createStandAction(data.stand, template.actions));
		if(data.walk){
			this.addActionAndProperty(
				template, ActionFactory.createWalkAction(data.walk, template.actions));
		}
		if(data.hit){
			this.addActionAndProperty(
				template, ActionFactory.createHitAction(data.hit, template.actions));
		}
		this.buildCommand(template.actions);
		ObjectManager.templates[template.name] = template;
		return template;
	}

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
			p.frames = this._createFrameProperties(5, owner);
			p.body = EngineUtil.newSprite();
		}else if(name=='collide'){
			p = this._createCollide(data);
		}else if(name=='hit'){
			p = new HitProperty();
			p.collide = this._createCollide(data);
		}
		p.owner = owner;
		return p;
	},
	
	_createFrameProperties : function(num, owner){
		var fs = [];
		for(var i=0; i<num; i++){
			var f = new FrameProperty();
			f.owner = owner;
			fs.push(f);
		}
		return fs;
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
	}
	
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