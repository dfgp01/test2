/**
 * 	定义游戏主要系统接口
 */
System = cc.Class.extend({
	name : "system",
	priority : 0,
	tick : Constant.TICK_FPS60,			//不能少于这个数
	remainDt : 0,
	
	//这三个以后要
	_head : null,
	_curr : null,
	_end : null,
	
	/**
	 * 主函数，循环整个链表
	 */
	update : function(dt){
		if(this._head != null){
			this._curr = this._head;
			do{
				this.execute(dt, this._curr);
				this._curr = this._curr.next;
			}while(this._curr != null);
		}
	},
	start : function(){},
	end : function(){},
	/**
	 * 子类重写此方法，用于执行一次详细逻辑
	 */
	execute : function(dt, node){},
	
	/**
	 * 将组件添加进链表
	 */
	addComponent : function(node){
		if(this._head == null){
			this._head = node;
			this._end = node;
		}else{
			this._end.next = node;
			node.prep = this._end;
			this._end = node;	//新加入的一定是放在链尾
		}
	},
	
	removeComponent : function(node){
		//如果已经不在链表里，就直接退出
		if(node.prep == null && node.next == null){
			return;
		}
		if(this._head == node && this._end == node){
			this._head = null;
			this._end = null;
		}
		else if(this._head == node){
			this._head = node.next;
		}
		else if(this._end == node){
			this._end = node.prep;
		}
		else{
			node.prep.next = node.next;
			node.next.prep = node.prep;
		}
		node.prep = null;
		node.next = null;
	}
});

/**
 * 系统管理器
 */
MainSystem = System.extend({
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
 * 主循环中的动作系统
 */
ActionUpdateSystemOld = System.extend({
	name : "action",
	tick : Constant.TICK_FPS30,
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

ActionUpdateSystem = System.extend({
	name : "action",
	tick : Constant.TICK_FPS30,
	_currObj : null,
	_currAct : null,

	execute : function(dt, actionCom){
		this._currAct = actionCom.current;
		this._currObj = actionCom.owner;
		if(actionCom.endFlag){
			this._currAct.end(this._currObj);
			if(actionCom.next != null){
				actionCom.next.start(this._currObj);
				actionCom.next = null;//还原为空状态，原因你懂，不信的话把这句注释看看。
			}
		}else{
			this._currAct.update(dt, this._currObj);
		}
		//还有重置逻辑以后补上
	},
	
	end : function(){
		//remove
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
	
	/*update : function(dt){
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
	},*/
	
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
MotionUpdateSystem = System.extend({
	name : "motion",

	execute : function(dt, component){
		if(component.dx !=0 || component.dy != 0){
			EngineUtil.setPosition(component.owner.coms.view.sprite, component);
		}
	}
});

/**
 * 主循环中的动画系统（新版）
 */
AnimateUpdateSystem = System.extend({
	tick : Constant.TICK_FPS05,
	name : "animate",
	_dt : 0,
	
	/**
	 * 加入到链表中，并初始化第一帧
	 */
	addComponent : function(viewCom){
		this._super(viewCom);
		viewCom.frameIndex = 0;
		viewCom.interval = 0;
		EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[0]);
	},

	execute : function(dt, viewCom){
		
		/*if(viewCom.interval < viewCom.animate.intervals[viewCom.frameIndex]){
			viewCom.interval += dt;
			return;
		}else{
			viewCom.frameIndex++;
			viewCom.interval = 0;
			if(viewCom.frameIndex < this._animate.frames.length){
				EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[viewCom.frameIndex]);
			}else if(viewCom.animate.type & Constant.ANIMATE_SCROLL){
				viewCom.frameIndex = 0;
				EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[0]);
			}else{
				this.removeComponent(viewCom);
			}
		}*/
		
		if(viewCom.frameIndex > viewCom.animate.frames.length-1){
			if(viewCom.animate.type == Constant.ANIMATE_SCROLL){
				viewCom.frameIndex = 0;
				EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[0]);
			}else{
				this.removeComponent(viewCom);
				return;
			}
		}
		
		viewCom.interval += dt;
		if(viewCom.frameIndex < viewCom.animate.frames.length-1){
			if(viewCom.interval >= viewCom.animate.intervals[viewCom.frameIndex]){
				viewCom.interval = viewCom.interval - viewCom.animate.intervals[viewCom.frameIndex];
				viewCom.frameIndex++;
				EngineUtil.setFrame(viewCom.sprite, viewCom.animate.frames[viewCom.frameIndex]);
			}
		}else if(viewCom.frameIndex == viewCom.animate.frames.length-1){
			if(viewCom.interval >= viewCom.animate.intervals[viewCom.frameIndex]){
				viewCom.frameIndex++;
			}
		}
		
	}
});