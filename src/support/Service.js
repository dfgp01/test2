/**
 * 公共服务组件，提供大部分常用的业务接口
 * edit by Hugo-Fu 2015.06.26
 */

Service = {

	//游戏经过时间
	gameTime : 0,

	/**
	 * 回收，归对象池队列内
	 */
	recycleUnit : function(unit){
		unit.template.availableList.push(unit);
	},
	
	/**
	 * 从指定模板中创建新单位
	 */
	newUnit : function(templateName, teamNo, posX, posY, posZ){
		var template = ObjectManager.templates[templateName];
		var unit = null;
		if(template.availableList.length > 0){
			unit = template.availableList.pop();
		}else{
			unit = GameObjectFactory.createGameObject(template);
		}
		unit.collide.team = teamNo;
		unit.view.x = posX;
		unit.view.y = posY;
		unit.view.z = posZ;
		template.actions.boot.start(unit);
		return unit;
	},
	
	initialize : function(data){
		Validator.init();
		ObjectManager.init();
		ObjectManager.initCollides(data.collides);
		for(var i in data.characters){
			GameObjectFactory.createCharacter(data.characters[i]);
		}
		this.setPlayer(this.newUnit(data.player.templateName, 1, data.player.posX, data.player.posY, data.player.posZ));
		this.mainSystem = ObjectManager.systems.main;
	},
	
	setPlayer : function(unit){
		unit.collide.type |= Constant.COLLIDE_TYPE_PLAYER;
		var evt = new Event();
		evt.type = Constant.EVT_PLAYER_INITIALIZED;
		evt.unit = unit;
		EventDispatcher.send(evt);
	},

	start : function(){
		this.mainSystem.start();
	},
	
	update : function(dt){
		this.gameTime += dt;
		this.mainSystem.update(dt);
	}

};
