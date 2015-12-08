/**
 * 公共服务组件，提供大部分常用的业务接口
 * edit by Hugo-Fu 2015.06.26
 */

Service = {

	//游戏经过时间
	gameTime : 0,
	
	//上一帧剩下的时间数，实际上是小数，取余运算时用整数进行。
	remainDt : 0.0000,
	
	//主循环最外层系统
	mainSystem : null,
	
	//消息系统
	eventDispatchSystem : null,
	
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
	 * 	从指定模板中创建新对象
	 */
	createObj : function(tempName, groupNum){
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
			this.Container.groups[groupNum].add(obj);
			obj.template.firstAct.start(obj);
			return obj;
		}
	},
	
	/**
	 * 初始化玩家配置
	 */
	initPlayer : function(){
		this.Container.player.character = this.createObj("deep", Constant.Group.PLAYER.index);
		this.Container.groups[Constant.Group.FACTION1.index].add(this.Container.player.character);
	},

	getPlayer : function(){
		return this.Container.player;
	},
	
	initialize : function(){
		GameUtil.initGroup();
		GameUtil.initSystem();
		GameUtil.initUnitTemplate(characterData);
		this.initPlayer();
		this.mainSystem.start();
	},
	
	getActionSystem : function(name){
		return this.Container.actionSystems[name];
	},
	
	getAnimateSystem : function(name){
		return this.Container.animateSystems[name];
	},
	
	//加入到 消息/事件 列表中，等待执行
	dispatchEvent : function(evt){
		this.eventDispatchSystem.addEvent(evt);
	},
	
	//对象回收
	gc : function(obj){
		this.Container.groups[obj.group].remove(obj);
		obj.active = false;
		obj.template.availableList.push(obj);
	},
	
	/**
	 * 全局数据容器，存储所有游戏对象，用于数据共享，方便对象间的访问
	 */
	Container : {

			//动作动画系统单例存储
			actionSystems : {},
			animateSystems : {},
		
			//玩家数据
			player : {
				character : null,
				score : 0
			},
			
			//存储单位缓存、以name+id作为索引，如：monster1,monster2
			units : {},

			frames : {},		//存储帧
			actions : {},		//存储动作组件
			data : {},			//存储原始数据

			groups : [],		//存储单位组信息，里面是个二维数组，每元素是一个组，里面存储一个list

			templates : {}		//存储已初始化的原始数据的模板
	},
	
	/**
	 * 全局游戏设置
	 */
	GameSetting : {

			framerate : 60,				//cocos2d默认fps是60
			logicTick : Constant.Tick.FPS30,			//默认逻辑帧fps:30
			frameTick : Constant.Tick.FPS10,		//默认动画帧fps:24

			gravity : -2,				//一般重力，一些组件可设置自定义重力
			maxGravity : -10,			//最大引力

			//单位移动时，Y轴与X轴的相对速度比
			unitSpeedFactor : {
				walkX : 1,
				walkY : 0.618,
				//runX : 2,
				//runY : 1.6,
				airX : 0.9,
				airY : 0.8
			}
	}

};
