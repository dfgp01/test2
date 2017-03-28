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
	
	initialize : function(){
		ObjectManager.initTeams([{
			type : Constant.COLLIDE_TYPE_BLOCK,
			mask : Constant.COLLIDE_TYPE_BODY
		},{
			type : Constant.COLLIDE_TYPE_BODY,
			mask : Constant.COLLIDE_TYPE_BLOCK
		},{
			type : Constant.COLLIDE_TYPE_HIT,
			mask : Constant.COLLIDE_TYPE_HURT
		},{
			type : Constant.COLLIDE_TYPE_HURT,
			mask : Constant.COLLIDE_TYPE_HIT
		}]);
		ObjectManager.init();
		GameObjectFactory.createCharacter(characterData);
		this.mainSystem = ObjectManager.systems.main;
	},

	start : function(){
		this.mainSystem.start();
	},
	
	update : function(dt){
		this.gameTime += dt;
		this.mainSystem.update(dt);
	}

};
