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
	 * 	从指定模板中创建新单位并加入到舞台中
	 */
	addUnitToStage : function(templateName, x,y,z, cc_layer){
		var template = ObjectManager.templates[templateName];
		var unit = this.newUnit(template);
		unit.view.x = x;
		unit.view.y = y;
		unit.view.z = z;
		template.actions.boot.start(unit);
		var pos = GameUtil.toScreenPosition(x, y, z);
		EngineUtil.addSprite(unit.view, pos.x, pos.y, cc_layer);
		return unit;
	},
	
	/**
	 * 从指定模板中创建新单位
	 */
	newUnit : function(template){
		var unit = null;
		if(template.availableList.length > 0){
			unit = template.availableList.pop();
		}else{
			unit = GameObjectFactory.createGameObject(template);
		}
		return unit;
	},
	
	initialize : function(){
		Initializer.initGobalParam();	//全局默认数值（引力、帧频等）
		ObjectManager.init();			//公共对象、系统组件初始化
		//初始化玩家
		Initializer.initCharacter(characterData);
		this.mainSystem = ObjectManager.systems.main;
	},

	start : function(){
		this.mainSystem.start();
	},
	
	update : function(dt){
		this.gameTime += dt;
		this.mainSystem.update(dt);
	},
	
	/**
	 * 全局数据对象，用于数据共享
	 */
	Gobal : {
			logicTick : 0,
			renderTick : 0,
			
			//玩家数据
			player : {
				unit : null,
				score : 0
			},
			
			gravity : null		//moveProperty组件
	}

};
