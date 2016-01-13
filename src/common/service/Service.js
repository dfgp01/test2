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
	createObj : function(tempName, groupNum, _x, _y, _z, ccLayer){
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
			obj.coms.view.z = _z;
			obj.coms.view.sprite.attr({x: _x, y: _y+_z});
			//GL坐标系，z值(Y轴)越小越排前
			ccLayer.addChild(obj.coms.view.sprite, -(_z));
			obj.template.firstAct.start(obj);
			return obj;
		}
	},
	
	/**
	 * 初始化玩家配置
	 */
	initPlayer : function(unit){
		this.Container.player.unit = unit;
	},
	
	initialize : function(){
		GameUtil.initGroup(
			[{type:Constant.Group.Team1.TYPE, name:Constant.Group.Team1.NAME},
		     {type:Constant.Group.Team2.TYPE, name:Constant.Group.Team2.NAME},
		     {type:Constant.Group.Block.TYPE, name:Constant.Group.Block.NAME}]
		);
		GameUtil.initSystem();
		GameUtil.initUnitTemplate(characterData);
	},
	
	getActionSystem : function(name){
		return this.Container.actionSystems[name];
	},
	
	getAnimateSystem : function(name){
		return this.Container.animateSystems[name];
	},
	
	//加入到 消息/事件 列表中，等待执行
	dispatchEvent : function(evt){
		GameUtil.systems.sys.EvtMsg.addEvent(evt);
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
			
			hitBack : 15,					//硬直后退距离
			hitDownX : 135,			//倒地后退距离X
			hitDownY : 30,				//倒地后退距离Y
			stiffTime : 500,					//硬直时间(毫秒)
			knockDownTime : 800,	//倒地硬直时间(毫秒)

			//单位移动时，Y轴与X轴的相对速度比
			unitSpeedFactor : {
				walkX : 1,
				walkY : 0.618,
				//runX : 2,
				//runY : 1.6,
				airX : 0.9,
				airY : 0.8
			}
	
			gravityCom : null,
			hitBackMotion : null,
			hitDownMotion : null,
			stiffTimer : null,
			stiffDownTimer : null
	}

};
