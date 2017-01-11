/**
 * 用于建造动作的工厂类
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
			cc.log("info: creating action:[" + data.name + "].");
			var actionState = null;
			if(data.view){
				actionState = new GameAction();
			}else{
				actionState = new ActionState();
			}
			actionState.name = data.name;
			actionState.init(data);
			this._bulid(data, actionState);
			return actionState;
		},
		
		/**
		 * 组成动作的组件系统
		 */
		_bulid : function(data, action){
			if(!data){
				return;
			}
			//穷举组件检测
			if(DataUtil.checkNotNull(data.view)){
				action.view = ComponentFactory.createView(data.view);
				//action.addSystem(ObjectManager.systems.animate[data.animate.type]);
			}
			if(DataUtil.checkNotNull(data.move)){
				ComponentFactory.addComponent(action,
					ComponentFactory.createMove(data.move));
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