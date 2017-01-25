/**
 * 用于建造动作的工厂类
 */
ActionFactory = {
		
		/**
		 * 创建一个动作节点
		 * param
		 * 	data 	 数据DNA
		 * 	actions	 动作集合{}，创建某些action时需要引用其他action
		 * 	actClass  ActionState的子类，可缺省
		 *  2016.03.05 有改动，详见 ActionState.init()注释
		 */
		createAction : function(data, actions){
			if(!DataUtil.checkNotNull(data) || !DataUtil.checkIsString(data.name)){
				cc.log("create ActionState error, lack of necessary data!");
				return null;
			}
			cc.log("info: creating action:[" + data.name + "].");
			var actionState = null;
			if(data.view){
				actionState = new GameAction();
				actionState.name = data.name;
			}
			else if(data.sequence){
				if(!DataUtil.checkIsString(data.sequence.name)){
					data.sequence.name = data.name + "_sequence";//取默认名
				}
				actionState = this.createSequence(data.sequence, actions);
			}
			else if(data.repeat){
				if(!DataUtil.checkIsString(data.repeat.name)){
					data.repeat.name = data.name + "_repeat";//取默认名
				}
				actionState = this.createRepeat(data.repeat, actions);
			}
			else{
				//actionState = new ActionState();
				cc.log("ActionFactory.createAction error. 无法创建匹配的action.");
				return null;
			}
			actionState.init(data);
			this._bulid(data, actionState);
			return actionState;
		},
		
		createSequence : function(data, actions){
			if(!DataUtil.checkArrayNotNull(data.actions)){
				cc.log("ActionFactory.createSequence error. actions is empty.");
				return null;
			}
			var action = new SequenceAction();
			action.name = data.name;
			action.actions = [];
			for(var i in data.actions){
				var act = data.actions[i];
				var type = this._availableDataType(act)
				if(type==null){
					return null;
				}
				else if(type=='string'){
					action.actions.push(this._findByName(actions, act));
				}
				else{
					// is a object/json
					action.actions.push(this.createAction(act, actions));
				}
			}
			action.input = action.actions[0].input;
			return action;
		},
		
		createRepeat : function(data, actions){
			var type = this._availableDataType(data.action);
			if(type==null){
				return null;
			}
			var action = new RepeatAction();
			if(type=='string'){
				action.action = this._findByName(actions, data.action);
			}else{
				// is a object/json
				action.action = this.createAction(data.action, actions);
			}
			action.name = data.name;
			action.count = DataUtil.checkIsInt(data.count) ? data.count : 0;
			action.input = action.action.input;
			return action;
		},
		
		/**
		 * 判断传入的data.action字段类型，只有string和object是允许的
		 * string类型是指一个actionName,
		 * object类型是指一个action的构造数据基因。
		 * 返回值有 null, string, object
		 */
		_availableDataType : function(data){
			if(!DataUtil.checkNotNull(data)){
				cc.log("ActionFactory._availableDataType error. param is empty.");
				return null;
			}
			if(DataUtil.checkIsString(act)){
				return 'string';
			}
			if(DataUtil.checkIsObject(act)){
				return 'object';
			}
			cc.log("ActionFactory._availableDataType error. please check your param data_type.");
			return null;
		},
		
		_findByName : function(actions, name){
			var action = actions[act];
			if(!action){
				cc.log("ActionFactory.findByName error. actions["+name+"] not found");
				return null;
			}
			return action;
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
				ComponentFactory.addComponent(action,
					ComponentFactory.createCommand(data.command));
			}
			return;
		},
		
		/**
		 * 创建站立动作节点
		 */
		createStandAction : function(data, actions){
			data.name = "stand";
			data.view.animate.type = data.view.animate.frames.length > 1 ? Constant.ANIMATE_SCROLL : Constant.ANIMATE_STATIC;
			if(data.command){
				data.command.type = Constant.COMMAND_CHARACTER_STAND;
			}
			return this.createAction(data, actions);
		},
		
		/**
		 * 创建走路/奔跑动作节点
		 */
		createWalkAction : function(data, actions){
			data.name = "walk";
			data.view.animate.type = data.view.animate.frames.length > 1 ? Constant.ANIMATE_SCROLL : Constant.ANIMATE_STATIC;
			if(data.command){
				data.command.type = Constant.COMMAND_CHARACTER_WALK;
			}
			return this.createAction(data, actions);
		},
		
		/**
		 * 创建普通攻击动作节点
		 */
		createHitAction : function(data, actions){
			if(data.sequence){
				data.sequence.name = "hit";
				data.sequence.input = Constant.CMD_AI_ATTACK;
			}else if(data.repeat){
				data.repeat.name = "hit";
				data.repeat.input = Constant.CMD_AI_ATTACK;
			}else{
				data.name = "hit";
			}
			if(data.command){
				data.command.type = Constant.COMMAND_CHARACTER_ATTACK;
			}
			return this.createAction(data, actions);
		}
};