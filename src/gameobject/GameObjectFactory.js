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