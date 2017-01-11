/**
 * 公共服务组件，提供大部分常用的业务接口
 * edit by Hugo-Fu 2015.06.26
 */

Service = {

	//游戏经过时间
	gameTime : 0,
	
	//上一帧剩下的时间数，实际上是小数，取余运算时用整数进行。
	remainDt : 0.0000,
	
	/**
	 * 游戏经过时间递增
	 */
	gameTimeAfter : function(dt){
		this.gameTime += dt;
	},

	/**
	 * 回收，归对象池队列内
	 */
	recycleUnit : function(unit){
		unit.template.availableList.push(unit);
	},
	
	/**
	 * 	从指定模板中创建新单位
	 */
	newUnit : function(templateName, x,y,z, cc_layer){
		var template = ObjectManager.templates[templateName];
		if(!template){
			cc.log("template: " + tempName + " not found!");
			return null;
		}
		var unit = null,
		if(template.availableList.length > 0){
			unit = template.availableList.pop();
		}else{
			unit = GameObjectFactory.createGameObject(template);
		}
		//初始化所有属性值，需要额外的封装方法（对象拷贝或对象值拷贝）
		for(var i in this.propertys){
			var name = this.propertys[i].name;
			for(var j in this.propertys[i]){
				unit.propertys[j] = this.propertys[i][j];
			}
		}
		EngineUtil.addSprite(unit.view, x,y,z, cc_layer);
		template.actions.boot.start(unit);
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
	
	//加入到 消息/事件 列表中，等待执行
	dispatchEvent : function(evt){
		GameUtil.systems.sys.EvtMsg.addEvent(evt);
	},
	
	/**
	 * 全局数据对象，用于数据共享
	 */
	Gobal : {
			//玩家数据
			player : {
				unit : null,
				score : 0
			},
			
			gravity : null
	}

};
