/**
 * 	定义游戏主要系统接口
 */
System = cc.Class.extend({
	name : null,
	priority : 0,
	tick : Constant.Tick.FPS60,			//不能少于这个数
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
			Service.gameTimeAfter(dt);
			for(var i in this.systemList){
				this._currSys = this.systemList[i];
				this._currSys.remainDt += dt;
				if(this._currSys.remainDt < this._currSys.tick){
					//cc.log("  break " + this._currSys.remainDt);
				}else{
					//这里传入的时间是tick，这样可以保证匀速进行
					//cc.log("update " + this._currSys.remainDt);
					this._currSys.update(this._currSys.tick);
					this._currSys.remainDt = this._currSys.remainDt - this._currSys.tick;
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
 * 主循环中的动作系统
 */
ActionRunSystem = System.extend({
	name : "ActionRunSystem",
	tick : Constant.Tick.FPS30,
	_currObj : null,
	_currState : null,
	_currAct : null,
	groups : null,
	
	start : function(){
		this.groups = Service.Container.groups;
	},
	
	update : function(dt){
		for(var i in this.groups){
			for(var j in this.groups[i].list){
				this._currObj = this.groups[i].list[j];
				this._currAct = this._currObj.actions.current;
				if(this._currAct != null){
					//运行
					this._currAct.run(dt, this._currObj);
					//动作结束后
					if(this._currObj.actions.endFlag){
						this._currAct.end(unit);
						if(this._currObj.actions.next != null){
							this._currObj.actions.next.start(unit);
							//还原为空状态，原因你懂，不信的话把这句注释看看。
							this._currObj.actions.next = null;
						}
						else if(this._currAct.children && this._currAct.children[Constant.DIRECT_CHILDNODE]){
							this._currAct.children[Constant.DIRECT_CHILDNODE].start(unit);
						}
						else{
							this._currAct = null;
						}
					}
				}else{
					
				}
				
				//一些计时组件系统的更新
				this._currState = this._currObj.coms.state;
				if(this._currState && this._currState.timer){
					for(var name in this._currState.timer){
						GameUtil.effectUpdate(name, this._currObj, this._currState.timer[name]);
					}
				}
			}
		}
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
	_dt : 0,

	update : function(dt){
		this._dt = dt;
		Service.loopAllObjects(this._callback);
	},
	
	_callback : function(unit){
		unit.actions.current.animateSystem.update(this._dt, unit, unit.actions.current.coms.animate);
	}
});

/**
 * 更新坐标的系统
 * 因为调用setPosition会发生重绘操作，影响性能，所以不要在其他地方频繁用setPosition
 */
MotionRunSystem = System.extend({
	name : "MotionRunSystem",
	dx : 0,
	dy : 0,
	unit : null,
	sprite : null,
	groups : null,
	
	start : function(){
		this.groups = Service.Container.groups;
	},
	
	update : function(dt){
		for(var i in this.groups){
			for(var j in this.groups[i].list){
				this.unit = this.groups[i].list[j];
				this.sprite = this.unit.coms.view.sprite;
				this._callback(dt);
			}
		}
	},
	
	_callback : function(dt){
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
});

/**
 * 事件消息分发系统
 */
EventMessageSystem = System.extend({
	name : "EvtMsg",
	_currEvt : null,
	_quene : null,
	_unitEvt : null,
	
	start : function(){
		this._quene = [];
		this._unitEvt = new UnitEventScheduler();
	},
	
	update : function(dt){
		while(this._currEvt = this._quene.shift()){
			switch(_currEvt.name){
			case Constant.MsgType.Unit.Type:
				this._unitEvt.callback(this._currEvt);
			case Constant.MsgType.System.TYPE:
			default :
				EngineUtil.dispatch(this._currEvt);
				break;
			}
			
		}
	},
	
	addListener : function(name, callback){
		EngineUtil.addListener(name, callback);
	},
	
	addEvent : function(evt){
		this._quene.push(evt);
	}
});