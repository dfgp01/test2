/**
 * 新版
 */
MainSystem = System.extend({
	name : "main",
	logicTick : 0,
	renderTick : 0,
	_logicTickCount : 0,
	_renderTickCount : 0,
	_actionSys : null,
	_renderSys : null,
	_eventDispatcher : null,

	start : function(){
		this.logicTick = Service.Gobal.logicTick;
		this.renderTick = Service.Gobal.renderTick;
		this._actionSys = ObjectManager.systems.action;
		this._renderSys = ObjectManager.systems.view;
		this._eventDispatcher = EventDispatcher;
		
		this._actionSys.start();
		this._renderSys.start();
	},

	//固定逻辑帧频，使主循环在固定的频率下运行，理论上通吃所有手机...
	update : function(dt){
		this._logicTickCount += dt;
		if(this._logicTickCount > this.logicTick){
			this._actionSys.update(this._logicTickCount);
			this._logicTickCount -= this.logicTick;
		}
		//处理消息事件
		this._eventDispatcher.process();
		
		//可以正确模拟卡机跳帧情况
		this._renderTickCount += dt;
		if(this._renderTickCount > this.renderTick){
			this._renderSys.update(this._renderTickCount);
			this._renderTickCount -= this.renderTick;
		}
	}
});