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
	
	logicTick : function(){
		return this.GameSetting.logicTick;
	},
	
	/**
	 * 轮询所有单位
	 * @param
	 * 		callbackFunc 回调函数，func(gameObj)
	 */
	loopAllObjects : function(callbackFunc){
		for(var i in this.Container.groups){
			for(var j in this.Container.groups[i].list){
				callbackFunc(this.Container.groups[i].list[j]);
			}
		}
	},
	
	/**
	 * 根据名称和id号的联合串获取缓存中的对象
	 */
	findObj : function(nameId){
		return this.Container.units[nameId];
	},
	
	/**
	 * 根据下标索引查找组，通常unit.group就是下标索引
	 */
	findGroup : function(index){
		return this.Container.groups[index];
	},
	
	/**
	 * 	从指定模板中创建新对象
	 */
	newObject : function(tempName, _x, _y, _z, ccNode){
		var tmp = this.Container.templates[tempName];
		if(!tmp){
			cc.log("template: " + tempName + " not found!");
			return null;
		}else{
			var obj = tmp.getNewInstance();
			if(!this.Container.units[obj.id]){
				//如果缓存内没有此单位，则加入
				this.Container.units[obj.id] = obj;
			}
			tmp.actions.start.start(obj);
			return obj;
		}
	},
	
	initialize : function(){
		Initializer.initGobalParam();	//全局默认数值（引力、帧频等）
		SystemUtil.init();	//主系统
		ActionUtil.init();	//动作系统和公共动作
		//初始化玩家
		var character = SimpleFactory.createCharacter(characterData);
		Service.Container.templates[character.name] = character;
		var object = this.newObject(character.name);
		this.Container.player.unit = object;
	},
	
	getPlayer : function(){
		return this.Container.player;
	},
	
	start : function(){
		SystemUtil.systems.main.start();
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

			data : {},			//存储原始数据

			groups : [],		//存储单位组信息，对象是Group
			
			teamMask : 0,		//阵营的掩码

			templates : {},		//存储已初始化的原始数据的模板
	},
	
	/**
	 * 全局游戏设置
	 */
	Gobal : {
		gravityCom : null,
		hitBackMotion : null,
		hitDownMotion : null,
		stiffTimer : null,
		stiffDownTimer : null,
		animateFrameRate : 0,
		logicFrameRate : 0
	}

};
