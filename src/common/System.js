/**
 * 	定义游戏主要系统接口
 */
System = cc.Class.extend({
	name : "system",
	priority : 0,
	tick : Constant.Tick.FPS60,			//不能少于这个数
	remainDt : 0,
	start : function(){},
	//update : function(dt){},
	end : function(){},
	
	//这三个以后要
	_head : null,
	_curr : null,
	_end : null,
	
	ctor : function(){
		//初始化头尾两个空内容的指针
		this._head = new Component();
		this._end = new Component();
		this._head.next = this._end;
	},
	
	/**
	 * 主函数，循环整个链表
	 */
	update : function(dt){
		if(this._head.next != this._end){
			this._curr = this._head.next;
			do{
				this.executeUpdate(dt, this._curr);
				this._curr = this._curr.next;
			}while(this._curr != this._end);
		}
	},
	
	/**
	 * 子类重写此方法，用于执行一次详细逻辑
	 */
	executeUpdate : function(dt, node){return;},
	
	addComponent : function(node){
		//新加入的一定是放在链尾
		node.prep = this._end.prep;
		node.next = this._end;
		this._end.prep.next = node;
	}
	
	/*removeComponent : function(node){
		if(this._head == node){
			this._head = node.next;
		}
		else if(this._end == node){
			this._end = node.prep;
		}else{
			node.prep.next = node.next;
			node.next.prep = node.prep;
		}
		node.prep = null;
		node.next = null;
	}*/
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
	
	/**
	 * 主循环实在是太重量级了，希望有好的优化方案
	 */
	update : function(dt){
		for(var i in this.groups){
			for(var j in this.groups[i].list){
				this._currObj = this.groups[i].list[j];
				this._currAct = this._currObj.actions.current;
				if(this._currAct != null){
					//动作结束后
					if(this._currObj.actions.endFlag){
						this._currAct.end(unit);
						if(this._currObj.actions.next != null){
							this._currObj.actions.next.start(unit);
							this._currObj.actions.next = null;//还原为空状态，原因你懂，不信的话把这句注释看看。
						}
						/*else if(this._currAct.children && this._currAct.children[Constant.DIRECT_CHILDNODE]){
							this._currAct.children[Constant.DIRECT_CHILDNODE].start(unit);
						}*/
						else{
							this._currAct = null;
						}
					}else{
						//运行
						this._currAct.run(dt, this._currObj);
					}
				}else{
					//重置action
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
	
	ctor : function(){
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

/**
 * 更新坐标的系统（新版，暂不使用）
 * 因为调用setPosition会发生重绘操作，影响性能，所以不要在其他地方频繁用setPosition
 */
MotionSystem = System.extend({
	name : "motion",
	dx : 0,
	dy : 0,
	_unit : null,
	_sprite : null,

	callback : function(dt, component){
		EngineUtil.setPosition(component.owner.coms.view.sprite, component);
	}
});

/**
 * 主循环中的动画系统（新版）
 * com是复合类型的
 */
AnimateUpdateSystem = System.extend({
	tick : Constant.Tick.FPS05,
	name : "animate",
	_dt : 0,
	
	//局部变量
	_unit : null,
	_animate : null,
	_view : null,
	
	/**
	 * 加入到链表中，并初始化第一帧
	 */
	addComponent : function(node){
		this._super(node);
		var view = node.owner.coms.view;
		view.frameIndex = 0;
		view.delay = 0;
		EngineUtil.setFrame(view.sprite, view.animate.frames[0]);
	},

	callback : function(dt, component){
		
		this._unit = component.gameObj;
		this._animate = component.animate;
		this._view = component.gameObj.coms.view;
		
		if(this._view.frameIndex < this._animate.frames.length){
			//冷却计时
			if(this.view.delay < this._animate.delays[this._view.frameIndex]){
				this._view.delay += dt;
				return;
			}else{
				this._view.frameIndex++;
				this._view.delay = 0;
				//冷却时间到就切换下一帧
				EngineUtil.setFrame(this._view.sprite, this._animate.frames[this._view.frameIndex]);
			}
		}else if(this._animate.type & Constant.animate.type.LOOP){
			this._view.frameIndex = 0;
			this._view.delay = 0;
			EngineUtil.setFrame(this._view.sprite, this._animate.frames[0]);
		}else{
			//移除这个节点
		}
	}
});