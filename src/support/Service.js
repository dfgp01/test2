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
		//验证器初始化
		Validator.init();
		//共享对象池初始化
		ObjectManager.init();
		//组件工厂类初始化
		ComponentFactory.init();
		//ObjectManager.initCollides(data.collides);
		//人物角色初始化
		_initCharacter();
		this.setPlayer();
		this.mainSystem = ObjectManager.systems.main;
	},
	
	_initCharacter : function(){
		GameObjectFactory.createCharacter(characterData);
		var unit = this.newUnit("deep", 1, 100, 100, 20);
		//this._setPlayer(unit);
	},
	
	_setPlayer : function(unit){
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
		//dt *= 1000;
		this.gameTime += dt;
		this.mainSystem.update(dt);
	}

};
