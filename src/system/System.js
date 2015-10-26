/**
 * 	定义游戏主要系统接口
 */
System = cc.Class.extend({
	name : null,
	priority : 0,
	tick : Constant.Tick.FPS60,
	remainDt : 0,
	prep : null,
	next : null,
	start : function(){},
	update : function(dt){},
	end : function(){}
});

/**
 * 系统管理器
 */
MainSystem = System.extend({
		systemList : [],						//子系统列表
		_currSys : null,

		start : function(){
			for(var i in this.systemList){
				this.systemList[i].start();
			}
		},
		
		update : function(dt){
			//dt = Math.floor(dt * 10000) / 10000);	保留4位小数的办法
			//dt = dt.toFixed(4)			另一种保留4位小数，第4位会四舍五入，但类型会变为string
			//逻辑帧时长控制
			Service.gameTimeAfter(dt);
			/*Service.remainDt += dt;
			if(Service.remainDt < Service.logicTick()){
				return;
			}*/
			for(var i in this.systemList){
				this._currSys = this.systemList[i];
				this._currSys.remainDt += dt;
				if(this._currSys.remainDt < this._currSys.tick){
					//cc.log("  break " + this._currSys.remainDt);
				}else{
					//这里传入的时间是tick，这样可以保证匀速进行
					this._currSys.update(this._currSys.tick);
					this._currSys.remainDt = this._currSys.remainDt - this._currSys.tick;
				}
			}
			//Service.remainDt = 0;
			//Service.remainDt / Service.logicTick() 是含小数的倍数，不是整除，因此不用累计余数
			//Service.remainDt = Service.remainDt % Service.logicTick();
			//cc.log("time: " + Service.Container.gameTime);
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
 * 主循环中的动作系统
 */
ActionRunSystem = System.extend({
	name : "ActionRunSystem",
	tick : Constant.Tick.FPS30,
	objList : null,
	_currObj : null,
	start : function(){
		this.objList = Service.getAllObjects();
	},
	update : function(dt){
		/*this._remainDt += dt;
		if(this._remainDt < this.tick){
			return;
		}*/
		for(var i in this.objList){
			this._currObj = this.objList[i];
			this._currObj.actionsCom.currAction.run(dt, this._currObj);
			if(this._currObj.actionsCom.nextAction != null){
				this._currObj.changeAction(this._currObj.actionsCom.nextAction);
				//还原为空状态，原因你懂
				this._currObj.actionsCom.nextAction = null;
			}
		}
		//this._remainDt = this._remainDt - this.tick;
	},
	end : function(){
		//remove
	}
});

/**
 * 主循环中的动画系统
 */
AnimateRunSystem = System.extend({
	tick : Constant.Tick.FPS05,
	name : "AnimateRunSystem",
	objList : null,
	_currObj : null,
	
	start : function(){
		this.objList = Service.getAllObjects();
	},
	update : function(dt){
		for(var i in this.objList){
			this._currObj = this.objList[i];
			this._currObj.actionsCom.currAction.animateSystem.update(dt, this._currObj, this._currObj.actionsCom.currAction.coms.animate);
		}
	}
});

/**
 * 更新坐标的系统
 * 因为调用setPosition会发生重绘操作，影响性能，所以不要在其他地方频繁用setPosition
 */
MotionRunSystem = System.extend({
	name : "MotionRunSystem",
	unitList : null,
	dx : 0,
	dy : 0,
	unit : null,
	sprite : null,
	start : function(){
		this.unitList = Service.getAllObjects();
	},
	
	update : function(dt){
		
		for(var i in this.unitList){

			this.unit = this.unitList[i];
			this.sprite = this.unit.viewCom.sprite;
			
			this.dx = this.unit.coms.motion.dx;
			this.dy = this.unit.coms.motion.dy;
			if(this.dx != 0 || this.dy != 0){
				//setPosition()里面有绘制命令
				//这里要使用getPositionX()而不是getPosition().x这种，因为翻查源码发现，getPosition()是会有new操作的。
				this.sprite.setPosition(
						this.sprite.getPositionX() + this.dx,
						this.sprite.getPositionY() + this.dy);
			}
		}
	}
});