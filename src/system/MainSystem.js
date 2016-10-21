/**
 * 系统管理器，主循环（旧版）
 */
MainSystemOld = System.extend({
	name : "main",
	systemList : [],	//子系统列表
	_currSys : null,
	_tick : 0,
	_tickCount : 0,
	_coefficient : 0,
	
	start : function(){
		this._tick = Service.Gobal.gameTick;
		for(var i in this.systemList){
			this.systemList[i].start();
		}
	},
	
	//固定逻辑帧频，使主循环在固定的频率下运行，理论上通吃所有手机...
	update : function(dt){
		cc.log("main....");
		this._tickCount += dt;
		this._coefficient = this._tickCount / this._tick;
		if(this._tickCount > this._tick){
			this._coefficient = this._tickCount / this._tick;
			this._tickCount = this._tickCount - this._tick * this._coefficient;
			for(var i in this.systemList){
				this._currSys = this.systemList[i];
				this._currSys.update(dt);
			}
		}
	},

	end : function(){
		for(var i in this.systemList){
			this.systemList[i].end();
		}
	},
	
	/**
	 * 插入一个子系统，可指定优先级
	 * @param system
	 * @param priority
	 */
	addSystem : function(system, priority){
		if(priority){
			system.priority = priority;
		}
		for(var i in this.systemList){
			if(system.priority > this.systemList[i].priority){
				this.systemList.splice(i, 0, system);
				return;
			}
		}
		//上面的循环未return时，说明system的优先级是最小的，要补加到列表尾
		this.systemList.push(system);
	},

	findSystemByName : function(name){
		for(var i in this.systemList){
			if(this.systemList[i].name == name){
				return this.systemList[i];
			}
		}
		cc.log("MainSystem findSystemByName error~! system-name:[" + name + "] not found.");
		return null;
	}
});

/**
 * 新版
 */
MainSystem = System.extend({
	name : "main",
	logicTick : 0,
	renderTick : 0,
	_logicTickCount : 0,
	_renderTickCount : 0,
	_action : null,
	_render : null,

	start : function(){
		this.logicTick = Service.Gobal.logicTick;
		this.renderTick = Service.Gobal.renderTick;
		this._action = ObjectManager.systems.action;
		this._render = SystemUtil.systems.view;
		
		this._action.start();
		this._render.start();
	},

	//固定逻辑帧频，使主循环在固定的频率下运行，理论上通吃所有手机...
	update : function(dt){
		this._logicTickCount += dt;
		if(this._logicTickCount > this.logicTick){
			this._action.update(dt);
			this._logicTickCount -= this.logicTick;
		}
		
		this._renderTickCount += dt;
		if(this._renderTickCount > this.renderTick){
			//可以正确模拟卡机跳帧情况
			this._render.update(dt);
			this._renderTickCount -= this.renderTick;
		}
	}
});