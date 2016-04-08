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
	_actionUpdate : null,
	_animateUpdate : null,
	_moveUpdate : null,

	start : function(){
		this.logicTick = Service.Gobal.logicTick;
		this.renderTick = Service.Gobal.renderTick;
		this._actionUpdate = SystemUtil.systems.action;
		this._animateUpdate = SystemUtil.systems.animate;
		this._moveUpdate = SystemUtil.systems.move;
		this._actionUpdate.start();
		this._animateUpdate.start();
		this._moveUpdate.start();
	},

	//固定逻辑帧频，使主循环在固定的频率下运行，理论上通吃所有手机...
	update : function(dt){
		this._logicTickCount += dt;
		if(this._logicTickCount > this.logicTick){
			this._actionUpdate.update(dt);
			this._logicTickCount -= this.logicTick;
		}else{
			//此方案：逻辑帧在不运行的时候才渲染，可以正确模拟卡机跳帧情况
			this._animateUpdate.update(this.renderTick);
			this._moveUpdate.update(this.renderTick);
		}
		
		//此方案：渲染帧按固定频率运行，与逻辑帧并行
		/*this._renderTickCount += dt;
		if(this._renderTickCount > this.renderTick){
			this._animateUpdate.update(this.renderTick);
			this._moveUpdate.update(this.renderTick);
			this._renderTickCount -= this.renderTick;
		}*/
	}
});