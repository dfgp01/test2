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
	newUnit : function(templateName, teamNo, pos3D){
		var template = ObjectManager.templates[templateName];
		var unit = GameObjectTemplate.getNewUnit(template);
		unit.collide.team = teamNo;
		ViewProperty.setPostion(unit.view, pos3D);
		/*unit.view.x = pos3D.x;
		unit.view.y = pos3D.y;		放在上面那个方法里
		unit.view.z = pos3D.z;*/
		EventManager.send(EventConstant.UNIT_ENTER_STAGE,unitEvt);
		return unit;
	},
	
	initialize : function(data){
		//验证器初始化
		Validator.init();
		//共享对象池初始化
		//ObjectManager.init();
		//ObjectManager.initCollides(data.collides);
		//人物角色初始化
		this._initCharacter();
		this.setPlayer();
		this.mainSystem = ObjectManager.systems.main;
	},
	
	_initCharacter : function(){
		//初始化场景元素
		//初始化玩家配置、人物数据、HUD
		GameObjectFactory.addTemplate(
				GameObjectFactory.createCharacter(characterData));
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
