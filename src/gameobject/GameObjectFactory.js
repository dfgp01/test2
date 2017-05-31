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
		GameObjectTemplate.addActionAndProperty(template, ActionFactory.createStandAction(data.stand));
		if(data.walk){
			GameObjectTemplate.addActionAndProperty(template, ActionFactory.createWalkAction(data.walk));
		}
		if(data.hit){
			GameObjectTemplate.addActionAndProperty(template, ActionFactory.createHitAction(data.hit));
		}
		ObjectManager.templates[template.name] = template;
		return template;
	},
	
	_createCollide : function(data){
		var p = new CollideProperty();
		p.targets = {};
		p.rect = [0,0,0,0];
		return p;
	}
}