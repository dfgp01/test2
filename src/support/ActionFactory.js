/**
 * 用于建造动作的工厂类
 */
ActionFactory = {
		
		/**
		 * 创建一个动作节点
		 * param
		 * 	data 	 数据DNA
		 * 	actions	 动作集合{}，创建某些action时需要引用其他action
		 */
		createAction : function(data, actions){
			if(!Validator.assertType(data, "action", data.name)){
				cc.log("createAction error.");
				return null;
			}
			var actionState = null;
			if(data.repeat){
				data.name += "_rept";
				actionState = this.createRepeat(data.name, data.repeat);
			}else if(data.sequence){
				data.name += "_seq";
				actionState = this.createSequence(data.name, data.sequence);
			}else if(data.view){
				actionState = this.createUnitAction(data);
			}
			if(!action){
				cc.log("create ActionState exception, see the log!");
				return null;
			}
			actionState.name = data.name;
			actionState.components = [];
			if(this._bulid(data, actionState)){
				cc.log("info: action:[" + data.name + "] has been created.");
			}
			return actionState;
		},
		
		/**
		 * 创建角色动作
		 */
		_createUnitAction : function(data){
			var view = ComponentFactory.createView(data.view);
			if(!view){
				return null;
			}
			var action = new GameAction();
			actionState.view = view;
			return action;
		},
		
		/**
		 * 创建动作序列
		 */
		_createSequence : function(baseName, sequence){
			if(!Validator.assertType(data, "sequenceAction", data.name)){
				cc.log("createSequenceAction error.");
				return null;
			}
			var action = new SequenceAction();
			action.actions = [];
			for(var i in sequence){
				var actId = sequence[i];
				action.actions.push(actId);
			}
			action.input = action.actions[0].input;
			return action;
		},
		
		/**
		 * 创建重复动作
		 */
		_createRepeat : function(baseName, repeat){
			if(!Validator.assertType(data, "repeatAction", data.name)){
				cc.log("createRepeatAction error.");
				return null;
			}
			var action = new RepeatAction();
			action.action = repeat.action;
			action.count = data.count;
			action.input = action.action.input;
			return action;
		},
		
		_findByName : function(actions, name){
			var action = actions[name];
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
			if(DataUtil.checkNotNull(data.move)){
				ComponentFactory.addComponent(action,
					ComponentFactory.createMove(data.move));
			}
			if(DataUtil.checkNotNull(data.command)){
				ComponentFactory.addComponent(action,
					ComponentFactory.createCommand(data.command));
			}
			if(DataUtil.checkNotNull(data.hit)){
				ComponentFactory.addComponent(action,
					ComponentFactory.createHit(data.hit));
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
			data.name = "hit";
			if(data.command){
				data.command.type = Constant.COMMAND_CHARACTER_ATTACK;
			}
			var action = this.createAction(data, actions);
			action.input = Constant.CMD_AI_ATTACK;
			return action;
		}
};