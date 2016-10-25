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
	 * 	从指定模板中创建新对象
	 */
	newObject : function(tempName, x,y,z, cc_layer){
		var tmp = ObjectManager.templates[tempName];
		if(!tmp){
			cc.log("template: " + tempName + " not found!");
			return null;
		}else{
			var obj = tmp.getNewInstance();
			EngineUtil.addSprite(obj.coms.view, x,y,z, cc_layer)
			//默认的初始动作
			tmp.actions.start.start(obj);
			return obj;
		}
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
	 * 全局数据容器，存储所有游戏对象，用于数据共享，方便对象间的访问
	 */
	Container : {
		
			//玩家数据
			player : {
				unit : null,
				unitState : 0,
				score : 0
			},
			
			//存储单位缓存、以name+id作为索引，如：monster1,monster2
			units : {},

			groups : [],		//存储单位组信息，对象是Group
			
			teamMask : 0,		//阵营的掩码

			templates : {},		//存储已初始化的原始数据的模板
	},
	
	/**
	 * 全局游戏设置
	 */
	Gobal : {
		logicTick : 0,
		renderTick : 0,
		gravity : null,			//ActionMoveComponent类型引用
		hitBack : null,			//同上
		hitDown : null,		//同上
		stiffTimer : null,
		stiffDownTimer : null
	}

};
