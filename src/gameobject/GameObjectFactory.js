/**
 * 用于创建单位模板及组件的工厂类
 */
GameObjectFactory = {
	
	templates : {},
	
	addTemplate : function(template){
		if(!template || !template.id){
			cc.log("GameObjectFactory.addTemplate error. template or id is null.");
			return;
		}
		if(this.templates[id]){
			cc.log("GameObjectFactory.addTemplate error. template id:["+id+"] has exists.");
			return;
		}
		this.templates[id] = template;
	},
	
	getTemplate : function(templateId){
		if(!templateId){
			cc.log("GameObjectFactory.getTemplate error. id is null.");
			return null;
		}
		var template = this.templates[templateId];
		if(!template){
			cc.log("GameObjectFactory.getTemplate error. could not find template id:["+templateId+"].");
			return null;
		}
		return template;
	},
	
	/**
	 * 获取一个新的单位实体
	 */
	getNewEntity : function(templateId){
		return GameObjectTemplate.getNewUnit(
				this.getTemplate(templateId));
	},
	
	/**
	 * 回收单位到对应模板里的对象池中
	 */
	recycle : function(unit){
		unit.template.availableList.push(unit);
	},
	
	/**
	 * 创建用于公共使用的单位模板，仅含有少数必备组件
	 */
	createNormal : function(){
		var template = new GameObjectTemplate();
		template.id = GameObjectConstant.templateId.PUBLIC;
		this.addTemplate(template);
	},
		
	/**
	 * 创建人物模板
	 */
	createCharacter : function(data){
		if(!Validator.assertType(data, "character", "character")){
			cc.log("createCharacter error.");
			return null;
		}
		var template = GameObjectTemplate.create(data);
		var asm = new ActionManager();
		template.actionManager = asm;
		GameObjectTemplate.addAction(template, ActionFactory.createStandAction(data.stand));
		GameObjectTemplate.createProperty(template, data.stand);
		if(data.walk){
			GameObjectTemplate.addAction(template, ActionFactory.createWalkAction(data.walk));
			GameObjectTemplate.createProperty(template, data.walk);
		}
		if(data.hit){
			GameObjectTemplate.addAction(template, ActionFactory.createHitAction(data.hit));
			GameObjectTemplate.createProperty(template, data.hit);
		}
		return template;
	},
	
	_createCollide : function(data){
		var p = new CollideProperty();
		p.targets = {};
		p.rect = [0,0,0,0];
		return p;
	}
}