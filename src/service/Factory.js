/**
 * 工厂类，用于建造游戏组件。
 */
Factory = {
		
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
			//actionState.coms = {};
			//actionState.systemList = [];
			actionState.init(data);
			//初始化动作组件系统
			//ActionUtil.bulidComponentSystem(data, actionState);
			return actionState;
		},
		
		/**
		 * 初始化一个单位模板
		 */
		createGameObjectTemplate : function(data){
			if(!DataUtil.checkIsString(data,"name",true)){
				cc.log("Factory.createGameObjectTemplate error. data or name is null.");
				return null;
			}
			var template = new GameObjectTemplate();
			template.name = data.name;
			template.frame = EngineUtil.getFrame(data.frame);
			template.availableList = [];
			template.coms = {};
			template.actions = {};
			template.init(data);
			if(!DataUtil.checkArrayNull(data,"actions")){
				var action = null;
				for(var i in data.actions){
					action = this.createAction(data.actions[i]);
					template.actions[action.name] = action;
				}
			}
			//template.coms.view = new ViewComponent();
			return template;
		},
		
		createActionMove : function(data){
			if(!DataUtil.checkIsInt(data, "type")){
				cc.log("ComponentUtil.createMove error. move.type error.");
				return null;
			}
			if(!DataUtil.checkIsNumber(data,"dx") || !DataUtil.checkIsNumber(data,"dy")){
				cc.log("ComponentUtil.createMove error. dx or dy must be number.");
				return null;
			}
			var move = new ActionMoveComponent();
			move.type = data.type;
			move.dx = DataUtil.checkIsNumber(data, "dx") ? data.dx / Service.Gobal.gameTick : 0;
			move.dy = DataUtil.checkIsNumber(data, "dy") ? data.dy / Service.Gobal.gameTick : 0;
			return move;
		},
		
		createUnitMove : function(data){
			var move = new UnitMoveComponent();
			if(data && DataUtil.checkIsNumber(data, "coefficient")){
				move.coefficient = data.coefficient;
			}
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
				cc.log("ComponentUtil.createAnimate error. animate.type error.");
				return null;
			}
			if(DataUtil.checkArrayNull(data,"frames")){
				cc.log("ComponentUtil.createAnimate error. animate.frames error.");
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
		}
};