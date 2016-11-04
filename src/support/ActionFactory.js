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
			if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data.name)){
				cc.log("create ActionState error, lack of necessary data!");
				return null;
			}
			//cc.log("info: creating action:[" + data.name + "].");
			var actionState = new ActionState();
			actionState.name = data.name;
			actionState.key = DataUtil.checkIsInt(data.key) ? data.key : 0;
			actionState.init(data);
			this._bulid(data, actionState);
			return actionState;
		},
		
		createMove : function(data){
			if(!DataUtil.checkNotNull(data)){
				cc.log("createMove error. lack of necessary data!");
				return null;
			}
			if(!DataUtil.checkIsInt(data.type, "type")){
				cc.log("createMove error. move.type error.");
				return null;
			}
			if(!DataUtil.checkIsNumber(data.dx) || !DataUtil.checkIsNumber(data.dy)){
				cc.log("createMove error. dx or dy must be number.");
				return null;
			}
			var move = new ActionMoveComponent();
			move.type = data.type;
			move.dx = data.dx * Service.Gobal.logicTick;
			move.dy = data.dy * Service.Gobal.logicTick;
			return move;
		},
		
		/**
		 * 动作指令组件
		 */
		createCommand : function(data){
			var type = DataUtil.checkIsInt(data.type) ? data.type : 0;
			if(!DataUtil.checkArrayNotNullForLog(data.list,"data.list")){
				cc.log("createCommand error. list error.");
				return null;
			}
			var command = new ActionCommandComponent();
			command.type = type;
			command.list = [];
			for(var name : data.list){
				if(!DataUtil.checkIsStringForLog(name,"data.list.name")){
					cc.log("createCommand error. list error.");
					return null;
				}
				command.list.push(name);
			}
			return command;
		},
		
		/**
		 * 创建动画组件
		 */
		createAnimate : function(data){
			if(!DataUtil.checkNotNull(data)){
				cc.log("createAnimate error. lack of necessary data!");
				return null;
			}
			if(!DataUtil.checkIsIntForLog(data.type, "data.type")){
				cc.log("createAnimate error. animate.type error.");
				return null;
			}
			if(!DataUtil.checkArrayNotNullForLog(data.frames,"data.frames")){
				cc.log("createAnimate error. animate.frames error.");
				return null;
			}
			var animate = new AnimateComponent();
			animate.type = DataUtil.checkIsInt(data.type) ? data.type : 0;
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
				if(DataUtil.checkIsNumber(data.interval)){
					for(var i=0; i<data.frames.length; i++){
						animate.intervals.push(data.interval);
					}
				}
				else if(DataUtil.checkArrayNotNullForLog(data.intervals,"data.intervals")){
					if(data.intervals.length != data.frames.length){
						cc.log("animate.intervals 数组和frame数量不对等.");
						return null;
					}
					for(var i=0; i<data.frames.length; i++){
						animate.intervals.push(data.intervals[i]);
					}
				}else{
					for(var i=0; i<data.frames.length; i++){
						//设置默认动画帧时长
						animate.intervals.push(
								GameSetting.Default.animateFrameTick);
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
			if(DataUtil.checkNotNull(data.animate)){
				action.coms.animate = this.createAnimate(data.animate);
				action.addSystem(ObjectManager.systems.animate[data.animate.type]);
			}
			if(DataUtil.checkNotNull(data.move)){
				action.coms.move = this.createMove(data.move);
				action.addSystem(ObjectManager.systems.move[data.move.type]);
			}
			if(DataUtil.checkNotNull(data.timer)){
				component = this.createTimer(data.timer);
				//system = ActionSystemUtil.getTimer(component);
			}
			if(DataUtil.checkNotNull(data.command)){
				component = this.createCommand(data.command);
				action.addSystem(ObjectManager.systems.command[data.command.type]);
			}
			return;
		},
		
		/**
		 * 创建站立动作节点
		 */
		createStandAction : function(data){
			data.name = "stand";
			data.animate.type = data.animate.frames.length > 1 ? Constant.ANIMATE_SCROLL : Constant.ANIMATE_STATIC;
			data.command.type = Constant.COMMAND_CHARACTER_STAND;
			return Factory.createAction(data);
		},
		
		/**
		 * 创建走路/奔跑动作节点
		 */
		createWalkAction : function(data){
			data.name = "walk";
			data.animate.type = data.animate.frames.length > 1 ? Constant.ANIMATE_SCROLL : Constant.ANIMATE_STATIC;
			data.command.type = Constant.COMMAND_CHARACTER_WALK;
			return Factory.createAction(data);
		}
};