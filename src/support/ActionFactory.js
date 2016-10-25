/**
 * 用于建造动作及组件的工厂类
 */
ActionFactory = {
		
		/**
		 * 创建一个动作节点
		 * param
		 * 	data 	 数据DNA
		 * 	actClass  ActionState的子类，可缺省
		 *  2016.03.05 有改动，详见 ActionState.init()注释
		 */
		createAction : function(data){
			if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data, "name", true)){
				cc.log("create ActionState error, lack of necessary data!");
				return null;
			}
			//cc.log("info: creating action:[" + data.name + "].");
			var actionState = new ActionState();
			actionState.name = data.name;
			actionState.init(data);
			this._bulid(data, actionState);
			return actionState;
		},
		
		createMove : function(data){
			if(!DataUtil.checkIsInt(data, "type")){
				cc.log("createMove error. move.type error.");
				return null;
			}
			if(!DataUtil.checkIsNumber(data,"dx") || !DataUtil.checkIsNumber(data,"dy")){
				cc.log("createMove error. dx or dy must be number.");
				return null;
			}
			var move = new ActionMoveComponent();
			move.type = data.type;
			move.dx = data.dx * Service.Gobal.logicTick;
			move.dy = data.dy * Service.Gobal.logicTick;
			return move;
		},
		
		createSwitchable : function(data){
			var switchable = new SwitchableComponent();
			for(var cmd in data){
				switchable.keys[cmd] = data[cmd];
			}
			return switchable;
		},
		
		/**
		 * 创建动画组件
		 */
		createAnimate : function(data){
			if(!DataUtil.checkIsInt(data, "type")){
				cc.log("createAnimate error. animate.type error.");
				return null;
			}
			if(DataUtil.checkArrayNull(data,"frames")){
				cc.log("createAnimate error. animate.frames error.");
				return null;
			}
			var animate = new AnimateComponent();
			animate.type = DataUtil.checkIsInt(data,"type") ? data.type : 0;
			animate.frames = [];
			for(var i in data.frames){
				var frame = cc.spriteFrameCache.getSpriteFrame(data.frames[i]);
				if(frame){
					animate.frames.push(frame);
				}else{
					cc.log("action:" + action.name + " frame:" + animate.frames[i] + " not found");
					return null;
				}
			}

			//设置每帧延时
			if(animate.type != Constant.ANIMATE_STATIC){
				//interval或intervals属性必须有其中一个，否则用默认的间隔
				animate.intervals = [];
				if(DataUtil.checkIsNumber(data, "interval")){
					for(var i=0; i<data.frames.length; i++){
						animate.intervals.push(data.interval);
					}
				}
				else if(!DataUtil.checkArrayNull(data,"intervals")){
					if(data.intervals.length != data.frames.length){
						cc.log("animate.intervals 数组和frame数量不对等.");
						return null;
					}
					for(var i=0; i<data.frames.length; i++){
						animate.intervals.push(data.intervals[i]);
					}
				}else{
					for(var i=0; i<frameList.length; i++){
						//设置默认动画帧时长
						animate.delays.push(
								Service.Gobal.animateFrameTick);
					}
				}
			}
			return animate;
		},
		
		/**
		 * 组成动作的组件系统
		 */
		_bulid : function(data, action){
			if(!data){
				return;
			}
			//穷举组件检测
			if(DataUtil.checkNotNull(data,"animate")){
				action.coms.animate = this.createAnimate(data.animate);
				action.addSystem(ObjectManager.systems.animate[data.animate.type]);
			}
			if(DataUtil.checkNotNull(data,"move")){
				action.coms.move = this.createMove(data.move);
				action.addSystem(ObjectManager.systems.move[data.move.type]);
			}
			if(DataUtil.checkNotNull(data,"timer")){
				component = this.createTimer(data.timer);
				//system = ActionSystemUtil.getTimer(component);
				//this.build(action, component, system);
			}
			if(DataUtil.checkNotNull(data,"switchable")){
				component = this.createSwitchable(data.switchable);
				system = ObjectManager.systems.switchable;
				//this.build(action, component, system);
			}
			return;
		},
		
		/**
		 * 创建站立动作节点
		 */
		createStandAction : function(data){
			data.name = "stand";
			if(DataUtil.checkArrayNull(data.animate.frames)){
				cc.log("SimpleFactory.createStandAction error. frames is null.");
				return null;
			}
			if(!DataUtil.checkIsInt(data.animate.type)){
				data.animate.type = this._defaultAnimateType(data.animate.frames);
			}
			var action = Factory.createAction(data);
			ActionUtil.addSystem(action, ActionUtil.systems.stand[Constant.GAMEOBJECT_CHARACTER]);
			return action;
		},
		
		createWalkAction : function(data){
			data.name = "walk";
			if(DataUtil.checkArrayNull(data.animate.frames)){
				cc.log("SimpleFactory.createWalkAction error. frames is null.");
				return null;
			}
			if(!DataUtil.checkIsInt(data.animate.type)){
				data.animate.type = this._defaultAnimateType(data.animate.frames);
			}
			data.move.type = Constant.MOVE_BY_CMD;
			var action = Factory.createAction(data);
			return action;
		},
		
		/**
		 * 默认动画类型
		 * frames: 字符串数组
		 * 专为 stand,walk这样的action来提供默认动画类型
		 */
		_defaultAnimateType : function(frames){
			if(frames.length > 1){
				return Constant.ANIMATE_SCROLL;
			}
			return Constant.ANIMATE_STATIC;
		}
};